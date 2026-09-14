import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const vitePort = 4175;
const chromePort = 9223;
const fixtureUrl = `http://127.0.0.1:${vitePort}/tests/browser/quality.html`;

function assert(condition, message) {
  if (!condition) throw new Error(message);
}

async function waitFor(check, message, timeoutMs = 15_000) {
  const deadline = Date.now() + timeoutMs;
  let lastError;
  while (Date.now() < deadline) {
    try {
      const value = await check();
      if (value) return value;
    } catch (error) {
      lastError = error;
    }
    await sleep(100);
  }
  throw new Error(`${message}${lastError ? `: ${lastError.message}` : ""}`);
}

async function waitForHttp(url) {
  return waitFor(async () => {
    const response = await fetch(url);
    return response.ok;
  }, `Timed out waiting for ${url}`);
}

function findChrome() {
  const candidates = [
    process.env.CHROME_BIN,
    "/usr/bin/google-chrome",
    "/usr/bin/google-chrome-stable",
    "/usr/bin/chromium",
    "/usr/bin/chromium-browser",
  ].filter(Boolean);
  return candidates.find((candidate) => existsSync(candidate));
}

function createCdpClient(url) {
  const socket = new WebSocket(url);
  let sequence = 0;
  const pending = new Map();

  const ready = new Promise((resolve, reject) => {
    socket.addEventListener("open", resolve, { once: true });
    socket.addEventListener("error", reject, { once: true });
  });

  socket.addEventListener("message", (event) => {
    const message = JSON.parse(event.data);
    if (!message.id) return;
    const deferred = pending.get(message.id);
    if (!deferred) return;
    pending.delete(message.id);
    if (message.error) deferred.reject(new Error(message.error.message));
    else deferred.resolve(message.result);
  });

  async function send(method, params = {}) {
    await ready;
    const id = ++sequence;
    return new Promise((resolve, reject) => {
      pending.set(id, { resolve, reject });
      socket.send(JSON.stringify({ id, method, params }));
    });
  }

  return { ready, send, close: () => socket.close() };
}

async function main() {
  const chrome = findChrome();
  if (!chrome)
    throw new Error("Chrome/Chromium is required for browser regressions");

  const vite = spawn(
    "bun",
    [
      "x",
      "vite",
      "--config",
      "tests/browser/vite.config.ts",
      "--host",
      "127.0.0.1",
      "--port",
      String(vitePort),
      "--strictPort",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );
  const chromeProcess = spawn(
    chrome,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      `--remote-debugging-port=${chromePort}`,
      "--user-data-dir=/tmp/doctui-quality-chrome",
      "--window-size=1280,900",
      "about:blank",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  let client;
  try {
    await waitForHttp(fixtureUrl);
    await waitForHttp(`http://127.0.0.1:${chromePort}/json/version`);

    const targets = await fetch(
      `http://127.0.0.1:${chromePort}/json/list`,
    ).then((response) => response.json());
    const page = targets.find((target) => target.type === "page");
    assert(
      page?.webSocketDebuggerUrl,
      "Chrome did not expose a debuggable page",
    );

    client = createCdpClient(page.webSocketDebuggerUrl);
    await client.ready;
    await client.send("Page.enable");
    await client.send("Runtime.enable");
    await client.send("Page.navigate", { url: fixtureUrl });

    const evaluate = async (expression) => {
      const response = await client.send("Runtime.evaluate", {
        expression,
        awaitPromise: true,
        returnByValue: true,
      });
      if (response.exceptionDetails) {
        throw new Error(
          response.exceptionDetails.exception?.description ??
            response.exceptionDetails.text,
        );
      }
      return response.result.value;
    };
    const waitForDom = (expression, message) =>
      waitFor(() => evaluate(expression), message);
    const pressKey = async (key, code = key) => {
      const virtualKeyCode =
        key === "Enter" ? 13 : key === " " ? 32 : undefined;
      const text = key === "Enter" ? "\r" : key === " " ? " " : undefined;
      await client.send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key,
        code,
        ...(virtualKeyCode === undefined
          ? {}
          : {
              windowsVirtualKeyCode: virtualKeyCode,
              nativeVirtualKeyCode: virtualKeyCode,
            }),
        ...(text === undefined ? {} : { text, unmodifiedText: text }),
      });
      await client.send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key,
        code,
        ...(virtualKeyCode === undefined
          ? {}
          : {
              windowsVirtualKeyCode: virtualKeyCode,
              nativeVirtualKeyCode: virtualKeyCode,
            }),
      });
      await sleep(30);
    };

    await waitForDom(
      "window.__doctuiQualityFixtureReady === true",
      "Quality browser fixture did not initialize",
    );

    const theme = await evaluate(`(() => {
      const provider = document.querySelector('[data-dui-provider]');
      return {
        scheme: provider?.getAttribute('data-dui-color-scheme'),
        neutralFilled: provider?.style.getPropertyValue('--dui-color-neutral-filled').trim(),
      };
    })()`);
    assert(
      theme.scheme === "dark",
      `Expected dark provider, got ${theme.scheme}`,
    );
    assert(
      theme.neutralFilled === "#123456",
      `Custom theme token was not observable: ${theme.neutralFilled}`,
    );

    const field = await evaluate(`(() => {
      const input = document.querySelector('#quality-email');
      const label = document.querySelector('label[for="quality-email"]');
      const describedIds = (input?.getAttribute('aria-describedby') ?? '').split(/\\s+/).filter(Boolean);
      return {
        name: input?.getAttribute('name'),
        labelMatches: label?.htmlFor === input?.id,
        described: describedIds.length === 2 && describedIds.every((id) => Boolean(document.getElementById(id))),
        invalid: input?.getAttribute('aria-invalid'),
        errorRole: document.querySelector('#quality-email-error')?.getAttribute('role'),
      };
    })()`);
    assert(
      field.name === "email",
      `TextInput did not forward name: ${field.name}`,
    );
    assert(
      field.labelMatches,
      "TextInput label is not associated with the native input",
    );
    assert(
      field.described,
      "TextInput description/error relationships are incomplete",
    );
    assert(
      field.invalid === "true",
      "TextInput error did not expose aria-invalid",
    );
    assert(
      field.errorRole === "alert",
      "TextInput error is not announced as an alert",
    );

    const initialSegment = await evaluate(`(() => {
      const enabled = [...document.querySelectorAll('#segmented-contract [role="radio"]')]
        .filter((item) => !item.disabled);
      const tabStops = enabled.filter((item) => item.tabIndex === 0);
      tabStops[0]?.focus();
      return {
        count: tabStops.length,
        text: tabStops[0]?.textContent?.trim(),
      };
    })()`);
    assert(
      initialSegment.count === 1,
      `SegmentedControl has ${initialSegment.count} tab stops`,
    );
    assert(
      initialSegment.text === "Vue",
      `Unexpected initial segment: ${initialSegment.text}`,
    );
    await pressKey("ArrowRight");
    await waitForDom(
      `document.querySelector('[data-quality-segment-value]')?.textContent === 'rust'`,
      "SegmentedControl ArrowRight did not update the controlled value",
    );
    const movedSegment = await evaluate(`(() => ({
      active: document.activeElement?.textContent?.trim(),
      checked: document.activeElement?.getAttribute?.('aria-checked'),
    }))()`);
    assert(
      movedSegment.active === "Rust",
      `Segment focus did not move: ${movedSegment.active}`,
    );
    assert(
      movedSegment.checked === "true",
      "SegmentedControl focus and selection drifted",
    );

    await evaluate(`(() => {
      const input = document.querySelector('#quality-tech');
      input.focus();
      input.value = 'Rust';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      return true;
    })()`);
    await waitFor(async () => {
      const state = await evaluate(`(() => {
        const input = document.querySelector('#quality-tech');
        const activeId = input?.getAttribute('aria-activedescendant');
        const active = activeId ? document.getElementById(activeId) : null;
        return {
          expanded: input?.getAttribute('aria-expanded'),
          activeExists: Boolean(active),
          activeText: active?.textContent?.trim(),
        };
      })()`);
      return (
        state.expanded === "true" &&
        state.activeExists &&
        state.activeText === "Rust"
      );
    }, "Combobox filtering left aria-activedescendant on a missing option");
    await pressKey("Enter");
    await waitForDom(
      `document.querySelector('[data-quality-combobox-value]')?.textContent === 'rust'`,
      "Combobox Enter did not select the filtered active option",
    );

    await evaluate(
      `document.querySelector('#quality-menu-trigger').focus(); true`,
    );
    await pressKey("ArrowDown");
    await waitFor(async () => {
      const active = await evaluate(`(() => ({
        menu: Boolean(document.querySelector('[role="menu"]')),
        text: document.activeElement?.textContent?.trim(),
      }))()`);
      return active.menu && active.text === "Profile";
    }, "Menu did not focus the first enabled item from the trigger");
    await pressKey("End");
    assert(
      (await evaluate("document.activeElement?.textContent?.trim()")) ===
        "Sign out",
      "Menu End did not move focus to the final enabled item",
    );
    await pressKey("Escape");
    await waitForDom(
      `!document.querySelector('[role="menu"]') && document.activeElement?.id === 'quality-menu-trigger'`,
      "Menu Escape did not close and restore trigger focus",
    );

    await evaluate(
      `document.querySelector('.dui-DatePicker__toggle').click(); true`,
    );
    await waitForDom(
      `Boolean(document.querySelector('.dui-DatePickerPanel')) && document.activeElement?.getAttribute?.('role') === 'gridcell'`,
      "DatePicker did not open and move focus into the calendar",
    );
    assert(
      (await evaluate(
        "document.activeElement?.getAttribute?.('aria-label')",
      )) === "2026-09-14",
      "DatePicker did not focus the selected day",
    );
    await pressKey("ArrowRight");
    assert(
      (await evaluate(
        "document.activeElement?.getAttribute?.('aria-label')",
      )) === "2026-09-15",
      "Calendar ArrowRight did not move to the next day",
    );
    await pressKey("Enter");
    await waitForDom(
      `document.querySelector('[data-quality-date-value]')?.textContent === '2026-09-15' && !document.querySelector('.dui-DatePickerPanel')`,
      "DatePicker keyboard selection did not commit and close",
    );
    assert(
      (await evaluate(
        "document.activeElement?.classList?.contains('dui-DatePicker__toggle')",
      )) === true,
      "DatePicker selection did not restore focus to the toggle",
    );

    const notification = await evaluate(`(() => {
      const status = document.querySelector('.dui-Notification [role="status"]');
      const dismiss = document.querySelector('.dui-Notification button');
      return {
        live: status?.getAttribute('aria-live'),
        atomic: status?.getAttribute('aria-atomic'),
        dismissLabel: dismiss?.getAttribute('aria-label'),
        dismissTabIndex: dismiss?.tabIndex,
      };
    })()`);
    assert(
      notification.live === "polite",
      "Notification live region is not polite",
    );
    assert(
      notification.atomic === "true",
      "Notification live region is not atomic",
    );
    assert(
      notification.dismissLabel?.includes("Dismiss Saved notification"),
      `Notification dismiss control has an unexpected label: ${notification.dismissLabel}`,
    );
    assert(
      notification.dismissTabIndex === 0,
      "Notification dismiss control is not keyboard focusable",
    );
    await evaluate(
      `document.querySelector('.dui-Notification button').click(); true`,
    );
    await waitForDom(
      `!document.querySelector('.dui-Notification')`,
      "Notification dismiss control did not remove the announcement",
    );

    console.log("Browser quality regression matrix passed");
  } finally {
    client?.close();
    vite.kill("SIGTERM");
    chromeProcess.kill("SIGTERM");
  }
}

await main();

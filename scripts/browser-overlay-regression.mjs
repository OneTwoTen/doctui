import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { setTimeout as sleep } from "node:timers/promises";

const vitePort = 4174;
const chromePort = 9222;
const fixtureUrl = `http://127.0.0.1:${vitePort}/tests/browser/overlay.html`;

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
  if (!chrome) {
    throw new Error(
      "Chrome/Chromium is required for browser overlay regressions",
    );
  }

  const vite = spawn(
    "bun",
    [
      "x",
      "vite",
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
      "--user-data-dir=/tmp/doctui-overlay-chrome",
      "--window-size=1280,800",
      "about:blank",
    ],
    { stdio: ["ignore", "pipe", "pipe"] },
  );

  let client;
  try {
    await waitForHttp(`http://127.0.0.1:${vitePort}/`);
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

    await waitForDom(
      "window.__doctuiOverlayFixtureReady === true",
      "Overlay browser fixture did not initialize",
    );

    await evaluate(`
      document.querySelector('#open-modal').focus();
      document.querySelector('#open-modal').click();
      true;
    `);
    await waitForDom(
      "Boolean(document.querySelector('.dui-Modal'))",
      "Modal did not open",
    );

    const backdrop = await evaluate(`(() => {
      const element = document.querySelector('.dui-Overlay');
      const style = getComputedStyle(element);
      return {
        themeColor: element.style.getPropertyValue('--dui-color-neutral-filled').trim(),
        background: style.backgroundColor,
      };
    })()`);
    assert(
      backdrop.themeColor === "#123456",
      `Teleported backdrop lost provider theme: ${backdrop.themeColor}`,
    );
    assert(
      backdrop.background !== "transparent" &&
        backdrop.background !== "rgba(0, 0, 0, 0)",
      `Backdrop is visually transparent: ${backdrop.background}`,
    );

    const xsGeometry = await evaluate(`(() => {
      const rect = document.querySelector('.dui-Modal').getBoundingClientRect();
      return {
        width: rect.width,
        leftGap: rect.left,
        rightGap: innerWidth - rect.right,
      };
    })()`);
    assert(
      xsGeometry.width > 300 && xsGeometry.width < 340,
      `xs Modal width is not observable: ${xsGeometry.width}px`,
    );
    assert(
      Math.abs(xsGeometry.leftGap - xsGeometry.rightGap) < 4,
      `Modal is not horizontally centered: ${JSON.stringify(xsGeometry)}`,
    );

    await evaluate(`
      const select = document.querySelector('#modal-size');
      select.value = 'xl';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      true;
    `);
    const xlWidth = await waitFor(async () => {
      const width = await evaluate(
        "document.querySelector('.dui-Modal').getBoundingClientRect().width",
      );
      return width > 800 ? width : false;
    }, "xl Modal did not grow to its token width");
    assert(
      xlWidth > xsGeometry.width + 400,
      `Modal size control did not change real geometry: ${xsGeometry.width} -> ${xlWidth}`,
    );

    await evaluate("document.querySelector('#outside').focus(); true;");
    await sleep(50);
    const focusContained = await evaluate(
      "document.querySelector('.dui-Modal').contains(document.activeElement)",
    );
    assert(focusContained, "Focus escaped the active Modal");

    await evaluate(`
      document.querySelector('#open-drawer').focus();
      document.querySelector('#open-drawer').click();
      true;
    `);
    await waitForDom(
      "Boolean(document.querySelector('.dui-Drawer'))",
      "Nested Drawer did not open",
    );
    assert(
      (await evaluate("document.body.style.overflow")) === "hidden",
      "Opening nested dialogs did not lock page scroll",
    );

    const pressEscape = async () => {
      await client.send("Input.dispatchKeyEvent", {
        type: "keyDown",
        key: "Escape",
        code: "Escape",
      });
      await client.send("Input.dispatchKeyEvent", {
        type: "keyUp",
        key: "Escape",
        code: "Escape",
      });
    };

    await pressEscape();
    await waitForDom(
      "!document.querySelector('.dui-Drawer')",
      "First Escape did not close the nested Drawer",
    );
    assert(
      await evaluate("Boolean(document.querySelector('.dui-Modal'))"),
      "First Escape incorrectly closed the parent Modal",
    );
    assert(
      (await evaluate("document.activeElement?.id")) === "open-drawer",
      "Drawer did not restore focus to its trigger",
    );
    assert(
      (await evaluate("document.body.style.overflow")) === "hidden",
      "Closing one nested layer released the parent scroll lock",
    );

    await pressEscape();
    await waitForDom(
      "!document.querySelector('.dui-Modal')",
      "Second Escape did not close the parent Modal",
    );
    assert(
      (await evaluate("document.activeElement?.id")) === "open-modal",
      "Modal did not restore focus to its trigger",
    );
    assert(
      (await evaluate("document.body.style.overflow")) === "",
      "Final dialog close did not restore body overflow",
    );

    await evaluate(`
      const select = document.querySelector('#modal-size');
      select.value = 'xs';
      select.dispatchEvent(new Event('change', { bubbles: true }));
      document.querySelector('#open-modal').click();
      true;
    `);
    await waitForDom(
      "Boolean(document.querySelector('.dui-Modal'))",
      "Modal did not reopen for pointer regression",
    );

    await client.send("Input.dispatchMouseEvent", {
      type: "mousePressed",
      x: 8,
      y: 400,
      button: "left",
      clickCount: 1,
    });
    await client.send("Input.dispatchMouseEvent", {
      type: "mouseReleased",
      x: 8,
      y: 400,
      button: "left",
      clickCount: 1,
    });
    await waitForDom(
      "!document.querySelector('.dui-Modal')",
      "Real backdrop pointer interaction did not dismiss Modal",
    );

    console.log("Overlay browser regressions passed");
  } finally {
    client?.close();
    vite.kill("SIGTERM");
    chromeProcess.kill("SIGTERM");
  }
}

await main();

import { spawn } from "node:child_process";
import { existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";

const rootDir = dirname(dirname(fileURLToPath(import.meta.url)));
const docsDir = join(rootDir, "apps/docs");
const docsPort = 4177;
const chromePort = 9227;
const origin = `http://127.0.0.1:${docsPort}`;
const docsBase = "/doctui";
const auditedRoutes = [
  "/guide/theming",
  "/guide/basic-components",
  "/guide/selection-controls",
  "/guide/tags-input",
  "/guide/overlays",
  "/guide/dialog-actions",
  "/guide/accessibility",
  "/guide/notifications",
  "/guide/dates",
];

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
    throw new Error("Chrome/Chromium is required for docs browser regression");
  }

  const docs = spawn(
    "bun",
    [
      "run",
      "preview",
      "--host",
      "127.0.0.1",
      "--port",
      String(docsPort),
      "--strictPort",
    ],
    { cwd: docsDir, stdio: "ignore" },
  );
  const chromeProcess = spawn(
    chrome,
    [
      "--headless=new",
      "--no-sandbox",
      "--disable-gpu",
      `--remote-debugging-port=${chromePort}`,
      "--user-data-dir=/tmp/doctui-docs-preview-chrome",
      "--window-size=1280,900",
      "about:blank",
    ],
    { stdio: "ignore" },
  );

  let client;
  try {
    await waitForHttp(`${origin}${docsBase}/guide/basic-components`);
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
    const navigate = async (path, readySelector) => {
      await client.send("Page.navigate", {
        url: `${origin}${docsBase}${path}`,
      });
      await waitForDom(
        `document.readyState === "complete" && Boolean(document.querySelector(${JSON.stringify(readySelector)}))`,
        `Docs page ${path} did not render ${readySelector}`,
      );
    };
    const auditPreviewGeometry = async (path, viewportLabel) => {
      await navigate(path, ".docs-preview");
      const audit = await evaluate(`(() => {
        const previews = [...document.querySelectorAll(".docs-preview")];
        const viewportWidth = window.innerWidth;
        return {
          previewCount: previews.length,
          documentOverflow:
            document.documentElement.scrollWidth -
            document.documentElement.clientWidth,
          overflowingPreviews: previews.filter((preview) => {
            const rect = preview.getBoundingClientRect();
            return rect.left < -1 || rect.right > viewportWidth + 1;
          }).length,
          transparentPreviews: previews.filter((preview) => {
            const background = getComputedStyle(preview).backgroundColor;
            return (
              background === "rgba(0, 0, 0, 0)" ||
              background === "transparent"
            );
          }).length,
        };
      })()`);
      assert(
        audit.previewCount > 0,
        `${path} has no rendered preview boundaries`,
      );
      assert(
        audit.documentOverflow <= 1,
        `${path} overflows ${viewportLabel} viewport by ${audit.documentOverflow}px`,
      );
      assert(
        audit.overflowingPreviews === 0,
        `${path} has ${audit.overflowingPreviews} preview boundaries outside the ${viewportLabel} viewport`,
      );
      assert(
        audit.transparentPreviews === 0,
        `${path} has ${audit.transparentPreviews} previews without a themed surface`,
      );
    };

    await navigate(
      "/guide/basic-components",
      '.docs-preview [data-dui-component="Button"]',
    );

    const basicAudit = await evaluate(`(() => {
      const provider = document.querySelector("[data-dui-provider]");
      const button = document.querySelector('.docs-preview [data-dui-component="Button"][data-color="primary"][data-variant="filled"]');
      const textInput = document.querySelector('.docs-preview [data-dui-component="TextInput"] input');
      if (!provider || !button || !textInput) return null;
      const providerStyle = getComputedStyle(provider);
      const buttonStyle = getComputedStyle(button);
      const inputStyle = getComputedStyle(textInput);
      return {
        colorToken: providerStyle.getPropertyValue("--dui-color-text").trim(),
        spacingToken: providerStyle.getPropertyValue("--dui-spacing-md").trim(),
        radiusToken: providerStyle.getPropertyValue("--dui-radius-md").trim(),
        buttonBackground: buttonStyle.backgroundColor,
        buttonRadius: parseFloat(buttonStyle.borderRadius),
        inputHeight: parseFloat(inputStyle.height),
        horizontalOverflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    })()`);

    assert(basicAudit, "Basic docs preview audit could not resolve elements");
    assert(
      basicAudit.colorToken,
      "Docs provider did not expose --dui-color-text",
    );
    assert(
      basicAudit.spacingToken,
      "Docs provider did not expose --dui-spacing-md",
    );
    assert(
      basicAudit.radiusToken,
      "Docs provider did not expose --dui-radius-md",
    );
    assert(
      basicAudit.buttonBackground !== "rgba(0, 0, 0, 0)" &&
        basicAudit.buttonBackground !== "transparent",
      "Primary filled Button preview lost its themed background",
    );
    assert(basicAudit.buttonRadius > 0, "Button preview lost themed radius");
    assert(
      basicAudit.inputHeight >= 30,
      "TextInput preview collapsed vertically",
    );
    assert(
      basicAudit.horizontalOverflow <= 1,
      `Basic docs page overflows horizontally by ${basicAudit.horizontalOverflow}px`,
    );

    await navigate(
      "/guide/selection-controls",
      '.docs-preview [data-dui-component="Combobox"]',
    );
    await evaluate(`(() => {
      const input = document.querySelector('.docs-preview [data-dui-component="Combobox"] input');
      input?.focus();
      input?.click();
      return Boolean(input);
    })()`);
    await waitForDom(
      'Boolean(document.querySelector(".docs-preview [role=listbox]"))',
      "Selection docs preview did not open a listbox",
    );
    const selectionAudit = await evaluate(`(() => {
      const dropdown = document.querySelector(".docs-preview [role=listbox]");
      if (!dropdown) return null;
      const rect = dropdown.getBoundingClientRect();
      const style = getComputedStyle(dropdown);
      return {
        width: rect.width,
        left: rect.left,
        right: rect.right,
        background: style.backgroundColor,
        viewportWidth: window.innerWidth,
      };
    })()`);
    assert(
      selectionAudit?.width > 120,
      "Selection dropdown collapsed horizontally",
    );
    assert(
      selectionAudit.left >= -1,
      "Selection dropdown is clipped on the left",
    );
    assert(
      selectionAudit.right <= selectionAudit.viewportWidth + 1,
      "Selection dropdown overflows the viewport",
    );
    assert(
      selectionAudit.background !== "rgba(0, 0, 0, 0)" &&
        selectionAudit.background !== "transparent",
      "Selection dropdown lost its themed surface",
    );

    await navigate(
      "/guide/tags-input",
      '.docs-preview [data-dui-component="TagsInput"]',
    );
    const tagsAudit = await evaluate(`(() => {
      const control = document.querySelector(".docs-preview .dui-TagsInput-control");
      if (!control) return null;
      const rect = control.getBoundingClientRect();
      const style = getComputedStyle(control);
      return {
        height: rect.height,
        borderWidth: parseFloat(style.borderTopWidth),
        radius: parseFloat(style.borderRadius),
        overflow: document.documentElement.scrollWidth - document.documentElement.clientWidth,
      };
    })()`);
    assert(tagsAudit?.height >= 30, "TagsInput preview collapsed vertically");
    assert(
      tagsAudit.borderWidth > 0,
      "TagsInput preview lost its field border",
    );
    assert(tagsAudit.radius > 0, "TagsInput preview lost its themed radius");
    assert(
      tagsAudit.overflow <= 1,
      "TagsInput docs page overflows horizontally",
    );

    for (const path of auditedRoutes) {
      await auditPreviewGeometry(path, "desktop");
    }

    await client.send("Emulation.setDeviceMetricsOverride", {
      width: 390,
      height: 844,
      deviceScaleFactor: 1,
      mobile: true,
    });

    for (const path of auditedRoutes) {
      await auditPreviewGeometry(path, "mobile");
    }

    console.log(
      "Docs browser preview regression: theme, interactions and responsive geometry OK across audited guides",
    );
  } finally {
    client?.close();
    docs.kill("SIGTERM");
    chromeProcess.kill("SIGTERM");
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});

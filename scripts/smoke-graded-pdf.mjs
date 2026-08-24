import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";

const port = 9333;
const downloadDir = "/home/ubuntu/Downloads/learning-compass-smoke";
const profileDir = "/tmp/learning-compass-smoke-profile";
rmSync(downloadDir, { recursive: true, force: true });
rmSync(profileDir, { recursive: true, force: true });
mkdirSync(downloadDir, { recursive: true });

const browser = spawn("chromium", [
  "--headless", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`, "http://127.0.0.1:3000/",
], { stdio: "ignore" });

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));

async function getTarget() {
  for (let attempts = 0; attempts < 30; attempts += 1) {
    try {
      const targets = await fetch(`http://127.0.0.1:${port}/json`).then((response) => response.json());
      const page = targets.find((target) => target.type === "page");
      if (page) return page;
    } catch { /* Chromium has not started yet. */ }
    await wait(150);
  }
  throw new Error("Could not connect to the local Chromium session.");
}

async function run() {
  const target = await getTarget();
  const socket = new WebSocket(target.webSocketDebuggerUrl);
  await new Promise((resolve, reject) => { socket.addEventListener("open", resolve, { once: true }); socket.addEventListener("error", reject, { once: true }); });
  let messageId = 0;
  const pending = new Map();
  socket.addEventListener("message", ({ data }) => {
    const message = JSON.parse(data);
    if (pending.has(message.id)) { pending.get(message.id)(message); pending.delete(message.id); }
  });
  const command = (method, params = {}) => new Promise((resolve, reject) => {
    const id = ++messageId;
    pending.set(id, (message) => message.error ? reject(new Error(message.error.message)) : resolve(message.result));
    socket.send(JSON.stringify({ id, method, params }));
  });
  const evaluate = async (expression) => {
    const result = await command("Runtime.evaluate", { expression, awaitPromise: true, returnByValue: true });
    if (result.exceptionDetails) throw new Error(result.exceptionDetails.text);
    return result.result.value;
  };

  await command("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: downloadDir });
  await evaluate(`window.__learningCompassSmokeErrors = []; window.addEventListener('error', (event) => window.__learningCompassSmokeErrors.push(String(event.error ?? event.message))); window.addEventListener('unhandledrejection', (event) => window.__learningCompassSmokeErrors.push(String(event.reason)));`);
  await wait(1000);
  await evaluate(`Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.trim() === '小一')?.click()`);
  await wait(100);
  await evaluate(`Array.from(document.querySelectorAll('.track-card')).find((button) => button.textContent?.includes('中文閱讀'))?.click()`);
  await wait(250);
  for (let index = 0; index < 20; index += 1) {
    await evaluate(`document.querySelector('.answer-option')?.click()`);
    await wait(65);
    await evaluate(`Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('${index === 19 ? "生成免費報告" : "下一題"}'))?.click()`);
    await wait(90);
  }
  await evaluate(`Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('查看並下載完整報告'))?.click()`);
  await wait(350);
  const reportState = await evaluate(`({ report: !!document.querySelector('.download-report'), text: document.querySelector('.download-report')?.innerText.includes('20 題') ?? false, button: !!Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('下載完整 PDF 報告')) })`);
  if (!reportState.report || !reportState.text || !reportState.button) {
    const bodyText = await evaluate("document.body.innerText.slice(-1600)");
    throw new Error(`The complete report did not render as expected: ${JSON.stringify(reportState)}\n${bodyText}`);
  }
  const shareState = await evaluate(`({ panel: !!document.querySelector('.report-share-panel'), whatsapp: !!Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('WhatsApp')), device: !!Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('分享到其他 App')), copy: !!Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('複製文字')) })`);
  if (!shareState.panel || !shareState.whatsapp || !shareState.device || !shareState.copy) throw new Error(`Share controls did not render as expected: ${JSON.stringify(shareState)}`);
  const screenshot = await command("Page.captureScreenshot", { format: "png", captureBeyondViewport: true });
  writeFileSync("/home/ubuntu/learning-compass-report-share.png", Buffer.from(screenshot.data, "base64"));
  const whatsappUrl = await evaluate(`window.__shareUrl = ''; window.open = (url) => { window.__shareUrl = url; return null; }; Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('WhatsApp'))?.click(); window.__shareUrl`);
  if (!whatsappUrl.startsWith('https://wa.me/?text=') || decodeURIComponent(whatsappUrl).includes('陳太') || decodeURIComponent(whatsappUrl).includes('港島')) throw new Error(`WhatsApp summary is not privacy-safe: ${whatsappUrl}`);
  await evaluate(`Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('複製文字'))?.click()`);
  await wait(250);
  const copyStatus = await evaluate(`document.querySelector('.share-status')?.innerText ?? ''`);
  if (!copyStatus) throw new Error("Copy-share action did not produce a visible status.");
  await evaluate(`Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('下載完整 PDF 報告'))?.click()`);
  for (let attempts = 0; attempts < 120; attempts += 1) {
    if (existsSync(downloadDir) && readdirSync(downloadDir).some((file) => file.endsWith(".pdf"))) break;
    await wait(250);
  }
  const downloads = readdirSync(downloadDir).filter((file) => file.endsWith(".pdf"));
  if (downloads.length === 0) {
    const errors = await evaluate("window.__learningCompassSmokeErrors");
    const pageState = await evaluate("({ busy: document.body.innerText.includes('正在製作 PDF'), report: !!document.querySelector('.download-report') })");
    throw new Error(`PDF download was not created. ${JSON.stringify({ errors, pageState })}`);
  }
  console.log(`Smoke test passed: report rendered, share controls verified and ${downloads[0]} downloaded.`);
  socket.close();
  browser.kill("SIGTERM");
}

run().catch((error) => { browser.kill("SIGTERM"); console.error(error); process.exit(1); });

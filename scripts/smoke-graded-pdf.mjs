import { spawn } from "node:child_process";
import { existsSync, mkdirSync, readdirSync, rmSync, writeFileSync } from "node:fs";
import "dotenv/config";
import { eq } from "drizzle-orm";
import { parentLeads } from "../drizzle/schema";
import { getDb } from "../server/db";

const port = 9333;
const downloadDir = "/home/ubuntu/Downloads/learning-compass-smoke";
const profileDir = "/tmp/learning-compass-smoke-profile";
const testTrack = process.env.SMOKE_TRACK ?? "中文";
const answerIndex = Number(process.env.SMOKE_ANSWER_INDEX ?? 0);
const expectRegionalSupport = process.env.SMOKE_EXPECT_REGIONAL_SUPPORT === "1";
const smokeLeadName = "SMOKE_TEST_PARENT_20260825";
rmSync(downloadDir, { recursive: true, force: true });
rmSync(profileDir, { recursive: true, force: true });
mkdirSync(downloadDir, { recursive: true });

const browser = spawn("chromium", [
  "--headless", "--no-sandbox", "--disable-gpu", `--remote-debugging-port=${port}`,
  `--user-data-dir=${profileDir}`, "http://127.0.0.1:3000/",
], { stdio: "ignore" });

const wait = (milliseconds) => new Promise((resolve) => setTimeout(resolve, milliseconds));
const cleanupSmokeLead = async () => { const db = await getDb(); if (db) await db.delete(parentLeads).where(eq(parentLeads.parentName, smokeLeadName)); };

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
  await cleanupSmokeLead();
  try {
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
  const waitFor = async (expression, description) => {
    for (let attempts = 0; attempts < 80; attempts += 1) {
      if (await evaluate(expression)) return;
      await wait(100);
    }
    throw new Error(`Timed out waiting for ${description}.`);
  };

  await command("Browser.setDownloadBehavior", { behavior: "allow", downloadPath: downloadDir });
  await evaluate(`window.__learningCompassSmokeErrors = []; window.addEventListener('error', (event) => window.__learningCompassSmokeErrors.push(String(event.error ?? event.message))); window.addEventListener('unhandledrejection', (event) => window.__learningCompassSmokeErrors.push(String(event.reason)));`);
  await wait(1000);
  await evaluate(`Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.trim() === '小一')?.click()`);
  await waitFor(`!!Array.from(document.querySelectorAll('.track-card')).find((button) => button.textContent?.includes(${JSON.stringify(testTrack)}))`, `${testTrack} track card`);
  await evaluate(`Array.from(document.querySelectorAll('.track-card')).find((button) => button.textContent?.includes(${JSON.stringify(testTrack)}))?.click()`);
  await waitFor(`document.querySelectorAll('.answer-option').length === 4`, "first assessment question");
  for (let index = 0; index < 20; index += 1) {
    await evaluate(`document.querySelectorAll('.answer-option')[${answerIndex}]?.click()`);
    await wait(65);
    await evaluate(`Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('${index === 19 ? "生成免費報告" : "下一題"}'))?.click()`);
    await wait(90);
  }
  await waitFor(`!!document.querySelector('.parent-lead-form')`, "parent follow-up form");
  const leadFormState = await evaluate(`({ name: !!document.querySelector('.parent-lead-form input[placeholder="例如：陳太"]'), phone: !!document.querySelector('.parent-lead-form input[inputmode="tel"]'), districts: document.querySelectorAll('.parent-lead-form option').length === 19, consent: !!document.querySelector('.parent-lead-form input[type="checkbox"]') })`);
  if (!leadFormState.name || !leadFormState.phone || !leadFormState.districts || !leadFormState.consent) throw new Error(`Parent follow-up form is incomplete: ${JSON.stringify(leadFormState)}`);
  await evaluate(`(() => { const phone = document.querySelector('.parent-lead-form input[inputmode="tel"]'); phone.value = '11234567'; phone.dispatchEvent(new Event('input', { bubbles: true })); phone.dispatchEvent(new FocusEvent('focusout', { bubbles: true })); })()`);
  await waitFor(`!!document.querySelector('.lead-field-error')`, "Hong Kong phone inline validation");
  await evaluate(`(() => { const setInput = (node, value) => { Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value').set.call(node, value); node.dispatchEvent(new Event('input', { bubbles: true })); }; const setSelect = (node, value) => { Object.getOwnPropertyDescriptor(HTMLSelectElement.prototype, 'value').set.call(node, value); node.dispatchEvent(new Event('change', { bubbles: true })); }; setInput(document.querySelector('.parent-lead-form input[placeholder="例如：陳太"]'), ${JSON.stringify(smokeLeadName)}); setInput(document.querySelector('.parent-lead-form input[inputmode="tel"]'), '+852 9123 4567'); setSelect(document.querySelector('.parent-lead-form select'), '荃灣區'); document.querySelector('.parent-lead-form input[type="checkbox"]')?.click(); })()`);
  await waitFor(`!document.querySelector('.lead-field-error')`, "valid Hong Kong phone state");
  await evaluate(`Array.from(document.querySelectorAll('.parent-lead-form button')).find((button) => button.textContent?.includes('提交並查看完整報告'))?.click()`);
  await waitFor(`!!document.querySelector('.parent-lead-success')`, "lead submission success animation");
  await waitFor(`!!document.querySelector('.download-report')`, "complete report");
  const reportState = await evaluate(`({ report: !!document.querySelector('.download-report'), text: document.querySelector('.download-report')?.innerText.includes('20 題') ?? false, button: !!Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('下載完整 PDF 報告')) })`);
  if (!reportState.report || !reportState.text || !reportState.button) {
    const bodyText = await evaluate("document.body.innerText.slice(-1600)");
    throw new Error(`The complete report did not render as expected: ${JSON.stringify(reportState)}\n${bodyText}`);
  }
  if (testTrack === "數學") {
    await evaluate(`Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('開啟精簡弱項報告'))?.click()`);
    await wait(180);
    const focusState = await evaluate(`({ panel: !!document.querySelector('.focus-report'), recommendation: document.body.innerText.includes('合作支援示範推薦'), transparency: document.body.innerText.includes('透明度說明') })`);
    if (!focusState.panel || !focusState.recommendation || !focusState.transparency) throw new Error(`Weakness focus report did not render as expected: ${JSON.stringify(focusState)}`);
  }
  if (expectRegionalSupport) {
    const regionalState = await evaluate(`({ panel: !!document.querySelector('.regional-support'), button: !!Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('新界')), contact: !!Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('由學習航圖安排轉介')) })`);
    if (!regionalState.panel || !regionalState.button || !regionalState.contact) throw new Error(`Regional support controls did not render as expected: ${JSON.stringify(regionalState)}`);
    await evaluate(`Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.trim() === '新界')?.click()`);
    await evaluate(`(() => { const select = document.querySelector('[aria-label="選擇香港十八區"]'); select.value = '荃灣區'; select.dispatchEvent(new Event('change', { bubbles: true })); })()`);
    await waitFor(`document.querySelector('.regional-support')?.innerText.includes('現正提供 小一${testTrack} 學習支援')`, "eligible Tsuen Wan centre");
    const tsuenWanUrl = await evaluate(`window.__supportUrl = ''; window.open = (url) => { window.__supportUrl = url; return null; }; Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.includes('由學習航圖安排轉介'))?.click(); window.__supportUrl`);
    if (!tsuenWanUrl.startsWith('https://wa.me/') || !decodeURIComponent(tsuenWanUrl).includes('言點教育') || !decodeURIComponent(tsuenWanUrl).includes(`小一${testTrack}`) || decodeURIComponent(tsuenWanUrl).includes('陳太')) throw new Error(`Tsuen Wan WhatsApp query is not correct: ${tsuenWanUrl}`);
    await evaluate(`Array.from(document.querySelectorAll('button')).find((button) => button.textContent?.trim() === '港島')?.click()`);
    await evaluate(`(() => { const select = document.querySelector('[aria-label="選擇香港十八區"]'); select.value = '灣仔區'; select.dispatchEvent(new Event('change', { bubbles: true })); })()`);
    await waitFor(`document.querySelector('.regional-support')?.innerText.includes('待合作中心加入')`, "transparent Wan Chai pending state");
    const wanChaiHtml = await evaluate(`document.querySelector('.regional-support')?.innerHTML ?? ''`);
    if (wanChaiHtml.includes('現正提供 <strong>小一${testTrack}</strong> 學習支援')) throw new Error("Wan Chai should not display an unconfirmed cooperation centre.");
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
  console.log(`Smoke test passed for ${testTrack}: report rendered, share controls verified and ${downloads[0]} downloaded.`);
  socket.close();
  browser.kill("SIGTERM");
  } finally {
    await cleanupSmokeLead();
  }
}

run().then(() => process.exit(0)).catch((error) => { browser.kill("SIGTERM"); console.error(error); process.exit(1); });

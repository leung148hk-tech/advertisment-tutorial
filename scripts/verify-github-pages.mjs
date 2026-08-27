import { existsSync, readdirSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

const root = resolve(process.cwd(), "dist/public");
const requireFile = (relativePath) => {
  const filename = resolve(root, relativePath);
  if (!existsSync(filename)) throw new Error(`Missing GitHub Pages artifact: ${relativePath}`);
  return filename;
};
const assertContains = (value, expected, description) => {
  if (!value.includes(expected)) throw new Error(`GitHub Pages verification failed: ${description}`);
};

const indexHtml = readFileSync(requireFile("index.html"), "utf8");
const notFoundHtml = readFileSync(requireFile("404.html"), "utf8");
const assetNames = readdirSync(resolve(root, "assets"));

assertContains(indexHtml, "/advertisment-tutorial/assets/", "assets are not rooted at the repository subpath");
assertContains(indexHtml, "learnquiz-pe8vp32z.manus.space", "official-site handoff is absent");
assertContains(indexHtml, "學習航圖｜小學分級免費評估", "document title is absent");
assertContains(notFoundHtml, "https://learnquiz-pe8vp32z.manus.space/", "404 fallback does not reach the official site");
if (!existsSync(resolve(root, ".nojekyll"))) throw new Error("GitHub Pages verification failed: .nojekyll is absent");
if (!assetNames.some((name) => name.endsWith(".js")) || !assetNames.some((name) => name.endsWith(".css"))) {
  throw new Error("GitHub Pages verification failed: JavaScript or CSS assets are absent");
}

console.log("GitHub Pages verified: subpath assets, static output, official-site handoff, and fallback are present.");

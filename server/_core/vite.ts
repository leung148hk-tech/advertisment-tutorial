import express, { type Express } from "express";
import fs from "fs";
import { type Server } from "http";
import { nanoid } from "nanoid";
import path from "path";
import { createServer as createViteServer } from "vite";
import viteConfig from "../../vite.config";

export async function setupVite(app: Express, server: Server) {
  const serverOptions = {
    middlewareMode: true,
    hmr: { server },
    allowedHosts: true as const,
  };

  const vite = await createViteServer({
    ...viteConfig,
    configFile: false,
    server: serverOptions,
    appType: "custom",
  });

  // The managed preview browser blocks Vite's default internal `/@fs` import
  // used by the HMR client. Source modules only require this small API for
  // optional hot callbacks, so a no-op client keeps the dev preview executable.
  app.get("/@vite/client", (_req, res) => {
    res.type("js").send(`
      export function createHotContext() {
        return { accept() {}, dispose() {}, prune() {}, decline() {}, invalidate() {}, on() {}, send() {} };
      }
      export function injectQuery(url) { return url; }
      export function updateStyle() {}
      export function removeStyle() {}
      export const ErrorOverlay = class {};
    `);
  });

  app.use(vite.middlewares);
  app.use("*", async (req, res, next) => {
    // The SPA fallback is only for browser navigations. Let Vite answer module
    // requests (for example /src/* and /vite-cache/*) and leave API requests
    // to their registered handlers rather than accidentally returning HTML.
    if (req.method !== "GET" || !req.headers.accept?.includes("text/html")) {
      return next();
    }

    const url = req.originalUrl;

    try {
      const clientTemplate = path.resolve(
        import.meta.dirname,
        "../..",
        "client",
        "index.html"
      );

      // always reload the index.html file from disk incase it changes
      let template = await fs.promises.readFile(clientTemplate, "utf-8");
      template = template.replace(
        `src="/src/main.tsx"`,
        `src="/src/main.tsx?v=${nanoid()}"`
      );
      const page = await vite.transformIndexHtml(url, template);
      res.status(200).set({ "Content-Type": "text/html" }).end(page);
    } catch (e) {
      vite.ssrFixStacktrace(e as Error);
      next(e);
    }
  });
}

export function serveStatic(app: Express) {
  const distPath =
    process.env.NODE_ENV === "development"
      ? path.resolve(import.meta.dirname, "../..", "dist", "public")
      : path.resolve(import.meta.dirname, "public");
  if (!fs.existsSync(distPath)) {
    console.error(
      `Could not find the build directory: ${distPath}, make sure to build the client first`
    );
  }

  app.use(express.static(distPath));

  // fall through to index.html if the file doesn't exist
  app.use("*", (_req, res) => {
    res.sendFile(path.resolve(distPath, "index.html"));
  });
}

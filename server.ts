import express from "express";
import path from "path";
import fs from "fs";
import { execFile } from "child_process";
import { createServer as createViteServer } from "vite";

async function startServer() {
  const app = express();
  const PORT = 3000;
  const pensionScriptPath = path.join(process.cwd(), "pension_tool.py");

  app.use(express.json());

  let cachedPrediction: any = null;
  let lastFetchTime = 0;
  let isExecuting = false;

  const refreshPrediction = (): Promise<any> => {
    return new Promise((resolve, reject) => {
      if (isExecuting) {
        if (cachedPrediction) return resolve(cachedPrediction);
      }
      isExecuting = true;
      execFile("python3", [pensionScriptPath, "--json"], { timeout: 15000 }, (error, stdout, stderr) => {
        isExecuting = false;
        if (error) {
          console.error("Python engine execution error:", error, stderr);
          if (cachedPrediction) return resolve(cachedPrediction);
          return reject(error);
        }

        try {
          const data = JSON.parse(stdout);
          cachedPrediction = data;
          lastFetchTime = Date.now();
          resolve(data);
        } catch (parseErr) {
          console.error("JSON parse error:", parseErr, stdout);
          if (cachedPrediction) return resolve(cachedPrediction);
          reject(parseErr);
        }
      });
    });
  };

  // Background poller running every 8 seconds to continuously capture all 30s issues
  setInterval(() => {
    refreshPrediction().catch((err) => {
      console.warn("Background poller notice:", err.message);
    });
  }, 8000);

  // Initial trigger
  refreshPrediction().catch(() => {});

  // API Route: Run the Python engine and get live prediction & tracker state
  app.get("/api/prediction", async (req, res) => {
    try {
      // If cache is fresh (less than 5 seconds old), return instantly
      if (cachedPrediction && Date.now() - lastFetchTime < 5000) {
        return res.json(cachedPrediction);
      }
      const data = await refreshPrediction();
      res.json(data);
    } catch (err: any) {
      if (cachedPrediction) {
        return res.json(cachedPrediction);
      }
      res.status(500).json({
        success: false,
        error: "Failed to execute Python prediction engine",
        details: err?.message || String(err),
      });
    }
  });

  // API Route: Download pure Python script
  app.get("/api/download-python", (req, res) => {
    if (fs.existsSync(pensionScriptPath)) {
      res.download(pensionScriptPath, "pension_tool.py");
    } else {
      res.status(404).send("pension_tool.py not found");
    }
  });

  // API Route: Read pure Python script content
  app.get("/api/python-code", (req, res) => {
    if (fs.existsSync(pensionScriptPath)) {
      const code = fs.readFileSync(pensionScriptPath, "utf-8");
      res.json({ code });
    } else {
      res.status(404).json({ error: "Source code not found" });
    }
  });

  // Vite middleware for development vs static build in production
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Pension Prediction Tool Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();

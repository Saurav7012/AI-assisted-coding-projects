import express from "express";
import path from "path";
import mongoose from "mongoose";
import dotenv from "dotenv";
import { createServer as createViteServer } from "vite";

// Load environment variables from .env
dotenv.config();

// --- DATABASE MODELS (Can stay at module scope) ---
const urlSchema = new mongoose.Schema({
  shortCode: { type: String, required: true, unique: true },
  longUrl: { type: String, required: true },
  clicks: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

// Define Mongoose Model
const Url = mongoose.models.Url || mongoose.model("Url", urlSchema);

// In-Memory fallback storage for demonstration and beginner playground
interface LocalUrl {
  shortCode: string;
  longUrl: string;
  clicks: number;
  createdAt: Date;
}
let localUrls: LocalUrl[] = [
  {
    shortCode: "google",
    longUrl: "https://google.com",
    clicks: 12,
    createdAt: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
  },
  {
    shortCode: "aistudio",
    longUrl: "https://ai.studio",
    clicks: 45,
    createdAt: new Date(),
  },
];

// --- MAIN SERVER RUNNER ---
async function startServer() {
  const app = express();
  const PORT = 3000;

  // Express JSON middleware to parse request bodies
  app.use(express.json());

  // --- DATABASE CONNECTION & SETUP ---
  const MONGODB_URI = process.env.MONGODB_URI;
  let isUsingMongoDB = false;
  let dbError: string | null = null;

  // Connect to MongoDB if MONGODB_URI is provided
  if (MONGODB_URI && MONGODB_URI.trim() !== "" && MONGODB_URI !== "YOUR_MONGODB_URI") {
    console.log("Connecting to MongoDB Atlas...");
    try {
      await mongoose.connect(MONGODB_URI);
      console.log("✅ Successfully connected to MongoDB Database!");
      isUsingMongoDB = true;
    } catch (err: any) {
      console.error("❌ MongoDB connection error:", err.message);
      dbError = err.message;
    }
  } else {
    console.log("⚠️ No MONGODB_URI found in secrets. Running in In-Memory Demo Mode.");
  }

  // --- DATABASE UTILITY HELPER METHODS ---
  async function saveUrl(shortCode: string, longUrl: string) {
    if (isUsingMongoDB) {
      const newUrl = new Url({ shortCode, longUrl });
      await newUrl.save();
      return {
        shortCode: newUrl.shortCode,
        longUrl: newUrl.longUrl,
        clicks: newUrl.clicks,
        createdAt: newUrl.createdAt,
      };
    } else {
      const newUrl: LocalUrl = {
        shortCode,
        longUrl,
        clicks: 0,
        createdAt: new Date(),
      };
      localUrls.push(newUrl);
      return newUrl;
    }
  }

  async function getUrlAndIncrementClicks(shortCode: string) {
    if (isUsingMongoDB) {
      const urlDoc = await (Url as any).findOne({ shortCode });
      if (urlDoc) {
        urlDoc.clicks += 1;
        await urlDoc.save();
        return urlDoc;
      }
      return null;
    } else {
      const urlItem = localUrls.find((u) => u.shortCode === shortCode);
      if (urlItem) {
        urlItem.clicks += 1;
        return urlItem;
      }
      return null;
    }
  }

  async function deleteUrl(shortCode: string) {
    if (isUsingMongoDB) {
      await (Url as any).deleteOne({ shortCode });
    } else {
      localUrls = localUrls.filter((u) => u.shortCode !== shortCode);
    }
  }

  async function getAllUrls() {
    if (isUsingMongoDB) {
      return await Url.find().sort({ createdAt: -1 });
    } else {
      return [...localUrls].sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  }

  // --- API ENDPOINTS ---

  // Check Database Status
  app.get("/api/db-status", (req, res) => {
    res.json({
      isUsingMongoDB,
      dbError,
      uriConfigured: !!MONGODB_URI && MONGODB_URI.trim() !== "",
    });
  });

  // Get all URLs
  app.get("/api/urls", async (req, res) => {
    try {
      const urls = await getAllUrls();
      res.json(urls);
    } catch (error: any) {
      res.status(500).json({ error: "Failed to retrieve URLs: " + error.message });
    }
  });

  // Shorten a URL (POST)
  app.post("/api/shorten", async (req, res) => {
    try {
      let { longUrl, customCode } = req.body;

      if (!longUrl) {
        return res.status(400).json({ error: "Please provide a long URL." });
      }

      // Ensure the URL starts with http:// or https://
      if (!/^https?:\/\//i.test(longUrl)) {
        longUrl = "http://" + longUrl;
      }

      // Generate short code if none is provided
      let shortCode = customCode ? customCode.trim().toLowerCase() : "";
      
      // Clean up the custom code
      shortCode = shortCode.replace(/[^a-z0-9_-]/g, "");

      if (!shortCode) {
        // Generate a random 6-character alphanumeric string
        shortCode = Math.random().toString(36).substring(2, 8);
      }

      // Check if code already exists
      if (isUsingMongoDB) {
        const existing = await (Url as any).findOne({ shortCode });
        if (existing) {
          return res.status(400).json({ error: "This short code is already in use. Please try another one." });
        }
      } else {
        const existing = localUrls.find((u) => u.shortCode === shortCode);
        if (existing) {
          return res.status(400).json({ error: "This short code is already in use. Please try another one." });
        }
      }

      const saved = await saveUrl(shortCode, longUrl);
      res.status(201).json(saved);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete a shortened URL
  app.delete("/api/urls/:code", async (req, res) => {
    try {
      const { code } = req.params;
      await deleteUrl(code);
      res.json({ success: true, message: "URL deleted successfully." });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // --- HTTP REDIRECTION ENDPOINT ---
  // Redirects from /s/:code to the real website URL
  app.get("/s/:code", async (req, res, next) => {
    try {
      const { code } = req.params;
      const record = await getUrlAndIncrementClicks(code);
      
      if (record) {
        console.log(`🔀 Redirecting /s/${code} to: ${record.longUrl}`);
        return res.redirect(302, record.longUrl);
      } else {
        return res.status(404).send(`
          <div style="font-family: sans-serif; text-align: center; padding: 50px;">
            <h1 style="color: #e11d48;">URL Not Found</h1>
            <p>The shortened URL code <strong>"${code}"</strong> does not exist.</p>
            <a href="/" style="color: #2563eb; text-decoration: none; font-weight: bold;">Go Back to Home</a>
          </div>
        `);
      }
    } catch (error) {
      next(error);
    }
  });

  // --- VITE MIDDLEWARE & STATIC ASSET HANDLERS ---
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

  // Start the Express server
  app.listen(PORT, "0.0.0.0", () => {
    console.log(`🚀 URL Shortener server listening at http://localhost:${PORT}`);
  });
}

// Start our full-stack server
startServer().catch((error) => {
  console.error("Critical error starting fullstack server:", error);
});

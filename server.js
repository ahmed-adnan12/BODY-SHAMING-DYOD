// server.js
import dotenv from "dotenv";
import mongoose from "mongoose";
import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Story from "./models/Story.js";
import Log from "./models/Log.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || "bodyshaming_secret_2025";
const TOKEN_EXPIRATION = "8h";

// Admin user
const adminUser = {
  username: process.env.ADMIN_USERNAME || "admin",
  passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || "admin123", 10)
};

app.use(cors());
app.use(bodyParser.json());

// --------------------
// Helpers
// --------------------
async function addLog(action, actor = "public") {
  const log = await Log.create({ action, actor });
  return log;
}

function verifyToken(req, res, next) {
  const authHeader = req.headers.authorization || "";
  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : "";

  if (!token) return res.status(401).json({ message: "Missing token" });

  try {
    const payload = jwt.verify(token, JWT_SECRET);
    req.user = payload;
    return next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}

// --------------------
// Auth Routes
// --------------------
app.post("/api/auth/login", async (req, res) => {
  const { username, password } = req.body;

  if (username !== adminUser.username) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const validPassword = await bcrypt.compare(password || "", adminUser.passwordHash);
  if (!validPassword) return res.status(401).json({ message: "Invalid credentials" });

  const token = jwt.sign({ username: adminUser.username }, JWT_SECRET, { expiresIn: TOKEN_EXPIRATION });
  await addLog("Admin logged in", "admin");

  res.json({ token });
});

app.get("/api/auth/verify", verifyToken, (req, res) => {
  res.json({ valid: true, user: req.user.username });
});

// --------------------
// Public Stories Routes
// --------------------
app.get("/api/stories", async (req, res) => {
  const stories = await Story.find().sort({ createdAt: -1 });
  const formatted = stories.map(s => ({
    id: s._id,
    name: s.name,
    story: s.text,
    flagged: s.flagged,
    createdAt: s.createdAt
  }));
  res.json(formatted);
});

app.post("/api/stories", async (req, res) => {
  const { name, story } = req.body;
  if (!name || !story) return res.status(400).json({ message: "Name and story are required" });

  const newStory = await Story.create({ name, text: story });
  await addLog(`Shared a story: ${name}`);

  res.status(201).json({
    id: newStory._id,
    name: newStory.name,
    story: newStory.text,
    flagged: newStory.flagged,
    createdAt: newStory.createdAt
  });
});

// --------------------
// Public Logs
// --------------------
app.post("/api/logs", async (req, res) => {
  const { action } = req.body;
  if (!action) return res.status(400).json({ message: "Action is required" });

  const log = await addLog(action, "public");
  res.status(201).json(log);
});

// --------------------
// Admin Routes
// --------------------
app.get("/api/admin/stories", verifyToken, async (req, res) => {
  const stories = await Story.find().sort({ createdAt: -1 });
  const formatted = stories.map(s => ({
    id: s._id,
    name: s.name,
    story: s.text,
    flagged: s.flagged,
    createdAt: s.createdAt
  }));
  res.json(formatted);
});

app.delete("/api/admin/stories/:id", verifyToken, async (req, res) => {
  const story = await Story.findByIdAndDelete(req.params.id);
  if (!story) return res.status(404).json({ message: "Story not found" });

  await addLog(`Deleted story ${req.params.id}`, "admin");
  res.json({ message: "Story deleted" });
});

app.patch("/api/admin/stories/:id/flag", verifyToken, async (req, res) => {
  const story = await Story.findById(req.params.id);
  if (!story) return res.status(404).json({ message: "Story not found" });

  story.flagged = typeof req.body.flagged === "boolean" ? req.body.flagged : !story.flagged;
  await story.save();

  await addLog(`Flag status changed for ${req.params.id} -> ${story.flagged}`, "admin");

  res.json({
    id: story._id,
    name: story.name,
    story: story.text,
    flagged: story.flagged,
    createdAt: story.createdAt
  });
});

app.get("/api/admin/logs", verifyToken, async (req, res) => {
  const logs = await Log.find().sort({ createdAt: -1 });
  res.json(logs);
});

app.post("/api/admin/logs", verifyToken, async (req, res) => {
  const { action } = req.body;
  if (!action) return res.status(400).json({ message: "Action is required" });

  const log = await addLog(action, "admin");
  res.status(201).json(log);
});

app.get("/api/admin/stats", verifyToken, async (req, res) => {
  const totalStories = await Story.countDocuments();
  const flaggedStories = await Story.countDocuments({ flagged: true });
  const logCount = await Log.countDocuments();
  const recentStoriesRaw = await Story.find().sort({ createdAt: -1 }).limit(5);
  const recentStories = recentStoriesRaw.map(s => ({
    id: s._id,
    name: s.name,
    story: s.text,
    flagged: s.flagged,
    createdAt: s.createdAt
  }));

  res.json({ totalStories, flaggedStories, logCount, recentStories });
});

// --------------------
// Serve admin panel static files
// --------------------
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

app.use("/admin", express.static(path.join(__dirname, "admin-panel")));

// --------------------
// Root
// --------------------
app.get("/", (req, res) => {
  res.json({ message: "Body Shaming Awareness backend is running" });
});

// --------------------
// Connect MongoDB & Start Server
// --------------------
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("MongoDB connected");
    app.listen(PORT, () => {
      console.log(`Server running at http://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error("MongoDB connection error:", err.message);
  });
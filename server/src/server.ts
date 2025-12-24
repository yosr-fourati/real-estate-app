import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { prisma } from "./utils/prisma";
import propertyRoutes from "./routes/property.routes";

const app = express();

app.use(helmet());

const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";
app.use(
  cors({
    origin: CLIENT_ORIGIN,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

app.use(
  "/api",
  rateLimit({
    windowMs: 60 * 1000,
    max: 100,
    standardHeaders: "draft-7",
    legacyHeaders: false,
  })
);

// Friendly root message
app.get("/", (_req, res) => {
  res.type("text/plain").send("Indeed Immobilier API is running. Try /api/health");
});

// Health
app.get("/api/health", async (_req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({ ok: true, ts: new Date().toISOString() });
  } catch {
    res.status(500).json({ ok: false });
  }
});

// Routes
app.use("/api/properties", propertyRoutes);

const port = Number(process.env.PORT) || 8080;
const server = app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

const shutdown = async () => {
  console.log("Shutting down...");
  await prisma.$disconnect().catch(() => {});
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

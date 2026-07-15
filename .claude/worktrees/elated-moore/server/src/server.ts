import "dotenv/config";
import express from "express";
import cors from "cors";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import rateLimit from "express-rate-limit";
import { prisma } from "./utils/prisma";
import propertyRoutes from "./routes/property.routes";
import { adminRouter } from "./controllers/admin.controller";

const app = express();

/** If you’re behind a proxy/ingress, this makes secure cookies + IPs behave */
app.set("trust proxy", 1);

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

/** Global API rate limit (applies to /api and all subpaths) */
const apiLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 100,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api", apiLimiter);

/** Tighter limiter just for admin auth endpoints */
const adminLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: 20,
  standardHeaders: "draft-7",
  legacyHeaders: false,
});
app.use("/api/admin", adminLimiter, adminRouter);

// Friendly root
app.get("/", (_req, res) => {
  res
    .type("text/plain")
    .send("Indeed Immobilier API is running. Try /api/health");
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

/** 404 for unknown API routes */
app.use("/api", (_req, res) => {
  res.status(404).json({ message: "Not found" });
});

/** Minimal error handler (keeps responses JSON) */
app.use(
  (
    err: any,
    _req: express.Request,
    res: express.Response,
    _next: express.NextFunction
  ) => {
    console.error(err);
    res
      .status(err?.status || 500)
      .json({ message: err?.message || "Internal server error" });
  }
);

const port = Number(process.env.PORT) || 8080;
const server = app.listen(port, () => {
  console.log(`✅ Server running on http://localhost:${port}`);
});

const shutdown = async () => {
  console.log("Shutting down...");
  try {
    await prisma.$disconnect();
  } catch {}
  server.close(() => process.exit(0));
};
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);

import { Router } from "express";
import cookie from "cookie";

const router = Router();

// Read from env with safe defaults (so it always works)
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "admin@indeed-immo.tn").trim();
const ADMIN_PASSWORD = (process.env.ADMIN_PASSWORD || "changeme-strong").trim();

// --- DEBUG: let us confirm what the server actually sees (password masked) ---
router.get("/debug", (_req, res) => {
  res.json({
    email: ADMIN_EMAIL,
    passwordLen: ADMIN_PASSWORD.length, // do NOT expose password
    envLoaded: true,
  });
});

// POST /api/admin/login
router.post("/login", (req, res) => {
  const { email, password } = req.body || {};
  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    email.trim().toLowerCase() !== ADMIN_EMAIL.toLowerCase() ||
    password.trim() !== ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: "Bad credentials" });
  }

  // Simple session cookie (not JWT yet)
  const token = "admin-ok";
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("admin_session", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false, // set true in prod over https
      path: "/",
      maxAge: 60 * 60 * 2, // 2h
    })
  );

  res.json({ ok: true });
});

// GET /api/admin/me
router.get("/me", (req, res) => {
  const cookies = cookie.parse(req.headers.cookie || "");
  if (cookies.admin_session !== "admin-ok") {
    return res.status(401).json({ message: "Unauthorized" });
  }
  res.json({ ok: true, email: ADMIN_EMAIL });
});

// POST /api/admin/logout
router.post("/logout", (req, res) => {
  res.setHeader(
    "Set-Cookie",
    cookie.serialize("admin_session", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 0,
    })
  );
  res.json({ ok: true });
});

export const adminRouter = router;

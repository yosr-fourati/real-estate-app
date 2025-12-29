// server/src/middleware/adminAuth.ts
import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const token = req.cookies?.admin_token as string | undefined;
  if (!token) return res.status(401).json({ message: "Unauthorized" });

  try {
    const secret = process.env.JWT_SECRET || "dev-secret";
    const payload = jwt.verify(token, secret) as any;

    if (payload?.role !== "admin") {
      return res.status(403).json({ message: "Forbidden" });
    }

    (req as any).admin = payload; // attach for later
    next();
  } catch {
    return res.status(401).json({ message: "Unauthorized" });
  }
}


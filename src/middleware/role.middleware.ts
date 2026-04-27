import { Request, Response, NextFunction } from "express";

export const requireAdmin = (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    return res.status(401).json({ error: "Akses ditolak. Silakan login." });
  }

  const role = req.user.role;
  if (role !== "RT") {
    return res.status(403).json({ error: "Akses ditolak. Fitur ini hanya untuk Admin/RT." });
  }

  next();
};

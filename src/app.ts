import express, { Application, Request, Response, NextFunction } from "express";
import cors from "cors";
import dotenv from "dotenv";
import prisma from "./config/prisma";

import authRouter from "./routers/auth.router";
import barangRouter from "./routers/barang.router";
import peminjamanRouter from "./routers/peminjaman.router";
import kerusakanRouter from "./routers/kerusakan.router";
import dashboardRouter from "./routers/dashboard.router";
import wargaRouter from "./routers/warga.router";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

dotenv.config();

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.configure();
    this.middlewares();
    this.route();
    this.errorHandler();
  }

  private configure(): void {
    this.app.use(cors());
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private middlewares(): void {
    // Keamanan
    this.app.use(helmet());
    
    // Rate limiter (Maksimal 100 request per 15 menit per IP)
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000,
      max: 100,
      message: "Terlalu banyak request dari IP ini, silakan coba lagi nanti."
    });
    this.app.use(limiter);
  }

  private route(): void {
    // Basic health check and database test
    this.app.get("/", (req: Request, res: Response) => {
      res.status(200).json({ status: "ok", message: "API is running" });
    });

    this.app.get("/health", async (req: Request, res: Response) => {
      try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({ 
          status: "ok", 
          database: "connected" 
        });
      } catch (error) {
        res.status(500).json({ 
          status: "error", 
          database: "disconnected",
          message: error instanceof Error ? error.message : "Unknown error"
        });
      }
    });

    // Register routes
    this.app.use("/api/auth", authRouter);
    this.app.use("/api/barang", barangRouter);
    this.app.use("/api/peminjaman", peminjamanRouter);
    this.app.use("/api/kerusakan", kerusakanRouter);
    this.app.use("/api/dashboard", dashboardRouter);
    this.app.use("/api/warga", wargaRouter);

    // 404 Catch-all
    this.app.use((req: Request, res: Response) => {
      res.status(404).json({ error: "Endpoint not found" });
    });
  }

  private errorHandler(): void {
    this.app.use((error: any, req: Request, res: Response, next: NextFunction) => {
      const statusCode = error.status || 500;
      res.status(statusCode).json({
        error: error.message || "Internal Server Error",
      });
    });
  }

  public start(): void {
    const PORT = process.env.PORT || 5000;
    this.app.listen(PORT, () => {
      console.log(`[server]: Server is running at http://localhost:${PORT}`);
    });
  }
}

export default App;

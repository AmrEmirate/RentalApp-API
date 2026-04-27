import { Router } from "express";
import { getDashboardStats } from "../controllers/dashboard.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const dashboardRouter = Router();

dashboardRouter.get("/stats", authenticate, getDashboardStats);

export default dashboardRouter;

import { Router } from "express";
import { getKerusakan, updateKerusakan } from "../controllers/kerusakan.controller";
import { authenticate } from "../middleware/auth.middleware";
import { requireAdmin } from "../middleware/role.middleware";

const kerusakanRouter = Router();

kerusakanRouter.use(authenticate); // require login

kerusakanRouter.get("/", getKerusakan);
kerusakanRouter.put("/:id", requireAdmin, updateKerusakan); // Only admin updates invoice

export default kerusakanRouter;

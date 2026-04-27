import { Router } from "express";
import { login, changePassword } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth.middleware";

const authRouter = Router();

authRouter.post("/login", login);
authRouter.put("/password", authenticate, changePassword);

export default authRouter;

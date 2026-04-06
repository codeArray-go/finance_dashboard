import express from "express";
import {
  createOrgUser,
  login,
  signUp,
  toggleUserStatus,
  updateUserRole,
} from "../controllers/auth.controller.js";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { roleGuard } from "../middlewares/roleGuard.middleware.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();

router.use(arcjetProtection)

router.post("/login", login);
router.post("/signUp", signUp);

router.use(protectedRoute);
router.post("/create", roleGuard("admin"), createOrgUser);
router.patch("/:id/role", roleGuard("admin"), updateUserRole);
router.patch("/:id/status", roleGuard("admin"), toggleUserStatus);

export default router;

import express from "express";
import { protectedRoute } from "../middlewares/auth.middleware.js";
import { roleGuard } from "../middlewares/roleGuard.middleware.js";
import {
  financeCreateController,
  financeDeleteController,
  financeUpdateController,
  getTrendsController,
  getDashboardData,
  getFilteredRecords,
  getRecentActivity,
  getSummery,
} from "../controllers/data.controller.js";
import { arcjetProtection } from "../middlewares/arcjet.middleware.js";

const router = express.Router();

router.use(protectedRoute, arcjetProtection);

router.get(
  "/dashboard",
  roleGuard("admin", "viewer", "analyst"),
  getDashboardData,
);
router.get("/summery", roleGuard("admin", "analyst"), getSummery);
router.get("/recent", roleGuard("admin", "analyst"), getRecentActivity);
router.post("/finance/update", roleGuard("admin"), financeUpdateController);
router.post("/finance/create", roleGuard("admin"), financeCreateController);
router.get(
  "/finance/trends",
  roleGuard("admin", "analyst"),
  getTrendsController,
);
router.delete("/finance/:id", roleGuard("admin"), financeDeleteController);
router.get(
  "/finance/records",
  roleGuard("admin", "analyst"),
  getFilteredRecords,
);


export default router;

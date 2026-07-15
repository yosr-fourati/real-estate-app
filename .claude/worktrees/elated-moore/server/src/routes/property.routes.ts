import { Router } from "express";
import {
  listPropertiesController,
  getPropertyController,
  createPropertyController,
} from "../controllers/property.controller";

const router = Router();

// /api/properties
router.get("/", listPropertiesController);
router.get("/:id", getPropertyController);
router.post("/", createPropertyController);

export default router;



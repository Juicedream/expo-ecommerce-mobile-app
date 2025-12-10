import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import adminController from "../controllers/admin.controller.js";
import productController from "../controllers/product.controller.js";
const router = Router();

router.use(authMiddleware.protectRoute)
//routes
router
    .get("/", adminController.getAllProducts)
    .get("/:id", productController.getProductById)

export default router;
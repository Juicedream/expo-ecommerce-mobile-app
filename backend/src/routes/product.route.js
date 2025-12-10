import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware.js";
import AdminController from "../controllers/admin.controller.js";
import ProductController from "../controllers/product.controller.js";
const router = Router();

router.use(AuthMiddleware.protectRoute)
//routes
router
    .get("/", AdminController.getAllProducts)
    .get("/:id", ProductController.getProductById)

export default router;
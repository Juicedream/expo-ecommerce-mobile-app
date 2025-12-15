import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

//middleware optimization - DRY
const middlewares = [AuthMiddleware.protectRoute, AuthMiddleware.adminOnly]

router
  // products
  .post("/products", ...middlewares, upload.array("images", 3), AdminController.createProduct)
  .put("/products/:id", ...middlewares, AdminController.updateProduct)
  .get("/products", ...middlewares, upload.array("images", 3), AdminController.getAllProducts)
  //orders
  .get("/orders", ...middlewares, AdminController.getAllOrders)
  .patch("/orders/:orderId/status", ...middlewares, AdminController.updateOrderStatus)
  // customers
  .get("/customers", ...middlewares, AdminController.getAllCustomers)
  .get("/stats", ...middlewares, AdminController.getDashboardStats)

export default router;

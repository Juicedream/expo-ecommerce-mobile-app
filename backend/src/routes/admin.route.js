import { Router } from "express";
import AdminController from "../controllers/admin.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

//middleware optimization - DRY
router.use(AuthMiddleware.protectRoute, AuthMiddleware.adminOnly);

router
  // products
  .post("/products", upload.array("images", 3), AdminController.createProduct)
  .put("/products/:id", AdminController.updateProduct)
  .get("/products", upload.array("images", 3), AdminController.getAllProducts)
  //orders
  .get("/orders", AdminController.getAllOrders)
  .patch("/orders/:orderId/status", AdminController.updateOrderStatus)
  // customers
  .get("/customers", AdminController.getAllCustomers)
  .get("/stats", AdminController.getDashboardStats)

export default router;

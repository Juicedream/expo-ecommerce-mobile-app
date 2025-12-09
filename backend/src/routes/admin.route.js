import { Router } from "express";
import adminController from "../controllers/admin.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
import { upload } from "../middleware/multer.middleware.js";
const router = Router();

//middleware optimization - DRY
router.use(authMiddleware.protectRoute, authMiddleware.adminOnly);

router
  // products
  .post("/products", upload.array("images", 3), adminController.createProduct)
  .put("/products/:id", adminController.updateProduct)
  .get("/products", upload.array("images", 3), adminController.getAllProducts)
  //orders
  .get("/orders", adminController.getAllOrders)
  .patch("/orders/:orderId/status", adminController.updateOrderStatus)
  // customers
  .get("/customers", adminController.getAllCustomers)
  .get("/stats", adminController.getDashboardStats)

export default router;

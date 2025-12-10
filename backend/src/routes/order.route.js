import { Router } from "express";
import orderController from "../controllers/order.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = Router();

//router middleware
router.use(authMiddleware.protectRoute);
// order routes
router 
    .post("/",  orderController.createOrder)
    .get("/", orderController.getUserOrders)


export default router;
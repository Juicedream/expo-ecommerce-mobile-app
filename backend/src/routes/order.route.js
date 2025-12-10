import { Router } from "express";
import OrderController from "../controllers/order.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
const router = Router();

//router middleware
router.use(AuthMiddleware.protectRoute);
// order routes
router 
    .post("/",  OrderController.createOrder)
    .get("/", OrderController.getUserOrders)


export default router;
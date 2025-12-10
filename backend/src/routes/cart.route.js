import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware.js";
import cartController from "../controllers/cart.controller.js";
const router = Router();

//middleware
router.use(AuthMiddleware.protectRoute)
//routes
router
    .get("/", cartController.getCart)
    .post("/", cartController.addToCart)
    .put("/:productId", cartController.updateCart)
    .delete("/:productId", cartController.removeFromCart)
    .delete("/", cartController.clearCart);


export default router;
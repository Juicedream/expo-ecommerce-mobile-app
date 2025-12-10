import { Router } from "express";
import UserController from "../controllers/user.controller.js";
import AuthMiddleware from "../middleware/auth.middleware.js";
const router = Router();

//middleware
router.use(AuthMiddleware.protectRoute)
// routers
router
    // address routes
  .post("/addresses", UserController.addAddress)
  .get("/addresses", UserController.getAddress)
  .put("/addresses/:addressId", UserController.updateAddress)
  .delete("/addresses/:addressId", UserController.deleteAddress)
    // wishlist
  .post("/wishlist", UserController.addToWishlist)
  .delete("/wishlist/:productId", UserController.removeFromWishlist)
  .get("/wishlist", UserController.getWishlist)

export default router;

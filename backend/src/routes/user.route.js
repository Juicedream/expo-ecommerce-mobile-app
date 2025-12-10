import { Router } from "express";
import userController from "../controllers/user.controller.js";
import authMiddleware from "../middleware/auth.middleware.js";
const router = Router();

//middleware
router.use(authMiddleware.protectRoute)
// routers
router
    // address routes
  .post("/addresses", userController.addAddress)
  .get("/addresses", userController.getAddress)
  .put("/addresses/:addressId", userController.updateAddress)
  .delete("/addresses/:addressId", userController.deleteAddress)
    // wishlist
  .post("/wishlist", userController.addToWishlist)
  .delete("/wishlist/:productId", userController.removeFromWishlist)
  .get("/wishlist", userController.getWishlist)

export default router;

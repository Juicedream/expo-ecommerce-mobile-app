import { Router } from "express";
import AuthMiddleware from "../middleware/auth.middleware.js";
import ReviewController from "../controllers/review.controller.js";
const router = Router();

// middleware
router.use(AuthMiddleware.protectRoute);
// routes
router
    .post("/", ReviewController.createReview)
    // 
    .delete("/:reviewId", ReviewController.deleteReview)


export default router;
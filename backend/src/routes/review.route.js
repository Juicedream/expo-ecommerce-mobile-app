import { Router } from "express";
import authMiddleware from "../middleware/auth.middleware.js";
import reviewController from "../controllers/review.controller.js";
const router = Router();

// middleware
router.use(authMiddleware.protectRoute);
// routes
router
    .post("/", reviewController.createReview)
    // 
    .delete("/:reviewId", reviewController.deleteReview)


export default router;
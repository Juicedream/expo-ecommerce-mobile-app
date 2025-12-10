import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

class reviewController {
  createReview = async (req, res) => {
    try {
      const { productId, orderId, rating } = req.body;
      if (!productId || !orderId)
        return res
          .status(400)
          .json({ error: "Product ID and Order ID are required" });
      if (!rating || rating < 1 || rating > 5)
        return res
          .status(400)
          .json({ error: "Rating must be between 1 and 5" });
      const user = req.user;
      // verify if order exists and it is delivered
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ error: "Order not found" });
      if (order.clerkId !== user.clerkId)
        return res
          .status(403)
          .json({ error: "Not authorized to review this order" });
      if (order.status !== "delivered")
        return res
          .status(400)
          .json({ error: "Can only review delivered orders" });
      // verify if the product is in the order
      const productInOrder = order.orderItems.find(
        (item) => item.product.toString() === productId.toString()
      );
      if (!productInOrder)
        return res
          .status(400)
          .json({ error: "Product not found in this order" });
      //check if review already exists
      const existingReview = await Review.findOne({
        productId,
        userId: user._id,
      });
      if (existingReview)
        return res
          .status(400)
          .json({ error: "You have already reviewed this product" });
      const review = await Review.create({
        productId,
        userId: user._id,
        orderId,
        rating,
      });
      // update the product rating
      const product = await Product.findById(productId);
      const currentTotal = product.averageRating * product.totalReviews;
      product.totalReviews += 1;
      product.averageRating = (currentTotal + rating) / product.totalReviews;
      await product.save();

      res
        .status(201)
        .json({ message: "Review submitted successfully", review });
    } catch (error) {
      console.error("Error occurred in the create review controller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  deleteReview = async (req, res) => {
    try {
      const { reviewId } = req.params;
      const user = req.user;
      const review = await Review.findById(reviewId);
      if (!review) return res.status(404).json({ error: "Review not found" });
      if (review.userId.toString() !== user._id.toString())
        return res
          .status(403)
          .json({ error: "Not authorized to delete this review" });
      const productId = review.productId;

      await Review.findByIdAndDelete(reviewId);

      // update product rating and review
      const reviews = await Review.find({ productId });
      const totalRating = reviews.reduce((sum, rev) => sum + rev.rating, 0);
      await Product.findByIdAndUpdate(productId, {
        averageRating: reviews.length > 0 ? totalRating / reviews.length : 0,
        totalReviews: reviews.length,
      });
      res.status(200).json({ message: "Review deleted successfully" });
    } catch (error) {
      console.error("Error occurred in the delete review controller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default new reviewController();

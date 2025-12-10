import { Order } from "../models/order.model.js";
import { Product } from "../models/product.model.js";
import { Review } from "../models/review.model.js";

// order controller
class orderController {
    createOrder = async (req, res) => {
        try {
            const user = req.user;
            const { orderItems, shippingAddress, paymentResult, totalPrice } = req.body;
            if (!orderItems || orderItems.length === 0) return res.status(400).json({ error: "No order Items" });
            // validate products and stock
            for (const item of orderItems) {
                const product = await Product.findById(item.product._id);
                if (!product) return res.status(404).json({  error: `Product ${item.name} not found` });
                if(product.stock < item.quantity) return res.status(400).json({ error: `Insufficient stock for ${product.name}` })
            } 
            const order = await Order.create({
                user: user._id,
                clerkId: user.clerkId,
                orderItems,
                shippingAddress,
                paymentResult,
                totalPrice,
            });
            // update product stock by subtracting each product quantity
            for (const item of orderItems) {
                await Product.findByIdAndUpdate(item.product._id, {
                    $inc : { stock: -item.quantity },
                })
            }
            res.status(201).json(order)
        } catch (error) {
             console.error(
        "Error occurred in the create order controller:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
        }
    }
    getUserOrders = async (req, res) => {
        try {
            const orders = await Order.find({ clerkId: req.user.clerkId }).populate("orderItems.product").sort({ createdAt: -1 });
            // check if each order has been reviewed
            const ordersWithReviewStatus = await Promise.all(
                orders.map(async (order) => {
                    const review = await Review.findOne({ orderId: order._id });
                    return {
                        ...order.toObject(),
                        hasReviewed: !!review
                    }
                })
            )            
            res.status(200).json({ orders: ordersWithReviewStatus });
        } catch (error) {
             console.error(
        "Error occurred in the get user orders controller:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
        }
    }
}

export default new orderController;
import cloudinary from "../config/cloudinary.js";
import { Product } from "../models/product.model.js";
import { Order } from "../models/order.model.js";
import { User } from "../models/user.model.js";
//admin controller class
class AdminController {
  // create product
  createProduct = async (req, res) => {
    try {
      const { name, description, price, stock, category } = req.body;
      if (!name || !description || !price || !stock || !category) {
        return res.status(400).json({ message: "All fields are required" });
      }
      // check if images were uploaded or not, if images are more than three
      if (!req.files || req.files.length === 0) {
        return res
          .status(400)
          .json({ message: "At least one image is required" });
      }
      if (req.files.length > 3) {
        return res.status(400).json({ message: "Maximum images allowed is 3" });
      }
      // upload images to cloudinary
      const uploadPromises = req.files.map((file) => {
        return cloudinary.uploader.upload(file.path, {
          folder: "products",
        });
      });
      const uploadResults = await Promise.all(uploadPromises);
      const imageUrls = uploadResults.map((result) => result.secure_url);
      // create a product
      const product = await Product.create({
        name,
        description,
        images: imageUrls,
        category,
        price: parseFloat(price),
        stock: parseInt(stock),
      });
      res.status(201).json(product);
    } catch (error) {
      console.error("Error occurred in the create Product controller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  // get all products
  getAllProducts = async (_, res) => {
    try {
      const products = await Product.find().sort({ createdAt: -1 }); // most recent products created
      res.status(200).json(products);
    } catch (error) {
      console.error(
        "Error occurred in the getting all Product controller:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
    }
  };
  // update product
  updateProduct = async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description, price, stock, category } = req.body;
      //if product is in database
      const product = await Product.findById(id);
      if (!product)
        return res.status(404).json({ message: "Product not found" });
      if (name) product.name = name;
      if (description) product.description = description;
      if (category) product.category = category;
      if (stock !== undefined) product.stock = parseInt(stock);
      if (price !== undefined) product.price = parseFloat(price);

      // handle image updates if new images are uploaded
      if (req.files && req.files > 0) {
        if (req.files.length > 3) {
          return res
            .status(400)
            .json({ message: "Maximum images allowed is 3" });
        }
        // upload images to cloudinary
        const uploadPromises = req.files.map((file) => {
          return cloudinary.uploader.upload(file.path, {
            folder: "products",
          });
        });
        const uploadResults = await Promise.all(uploadPromises);
        const imageUrls = uploadResults.map((result) => result.secure_url);
        product.images = imageUrls;
      }
      // update the product
      await product.save();
      res.status(200).json(product);
    } catch (error) {
      console.error(
        "Error occurred in the updating product controller:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // create order

  // get all orders
  getAllOrders = async (_, res) => {
    try {
      const orders = await Order.find()
        .populate("user", "name email")
        .populate("orderItems.product")
        .sort({ createdAt: -1 });
      res.status(200).json(orders);
    } catch (error) {
      console.error("Error occurred in the get all orders controller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  // update order status
  updateOrderStatus = async (req, res) => {
    try {
      const { orderId } = req.params;
      const { status } = req.body;
      if (!["pending", "shipped", "delivered"].includes(status)) {
        return res.status(400).json({ error: "Invalid status" });
      }
      const order = await Order.findById(orderId);
      if (!order) return res.status(404).json({ error: "Order not found" });
      // updating status
      order.status = status;
      if (status === "shipped" && !order.shippedAt)
        order.shippedAt = new Date();
      if (status === "delivered" && !order.shippedAt)
        order.deliveredAt = new Date();
      await order.save();
      res.status(200).json(order);
    } catch (error) {
      console.error(
        "Error occurred in the update order status controller:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
    }
  };

  // get all customers
  getAllCustomers = async (_, res) => {
    try {
      const customers = await User.find().sort({ createdAt: -1 });
      res.status(200).json(customers);
    } catch (error) {
      console.error(
        "Error occurred in the get all customers controller:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
    }
  };
  // get dashboard stats
  getDashboardStats = async (_, res) => {
    try {
      const totalOrders = await Order.countDocuments();
      const revenueResult = await Order.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: "$totalPrice" },
          },
        },
      ]);
      const totalRevenue = revenueResult[0]?.total || 0;
      const totalCustomers = await User.countDocuments();
      const totalProducts = await Product.countDocuments();
      res.status(200).json({
        totalRevenue,
        totalOrders,
        totalCustomers,
        totalProducts,
      });
    } catch (error) {
      console.error(
        "Error occurred in the get dashboard stats controller:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
    }
  };
  deleteProduct = async (req, res) => {
    try {
    const { id } = req.params;

    const product = await Product.findById(id);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    // Delete images from Cloudinary
    if (product.images && product.images.length > 0) {
      const deletePromises = product.images.map((imageUrl) => {
        // Extract public_id from URL (assumes format: .../products/publicId.ext)
        const publicId = "products/" + imageUrl.split("/products/")[1]?.split(".")[0];
        if (publicId) return cloudinary.uploader.destroy(publicId);
      });
      await Promise.all(deletePromises.filter(Boolean));
    }

    await Product.findByIdAndDelete(id);
    res.status(200).json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res.status(500).json({ message: "Failed to delete product" });
  }

  }
}

export default new AdminController();

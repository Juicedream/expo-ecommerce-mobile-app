import { Cart } from "../models/cart.model.js";
import { Product } from "../models/product.model.js";

class cartController {
  getCart = async (req, res) => {
    try {
      const user = req.user;
      let cart = await Cart.findOne({ clerkId: user.clerkId }).populate(
        "items.product"
      );
      if (!cart) {
        cart = await Cart.create({
          user: user._id,
          clerk: user.clerkId,
          items: [],
        });
      }
      res.status(200).json({ cart });
    } catch (error) {
      console.error("Error occurred in the get cart controller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  addToCart = async (req, res) => {
    try {
      const { productId, quantity = 1 } = req.body;
      const user = req.user;
      // validate if product exists and has stock
      if (!productId)
        return res.status(404).json({ error: "Product not found" });
    if (product.stock < quantity)
        return res.status(400).json({ error: "Insufficient stock" });
      const product = await Product.findById(productId);
      let cart = await Cart.findOne({ clerkId: req.user.clerkId });
      if (!cart) {
        cart = await Cart.create({
          user: user._id,
          clerk: user.clerkId,
          items: [],
        });
        // check if iten already in the cart
        const existingItem = cart.items.find((item) => item.product.toString() === productId);
        if (existingItem) {
            // increment quantity by 1
            const newQuantity = existingItem.quantity + 1;
            if (product.stock < newQuantity) return res.status(400).json({ error: "Insufficient stock" });
            existingItem.quantity = newQuantity 
        } else {
            // add new item
            cart.items.push({ product: productId, quantity });
        }
        await cart.save();
        res.status(200).json({ message: "Item added to cart", cart });
      }
    } catch (error) {
      console.error("Error occurred in the add to cart controller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  updateCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const { quantity } = req.body;
        if (quantity < 1) return res.status(400).json({ error: "Quantity must be at least 1" });
        const cart = await Cart.findOne({ clerkId: req.user.clerkId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        // find the item to be updated
        const itemIndex = cart.items.findIndex((item) => item.product.toString() === productId);
        if (itemIndex === -1) return res.status(404).json({ error: "Item not found in cart" });
        // check if product exists &  validate stock
        const product = await Product.findById(productId);
        if (!product)
        return res.status(404).json({ error: "Product not found" });
      if (product.stock < quantity)
        return res.status(400).json({ error: "Insufficient stock" });
      cart.items[itemIndex].quantity = quantity;
      await cart.save();
      res.status(200).json({ message: "Cart updated successfully", cart })

    } catch (error) {
      console.error("Error occurred in the update cart controller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
  removeFromCart = async (req, res) => {
    try {
        const { productId } = req.params;
        const cart = await Cart.findOne({ clerkId: req.user.clerkId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        await cart.save();
        res.status(200).json({ message: "Item removed from cart", cart });
    } catch (error) {
      console.error(
        "Error occurred in the remove from cart controller:",
        error
      );
      res.status(500).json({ message: "Internal server error" });
    }
  };
  clearCart = async (req, res) => {
    try {
        const cart = await Cart.findOne({ clerkId: req.user.clerkId });
        if (!cart) return res.status(404).json({ error: "Cart not found" });
        cart.items = [];
        await cart.save();
        res.status(200).json({ message: "Cart cleared", cart });
    } catch (error) {
      console.error("Error occurred in the clear cart controller:", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default new cartController();

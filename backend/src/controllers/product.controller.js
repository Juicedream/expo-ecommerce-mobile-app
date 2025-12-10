import { Product } from "../models/product.model.js";

class productController {
    getProductById = async (req, res) => {
        try {
            const { id } = req.params;
            const product = await Product.findById(id);
            if(!product) return res.status(404).json({ error: "Product not found" });
            res.status(200).json(product);
        } catch (error) {
            console.error(
        "Error occurred in the get product by id controller:",
        error
      );
      res.status(500).json({ message: "Internal server error" }); 
        }
    }
}

export default new productController
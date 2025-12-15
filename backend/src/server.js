import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import cors from "cors";

// custom modules
import { functions, inngest } from "./config/inngest.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";

const app = express();
const __dirname = path.resolve();
// body parser
app.use(express.json());
// Clerk Middleware
app.use(clerkMiddleware()); // will add auth to the request (req.auth)
// cors
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true })); 
// inngest server handler for the background jobs
app.use("/api/inngest", serve({ client: inngest, functions }));
// routes
app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
// check if server is running
app.get("/api/health", (_, res) => {
  res.status(200).json({ message: "Success" });
});

//For deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));
// Only catch non-API routes
  app.get("*", (req, res) => {
    // Don't catch API routes
    if (req.path.startsWith('/api')) {
      return res.status(404).json({ message: "API endpoint not found" });
    }
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });

}

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log("Server is up and running on " + ENV.PORT);
  });
};

startServer();

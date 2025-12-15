import { requireAuth } from "@clerk/express";
// custom modules
import { User } from "../models/user.model.js";
import { ENV } from "../config/env.js";

class AuthMiddleware {
  protectRoute = [
    // requireAuth({
    //     onError: (error) => {
    //         console.error("Clerk requireAuth error:", error)
    //     }
    // }),
    async (req, res, next) => {
      try {
        const clerkId = req.auth().userId;
        if (!clerkId)
          return res
            .status(401)
            .json({ message: "Unauthorized - Invalid token" });
        const user = await User.findOne({ clerkId });
        if (!user) return res.status(404).json({ message: "User not found" });
        req.user = user;
        next();
      } catch (error) {
        console.error("Error in protect router middleware: ", error);
        res.status(500).json({ message: "Internal server error" });
      }
    },
  ];

  adminOnly = async (req, res, next) => {
    try {
      if (!req.user)
        return res
          .status(401)
          .json({ message: "Unauthorized - user not found" });
      if (req.user.email !== ENV.ADMIN_EMAIL)
        return res
          .status(403)
          .json({ message: "Forbidden - admin access only" });
      next();
    } catch (error) {
      console.error("Error in adminOnly middleware: ", error);
      res.status(500).json({ message: "Internal server error" });
    }
  };
}

export default new AuthMiddleware();

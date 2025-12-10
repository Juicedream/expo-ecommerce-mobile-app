import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

// custom modules
import { functions, inngest } from "./config/inngest.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";
import adminRoutes  from "./routes/admin.route.js"
import userRoutes from "./routes/user.route.js"

const app = express();

const __dirname = path.resolve()


// body parser
app.use(express.json())
// Clerk Middleware
app.use(clerkMiddleware()); // will add auth to the request (req.auth)
// inngest server handler for the background jobs
app.use("/api/inngest", serve({ client: inngest, functions }));
// routes
app.use("/api/admin", adminRoutes)
app.use("/api/users", userRoutes)


// check if server is running
app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success" });
});


//For deployment
if (ENV.NODE_ENV === "production") {
    app.use(express.static(path.join(__dirname, "../admin/dist")));
    app.get("/{*any}", (req, res) => {
        res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
    })
}


const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log("Server is up and running on " + ENV.PORT)
    });
}

startServer();

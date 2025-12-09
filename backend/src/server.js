import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";

import { functions, inngest } from "./config/inngest.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

const __dirname = path.resolve()

app.get("/api/health", (req, res) => {
    res.status(200).json({ message: "Success" });
});

// body parser
app.use(express.json())
// Clerk Middleware
app.use(clerkMiddleware());
// inngest server handler for the background jobs
app.use("/api/inngest", serve({ client: inngest, functions }));



const startServer = async () => {
    await connectDB();
    app.listen(ENV.PORT, () => {
        console.log("Server is up and running on " + ENV.PORT)
    });
}

startServer();

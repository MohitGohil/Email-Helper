import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./src/middleware/index.js";
import { authRoute, defaultRoute } from "./src/routes/index.js";
import { ConnectDB } from "./config/index.js";

dotenv.config();
const app = express();
const server = createServer(app);
// setting environment variable port
const PORT = process.env.PORT || 8000;
// Check production environment
const isProdEnvironment = process.env.NODE_ENV == "production";

// Logger middleware - server request's logs
if (!isProdEnvironment) {
  app.use(morgan("dev"));
}

ConnectDB();

// built-in middleware to handle urlencoded data for form-data : 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));
// built-in middleware for json
app.use(express.json());
// Parse cookies
app.use(cookieParser());
// setting various HTTP headers (Better Security)
app.use(helmet());

// Routes
app.get("/", (req, res) => res.json({ message: "Hi, Welcome to the mailer service." }));
app.use("/api/v1/auth", authRoute);
app.use("/api/v1/email", defaultRoute);

// Error handler
app.use(errorHandler);
// Not Found Round
app.use("*", (req, res) => res.status(404).json({ message: "Not Found!" }));

// server listing port
const message = `
🔐 Server is running in ${process.env.NODE_ENV} mode.
🆔 Process ID: ${process.pid}
🌐 Server is now listening on port ${PORT} ⚡🚀`;

server.listen(PORT, () => {
  console.log(message);
});

// Graceful shutdown
const gracefulShutdown = () => {
  console.log("\x1b[1m\x1b[31m", "\n⚡ 🤖 SIGINT Received. Closing server...😴");
  // Close the server
  server.close(() => {
    // Close the Mongoose connection to the database
    mongoose.connection.close(false, () => {
      console.log("\x1b[1m\x1b[31m", "⚡ 🤖 SIGINT - Mongoose disconnected from DB...😴");
    });
    // Log server closure
    console.log("\x1b[1m\x1b[31m", "⚡ 🤖 Server is closed...");
    // Gracefully shutdown the process
    process.exit(0);
  });
  // Handle errors during server closure
  server.on("error", (error) => {
    console.log("\x1b[1m\x1b[31m", `⚡ 🤖 Error in closing server: ${error}😴`);
    process.exit(1); // Forcefully shutdown
  });
};
// Handle SIGINT (Ctrl+C) and SIGTERM (Process Manager) signals
process.on("SIGINT", gracefulShutdown);
process.on("SIGTERM", gracefulShutdown);

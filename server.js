import express from "express";
import { createServer } from "http";
import helmet from "helmet";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import { errorHandler } from "./src/middleware/index.js";
import { authRoute, defaultRoute } from "./src/routes/index.js";
import { ConnectDB } from "./config/index.js";
import gracefulShutdown from "./handler/shutdownHandler.js";
import configureErrorHandling from "./handler/errorHandling.js";

const app = express();
const server = createServer(app);
// setting environment variable port
const PORT = process.env.PORT || 8000;
// Check production environment
const isProdEnvironment = process.env.NODE_ENV == "production";
// Graceful shutdown
const shutdownHandler = gracefulShutdown(server);

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

// Handle SIGINT (Ctrl+C) and SIGTERM (Process Manager) signals
process.on("SIGINT", shutdownHandler);
process.on("SIGTERM", shutdownHandler);

// Set up global error handling for unhandled rejections and exceptions
configureErrorHandling({ unhandledRejection: false, uncaughtException: false });

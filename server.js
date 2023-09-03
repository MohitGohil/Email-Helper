require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./src/middleware");
const mainRoute = require("./src/routes/mainRoute");
const { ConnectDB } = require("./config");

const app = express();
const server = createServer(app);
// setting environment variable port
const PORT = process.env.PORT || 8000;

// Logger middleware - server request's logs
if (process.env.NODE_ENV !== "Production") {
  app.use(morgan("dev"));
}

ConnectDB();

// built-in middleware to handle urlencoded data for form-data : 'content-type: application/x-www-form-urlencoded'
app.use(express.urlencoded({ extended: false }));

// built-in middleware for json
app.use(express.json());

// setting various HTTP headers (Better Security)
app.use(helmet());
// Routes
app.get("/", (req, res) => res.json({ message: "Hi, Welcome to the mailer service." }));
app.use("/email", mainRoute);

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

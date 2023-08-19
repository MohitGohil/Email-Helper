require("dotenv").config();
const express = require("express");
const { createServer } = require("http");
const helmet = require("helmet");
const morgan = require("morgan");
const { errorHandler } = require("./src/middleware");
const mainRoute = require("./src/routes/mainRoute");

const app = express();
const server = createServer(app);
// setting environment variable port
const PORT = process.env.PORT ?? 8000;

// Logger middleware - server request's logs
if (process.env.NODE_ENV == "Development") {
  app.use(morgan("dev"));
}

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
const message = `\n🆔 ${process.pid} - Listening on port ${PORT} ⚡🚀`;
server.listen(PORT, () => console.log(`${message}`));

//  sigint event handler for graceful shutdown of the server
process.on("SIGINT", () => {
  console.log("\x1b[1m\x1b[31m", "\n⚡ 🤖 SIGINT Received. Closing server...😴");
  server.close(() => {
    console.log("\x1b[1m\x1b[31m", "⚡ 🤖 Server is closed...");
    process.exit(0); // gracefully shutdown
  });
  server.on("error", (error) => {
    console.log("\x1b[1m\x1b[31m", `⚡ 🤖 Error in closing server: ${error}😴`);
    process.exit(1); // forcefully shutdown
  });
});

//  SIGTERM event handler for graceful shutdown of the server
process.on("SIGTERM", () => {
  console.log("\x1b[1m\x1b[31m", "\n⚡ 🤖 SIGTERM Received. Closing server...😴");
  server.close(() => {
    console.log("\x1b[1m\x1b[31m", "⚡ 🤖 Server is closed...");
    process.exit(0); // gracefully shutdown
  });
  server.on("error", (error) => {
    console.log("\x1b[1m\x1b[31m", `⚡ 🤖 Error in closing server: ${error}😴`);
    process.exit(1); // forcefully shutdown
  });
});

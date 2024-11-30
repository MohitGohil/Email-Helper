import mongoose from "mongoose";

function gracefulShutdown(server) {
  return () => {
    console.log("\x1b[1m\x1b[31m", "\n⚡ 🤖 SIGINT or SIGTERM Received. Closing server...😴");

    // Close the server
    server.close(() => {
      // Close the Mongoose connection to the database
      mongoose.connection.close(false, () => {
        console.log(
          "\x1b[1m\x1b[31m",
          "⚡ 🤖 SIGINT or SIGTERM - Mongoose disconnected from DB...😴"
        );
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
}

export default gracefulShutdown;

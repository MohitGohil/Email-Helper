function configureErrorHandling(isActive) {
  if (isActive?.unhandledRejection === true) {
    process.on("unhandledRejection", (reason, promise) => {
      console.error({ "Unhandled Rejection": reason, promise });
      process.exit(0); // gracefully shutdown
    });
  }
  if (isActive?.uncaughtException === true) {
    process.on("uncaughtException", (err) => {
      console.error({ "Uncaught Exception Thrown": err });
      process.exit(1); // forcefully shutdown
    });
  }
}

export default configureErrorHandling;

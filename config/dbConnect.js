import mongoose from "mongoose";

// Generate MongoDB URI based on the environment
function getMongoDBUri(dbName) {
  if (!process.env.NODE_ENV || !dbName) {
    throw new Error("NODE_ENV or dbName should not be blank.");
  }
  if (process.env.NODE_ENV === "production") {
    // Live Atlas Cloud URI with retryWrites and write concern
    return `${process.env.MONGO_ATLAS_URI}/${dbName}?retryWrites=true&w=majority`;
  } else {
    // Default to a local MongoDB URI
    return `${process.env.MONGO_URI}/${dbName}`;
  }
}

// Connect to MongoDB
const connectDB = async () => {
  try {
    const dbName = "email_helper";
    const mongoUri = getMongoDBUri(dbName);

    // Optional: Set Mongoose configuration options
    mongoose.set("strictQuery", false);

    await mongoose.connect(mongoUri);
  } catch (err) {
    console.error(`🔴 Error connecting to MongoDB: ${err.message}`);
    process.exit(1); // Exit process with failure
  }
};

// Handle Mongoose connection events
mongoose.connection
  .on("open", () => {
    console.log(`Mongoose connection open ✅ DB - ${mongoose.connection.name}`);
  })
  .on("error", (error) => {
    console.error(`🔴 Error in Mongoose connection DB: ${error}`);
  })
  .on("disconnected", () => {
    console.log("🔴 Mongoose disconnected from DB");
  });

export default connectDB;

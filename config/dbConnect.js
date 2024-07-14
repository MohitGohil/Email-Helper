import mongoose from "mongoose";

function mongodbURI(DB_Name) {
  // Check if NODE_ENV or DB_Name is blank
  if (!process.env.NODE_ENV || !DB_Name) {
    throw new Error("NODE_ENV or DB_Name should not be blank.");
  }
  // Generate MongoDB URI based on the environment
  if (process.env.NODE_ENV === "production") {
    // Live Atlas Cloud URI with retryWrites and write concern
    return `${process.env.MONGO_ATLAS_URI}/${DB_Name}?retryWrites=true&w=majority`;
  } else {
    // Default to a local MongoDB URI
    return `${process.env.MONGO_URI}/${DB_Name}`;
  }
}

// connect to mongoDB
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false); // Default value is FALSE
    await mongoose.connect(mongodbURI("email_helper"), {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  } catch (err) {
    console.error(err.message);
    // process.exit(1);
  }
};

// mongoose connection error handler
mongoose.connection
  .once("open", () => {
    console.log(`Mongoose connected ✅ DB - ${mongoose.connection.name}`);
  })
  .on("error", (error) => {
    console.log(`🔴 Error in Mongoose connection DB: ${error}`);
  })
  .on("disconnected", () => {
    console.log("🔴 Mongoose disconnected from DB");
  });

export default connectDB;

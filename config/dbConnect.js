const mongoose = require("mongoose");

const DB_URI = {
  mongoAtlasUri: `${process.env.MONGO_ATLAS_URI}/email_helper?retryWrites=true&w=majority`, // Live Atlas Cloud URI
  dockerMongoUri: `${process.env.MONGO_URI}/email_helper`, // Docker container URI
  mongoDBUri: `mongodb://127.0.0.1:27017/email_helper`, // Local MongoDB URI
};

let URI;

if (process.env.NODE_ENV == "docker_container") {
  URI = DB_URI.dockerMongoUri;
} else if (process.env.NODE_ENV == "production") {
  URI = DB_URI.mongoAtlasUri;
} else {
  URI = DB_URI.mongoDBUri;
}

// connect to mongoDB
const connectDB = async () => {
  try {
    mongoose.set("strictQuery", false); // Default value is FALSE
    await mongoose.connect(URI, {
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

module.exports = connectDB;

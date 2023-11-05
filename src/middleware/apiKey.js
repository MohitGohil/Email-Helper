require("dotenv").config();

function apiKey(req, res, next) {
  const Key = process.env.API_KEY || "8000";
  const userApiKey = req.query.api_key;
  if (userApiKey === Key) {
    next();
  } else if (userApiKey !== Key) {
    res.status(401).json({ message: "Unauthorized access - Invalid api key" });
  } else {
    res.status(401).json({ message: "Api key not found!" });
  }
}

module.exports = apiKey;

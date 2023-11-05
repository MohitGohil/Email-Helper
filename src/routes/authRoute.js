const authRoute = require("express").Router();
const { apiKey } = require("../middleware");
const authController = require("../controllers/auth");

const authHandler = new authController();

// default route
authRoute.get("/", (req, res) => {
  res.json({ message: "Auth route" });
});

// auth routes
authRoute.get("/login", apiKey, authHandler.testLogin); // route to login directly with req.query
authRoute.post("/login", authHandler.handleLogin); // username with psw login module
authRoute.get("/logout", authHandler.handleLogout); // logout user by clearing browser token (access and refresh token)

module.exports = authRoute;

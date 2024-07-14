import { Router } from "express";
import { apiKey } from "../middleware/index.js";
import authController from "../controllers/auth.js";

const authHandler = new authController();
const authRoute = Router();

// default route
authRoute.get("/", (req, res) => {
  res.json({ message: "Auth route" });
});

// auth routes
authRoute.get("/login", apiKey, authHandler.testLogin); // route to login directly with req.query
authRoute.post("/login", authHandler.handleLogin); // username with psw login module
authRoute.get("/logout", authHandler.handleLogout); // logout user by clearing browser token (access and refresh token)

export default authRoute;

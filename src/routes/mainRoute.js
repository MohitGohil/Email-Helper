import { Router } from "express";
import { checkValidUser } from "../middleware/index.js";
import { homeRoute, helpRoute, testRoute, emailHandler } from "../controllers/mailer.js";

const mainRoute = Router();

mainRoute.get("/", homeRoute);
mainRoute.get("/help", helpRoute);
mainRoute.get("/test", checkValidUser, testRoute);
mainRoute.post("/", checkValidUser, emailHandler);

export default mainRoute;

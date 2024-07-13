const mainRoute = require("express").Router();
const { checkValidUser } = require("../middleware");
const { homeRoute, helpRoute, testRoute, emailHandler } = require("../controllers/mailer");

mainRoute.get("/", homeRoute);
mainRoute.get("/help", helpRoute);
mainRoute.get("/test", checkValidUser, testRoute);
mainRoute.post("/", checkValidUser, emailHandler);

module.exports = mainRoute;

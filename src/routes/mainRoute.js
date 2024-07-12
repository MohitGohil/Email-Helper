const mainRoute = require("express").Router();
const { checkValidUser } = require("../middleware");
const {
  homeRoute,
  helpRoute,
  testRoute,
  singleEmailHandler,
  multipleEmailHandler,
} = require("../controllers/mailer");

mainRoute.get("/", homeRoute);
mainRoute.get("/help", checkValidUser, helpRoute);
mainRoute.get("/test", testRoute);
mainRoute.post("/single", checkValidUser, singleEmailHandler);
mainRoute.post("/bulk", checkValidUser, multipleEmailHandler);

module.exports = mainRoute;

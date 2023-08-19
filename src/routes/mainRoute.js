const mainRoute = require("express").Router();
const {
  homeRoute,
  helpRoute,
  testRoute,
  singleEmailHandler,
  multipleEmailHandler,
} = require("../controllers/mailer");

mainRoute.get("/", homeRoute);
mainRoute.get("/help", helpRoute);
mainRoute.get("/test", testRoute);
mainRoute.post("/single", singleEmailHandler);
mainRoute.post("/bulk", multipleEmailHandler);

module.exports = mainRoute;

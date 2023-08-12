const mainRoute = require("express").Router();
const { getHandler, postHandler } = require("../controllers");

mainRoute.get("/", getHandler);
mainRoute.post("/", postHandler);

module.exports = mainRoute;

/**
 * @api {get} /users Get users
 * @apiName GetUsers
 * @apiGroup Users
 */
const express = require("express");
const app = express();
app.get("/users", (req, res) => {
  res.json([{ id: 1, name: "John Doe" }]);
});
module.exports = app;

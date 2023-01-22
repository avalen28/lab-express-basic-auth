const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares");

router.get("/", isLoggedIn, async (req, res, next) => {
  try {
    await res.render("main");
  } catch (next) {
    console.log(next);
  }
});
module.exports = router;

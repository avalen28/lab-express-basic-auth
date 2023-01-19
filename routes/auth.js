const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

router.get("/", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/", async (req, res, next) => {
  const { username, password } = req.body;
  // Esto seria necesario para avisar de un fallo
  //   if (!username || !password) {
  //     res.render("auth/signup", {
  //       error: "all fields are required. Please check it",
  //     });
  //   }

  // Esto sería necesario si al crear una contraseña quisiera checkear
  // const regex = /(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{6,}/;
  // if (!regex.test(password)) {
  //     res.render("auth/signup", {
  //         error:
  //             "Password needs to contain at least 6 characters, one number, one lowercase and one uppercase letter.",
  //     });
  //     return;
  // }

  try {
    const salt = await bcrypt.genSalt(saltRounds);
    const hashedPassword = await bcrypt.hash(password, salt);
    await User.create({ username, hashedPassword });
    res.render("auth/signup", { signupDone: "user created" }); // de momento lo dejo así para posterior saber a donde redirigir
  } catch (error) {
    console.log(error);
  }
});
module.exports = router;

const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const User = require("../models/User.model");

// rutas de sign up
router.get("/", (req, res, next) => {
  res.render("auth/signup");
});

router.post("/signup", async (req, res, next) => {
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
    res.redirect("/auth/login");
  } catch (error) {
    console.log(error);
  }
});

// rutas de login
router.get("/login", (req, res, next) => res.render("auth/login"));

router.post("/login", async (req, res, next) => {
  console.log("entro??????");
  const { name, password } = req.body;
  if (!name || !password) {
    res.render("auth/login", {
      error: "Introduce a correct name and password to log In",
    });
    return;
  }
  try {
    const userInDB = await User.findOne({ username: name }); // encontrar usuario y traer toda la info
    console.log("info: user in DB is", userInDB);
    if (!userInDB) {
      console.log("user is not in db");
      res.render("auth/login", { error: `The user ${name} doesn't exist` });
      return;
    } else {
      console.log("user is in db");
      const passwordMatch = await bcrypt.compare(
        password,
        userInDB.hashedPassword
      );
      if (passwordMatch) {
        console.log("passwords match");
        req.session.currentUser = userInDB; //por si queremos añadir datos del usuario. con esto hago "link" a todas las req.
        const { currentUser } = req.session;
        res.render("welcome", currentUser);
      } else {
        console.log("passwords don't match", password, userInDB.hashedPassword);
        res.render("auth/login", { error: "incorrect password" });
        return;
      }
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router;

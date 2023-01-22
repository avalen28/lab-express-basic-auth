module.exports = isLoggedIn = (req, res, next) => {
  if (!req.session.currentUser) {
    console.log("no logged");
    res.redirect("/auth/login");
  } else {
    console.log("logged");
    next();
  }
};

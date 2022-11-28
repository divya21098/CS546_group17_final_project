const express = require("express");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
const users = data.users;
const bcrypt = require("bcryptjs");
const userData = mongoCollections.users;
const saltRounds = 10;
const validator = require("../helper");

//POST METHOD for /register route
router.post("/register", async (req, res) => {
  let errors = [];
  console.log(req.body);
  let firstName = validator.trimString(req.body.firstName);
  let lastName = validator.trimString(req.body.lastName);
  let emailId = validator.trimString(req.body.emailId).toLowerCase();
  let password = req.body.password;
  let age = req.body.age;
  let phoneNumber = validator.trimString(req.body.phoneNumber);
  let gender = validator.trimString(req.body.gender);
  let nationality = validator.trimString(req.body.nationality);
  let aboutMe = validator.trimString(req.body.aboutMe);
  let preference = validator.trimString(req.body.preference);

  if (!validator.validString(firstName)) {
    errors.push("Please Enter valid First Name");
  }
  if (!validator.validString(lastName)) {
    errors.push("Please Enter valid Last Name");
  }
  if (!validator.validEmail(emailId)) {
    errors.push("Please Enter valid email id");
  }
  if (typeof age === "string") {
    age = parseInt(age);
  }
  if (validator.validatePhoneNumber(phoneNumber)) {
    errors.push("Please Enter valid phone number");
  }
  if (!validator.validString(aboutMe)) {
    errors.push("Please Enter valid about me");
  }
  if (!validator.validString(nationality)) {
    errors.push("Please Enter valid Nationality");
  }
  // if (errors.length > 0) {
  //   return res.status(400).render("/register", {
  //     authenticated: false,
  //     title: "Register",
  //     errors: errors
  //   });
  // }
  console.log("going to data");
  try {
    const user = await users.createUser(
      firstName,
      lastName,
      emailId,
      password,
      age,
      phoneNumber,
      gender,
      nationality,
      aboutMe,
      preference
    );
    return res.status(200).json({ user: "registered" });
    // req.session.user = user.__id.toString();
    // res.redirect("/login");
  } catch (e) {
    console.log(e);
    // errors.push(e);
    // return res.status(400).render("/register", {
    //   errors: errors,
    // });
  }
});

// get Logout
router.get("/logout", async (req, res) => {
  req.session.destroy();
  res.redirect("/");
});

// GET METHOD for /register route
router.get("/register", async (req, res) => {
  if (req.session.user) {
    res.redirect("/postList");
  } else {
    res.render("/register", {});
  }
});

// GET METHOD for /login route
router.get("/login", async (req, res) => {
  if (req.session.user) {
    res.redirect("/postList");
  } else {
    res.render("/login", {});
  }
});

// router.get('/', async (req, res) => {
//   if (req.session.user){
//       res.redirect("/posts");
//   }
// });

//POST METHOD for /login route
router.post("/login", async (req, res) => {
  const emailId = validator.trimString(req.body.emailId);
  const password = req.body.password;
  console.log(req.body);
  let errors = [];

  if (!validator.validEmail(emailId)) {
    errors.push("Please Enter valid email id");
  }
  //if (!validator.validPassword(password)) errors.push("Invalid password.");

  const userCollection = await userData();
  const myUser = await userCollection.findOne({
    emailId: emailId.toLowerCase(),
  });

  if (!myUser) errors.push("Username or password does not match.");
  // if (errors.length > 0) {
  // return res.status(401).render("users/login", {
  //   errors: errors,
  // });
  // }

  let match = await bcrypt.compare(password, myUser.password);

  if (match) {
    req.session.user = myUser._id.toString();
    // Redirect the user to their previous route after they login if it exists
    // Otherwise, bring them to the home/post list page
    let prev = req.session.previousRoute;
    if (prev) {
      req.session.previousRoute = "";
      // return res.redirect(prev);
    }
    // res.redirect("/postList");
    res.status(200).json(myUser);
  } else {
    errors.push("Username or password does not match");
    return res.status(403).render("/login", {
      errors: errors,
    });
  }
});
module.exports = router;

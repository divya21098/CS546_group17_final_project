const express = require("express");
const { ObjectId } = require("mongodb");
const mongoCollections = require("../config/mongoCollections");
const router = express.Router();
const data = require("../data/");
const users = data.users;
const posts = data.posts;
const bcrypt = require("bcryptjs");
const userData = mongoCollections.users;
const saltRounds = 10;
const validator = require("../helper");
const xss = require("xss");

//POST METHOD for /register route
router.post("/register", async (req, res) => {
  console.log(req.body);
  let errors = [];
  let firstName = xss(validator.trimString(req.body.firstName));
  let lastName = xss(validator.trimString(req.body.lastName));
  let emailId = xss(validator.trimString(req.body.emailId).toLowerCase());
  let password = xss(req.body.password);
  let age = xss(req.body.age);
  let phoneNumber = xss(validator.trimString(req.body.phoneNumber));
  let gender = xss(validator.trimString(req.body.gender));
  let nationality = xss(validator.trimString(req.body.nationality));
  let aboutMe = xss(validator.trimString(req.body.aboutMe));
  let preference = req.body.preference;

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
  if (!validator.validAge(age)) errors.push("Age must be a positive integer");
  try {
    if (validator.validatePhoneNumber(phoneNumber)) {
      errors.push("Please Enter valid phone number");
    }
  } catch (e) {
    errors.push(e);
  }
  if (!validator.validString(aboutMe)) {
    errors.push("Please Enter valid about me");
  }
  if (!validator.validString(nationality)) {
    errors.push("Please Enter valid Nationality");
  }
  if (preference.length < 0) {
    errors.push("here should be atleast one preference");
  }
  if (preference.drinking) {
    if (!validator.validString(preference.drinking))
      errors.push("Please enter valid field");
  }
  if (preference.smoking) {
    if (!validator.validString(preference.smoking))
      errors.push("Please enter valid field");
  }
  try {
    if (preference.food) {
      validator.validArray(preference.food, "food");
    }
    // if (preference.budget) {
    //   console.log(preference.budget);
    // }
    if (preference.room) {
      validator.validArray(preference.room, "room");
    }
    if (preference.location) {
      validator.validArray(preference.location, "location");
    }
    if (preference.home_type) {
      validator.validArray(preference.home_type, "home_type");
    }
  } catch (e) {
    errors.push(e);
  }
  if (errors.length > 0) {
    return res.status(400).render("/register", {
      authenticated: false,
      title: "Register",
      errors: errors,
      hasErrors: true,
    });
  }
  
  const allUsers = await users.getAllUsers()
  if (allUsers.length !== 0) {
    allUsers.forEach((user) => {
      if (user.emailId === validator.trimString(emailId)){
        errors=[]
        errors.push("An account is already created with the given email id")
      }
    });
    if(errors.length>0){
    return res.status(403).render("register",{
      authenticated:false,
      title:"Register",
      errors:errors
    });
  }
  }

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
    //return res.status(200).json({ user: "registered" });
    // req.session.user = user.__id.toString();
    return res.redirect("/login");
    //return res.status(201).render("login");
  } catch (e) {
    res.status(500).render("register");
    // errors.push(e);
    // return res.status(400).render("/register", {
    //   errors: errors,
    // });
  }
});

// get Logout
router.get("/logout", async (req, res) => {
  req.session.destroy();
  return res.redirect("/")
});

// GET METHOD for /register route
router.get("/register", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/posts");
  } else {
    return res.render("register", {userLoggedIn:false});
  }
});

// GET METHOD for /login route
router.get("/login", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/posts");
    //res.render("posts/index.handlebars");
  } else {
    return res.render("login", {userLoggedIn:false});
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
  let errors = [];
  try {
    if (!validator.validEmail(emailId)) {
      errors.push("Email id cannot be empty");
    }
  } catch (e) {
    errors.push("Email id cannot be empty");
  }

  if (!password) {
    errors.push("Password cannot be empty");
  }
  if (errors.length > 0) {
    return res.status(400).render("login", {
      errors: errors,
      hasErrors: true,
    });
  }
  //if (!validator.validPassword(password)) errors.push("Invalid password.");
  const userCollection = await userData();
  const myUser = await userCollection.findOne({
    emailId: emailId.toLowerCase(),
  });

  if (!myUser) errors.push("Emailid or password does not match.");
  if (errors.length > 0) {
    return res.status(401).render("login", {
      errors: errors,
      hasErrors: true,
    });
  }

  let match = await bcrypt.compare(password, myUser.password);

  if (match) {
    req.session.user = myUser._id.toString();
    // Redirect the user to their previous route after thsey login if it exists
    // Otherwise, bring them to the home/post list page
    let prev = req.session.previousRoute;
    if (prev) {
      req.session.previousRoute = "";
      // return res.redirect(prev);
    }
    return res.redirect("/posts");
    //res.status(200).json(myUser);
    // res.render('posts/index');
  } else {
    errors.push("Emailid or password does not match");
    return res.status(401).render("login", {
      errors: errors,
      hasErrors: true,
    });
  }
});

//GET METHOD for myProfle route
router.get("/users/myProfile", async (req, res) => {
  if (req.session.user) {
    try{
    const userInfo = await users.getUserById(req.session.user);
    // return res.status(200).json(userInfo);
    return res.render("users/index", { userInfo: userInfo, userLoggedIn:true});
    }
    catch{
      return res.status(500).render("error")
    }
  } else {
    return res.redirect('/login')
    //return res.status(401).render("login", {});
  }
});

// // get
router.get("/users/myProfileEdit", async (req, res) => {
  if (req.session.user) {
    const userInfo = await users.getUserById(req.session.user);
    return res.render("users/editUser", { userInfo: userInfo,userLoggedIn:true});
  } else {
    return res.redirect('/login');
  }
});

// PUT METHOD for myProfileEdit route
router.post("/users/myProfileEdit", async (req, res) => {
  if (req.session.user) {
    let updatedUser = req.body;
    let updatedUserData = {};
    let errors = [];
    //if (!validator.validString(req.session.user)) throw "id must be given";
    // try{
    // var updatedUser  = await users.getUserById(req.session.user);
    // }
    // catch(e){
    //   return res.status(500).render("error",{e:"Something went wrong"})
    // }

    if (updatedUser.firstName) {
      if (!validator.validString(updatedUser.firstName))
        errors.push("First name is not a valid string");
      updatedUser.firstName = xss(validator.trimString(updatedUser.firstName));
      updatedUserData.firstName = updatedUser.firstName;
    }
    if (updatedUser.lastName) {
      if (!validator.validString(updatedUser.lastName))
        errors.push("Last name is not a valid string");
      updatedUser.lastName = xss(validator.trimString(updatedUser.lastName));
      updatedUserData.lastName = updatedUser.lastName;
    }

    if (updatedUser.age) {
      if (!validator.validAge(updatedUser.age))
        errors.push("Age must be a positive integer");
      //updatedUser.age = validator.trimString(updatedUser.age);
      updatedUserData.age = xss(updatedUser.age);
    }

    if (updatedUser.phoneNumber) {
      try {
        validator.validatePhoneNumber(updatedUser.phoneNumber);
      } catch (e) {
        errors.push(e);
      }
      updatedUser.phoneNumber = xss(
        validator.trimString(updatedUser.phoneNumber)
      );
      updatedUserData.phoneNumber = updatedUser.phoneNumber;
    }

    if (updatedUser.aboutMe) {
      if (!validator.validString(updatedUser.aboutMe))
        errors.push("About  Me is not a valid string");
      updatedUser.aboutMe = xss(validator.trimString(updatedUser.aboutMe));
      updatedUserData.aboutMe = updatedUser.aboutMe;
    }

    //nationality call use npm package in drop down box to be called on client side
    if (updatedUser.nationality) {
      if (!validator.validString(updatedUser.nationality))
        errors.push("Nationality is not a valid string");
      updatedUser.nationality = xss(
        validator.trimString(updatedUser.nationality)
      );
      updatedUserData.nationality = updatedUser.nationality;
    }
    //preference  in drop down box to be called on client side
    //gender - Male, Female, Others drop box
    if (updatedUser.gender) {
      if (!validator.validString(updatedUser.gender))
        errors.push("Gender is not a valid string");
      updatedUser.gender = xss(validator.trimString(updatedUser.gender));
      updatedUserData.gender = updatedUser.gender;
    }
    if (updatedUser.preference) {
      if (updatedUser.preference.drinking) {
        if (!validator.validString(updatedUser.preference.drinking))
          errors.push("Not a type boolean");
      }
      if (updatedUser.preference.smoking) {
        if (!validator.validString(updatedUser.preference.smoking))
          errors.push("Not a type boolean");
      }
      if (updatedUser.preference.food) {
        validator.validArray(updatedUser.preference.food, "food");
      }
      // if (updatedUser.preference.budget) {
      //   console.log(updatedUser.preference.budget);
      // }
      if (updatedUser.preference.room) {
        validator.validArray(updatedUser.preference.room, "room");
      }
      if (updatedUser.preference.location) {
        validator.validString(updatedUser.preference.location, "location");
      }
      if (updatedUser.preference.home_type) {
        validator.validArray(updatedUser.preference.home_type, "home_type");
      }
      updatedUserData.preference = updatedUser.preference;
    }
    if (errors.length > 0) {
      // return res.status(200).json(errors);
      return res.status(400).render("users/editUser", {
        errors: errors,
      });
    }
    try {
      let userInfo = await users.updateUser(req.session.user, updatedUserData);
      // return res.status(200).json(userInfo);
      return res.redirect("/users/myProfile")
      //return res.render("users/index", { userInfo: userInfo });
    } catch (e) {
      // return res.status(400).json(e);
      return res.status(500).render("error");
    }
  } else {
    return res.render("login");
  }
});

//GET METHOD for myProfile/posts
router.get("/users/myProfile/posts", async (req, res) => {
  if (req.session.user) {
    try {
      let all_post = await posts.getPostByuserId(req.session.user);
      // return res.status(200).json(all_post);
      return res.render("users/userPost", { all_post: all_post, userLoggedIn:true });
    } catch {
      return res.status(500).render("error")
      // return res.render("error", {});
    }
  }
  return res.redirect("/login")
});

//POST METHOD for myProfile/savedPosts
router.post("/users/myProfile/savedPosts/:postid", async (req, res) => {
  //check if post id valid n if exists

  if (req.session.user) {
    try {
      let postid = validator.validId(req.params.postid);
      let post = await posts.getPostById(postid);
      if (!post) throw "post doesnt exists";
      let all_post = await posts.createSavedPost(postid, req.session.user);
      //create handlebar which says post saved
      //return res.send(all_post);
      return res.render("users/userSavedPost", { allPost: all_post , userLoggedIn:true});
    } catch (e) {
      //render handlebar that says user cant save own post

      return res.status(400).render("error",);
    }
  }
  return res.redirect('/login')
  //return res.render("login", {});
});

//GET METHOD for myProfile/savedPosts
router.get("/users/myProfile/savedPosts", async (req, res) => {
  if (req.session.user) {
    try {
      let all_post = await posts.getSavedPostByuserId(req.session.user);
      // return res.send(all_post);
      return res.render("users/userSavedPost", { allPost: all_post, userLoggedIn:true });
    } catch {
      console.log("Post no longer available!");

      // return res.render("error", {});
    }
  }
  else{
    res.redirect('/login')
    return res.render("login", {});
  }
});

//PUT METHOD for myProfile/savedPosts
router.post("/users/myProfile/savedPosts/:postid", async (req, res) => {
  if (req.session.user) {
    try {
      let postid = req.params.postid;
      let all_post = await posts.removeSavedPostByuserId(
        postid,
        req.session.user
      );
      //return res.send(all_post);

      return res.render("users/userPosts", { allPost: all_post, userLoggedIn:true });
    } catch {
      console.log("err");

      // return res.render("error", {});
    }
  } else {
    return res.redirect('/login')
    //return res.render("login", {});
  }
});

router.get("/users/recommendation", async (req, res) => {
  if (req.session.user) {
    let userList = await users.userRecommendation(req.session.user);
    return res.status(200).json(userList);
  } else {
    return res.status(403).json({ error: "Not aunthencticated" });
  }
});

module.exports = router;

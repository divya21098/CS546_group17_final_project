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

  if (
    !validator.validStringBool(firstName) ||
    !validator.validName(firstName)
  ) {
    errors.push("Please Enter valid First Name");
  }
  if (!validator.validStringBool(lastName) || !validator.validName(lastName)) {
    errors.push("Please Enter valid Last Name");
  }
  if (!validator.validEmail(emailId)) {
    errors.push("Please Enter valid email id");
  }
  if (!validator.validPassword(password)) {
    errors.push("Please enter valid password");
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
  if (!validator.validStringBool(aboutMe)) {
    errors.push("Please Enter valid about me");
  }
  if (!validator.validStringBool(nationality)) {
    errors.push("Please Enter valid Nationality");
  }
  if (preference.length < 0) {
    errors.push("There should be atleast one preference");
  }
  if (preference.drinking) {
    if (!validator.validStringBool(preference.drinking))
      errors.push("Please enter valid field for drinking");
  }
  if (preference.smoking) {
    if (!validator.validStringBool(preference.smoking))
      errors.push("Please enter valid field for smoking");
    // errors.push("Please enter valid field");
  }
  try {
    if (preference.food) {
      validator.validArray(preference.food, "food");
    } else {
      errors.push("Atleast one food preference needs to be checked");
    }
    if (preference.room) {
      validator.validArray(preference.room, "room");
    } else {
      errors.push("Atleast one room preference needs to be checked");
    }
    if (preference.location) {
      validator.validArray(preference.location, "location");
    } else {
      errors.push("Atleast one location preference needs to be checked");
    }
    if (preference.home_type) {
      validator.validArray(preference.home_type, "home_type");
    } else {
      errors.push("Atleast one home type preference needs to be checked");
    }
  } catch (e) {
    errors.push(e);
  }
  if (errors.length > 0) {
    return res.status(400).render("register", {
      authenticated: false,
      title: "Register",
      errors: errors,
      hasErrors: true,
    });
  }

  const allUsers = await users.getAllUsers();
  if (allUsers.length !== 0) {
    allUsers.forEach((user) => {
      if (user.emailId === validator.trimString(emailId)) {
        errors = [];
        errors.push("An account is already created with the given email id");
      }
    });
    if (errors.length > 0) {
      return res.status(400).render("register", {
        authenticated: false,
        title: "Register",
        errors: errors,
        hasErrors: true,
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

    return res.redirect("/login");
  } catch (e) {
    res.status(500).render("error",{userLoggedIn:false});
  }
});

// get Logout
router.get("/logout", async (req, res) => {
  req.session.destroy();
  return res.redirect("/");
});

// GET METHOD for /register route
router.get("/register", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/posts");
  } else {
    return res.render("register", { userLoggedIn: false, register: true });
  }
});

// GET METHOD for /login route
router.get("/login", async (req, res) => {
  if (req.session.user) {
    return res.redirect("/posts");
    //res.render("posts/index.handlebars");
  } else {
    return res.render("login", { userLoggedIn: false });
  }
});


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
      userLoggedIn:false
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
      userLoggedIn:false
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
      userLoggedIn:false
    });
  }
});

//GET METHOD for myProfle route
router.get("/users/myProfile", async (req, res) => {
  if (req.session.user) {
    try {
      const userInfo = await users.getUserById(req.session.user);
      // return res.status(200).json(userInfo);
      return res.render("users/index", {
        userInfo: userInfo,
        userLoggedIn: true,
      });
    } catch(e) {
      return res.status(500).render("error",{errors:e,userLoggedIn:true});
    }
  } else {
    return res.redirect("/login");
  }
});

// // get
router.get("/users/myProfileEdit", async (req, res) => {
  if (req.session.user) {
    const userInfo = await users.getUserById(req.session.user);
    return res.render("users/editUser", {
      userInfo: userInfo,
      userLoggedIn: true,
    });
    //return res.redirect("/users/myProfile")
  } else {
    return res.redirect("/login");
  }
});

// PUT METHOD for myProfileEdit route
router.post("/users/editProfile", async (req, res) => {
  if (req.session.user) {
    let updatedUser = req.body;
    let updatedUserData = {};
    let errors = [];
    if (updatedUser.firstName) {
      if (
        !validator.validStringBool(updatedUser.firstName) ||
        !validator.validName(updatedUser.firstName)
      )
        errors.push("First name is not a valid string");
      updatedUser.firstName = xss(validator.trimString(updatedUser.firstName));
      updatedUserData.firstName = updatedUser.firstName;
    }

    if (updatedUser.lastName) {
      if (
        !validator.validStringBool(updatedUser.lastName) ||
        !validator.validName(updatedUser.lastName)
      )
        errors.push("Last name is not a valid string");
      updatedUser.lastName = xss(validator.trimString(updatedUser.lastName));
      updatedUserData.lastName = updatedUser.lastName;
    }

    if (updatedUser.age) {
      if (typeof updatedUser.age === "string") {
        updatedUser.age = parseInt(updatedUser.age);
      }
      if (!validator.validAge(updatedUser.age))
        errors.push("Age must be a positive integer");
      //updatedUser.age = validator.trimString(updatedUser.age);
      updatedUserData.age = xss(updatedUser.age);
    }
    // else{
    //   errors.push("Age cannot be empty");
    // }

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
      if (!validator.validStringBool(updatedUser.aboutMe))
        errors.push("About  Me is not a valid string");
      updatedUser.aboutMe = xss(validator.trimString(updatedUser.aboutMe));
      updatedUserData.aboutMe = updatedUser.aboutMe;
    }
    // else{
    //   errors.push("About Me cannot be empty");
    // }

    //nationality call use npm package in drop down box to be called on client side
    if (updatedUser.nationality) {
      if (!validator.validStringBool(updatedUser.nationality))
        errors.push("Nationality is not a valid string");
      updatedUser.nationality = xss(
        validator.trimString(updatedUser.nationality)
      );
      updatedUserData.nationality = updatedUser.nationality;
    }
    // else{
    //   errors.push("Nationality cannot be empty");
    // }
    //preference  in drop down box to be called on client side
    //gender - Male, Female, Others drop box
    if (updatedUser.gender) {
      if (!validator.validStringBool(updatedUser.gender))
        errors.push("Gender is not a valid string");
      updatedUser.gender = xss(validator.trimString(updatedUser.gender));
      updatedUserData.gender = updatedUser.gender;
    }
    // else{
    //   errors.push("Gender cannot be empty");
    // }
    console.log(updatedUser)
    if (updatedUser.preference) {
      if (updatedUser.preference.drinking) {
        if (!validator.validStringBool(updatedUser.preference.drinking))
          errors.push("Not a type boolean");
          //updatedUserData["preference"]["drinking"] = updatedUser.preference.drinking;
      }
      if (updatedUser.preference.smoking) {
        if (!validator.validStringBool(updatedUser.preference.smoking))
          errors.push("Not a type boolean");
          //updatedUserData.preference.smoking = updatedUser.preference.smoking
      }
      if (updatedUser.preference.food) {
        validator.validArray(updatedUser.preference.food, "food");
        //updatedUserData.preference.food = updatedUser.preference.food
      }

      if (updatedUser.preference.room) {
        validator.validArray(updatedUser.preference.room, "room");
        //updatedUserData.preference.room = updatedUser.preference.room
      }
      else{
        errors.push("Atleast one room preference needs to be checked")
      }
      if (updatedUser.preference.location) {
        validator.validString(updatedUser.preference.location, "location");
        //updatedUserData.preference.location = updatedUser.preference.location
      }
      else{
        errors.push("Atleast one location preference needs to be checked")
      }
      if (updatedUser.preference.home_type) {
        validator.validArray(updatedUser.preference.home_type, "home_type")
        //updatedUserData.preference.home_type = updatedUser.preference.home_type;
      }
      else{
        errors.push("Atleast one hometype preference needs to be checked")
      }
      updatedUserData.preference = updatedUser.preference;
    }
    if (errors.length > 0) {
      // return res.status(200).json(errors);
      return res.status(400).render("users/editUser", {
        errors: errors,
        hasErrors: true,
        userLoggedIn:true
      });
    }
    try {
      let userInfo = await users.updateUser(req.session.user, updatedUserData);
      // return res.status(200).json(userInfo);
      return res.redirect("/users/myProfile");
      //return res.render("users/index", { userInfo: userInfo });
    } catch (e) {
      // return res.status(400).json(e);
      return res.status(500).render("error",{errors:e,userLoggedIn:true});
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
      return res.render("users/userPost", {
        all_post: all_post,
        userLoggedIn: true,
      });
    } catch(e) {
      return res.status(500).render("error",{errors:e,userLoggedIn:true});
      // return res.render("error", {});
    }
  }
  return res.redirect("/login");
});

//POST METHOD for myProfile/savedPosts
router.post("/users/myProfile/savedPosts/:postid", async (req, res) => {
  //check if post id valid n if exists

  if (req.session.user) {
    try {
      let errors = [];
      let postid = validator.validId(req.params.postid);
      let post = await posts.getPostById(postid);
      if (!post) errors.push("post doesnt exists") 
      
      let all_post = await posts.createSavedPost(postid, req.session.user);
      //create handlebar which says post saved
      //return res.send(all_post);
      //return res.render("users/userSavedPost", { allPost: all_post , userLoggedIn:true});
      // return alert("Post Saved");
      return res.redirect("/posts/" + postid);
    } catch (e) {
      //render handlebar that says user cant save own post

      return res.status(500).render("error",{errors:e,userLoggedIn:true});
    }
  } else {
    return res.redirect("/login");
  }
});

//GET METHOD for myProfile/savedPosts
router.get("/users/myProfile/savedPosts", async (req, res) => {
  if (req.session.user) {
    try {
      
      let all_post = await posts.getSavedPostByuserId(req.session.user);
      // return res.send(all_post);
      console.log(all_post);
      return res.render("users/index", {
        allPost: all_post,
        userLoggedIn: true,
      });
      //alert("Post Saved");
    } catch {
      return res.status(500).render("error",{errors:e,userLoggedIn:true});

      // return res.render("error", {});
    }
  } else {
    res.redirect("/login");
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

      //return res.render("users/userPost", { allPost: all_post, userLoggedIn:true });
    } catch (e){
      return res.status(500).render("error",{errors:e,userLoggedIn:true});
    }
  } else {
    return res.redirect("/login");
    //return res.render("login", {});
  }
});
router.post("/users/recommendation", async (req, res) => {});
router.get("/users/recommendation", async (req, res) => {
  if (req.session.user) {
    let userList = await users.userRecommendation(req.session.user);
    console.log(userList);

    return res.status(200).render("users/userRec", {
      userRec: userList,
      userLoggedIn: true,
    });
  } else {
    return res.redirect("/login");
  }
});

router.get("/users/checkUser/:id",async(req,res)=>{
  try{
  req.params.id = validator.validId(req.params.id);
  const userInfo = await users.getUserById(req.params.id);
  if(userInfo!==null){
    userInfo._id = userInfo._id.toString()
    return res.render("users/showUser",{userInfo:userInfo, userLoggedIn:true})
  }
  }
  catch(e){
    return res.render("error",{errors:e,userLoggedIn:true})
  }
  
  
})

module.exports = router;

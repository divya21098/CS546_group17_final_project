// all posts routes
const express = require("express");
const router = express.Router();
const data = require("../data/");
const posts = data.posts;
const validation = require("../helper");
const multer = require("multer");
// const path = require("path");
const { ObjectId } = require("mongodb");
const xss = require("xss");

//all posts
const path = require("path");

var fs = require("fs");
// SET STORAGE
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads");
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + "-" + Date.now());
  },
});
var upload = multer({ storage: storage });

router.get("/postpic/:id", async (req, res) => {
  let errors = [];
  if (
    !req.params.id ||
    typeof req.params.id != "string" ||
    req.params.id.trim().length == 0 ||
    !ObjectId.isValid(req.params.id)
  ) {
    errors.push("not valid string");
  }
  req.params.id = validation.validId(req.params.id);

  const getPost = await posts.getPostById(req.params.id);
  const profilepicData = getPost.postPicture;
  if (profilepicData == "") {
    errors.push("No Post Pic Found!");

    return res.status(400).send({
      message: "No Post Pic Found!",
    });
  } else {
    res.contentType("image/jpeg");
    res.send(profilepicData.image.buffer);
  }
});

router.route("/").get(async (req, res) => {
  try {
    const postList = await posts.getAllPosts();
    res.render("posts/index", { posts: postList });
  } catch (e) {
    res.status(404).send();
  }
});

router.route("/add").get(async (req, res) => {
  console.log("edit");
  if (req.session.user) {
    res.render("posts/createPost");
  } else {
    res.render("login", {});
  }
});
router.route("/delete/:id").get(async (req, res) => {
  errors = [];
  if (
    !req.params.id ||
    typeof req.params.id != "string" ||
    req.params.id.trim().length == 0 ||
    !ObjectId.isValid(req.params.id)
  ) {
    errors.push("not valid string");
  }
  try {
    req.params.id = validation.validId(req.params.id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  if (req.session.user) {
    try {
      const id = req.params.id;
      const post = await posts.getPostById(id);
      //return res.status(200).json(post);
      res.render("posts/deletePost", { post: post });
    } catch (e) {
      res.status(404).json({ error: "No post with id" });
    }
  } else {
    res.render("login", {});
  }
});

router.route("/add").post(upload.single("postPicture"), async (req, res) => {
  const info = req.body;
  let userId = req.session.user;
  let errors = [];

  if (userId) {
    if (
      !info.postTitle ||
      typeof info.postTitle != "string" ||
      info.postTitle.trim().length == 0
    ) {
      errors.push("Please Enter post title");
    }
    if (
      !info.postBody ||
      typeof info.postBody != "string" ||
      info.postBody.trim().length == 0
    ) {
      errors.push("Please Enter valid post body");
    }
    try {
      info.postTitle = xss(validation.validString(info.postTitle));
      info.postBody = xss(validation.validString(info.postBody));
      // info.postPicture = validation.validString(info.postPicture);
      var finalImg = "";

      if (!req.file) {
        finalImg = "";
      } else {
        var img = fs.readFileSync(req.file.path);
        var encode_image = img.toString("base64");
        finalImg = {
          contentType: req.file.mimetype,
          image: Buffer.from(encode_image, "base64"),
        };
      }
      const { postTitle, postBody, postPicture } = info;
      const post = await posts.createPost(
        userId,
        postTitle,
        postBody,
        finalImg
      );
      //return res.status(200).json(post);
      return res.redirect("/posts");
      //res.render("posts/index");
    } catch (e) {
      console.log(e);
      //render error page
    }

    if (errors.length > 0) {
      return res.status(400).render("posts/createPost", {
        authenticated: false,
        title: "Register",
        errors: errors,
        hasErrors: true,
      });
    }
  } else {
    return res.status(401).render("login", {
      errors: errors,
      hasErrors: true,
    });
    // res.status(401).json({ user: "not auth" });
  }
});
router.route("/:id").get(async (req, res) => {
  errors = [];
  if (
    !req.params.id ||
    typeof req.params.id != "string" ||
    req.params.id.trim().length == 0 ||
    !ObjectId.isValid(req.params.id)
  ) {
    errors.push("not valid string");
  }
  try {
    req.params.id = validation.validId(req.params.id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  let userId = req.session.user;
  if(userId){
  try {
    const id = req.params.id;
    const post = await posts.getPostById(id);
    //return res.status(200).json(post);
    res.render("posts/postDetails", { posts: post });
  } catch (e) {
    res.status(404).json({ error: "No post with id" });
  }
  }
  else{
    return res.redirect('/login')
  }
});
router.route("/delete/:id").post(async (req, res) => {
  if (
    !req.params.id ||
    typeof req.params.id != "string" ||
    req.params.id.trim().length == 0 ||
    !ObjectId.isValid(req.params.id)
  ) {
    errors.push("not valid string");
  }
  try {
    req.params.id = validation.validId(req.params.id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  let userId = req.session.user;
  if (userId) {
    try {
      const postid = req.params.id;
      const post = await posts.removePostById(postid, userId);
      const postList = await posts.getAllPosts();
      return res.status(200).render("posts/index", { posts: postList });

      // res.render("users/userPost", { all_post: post });
    } catch (e) {
      return res.status(404).json({ error: "No post with id" });
    }
  } else {
    return res.status(401).json({ user: "not auth" });
  }
});
router.route("/edit/:id").get(async (req, res) => {
  console.log("edit");
  if (req.session.user) {
    res.render("posts/editPost", { id: req.params.id });
  } else {
    res.render("login", {});
  }
});
router
  .route("/edit/:id")
  .post(upload.single("postPicture"), async (req, res) => {
    const info = req.body;
    let userId = req.session.user;
    let updatedPostData = {};
    if (
      !req.params.id ||
      typeof req.params.id != "string" ||
      req.params.id.trim().length == 0 ||
      !ObjectId.isValid(req.params.id)
    ) {
      errors.push("not valid string");
    }
    if (userId) {
      console.log("in put post route");

      try {
        postId = validation.validId(req.params.id);
      } catch (e) {
        return res.status(400).json({ error: e });
      }
      try {
        if (!req.file) {
          finalImg = "";
        } else {
          var img = fs.readFileSync(req.file.path);
          var encode_image = img.toString("base64");
          finalImg = {
            contentType: req.file.mimetype,
            image: Buffer.from(encode_image, "base64"),
          };
        }
        const { postTitle, postBody, aptPhotos } = info;
        if (postTitle) {
          if (
            !info.postTitle ||
            typeof info.postTitle ||
            info.postTitle.trim.length() == 0
          ) {
            errors.push("Please Enter post title");
          }
          // if (!validation.validString(postTitle)) throw "Title not valid";
          updatedPostData.postTitle = validation.validString(postTitle);
        }
        if (postBody) {
          if (!validation.validString(postBody)) throw "Body not valid";
          updatedPostData.postBody = postBody;
        }
        if (aptPhotos) {
          updatedPostData.aptPhotos = finalImg;
        }
        const post = await posts.updatePostbyId(
          postId,
          userId,
          updatedPostData
        );
        const postList = await posts.getAllPosts();
        // res.status(200).json(post);
        res.status(200).render("posts/index", { posts: postList });
      } catch (e) {
        //add res.render
        res.status(500).json({ error: e });
      }
    } else {
      //handle errors
      res.status(401).json({ user: "not auth" });
    }
  });

router.route("/search").post(async (req, res) => {
  const search = req.body;
  let errors = [];
  // if (!search.key) {
  //   return res.redirect("/");
  // }
  let b = {};
  if (Object.keys(search).length === 0) {
    return res.status(401).json({ "Enter some search": "Nothing" });
  }
  if (search.preference.drinking) {
    if (!validation.validBool(search.preference.drinking))
      errors.push("Not a type boolean");
    b["preference.drinking"] = search.preference.drinking;
  }
  if (search.preference.smoking) {
    if (!validation.validBool(search.preference.smoking))
      errors.push("Not a type boolean");
    b["preference.smoking"] = search.preference.smoking;
  }
  try {
    if (search.preference.food) {
      validation.validArray(search.preference.food, "food");
      b["preference.food"] = search.preference.food;
    }
    if (search.preference.budget) {
      console.log(search.preference.budget);
      b["preference.budget"] = search.preference.budget;
    }
    if (search.preference.room) {
      validation.validArray(search.preference.room, "room");
      b["preference.room"] = search.preference.room;
    }
    if (search.preference.location) {
      validation.validArray(search.preference.location, "location");
      b["preference.location"] = search.preference.location;
    }
    if (search.preference.home_type) {
      validation.validArray(search.preference.home_type, "home_type");
      b["preference.home_type"] = search.preference.home_type;
    }
  } catch (e) {
    errors.push(e);
    return res.status(400).json(e);
  }
  try {
    let searchList = await posts.filterSearch(b);
    return res.status(200).json(searchList);
  } catch (e) {
    return res.status(500).json(e);
    //return res.render("",e)
  }
});
router.route("/search").get(async (req, res) => {
  res.render("");
});
module.exports = router;

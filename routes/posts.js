// all posts routes
const express = require("express");
const router = express.Router();
const data = require("../data/");
const posts = data.posts;
const validation = require("../helper");
const multer = require("multer");
// const path = require("path");
const { ObjectId } = require("mongodb");

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

router.route("/").get(async (req, res) => {
  try {
    // let userLoggedIn = false;
    // let userId = req.session.AuthCookie;

    // if (!userId) {
    //   userLoggedIn = false;
    // } else {
    //   userLoggedIn = true;
    // }
    const postList = await posts.getAllPosts();
    // res.status(200).render("posts", {
    //   post: newRestaurantList,
    //   userLoggedIn: userLoggedIn,
    // });
    res.json(postList);
  } catch (e) {
    res.status(404).send();
  }
});
//post by id
//add post
router.route("/add").post(async (req, res) => {
  if (req.session.user) {
    // var finalImg = "";
    // console.log(req.body.file);
    // if (!req.body.file) {
    //   finalImg = "";
    // } else {
    //   var img = fs.readFileSync(req.file.path);
    //   var encode_image = img.toString("base64");
    //   finalImg = {
    //     contentType: req.file.mimetype,
    //     image: Buffer.from(encode_image, "base64"),
    //   };
    // }
    const info = req.body;
    let userId = req.session.user;
    console.log(userId);
    try {
      info.postTitle = validation.validString(info.postTitle);
      info.postBody = validation.validString(info.postBody);
      const { postTitle, postBody } = info;
      const post = await posts.createPost(userId, postTitle, postBody);
      return res.status(200).json(post);
    } catch (e) {
      console.log(e);
    }
  } else {
    res.status(401).json({ user: "not auth" });
  }
});
router
  .route("/:id")
  .get(async (req, res) => {
    try {
      req.params.id = validation.validId(req.params.id);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const id = req.params.id;
      console.log(id);
      const post = await posts.getPostById(id);
      res.status(200).json(post);
    } catch (e) {
      res.status(404).json({ error: "No post with id" });
    }
  })
  .delete(async (req, res) => {
    try {
      req.params.id = validation.validId(req.params.id);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    let userId = req.session.user;
    if (userId) {
      try {
        const postid = req.params.id;
        const movie = await posts.removePostById(postid, userId);
        res.status(200).json(movie);
      } catch (e) {
        res.status(404).json({ error: "No post with id" });
      }
    } else {
      res.status(401).json({ user: "not auth" });
    }
  })
  .put(async (req, res) => {
    const info = req.body;
    let userId = req.session.user;
    if (userId) {
      try {
        postId = validation.validId(req.params.id);
      } catch (e) {
        return res.status(400).json({ error: e });
      }
      try {
        info.postTitle = validation.validString(info.postTitle);
        info.postBody = validation.validString(info.postBody);

        const { postTitle, postBody } = info;
        const post = await posts.updatePostbyId(
          postId,
          userId,
          postTitle,
          postBody
        );
        res.status(200).json(post);
      } catch (e) {
        res.status(500).json({ error: e });
      }
    } else {
      res.status(401).json({ user: "not auth" });
    }
  });
router.route("/search").get(async (req, res) => {});
module.exports = router;

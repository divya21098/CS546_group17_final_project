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

router.get("/postpic/:id", async (req, res) => {
  const getPost = await posts.getPostById(req.params.id);
  const profilepicData = getPost.postPicture;
  if (profilepicData == "") {
    return res.status(400).send({
      message: "No Profile Pic Found!",
    });
  } else {
    res.contentType("image/jpeg");
    res.send(profilepicData.image.buffer);
  }
});

router.route("/").get(async (req, res) => {
  try {
    const postList = await posts.getAllPosts();

    res.json(postList);
  } catch (e) {
    res.status(404).send();
  }
});

router.route("/add").post(upload.single("picture"), async (req, res) => {
  const info = req.body;
  let userId = req.session.user;
  console.log(userId);
  if (userId) {
    try {
      info.postTitle = validation.validString(info.postTitle);
      info.postBody = validation.validString(info.postBody);
      // info.postPicture = validation.validString(info.postPicture);
      var finalImg = "";
      console.log(req.file);
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
    let updatedPostData = {};
    if (userId) {
      console.log("in put post route");

      try {
        postId = validation.validId(req.params.id);
      } catch (e) {
        return res.status(400).json({ error: e });
      }
      try {
        const { postTitle, postBody } = info;
        if (postTitle) {
          if (!validation.validString(postTitle)) throw "Title not valid";
          // postTitle = validation.trimString(postTitle);
          updatedPostData.postTitle = postTitle;
        }
        if (postBody) {
          if (!validation.validString(postBody)) throw "Body not valid";
          // postBody = validation.trimString(postBody);
          updatedPostData.postBody = postBody;
        }
        const post = await posts.updatePostbyId(
          postId,
          userId,
          updatedPostData
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

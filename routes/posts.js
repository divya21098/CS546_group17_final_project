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
  req.params.id = validation.validId(req.params.id);

  const getPost = await posts.getPostById(req.params.id);
  const profilepicData = getPost.postPicture;
  if (profilepicData == "") {
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

    // res.json(postList);
    res.render("posts/index", { posts: postList });

    //res.json(postList);
  } catch (e) {
    res.status(404).send();
  }
});

router.route("/add").get(async (req, res) => {
  if (req.session.user) {
    res.render("posts/createPost");
  } else {
    res.render("login", {});
  }
});

router.route("/add").post(upload.single("postPicture"), async (req, res) => {
  const info = req.body;
  let userId = req.session.user;
  info.postTitle = xss(info.postTitle);
  // console.log(userId);
  if (userId) {
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
      const post = await posts.getPostById(id);
      //return res.status(200).json(post);
      res.render("posts/postDetails", { posts: post });
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
  .put(upload.single("postPicture"), async (req, res) => {
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
        if (postTitle) {
          if (!validation.validString(postTitle)) throw "Title not valid";
          updatedPostData.postTitle = postTitle;
        }
        if (postBody) {
          if (!validation.validString(postBody)) throw "Body not valid";
          updatedPostData.postBody = postBody;
        }
        if (postPicture) {
          updatedPostData.postPicture = finalImg;
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

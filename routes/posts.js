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
const { users } = require("../config/mongoCollections");
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

router.route("/filter").get(async (req, res) => {
  let userId = req.session.user;
  if (userId) {
    return res.render("search", { userLoggedIn: true });
  } else {
    return res.redirect("/login");
  }
});

router.route("/filter").post(async (req, res) => {
  let userId = req.session.user;
  if (userId) {
    const search = req.body;
    let errors = [];
    // if (!search.key) {
    //   return res.redirect("/");
    // }
    var b = {};
    if (Object.keys(search).length === 0) {
      return res.status(401).render("posts/searchDetails",{errors:["Please provide atleast one search input"],hasErrors:true,userLoggedIn:true});
    }
    if (search.preference.drinking) {
      if (!validation.validString(search.preference.drinking))
        errors.push("Not a valid input");
      b["preference.drinking"] = search.preference.drinking;
    }
    if (search.preference.smoking) {
      if (!validation.validString(search.preference.smoking))
        errors.push("Not a valid input");
      b["preference.smoking"] = search.preference.smoking;
    }
    try {
      if (search.preference.food) {
        validation.validArray(search.preference.food, "food");
        b["preference.food"] = search.preference.food;
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
      return res.render("error", { userLoggedIn: true });
    }
  } else {
    return res.redirect("/login");
  }
  try {
    let searchList = await posts.filterSearch(b);
    if(searchList.length===0){
      let error=["No posts were found for your search!"]
      return res.render("posts/searchDetails",{hasErrors:true,userLoggedIn:true,errors:error})
    }
    return res.render("posts/searchDetails", {
      searchList: searchList,
      userLoggedIn: true,
    });
  } catch (e) {
    return res.render("error", { hasErrors:true,userLoggedIn: true ,errors:e});
    //return res.render("",e)
  }
});

router.route("/").get(async (req, res) => {
  try {
    let userId = req.session.user;

    const postList = await posts.getAllPosts();

    if (userId) {
      return res.render("posts/index", { posts: postList, userLoggedIn: true });
    } else {
      return res.render("posts/index", { posts: postList, userLoggedIn: false });
    }
  } catch (e) {
    res.status(500).render("error"); //PLEASE CHECK
  }
});

router.route("/add").get(async (req, res) => {
  if (req.session.user) {
    res.render("posts/createPost", { userLoggedIn: true });
  } else {
    res.redirect("/login");
  }
});
router.route("/delete/:id").get(async (req, res) => {
  let errors = [];
  if (
    !req.params.id ||
    typeof req.params.id != "string" ||
    req.params.id.trim().length == 0 ||
    !ObjectId.isValid(req.params.id)
  ) {
    errors.push("not valid string");
  }
  if (errors.length > 0) {
    // return res.status(200).json(errors);
    return res.status(400).render("posts/deletePost", {
      errors: errors,
      hasErrors: true,
    });
  }
  // try {
  //   req.params.id = validation.validId(req.params.id);
  // } catch (e) {
  //   return res.status(400).json({ error: e });
  // }
  if (req.session.user) {
    try {
      const id = req.params.id;
      const post = await posts.getPostById(id);
      //return res.status(200).json(post);
      res.render("posts/deletePost", { post: post, userLoggedIn:true, hasErrors:true });
    } catch (e) {
      return res.status(500).render("error",{errors:e, userLoggedIn:true, hasErrors:true});
    }
  } else {
    res.redirect("/login");
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
    if (errors.length > 0) {
      return res.status(400).render("posts/createPost", {
        userLoggedIn: true,
        title: "Register",
        errors: errors,
        hasErrors: true,
      });
    }
    try {
      info.postTitle = xss(info.postTitle);
      info.postBody = xss(info.postBody);
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
      return res.render("error");
      //render error page
    }
  } else {
    return res.status(401).render("login", {
      errors: errors,
      hasErrors: true,
    });
  }
});
router.route("/:id").get(async (req, res) => {
  let errors = [];
  if (
    !req.params.id ||
    typeof req.params.id != "string" ||
    req.params.id.trim().length == 0 ||
    !ObjectId.isValid(req.params.id)
  ) {
    errors.push("not valid string");
  }
  if (errors.length > 0) {
    // return res.status(200).json(errors);
    return res.status(400).render("error", {
      errors: errors,
      hasErrors: true,
    });
  }
  // try {
  //   req.params.id = validation.validId(req.params.id);
  // } catch (e) {
  //   return res.status(400).json({ error: e });
  // }
  let userId = req.session.user;
  let canComment = false;

  if (userId) {
    try {
      let canComment = true;

      const id = req.params.id;
      const post = await posts.getPostById(id);

      //return res.status(200).json(post);
      res.render("posts/postDetails", {
        posts: post,
        canComment: canComment,
        userLoggedIn: true,
        hasErrors:true
      });
    } catch (e) {
      return res.status(500).render("error",{errors:e, userLoggedIn:true,hasErrors:true});
    }
  } else {
    return res.redirect("/login");
  }
});
router.route("/delete/:id").post(async (req, res) => {
  console.log("in del");
  errors = [];
  if (
    !req.params.id ||
    req.params.id.trim().length == 0 ||
    !ObjectId.isValid(req.params.id)
  ) {
    errors.push("not valid string");
  }
  if (errors.length > 0) {
    // return res.status(200).json(errors);
    return res.status(400).render("posts/editPost", {
      errors: errors,
      hasErrors: true,
    });
  }
  let userId = req.session.user;
  if (userId) {
    try {
      const postid = req.params.id;
      const post = await posts.removePostById(postid, userId);
      const postList = await posts.getAllPosts();
      return res.redirect("/users/myProfile")
    } catch (e) {
      //render error page
      return res.status(500).render("error",{error:e, userLoggedIn:true, hasErrors:true});
    }
  } else {
    return res.redirect("/login");
  }
});
router.route("/edit/:id").get(async (req, res) => {
  console.log("edit");
  if (req.session.user) {
    try{
    const id = req.params.id;
    const post = await posts.getPostById(id);
    if(post===null){
      return []
    }
    post._id=post._id.toString();
    return res.render("posts/editPost", {
      id: req.params.id,
      postInfo: post,
      userLoggedIn: true,
    });
    }
    catch(e){
      return res.render("error",{error:e,hasErrors:true,userLoggedIn:true})
    }
    
  } else {
    return res.redirect("/login");
  }
});
router
  .route("/edit/:id")
  .post(upload.single("postPicture"), async (req, res) => {
    console.log("inside post edit ");
    const info = req.body;
    let userId = req.session.user;
    let updatedPostData = {};
    let errors = [];
    if (
      !req.params.id ||
      req.params.id.trim().length == 0 ||
      !ObjectId.isValid(req.params.id)
    ) {
      errors.push("not valid string");
    }
    if (errors.length > 0) {
      // return res.status(200).json(errors);
      return res.status(400).render("posts/editPost", {
        errors: errors,
        hasErrors: true,
      });
    }
    if (userId) {
      console.log("in put post route");
      postId = validation.validId(req.params.id);

      // try {
      //   postId = validation.validId(req.params.id);
      // } catch (e) {
      //   return res.status(400).json({ error: e });
      // }
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
          if (!validation.validString(postTitle)) {
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
        return res.redirect("/posts/"+postId);
        // res.status(200).json(post);
        // return res.status(200).render("posts/index", { posts: postList, userLoggedIn: true });
      } catch (e) {
        //add res.render
        return res.status(500).render("error",{userLoggedIn:true,hasErrors:true});
      }
    } else {
      //handle error
      return res.redirect("/login");
    }
  });

module.exports = router;

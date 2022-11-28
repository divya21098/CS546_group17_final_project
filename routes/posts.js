// all posts routes
const express = require("express");
const router = express.Router();
const data = require("../data/");
const posts = data.posts;
const validation = require("../helper");
// const session = require("express-session");

//all posts
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
router.route("/:id").get(async (req, res) => {
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
});
//add post
router.route("/add").post(async (req, res) => {
  const info = req.body;
  // const info.postTitle = validation.validString(info.postTitle)
  // const info.postBody = validation.validString(info.postBody)

  try {
    const { postTitle, postBody } = info;
    const post = await posts.createPost(postTitle, postBody);
    res.status(200).json(post);
  } catch (e) {
    console.log(e);
  }
});
//
router.route("/:id").delete(async (req, res) => {
  try {
    req.params.id = validation.validId(req.params.id);
  } catch (e) {
    return res.status(400).json({ error: e });
  }
  try {
    const id = req.params.id;
    const movie = await posts.removePostById(id);
    res.status(200).json(movie);
  } catch (e) {
    res.status(404).json({ error: "No post with id" });
  }
});
router.route("/search").get(async (req, res) => {});

router.route("/userPost").get(async (req, res) =>{
  try{
    
  }
  catch(e){

  }
})
module.exports = router;

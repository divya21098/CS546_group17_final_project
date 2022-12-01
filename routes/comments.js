//comment routes
const express = require("express");
const router = express.Router();
const data = require("../data/");
const post = data.posts;
const commentData = data.comments;
const validation = require("../helper");

router
  .route("/:postId")
  .get(async (req, res) => {
    try {
      req.params.postId = validation.validId(req.params.postId);
    } catch (e) {
      return res.status(400).json({ error: e });
    }
    try {
      const postId = req.params.postId;
      await post.getPostById(postId);
    } catch (e) {
      return res.status(404).json({ error: "No post with id" });
    }
    try {
      const postId = req.params.postId;
      // console.log(postId);
      const comment = await commentData.getAllComments(postId);
      res.status(200).json(comment);
    } catch (e) {
      res.status(404).json({ error: "No comment with id" });
    }
  })
  .post(async (req, res) => {
    let commentInfo = req.body;
    if (!commentInfo) {
      res
        .status(400)
        .json({ error: "You must provide data to create a review" });
      return;
    }
    if (req.session.user) {
      try {
        commentInfo.commentText = validation.validString(
          commentInfo.commentText
        );
        commentInfo.userId = validation.validId(req.session.user);
        const postId = validation.validId(req.params.postId);
        await post.getPostById(postId);
      } catch (e) {
        return res.status(404).json({ error: "No post with id" });
      }
      try {
        console.log("in comm create routes");
        const post = await commentData.createComment(
          req.params.postId,
          commentInfo.userId,
          commentInfo.commentText.trim()
        );
        res.render("posts/postDetails", { posts: post });
      } catch (e) {
        res.status(400).json({ error: "Comment cannot be created" });
      }
    } else {
      res.status(401).json({ user: "not auth" });
    }
  });

//to discuss whether needed
router
  .route("/comment/:postId")
  .get(async (req, res) => {})
  .delete(async (req, res) => {});
module.exports = router;

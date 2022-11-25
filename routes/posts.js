// all posts routes
const express = require("express");
const router = express.Router();

//all posts
router.route("/").get(async (req, res) => {});
//post by id
router.route("/:id").get(async (req, res) => {});
//add post
router.route("/add").get(async (req, res) => {});
router.route("/").get(async (req, res) => {});
router.route("/").get(async (req, res) => {});

module.exports = router;

// index file for all data
const userData = require("./users");
const postData = require("./posts");
const commentData = require("./comments");

module.exports = {
  users: userData,
  posts: postData,
  comments: commentData,
};

//post route
const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const { ObjectId } = require("mongodb");
const comments = mongoCollections.comments;
const createPost = async (
  postTitle,
  postDate,
  postBody,
  mapCordinate,
  image,
  comments,
  preference
) => {
  console.log("in post data");
};

const getAllPosts = async () => {};
const getPostById = async (id) => {};
const removePostById = async (id) => {};
const updatePostbyId = async (id) => {};
const getPostByuserId = async (id) => {};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  removePostById,
  updatePostbyId,
  getPostByuserId,
};

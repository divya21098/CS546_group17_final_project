//post route
const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const comments = mongoCollections.comments;
const validation = require("../helper");

const createPost = async (
  postTitle,
  postBody,
  mapCordinate,
  image,
  preference
) => {
  console.log("in post data");

  if (!validation.validString(postTitle) || !validation.validString(postBody))
    throw "All fields need to have valid values";
  // if (!validation.isValidDate(postDate)) throw "date is not valid";
  const date = new Date();

  let day = date.getDate();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = String(date.getFullYear()).padStart(2, "0");
  let currentDate = `${month}/${day}/${year}`;
  let newPost = {
    postTitle: postTitle,
    postDate: currentDate,
    postBody: postBody,
    comments: [],
  };

  const postCollection = await posts();

  const insertInfo = await postCollection.insertOne(newPost);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0)
    throw "could not add post";
  const newId = insertInfo.insertedId;
  const newIDString = String(newId);
  const post = await getPostById(newIDString);
  post._id = post._id.toString();
  return post;
};
//post listing
const getAllPosts = async () => {
  const postCollection = await posts();
  const postList = await postCollection.find({}).toArray();
  if (!postList) throw "No post with that id";
  //convert id to string
  for (let post of postList) {
    post._id = post._id.toString();
  }
  if (postList.length == 0) return [];
  return postList;
};
//post individual
const getPostById = async (id) => {
  const postId = validation.validId(id);
  const postCollection = await posts();
  const post = await postCollection.findOne({ _id: ObjectId(postId) });
  if (post === null) throw "No post with that id";
  return post;
};
//edit post once user login
const removePostById = async (id) => {
  postId = validation.validId(id);

  const postCollection = await posts();
  // const movie = await getMovieById(postId);

  const deletionInfo = await postCollection.deleteOne({
    _id: ObjectId(postId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${id}`;
  }
  return { postId: postId, deleted: true };
};
//edit post once user login
const updatePostbyId = async (id) => {};

//list of post user see after login
const getPostByuserId = async (id) => {
  //id = validation.checkId(id, 'ID');
  const userCollection = await users();
  const userinfo = await userCollection.findOne({_id: ObjectId(id)})
  // const postCollection = await posts();
  // const post = await postCollection.findAll({userId: userinfo.postId});

  if (!userinfo) throw 'Posts not found';
  return userinfo.postId;
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  removePostById,
  updatePostbyId,
  getPostByuserId,
};

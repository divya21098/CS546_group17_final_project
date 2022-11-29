//post route
const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const { ObjectId } = require("mongodb");
const userData = require("./users");
const users = mongoCollections.users;
const validation = require("../helper");

const createPost = async (
  userId,
  postTitle,
  postBody,
  // postPicture,
  mapCordinate,
  preference
) => {
  console.log("in post data");

  if (
    !validation.validString(postTitle) ||
    !validation.validString(postBody) ||
    !validation.validId(userId)
  )
    throw "All fields need to have valid values";
  // if (!postPicture || postPicture == "") {
  //   postPicture = "";
  // }
  // if (!validation.isValidDate(postDate)) throw "date is not valid";
  const date = new Date();
  let day = date.getDate();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = String(date.getFullYear()).padStart(2, "0");
  let currentDate = `${month}/${day}/${year}`;

  let newPost = {
    userId: userId,
    postTitle: postTitle,
    postDate: currentDate,
    postBody: postBody,
    comments: [],
    // postPicture: postPicture,
  };

  const postCollection = await posts();
  const userCollection = await users();
  const insertInfo = await postCollection.insertOne(newPost);
  if (!insertInfo.acknowledged || insertInfo.insertedCount === 0)
    throw "could not add post";
  else {
    const updatedInfo = await userCollection.updateOne(
      { _id: ObjectId(userId) },
      { $push: { postId: String(newPost._id) } }
    );
    if (updatedInfo.modifiedCount === 0) {
      throw "Could not update Restaurant Collection with Review Data!";
    }
  }
  const newId = insertInfo.insertedId;
  const newIDString = String(newId);
  const post = await getPostById(newIDString);
  // post._id = post._id.toString();
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
const removePostById = async (postid, userid) => {
  //check if it's a savedPost in other users then delete it  from other users
  postId = validation.validId(postid);
  userid = validation.validId(userid);
  const userCollection = await users();
  const postCollection = await posts();
  const post = await postCollection.findOne({ _id: ObjectId(postId) });
  if (post === null) throw "No post with that id";
  const deletionInfo = await postCollection.deleteOne({
    _id: ObjectId(postId),
  });

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete movie with id of ${id}`;
  }
  const userinfo = await userCollection.findOne({ _id: ObjectId(userid) });
  if (userinfo === null) throw "No user with that id";
  if (userinfo.postId.length > 0) {
    for (i = 0; i < userinfo.postId.length; i++) {
      if (userinfo.postId[i] === postid) {
        userinfo.postId.splice(i, 1);
      }
    }
    console.log(userinfo);
    await userData.updateUser(userid, { postId: userinfo.postId });
  }

  return { postId: postId, deleted: true };
};
//edit post once user login
const updatePostbyId = async (postId, userId, postTitle, postBody) => {
  let postid = validation.validId(postId); //small i
  let userid = validation.validId(userId);
  if (!validation.validString(postTitle) || !validation.validString(postBody))
    throw "All fields need to have valid values";
  const postCollection = await posts();
  // const movie = await getMovieById(postId);

  const post = await postCollection.findOne({ _id: ObjectId(postid) });
  if (post === null) throw "No post with that id";

  const date = new Date();

  let day = date.getDate();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = String(date.getFullYear()).padStart(2, "0");
  let currentDate = `${month}/${day}/${year}`;

  let updatedPost = {
    userId: userid,
    postTitle: postTitle,
    postDate: currentDate,
    postBody: postBody,
  };
  const updateInfo = await postCollection.updateOne(
    { _id: ObjectId(postid) },
    { $set: updatedPost }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Error: Update failed";

  const res = await getPostById(postid);
  return res;
};

//list of post user see after login
//list of post user see after login
const getPostByuserId = async (id) => {
  //id = validation.checkId(id, 'ID');
  id = validation.validId(id);
  const userCollection = await users();
  const userinfo = await userCollection.findOne({ _id: ObjectId(id) });
  if (userinfo === null) throw "No post with that id";

  let result = [];
  if (userinfo.postId.length > 0) {
    for (i = 0; i < userinfo.postId.length; i++) {
      result.push(await getPostById(userinfo.postId[i]));
    }
  }
  // const postCollection = await posts();
  // const post = await postCollection.findAll({userId: userinfo.postId});

  if (!result) throw "Posts not found";
  return result;
};
// const delPostByuserId = async (postid, userid) => {
//   userid = validation.validId(userid);
//   postid = validation.validId(postid);
//   const postCollection = await posts();
//   const postinfo = await postCollection.findOne({ _id: ObjectId(postid) });
//   if (postinfo === null) throw "No post with that id";

//   const removedPost = removePostById(postid, userid);
//   return removedPost;
// };
// const editPostByuserId = async (postid, userid) => {
//   userid = validation.validId(userid);
//   postid = validation.validId(postid);
//   const postCollection = await posts();
//   const postinfo = await postCollection.findOne({ _id: ObjectId(postid) });
//   if (postinfo === null) throw "No post with that id";

//   const removedPost = updatePostById(postid, userid);
//   return removedPost;
// };
const createSavedPost = async (postid, userid) => {
  postid = validation.validId(postid);
  userid = validation.validId(userid);
  const userCollection = await users();
  //const userinfo = await userCollection.findOne({ _id: ObjectId(userid) });
  //const userinfo = await userCollection.findOne({ _id: ObjectId(id) });
  //if (!userinfo) throw "No user exists";
  const updatedInfo = await userCollection.updateOne(
    { _id: ObjectId(userid) },
    { $push: { savedPost: String(postid) } }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not add posts to favourite!";
  }
  return { savedPost: "True" };
};

const getSavedPostByuserId = async (id) => {
  id = validation.validId(id);
  const userCollection = await users();
  const userinfo = await userCollection.findOne({ _id: ObjectId(id) });
  if (userinfo === null) throw "No user with that id";

  let result = [];
  if (userinfo.savedPost.length > 0) {
    for (i = 0; i < userinfo.savedPost.length; i++) {
      result.push(await getPostById(userinfo.savedPost[i]));
    }
  }
  // const postCollection = await posts();
  // const post = await postCollection.findAll({userId: userinfo.postId});

  if (!result) {
    return [];
  }
  return result;
};

const removeSavedPostByuserId = async (postid, userid) => {
  postid = validation.validId(postid);
  userid = validation.validId(userid);
  const userCollection = await users();
  const userinfo = await userCollection.findOne({ _id: ObjectId(userid) });
  console.log(userinfo);
  if (userinfo === null) throw "No user with that id";
  const userWithPost = await userData.getUserById(userid);
  if (!userWithPost) throw "user with that id not present";
  if (userWithPost.postId.length > 0) {
    for (i = 0; i < userWithPost.postId.length; i++) {
      if (userWithPost.postId == postid) {
        userWithPost.postId.splice(i, 1);
      }
    }
  }
  if (userinfo.savedPost.length > 0) {
    for (i = 0; i < userinfo.savedPost.length; i++) {
      if (userinfo.savedPost[i] === postid) {
        userinfo.savedPost.splice(i, 1);
      }
    }
    console.log(userinfo);
    await userData.updateUser(userid, { savedPost: userinfo.savedPost });
  }

  // const postCollection = await posts();
  // const post = await postCollection.findAll({userId: userinfo.postId});
  return { updated: "true" };
};
module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  removePostById,
  updatePostbyId,
  getPostByuserId,
  getSavedPostByuserId,
  removeSavedPostByuserId,
  createSavedPost,
};

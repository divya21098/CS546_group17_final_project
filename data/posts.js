//post route
const mongoCollections = require("../config/mongoCollections");
const posts = mongoCollections.posts;
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const userData = require("./users");
// const users = mongoCollections.users;
const validation = require("../helper");

const createPost = async (userId, postTitle, postBody, postPicture) => {
  console.log("in post data");

  if (
    !validation.validString(postTitle) ||
    !validation.validString(postBody) ||
    !validation.validId(userId)
  )
    throw "All fields need to have valid values";
  if (!postPicture || postPicture == "") {
    postPicture = "";
  }

  const date = new Date();
  let day = date.getDate();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = String(date.getFullYear()).padStart(2, "0");
  let currentDate = `${month}/${day}/${year}`;
  let preference = {};
  let userinfo = await userData.getUserById(userId);
  if (userinfo === null) throw "user not found";
  preference = userinfo.preference;
  let location = userinfo.preference.location;

  let newPost = {
    userId: userId,
    postTitle: postTitle,
    postDate: currentDate,
    postBody: postBody,
    comments: [],
    preference: preference,
    postPicture: postPicture,
    latitude: validation.map_cord(location)[0],
    longitude: validation.map_cord(location)[1],
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
  const postList = await postCollection
    .find({})
    .sort({ postDate: -1 })
    .toArray();
  if (!postList) throw "No post with that id";
  //convert id to string
  for (let post of postList) {
    post._id = post._id.toString();
    let u =  await userData.getUserById(post.userId)
    post.userId = u.firstName+" "+u.lastName
  }
  if (postList.length == 0) return [];
  // console.log(postList.sort((a, b) => a.postDate - b.postDate));
  return postList
};
//post individual
const getPostById = async (id) => {
  const postId = validation.validId(id);
  const postCollection = await posts();
  const post = await postCollection.findOne({ _id: ObjectId(postId) });
  if (post === null) throw "No post with that id";
  let u =  await userData.getUserById(post.userId)
  post.userId = u.firstName+" "+u.lastName
  return post;
};
//edit post once user login
const removePostById = async (postid, userid) => {
  //check if it's a savedPost in other users then delete it  from other users
  postid = validation.validId(postid);
  userid = validation.validId(userid);
  const userCollection = await users();
  const postCollection = await posts();
  const post = await postCollection.findOne({ _id: ObjectId(postid) });
  if (!post) throw "No post with that id";
  // const deletionInfo = await postCollection.deleteOne({
  //   _id: ObjectId(postid),
  // });

  // if (deletionInfo.deletedCount === 0) {
  //   throw `Could not delete post with id of ${id}`;
  // }
  const userinfo = await userCollection.findOne({ _id: ObjectId(userid) });
  if (userinfo === null) throw "No user with that id";
  let flag = false;
  if (userinfo.postId.length > 0) {
    for (i = 0; i < userinfo.postId.length; i++) {
      if (userinfo.postId[i] === postid) {
        userinfo.postId.splice(i, 1);
        flag = true;
      }
    }
  }
  if (flag) {
    var deletionInfo = await postCollection.deleteOne({
      _id: ObjectId(postid),
    });
  } else {
    throw "Not allowed to deleted";
  }

  if (deletionInfo.deletedCount === 0) {
    throw `Could not delete post with id of ${id}`;
  }
  await userData.updateUser(userid, { postId: userinfo.postId });

  return { deleted: true };
};
//edit post once user login
const updatePostbyId = async (postId, userId, updatedPost) => {
  let postid = validation.validId(postId); //small i
  let userid = validation.validId(userId);
  let updatedPostData = {};

  if (
    !validation.validString(updatedPost.postTitle) ||
    !validation.validString(updatedPost.postBody)
  )
    throw "All fields need to have valid values";
  if (updatedPost.postBody) {
    updatedPost.postBody = validation.trimString(updatedPost.postBody);
    updatedPostData.postBody = updatedPost.postBody;
  }
  if (updatedPost.postTitle) {
    updatedPost.postTitle = validation.trimString(updatedPost.postTitle);

    updatedPostData.postTitle = updatedPost.postTitle;
  }
  if (updatedPost.postPicture) {
    updatedPostData.postPicture = updatedPost.postPicture;
  }
  updatedPostData.userId = userid;
  const postCollection = await posts();
  // const movie = await getMovieById(postId);

  const post = await postCollection.findOne({ _id: ObjectId(postid) });
  if (post === null) throw "No post with that id";

  const date = new Date();

  let day = date.getDate();
  let month = String(date.getMonth() + 1).padStart(2, "0");
  let year = String(date.getFullYear()).padStart(2, "0");
  let currentDate = `${month}/${day}/${year}`;
  updatedPostData.userId = userid;
  updatedPostData.currentDate = currentDate;

  const updateInfo = await postCollection.updateOne(
    { _id: ObjectId(postid) },
    { $set: updatedPostData }
  );
  if (!updateInfo.matchedCount && !updateInfo.modifiedCount)
    throw "Error: Update failed";

  const res = await getPostById(postid);
  return res;
};

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

  if (!result) throw "Posts not found";
  return result;
};

const createSavedPost = async (postid, userid) => {
  postid = validation.validId(postid);
  userid = validation.validId(userid);
  const userCollection = await users();
  const userinfo = await userCollection.findOne({ _id: ObjectId(userid) });
  if (!userinfo) throw "No user exists";
  if (userinfo.postId.length > 0) {
    for (i = 0; i < userinfo.postId.length; i++) {
      if (userinfo.postId == postid) throw "cant save own post";
    }
  }

  if (userinfo.postId)
    if (userinfo.savedPost.length > 0) {
      for (i = 0; i < userinfo.savedPost.length; i++) {
        if (userinfo.savedPost[i] == postid) throw "Cant save post again";
      }
    }
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
      const post = await getPostById(userinfo.savedPost[i]);
      result.push(post);
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
  //const userCollection = await users();
  // const userinfo = await userCollection.findOne({ _id: ObjectId(userid) });
  // console.log(userinfo);
  // if (userinfo === null) throw "No user with that id";
  const userinfo = await userData.getUserById(userid);
  if (!userinfo) throw "user with that id not present";
  // if (userWithPost.postId.length > 0) {
  //   for (i = 0; i < userWithPost.postId.length; i++) {
  //     if (userWithPost.postId == postid) {
  //       userWithPost.postId.splice(i, 1);
  //     }
  //   }
  // }
  if (userinfo.savedPost.length > 0) {
    for (i = 0; i < userinfo.savedPost.length; i++) {
      if (userinfo.savedPost[i] === postid) {
        userinfo.savedPost.splice(i, 1);
      }
    }
    // console.log(userinfo);
    await userData.updateUser(userid, { savedPost: userinfo.savedPost });
  }

  // const postCollection = await posts();
  // const post = await postCollection.findAll({userId: userinfo.postId});
  return { updated: "true" };
};

const addPostPicture = async (postid, postPicture) => {
  postid = validation.validId(postid);

  const postCollection = await posts();
  let updatedPostData = {};
  let gotten = await this.getPostById(postid);
  if (!gotten) throw "post doesnt exist";

  updatedPostData.postPicture = postPicture;
  const updateInfo = await postCollection.updateOne(
    { _id: postid },
    { $set: updatedPostData }
  );
  if (updateInfo.modifiedCount === 0 && updateInfo.deletedCount === 0)
    throw "could not update user";
  return await this.getPostById(postid);
};
const filterSearch = async (searchFilter) => {
  //   searchFilter={
  //   "preference": {
  //     "drinking": false,
  //     "smoking": false,
  //     "food": [
  //         "veg"
  //     ],
  //     "budget": "1500$-2000$",
  //     "room": [
  //         "private",
  //         "sharing"
  //     ],
  //     "home_type": [
  //         "Condo",
  //         "Apartment"
  //     ],
  //     "location": [
  //         "Newport",
  //         "Hoboken"
  //     ]
  // }
  // }
  //let allPost =  await getAllPosts()
  const postCollection = await posts();
  if (Object.keys(searchFilter).length === 0) {
    throw "Preference is not valid";
  }
  if (searchFilter["preference.drinking"]) {
    searchFilter["preference.drinking"] = {
      $all: [searchFilter["preference.drinking"]],
    };
  }
  if (searchFilter["preference.smoking"]) {
    searchFilter["preference.smoking"] = {
      $all: [searchFilter["preference.smoking"]],
    };
  }
  if (searchFilter["preference.food"]) {
    if (typeof searchFilter["preference.food"] === "string")
      searchFilter["preference.food"] = {
        $all: [searchFilter["preference.food"]],
      };
    else
      searchFilter["preference.food"] = {
        $all: searchFilter["preference.food"],
      };
  }

  if (searchFilter["preference.room"]) {
    if (typeof searchFilter["preference.room"] === "string")
      searchFilter["preference.room"] = {
        $all: [searchFilter["preference.room"]],
      };
    else
      searchFilter["preference.room"] = {
        $all: searchFilter["preference.room"],
      };
  }
  if (searchFilter["preference.home_type"]) {
    if (typeof searchFilter["preference.home_type"] === "string")
      searchFilter["preference.home_type"] = {
        $all: [searchFilter["preference.home_type"]],
      };
    else
      searchFilter["preference.home_type"] = {
        $all: searchFilter["preference.home_type"],
      };
  }
  if (searchFilter["preference.location"]) {
    searchFilter["preference.location"] = {
      $all: [searchFilter["preference.location"]],
    };
  }
  const filteredPost = await postCollection.find(searchFilter).toArray();
  if (filteredPost.length === 0) {
    return "No results found";
  }
  return filteredPost;
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
  addPostPicture,
  filterSearch,
};

// all comments data
const mongoCollections = require("../config/mongoCollections");
const { ObjectId } = require("mongodb");
const validation = require("../helper");
// const comments = mongoCollections.comments;
const users = mongoCollections.users;
const posts = mongoCollections.posts;

const createComment = async (postId, userId, commentText) => {
  if (!validation.validString(postId)) throw "postId must be given as a string";
  if (!validation.validString(userId)) throw "userId must be given as a string";
  if (!validation.validString(commentText))
    throw "must give comment text as a string";

  const postCollections = await posts();
  const samePost = await postCollections.findOne({
    _id: ObjectId(postId),
  });

  if (samePost === null) throw "Post to which comment added doesnt exist";

  let newComment = {
    // postId: postId,
    _id: new ObjectId(),

    userId: userId,
    commentText: commentText,
  };
  // const commentCollection = await comments();

  // const insertInfo = await commentCollection.insertOne(newComment);
  const postsCollection = await posts();
  const usersCollection = await users();

  //Add the comment id to the review
  const updatedInfo = await postsCollection.updateOne(
    { _id: ObjectId(postId) },
    { $push: { comments: newComment } }
  );
  if (updatedInfo.modifiedCount === 0) {
    throw "Could not update Post Collection with comment Data!";
  }
  //Add the comment id to the user
  // const updatedInfo2 = await usersCollection.updateOne({ _id: objIdForUser }, { $push: { commentIds: String(newComment._id) } });
  // if (updatedInfo2.modifiedCount === 0) {
  //     throw 'Could not update Users Collection with Review Data!';
  // }

  // const newId = insertInfo.insertedId;
  const post = await postCollections.findOne({ _id: ObjectId(postId) });
  if (post === null) throw "No movie found with that id";

  post._id = post._id.toString();
  return post;
};

const getComment = async (id) => {
  if (!validation.validString(id)) throw "id must be given";
  if (typeof id === "string") id = ObjectId.createFromHexString(id);
  let resultData = {};
  const postsCollection = await posts();
  const post = await postsCollection.find({}).toArray();

  if (post === null) throw "No review present with that Id";

  post.forEach((element) => {
    element.comments.forEach((data) => {
      if (data._id.toString() === id) {
        resultData = {
          _id: data._id,
          userName: data.userName,

          commentText: data.commentText,
        };
      }
    });
  });
  resultData._id = resultData._id.toString();
  return resultData;
};

const getAllComments = async (postId) => {
  if (!validation.validString(postId)) throw "id must be given";

  const postsCollection = await posts();
  const post = await postsCollection.findOne({ _id: ObjectId(postId) });
  if (post === null) throw "No post present with that Id";

  // console.log(post);
  post.comments.forEach((element) => {
    element._id = element._id.toString();
  });
  return post.comments;
};

const removeComment = async (commentId) => {
  commentId = validation.isValidId(commentId);
  // const commentCollection = await comments();
  // let comment = await getComment(commentId);
  console.log(commentId);

  try {
    const postCollection = await posts();
    const post = await postCollection.find({}).toArray();
    if (post === null)
      throw "Post you are trying to remove a review for does not exist";
    post.forEach((element) => {
      element.comments.forEach((data) => {
        if (data._id.toString() === commentId) {
          postId = element._id;
        }
      });
    });
    const removeComment = await postCollection.updateOne(
      {},
      { $pull: { comments: { _id: ObjectId(commentId) } } }
    );

    if (!removeComment.matchedCount && !removeComment.modifiedCount)
      throw [400, "Removal of comment has failed"];
    const updatedPost = await postCollection.findOne({
      _id: ObjectId(postId),
    });

    return updatedPost;
  } catch (e) {
    throw "Could not Delete Comment from Review while Deleting Comment!";
  }
};

module.exports = {
  removeComment,
  getAllComments,
  getComment,
  createComment,
};

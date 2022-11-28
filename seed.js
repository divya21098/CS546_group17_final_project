const dbConnection = require("./config/mongoConnection");
const posts = require("./data/posts");
const comments = require("./data/comments");
// const { post } = require("./routes/posts");
// const reviews = require("../data/reviews")

const main = async () => {
  const db = await dbConnection.dbConnection();
  // await db.dropDatabase();
  try {
    // const post = await posts.createPost("divya", "test1");
    // console.log(await posts.getPostById("6380d2ff87039e2ff5827cb3"));
    // console.log(await posts.removePostById("637ec2aae471a43138a3ac9e"));
    // console.log(await posts.getAllPosts());
    // const comment = await comments.createComment(
    //   "6380d2ff87039e2ff5827cb3",
    //   "harsh",
    //   "Its a not good place."
    // );
    console.log(await comments.getAllComments("6380d2ff87039e2ff5827cb3"));
    console.log(await comments.removeComment("6380d36a8dd7380708d0aab5"));
  } catch (e) {
    console.log(e);
  }

  await dbConnection.closeConnection();
};
main();

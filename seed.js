const dbConnection = require("./config/mongoConnection");
const posts = require("./data/posts");
const comments = require("./data/comments");
const users  = require("./data/users");
// const { createUser } = require("./data/users");
// const { post } = require("./routes/posts");
// const reviews = require("../data/reviews")

const main = async () => {
  const db = await dbConnection.dbConnection();
  // await db.dropDatabase();
//   try {
//     // const post = await posts.createPost("divya", "test1");
//     // console.log(await posts.getPostById("6380d2ff87039e2ff5827cb3"));
//     // console.log(await posts.removePostById("637ec2aae471a43138a3ac9e"));
//     // console.log(await posts.getAllPosts());
//     // const comment = await comments.createComment(
//     //   "6380d2ff87039e2ff5827cb3",
//     //   "harsh",
//     //   "Its a not good place."
//     // );
//     console.log(await comments.getAllComments("6380d2ff87039e2ff5827cb3"));
//     console.log(await comments.removeComment("6380d36a8dd7380708d0aab5"));
//   } catch (e) {
//     console.log(e);
//   }

<<<<<<< HEAD
//   await dbConnection.closeConnection();
// };

// try {
//   const user = await users.createUser(
//     "dhriti",
//     "shah",
//     "dshah@stevens.edu",
//     "qwerty@123",
//     60,
//     "5512478555",
//     "F",
//     "Nigerian",
//     "I am a good gul, I am happy!",
//     "drinking"
//   );

//   console.log(user);
// } catch (e) {
//   console.log(e);
// }
//   console.log("Done seeding database");
//   await dbConnection.closeConnection();
// }

try {
  console.log(await posts.getPostByuserId("6384227c1854524310cea020"));
} catch (e) {
  console.log(e);
}
  console.log("Done seeding database");
  await dbConnection.closeConnection();
}

main();






=======
  await dbConnection.closeConnection();
};
main();
>>>>>>> 7616a0aff4547afb0f89f233c32bc3167b14d1ae

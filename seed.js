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

// const dbConnection = require("../config/mongoConnection");
// const movies = require("../data/movies");
// const reviews = require("../data/reviews");

// const main = async () => {
//   const db = await dbConnection.dbConnection();
//   await db.dropDatabase();
//   const hackers = await movies.createMovie(
//     "Hackers",
//     "Hackers are blamed for making a virus that will capsize five oil tankers.",
//     ["Crime", "Drama", "Romance"],
//     "PG-13",
//     "United Artists",
//     "Iain Softley",
//     ["Jonny Miller", "Angelina Jolie", "Matthew Lillard", "Fisher Stevens"],
//     "09/15/1995",
//     "1h 45min"
//   );
//   const movieid = hackers._id;
//   const hackers_review = await reviews.createReview(
//     movieid,
//     "Meh...",
//     "Patrick Hill",
//     "This movie was good. It was entertaining, but as someone who works in IT, it was not very realistic",
//     2.5
//   );
//   console.log(hackers_review);
//   const hackers_review1 = await reviews.createReview(
//     movieid,
//     "Meh...",
//     "Patrick Hill",
//     "This movie was good. It was entertaining, but as someone who works in IT, it was not very realistic",
//     4.5
//   );
//   console.log(hackers_review1);
//   const allrev = await reviews.getAllReviews(movieid);
//   console.log(allrev);
//   const nemo = await movies.createMovie(
//     "Finding Nemo",
//     "Marlin (Albert Brooks), a clown fish, is overly cautious with his son, Nemo (Alexander Gould), who has a foreshortened fin. When Nemo swims too close to the surface to prove himself, he is caught by a diver, and horrified Marlin must set out to find him. A blue reef fish named Dory (Ellen DeGeneres) -- who has a really short memory -- joins Marlin and complicates the encounters with sharks, jellyfish, and a host of ocean dangers. Meanwhile, Nemo plots his escape from a dentist's fish tank.",
//     ["Comedy", "Adventure", "Animation"],
//     "PG-13",
//     " Walt Disney Pictures",
//     "Andrew Stanton",
//     ["Alexender Gould", "Albert Brooks", "Ellen Lee DeGeneres"],
//     "05/30/2003",
//     "1h 40min"
//   );
//   var nemo_id = nemo._id.toString();
//   const nemo_rev = await reviews.getAllReviews(nemo_id);
//   console.log(nemo_rev);
//   const nemoo = hackers_review._id;
//   const rem = await reviews.getReview(nemoo);
//   console.log(rem);

//   console.log("Done seeding database");
//   await dbConnection.closeConnection();
// };
// main();

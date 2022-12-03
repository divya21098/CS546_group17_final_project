const dbConnection = require("./config/mongoConnection");
const posts = require("./data/posts");
const comments = require("./data/comments");
const users  = require("./data/users");



const main = async () => {
  const db = await dbConnection.dbConnection();
  // await db.dropDatabase();


  // const U1 = await users.createUser("Divya", "Kamath", "dkamath@stevens.edu", "Test@123", 24, "5512478555", "F", "American", " am a good gul, I am happy!", {"location":'Hobojken'});

//   {
//     "firstName": "Divya",
//     "lastName": "Kamath",
//     "emailId": "dkamath@stevens.edu",
//     "password": "Test@123",
//     "age": 24,
//     "phoneNumber": "5512478555",
//     "gender": "F",
//     "nationality": "American",
//     "aboutMe": "I am a good gul, I am happy!",
//     "preference": {
//         "drinking": false,
//         "smoking": false,
//         "food": [
//             "veg"
//         ],
//         "budget": "1500$-2000$",
//         "room": [
//             "private",
//             "sharing"
//         ],
//         "home_type": [
//             "Condo",
//             "Apartment"
//         ],
//         "location": [
//             "Newport",
//             "Hoboken"
//         ]
//     }
// }



  const P1 = await posts.createPost("638bc858b679e6e7d349d676", "ABC", "Pizza", "");

  // userId,
  // postTitle,
  // postBody,
  // postPicture,
  // latitude,
  // longitude



  console.log('Done seeding....');
	await dbConnection.closeConnection();
};

main().catch(error => {
    console.log(error);
});
//user routes
//post route
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const validator = require("../helper");
const bcrypt = require("bcryptjs");
const saltRounds = 10;

const createUser = async (
  firstName,
  lastName,
  emailId,
  password,
  age,
  phoneNumber,
  gender,
  nationality,
  aboutMe,
  preference
) => {
  if (!validator.validStringBool(firstName)|| !validator.validName(firstName))
    throw "First name is not a valid string.";
  if (!validator.validStringBool(lastName)|| !validator.validName(lastName))
    throw "Last name is not a valid string.";
  if (!validator.validEmail(emailId)) throw "Email is not a valid string.";
  let email = emailId.toLowerCase();
  if (typeof age === "string") {
    age = parseInt(age);
  }
  if (!validator.validAge(age)) throw "Age must be a positive integer";
  if (!validator.validPassword(password)) throw "Password is not a valid string.";
  validator.validatePhoneNumber(phoneNumber);
  if (!validator.validStringBool(aboutMe)) throw "About  Me is not a valid string.";
  //nationality call use npm package in drop down box to be called on client side
  if (!validator.validStringBool(nationality))
    throw "Nationality is not a valid string.";
  //preference  in drop down box to be called on client side
  //gender - Male, Female, Others drop box
  if (!validator.validStringBool(gender)) throw "Gender is not a valid string.";
  if (preference.length < 0) {
    throw `There should be atleast one preference`;
  }
  if(preference.drinking){
    if(!validator.validStringBool(preference.drinking)) throw "Not a type boolean"

  }
  if(preference.smoking){
    if(!validator.validStringBool(preference.smoking))  throw "Not a type booolean"
  }

  if(preference.food){
    validator.validArray(preference.food,"food")
  }
  if(preference.room){
    validator.validArray(preference.room,"room")
  }
  if(preference.location){
    validator.validArray(preference.location,"location")
  }
  if(preference.home_type){
    validator.validArray(preference.home_type,"home type")
  }
  /*
  {
  "drinking":"true",
	"smoking":"false",
	"food": "veg",
	"budget":"40$",
	"room":["private","sharing"],
	"home_type":["Condo"],
	"location":["Newport"],
	"roomate_count": "2"
}
  */
  /*before storing email and username into DB, make sure there are no duplicate entries of email in DB */
  const allUsers = await getAllUsers();
  if (allUsers.length !== 0) {
    allUsers.forEach((user) => {
      if (user.emailId === validator.trimString(email))
        throw "An account is already created with the provided email id.";
    });
  }
  //create hashed password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  firstName = validator.trimString(firstName);
  lastName = validator.trimString(lastName);
  emailId = validator.trimString(email);
  phoneNumber = validator.trimString(phoneNumber);
  gender = validator.trimString(gender);
  nationality = validator.trimString(nationality);
  aboutMe = validator.trimString(aboutMe);
  /* Add new user to DB */
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    emailId: emailId.toLowerCase(),
    password: hashedPassword,
    age: age,
    phoneNumber: phoneNumber,
    gender: gender,
    nationality: nationality,
    aboutMe: aboutMe,
    preference: preference,
    postId: [],
    commentId: [],
    savedPost: [],
  };
  console.log("new user dict");
  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add user.";
  console.log("insert done");
  const newId = insertInfo.insertedId;
  const userDetail = await getUserById(newId.toString());
  console.log("user hi");
  return userDetail;
};

const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (userList.length === 0) return [];
  return userList;
};

const getUserById = async (id) => {
  if (!validator.validString(id)) throw "id must be given";
  validator.validId(id);
  id = validator.trimString(id);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "user with that id does not exist";
  return user;
};

const updateUser = async (id, updatedUser) => {
  let updatedUserData = {};
  if (!validator.validString(id)) throw "id must be given";
  id = validator.validId(id);
  id = validator.trimString(id);
  // let = await getUserById(id);
  if (updatedUser.firstName) {
    if (!validator.validStringBool(updatedUser.firstName)|| !validator.validName(updatedUser.firstName))
      throw "First name is not a valid string.";
    updatedUser.firstName = validator.trimString(updatedUser.firstName);
    updatedUserData.firstName = updatedUser.firstName;
  }
  if (updatedUser.lastName) {
    if (!validator.validStringBool(updatedUser.lastName)|| !validator.validName(updatedUser.lastName))
      throw "Last name is not a valid string.";
    updatedUser.lastName = validator.trimString(updatedUser.lastName);
    updatedUserData.lastName = updatedUser.lastName;
  }

  if (updatedUser.age) {
    if (typeof updatedUser.age === "string") {
      updatedUser.age = parseInt(updatedUser.age);
    }
    if (!validator.validAge(updatedUser.age))
      throw "Age must be a positive integer";
    //updatedUser.age = validator.trimString(updatedUser.age);
    updatedUserData.age = updatedUser.age;
  }

  if (updatedUser.phoneNumber) {
    validator.validatePhoneNumber(updatedUser.phoneNumber);
    updatedUser.phoneNumber = validator.trimString(updatedUser.phoneNumber);
    updatedUserData.phoneNumber = updatedUser.phoneNumber;
  }

  if (updatedUser.aboutMe) {
    if (!validator.validStringBool(updatedUser.aboutMe))
      throw "About  Me is not a valid string.";
    updatedUser.aboutMe = validator.trimString(updatedUser.aboutMe);
    updatedUserData.aboutMe = updatedUser.aboutMe;
  }

  //nationality call use npm package in drop down box to be called on client side
  if (updatedUser.nationality) {
    if (!validator.validStringBool(updatedUser.nationality))
      throw "Nationality is not a valid string.";
    updatedUser.nationality = validator.trimString(updatedUser.nationality);
    updatedUserData.nationality = updatedUser.nationality;
  }
  //preference  in drop down box to be called on client side
  //gender - Male, Female, Others drop box
  if (updatedUser.gender) {
    if (!validator.validStringBool(updatedUser.gender))
      throw "Gender is not a valid string.";
    updatedUser.gender = validator.trimString(updatedUser.gender);
    updatedUserData.gender = updatedUser.gender;
  }

  // if (updatedUser.preference.length < 0) {
  //   throw `There should be atleast one preference`;
  // }
  
  if(updatedUser.preference){
    if(updatedUser.preference.drinking){
      if(!validator.validStringBool(updatedUser.preference.drinking)) throw "Not a type boolean"
  
    }
    if(updatedUser.preference.smoking){
      if(!validator.validStringBool(updatedUser.preference.smoking)) throw "Not a type boolean"
    }
    if (updatedUser.preference.food) {
      validator.validArray(updatedUser.preference.food, "food");
    }
    if(updatedUser.preference.room){
      validator.validArray(updatedUser.preference.room,"room")
    }
    if (updatedUser.preference.location) {
      validator.validArray(updatedUser.preference.location, "location");
    }
    if (updatedUser.preference.home_type) {
      validator.validArray(updatedUser.preference.home_type, "home_type");
    }
    updatedUserData.preference = updatedUser.preference;
  }

  if (updatedUser.postId) {
    //updatedUser.postId = validator.validId(postId);
    //updatedUser.postId = validator.trimString(updatedUser.postId);
    updatedUserData.postId = updatedUser.postId;
  }
  if (updatedUser.commentId) {
    //updatedUser.commentId = validator.validId(commentId);
    //updatedUser.commentId = validator.trimString(updatedUser.commentId);
    updatedUserData.commentId = updatedUser.commentId;
  }
  if (updatedUser.savedPost) {
    //updatedUser.savedPost = validator.validId(savedPost);
    //updatedUser.savedPost = validator.trimString(updatedUser.savedPost);
    updatedUserData.savedPost = updatedUser.savedPost;
  }
  const userCollection = await users();
  if (updatedUserData == {}) {
    return await getUserById(id);
  }

  const updateInfoUser = await userCollection.updateOne(
    { _id: ObjectId(id) },
    { $set: updatedUserData }
  );
  if (updateInfoUser.modifiedCount === 0 && updateInfoUser.deletedCount === 0)
    throw "could not update user";
  return await getUserById(id);
};

const userRecommendation = async (id) => {
  console.log("in user rec");
  if (!validator.validString(id)) throw "id must be given";
  validator.validId(id);
  id = validator.trimString(id);
  let searchFilter = await getUserById(id);
  let recommendList = {};
  let recarr = [];
  if (searchFilter === null) {
    throw "Invalid";
  }
  if (Object.keys(searchFilter.preference).length === 0) {
    throw "Preference is not valid";
  }
  if (searchFilter.preference["drinking"]) {
    recommendList["preference.drinking"] = searchFilter.preference["drinking"];
    recarr.push(recommendList);
  }
  if (searchFilter.preference["smoking"]) {
    recommendList = {};
    recommendList["preference.smoking"] = searchFilter.preference["smoking"];
    recarr.push(recommendList);
  }
  if (searchFilter.preference["food"]) {
    recommendList = {};
    recommendList["preference.food"] = {
      $all: [searchFilter.preference["food"]],
    };
    recarr.push(recommendList);
  }
  if (searchFilter.preference["budget"]) {
    recommendList = {};
    recommendList["preference.budget"] = searchFilter.preference["budget"];
    recarr.push(recommendList);
  }
  if (searchFilter.preference["room"]) {
    recommendList = {};
    recommendList["preference.room"] = {
      $all: [searchFilter.preference["room"]],
    };
    recarr.push(recommendList);
  }
  if (searchFilter.preference["home_type"]) {
    recommendList = {};
    recommendList["preference.home_type"] = {
      //updated rhs to arry
      $all: [searchFilter.preference["home_type"]],
    };
    recarr.push(recommendList);
  }
  if (searchFilter.preference["location"]) {
    recommendList = {};
    recommendList["preference.location"] = searchFilter.preference["location"];
    recarr.push(recommendList);
  }

  const userCollection = await users();
  const recommendUsers = await userCollection.find({ $or: recarr }).toArray();
  if (recommendUsers === "null") {
    throw "At the moment we were not able to recommend you the users. Please come back later.";
  }
  for (let i = 0; i < recommendUsers.length; i++) {
    if (recommendUsers[i]._id.toString() === id) {
      console.log(recommendUsers.splice(i, 1));
      break;
    }
  }
  // console.log(recommendUsers);

  return recommendUsers;
};

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  userRecommendation,
};

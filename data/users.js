//user routes
//post route
const mongoCollections = require("../config/mongoCollections");
const users = mongoCollections.users;
const { ObjectId } = require("mongodb");
const helper = require("../helper");
const bcrypt = require("bcryptjs");
const saltRounds = 16;

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
  if (!helper.validString(firstName)) throw "First name is not a valid string.";
  if (!helper.validString(lastName)) throw "Last name is not a valid string.";
  if (!helper.validEmail(emailId)) throw "Email is not a valid string.";
  let email = emailId.toLowerCase();
  if (!helper.validAge(age)) throw "Age must be a positive integer";
  if (!helper.validString(password)) throw "Password is not a valid string.";
  helper.validatePhoneNumber(phoneNumber);
  if (!helper.validString(aboutMe)) throw "About  Me is not a valid string.";
  //nationality call use npm package in drop down box to be called on client side
  if (!helper.validString(nationality))
    throw "Nationality is not a valid string.";
  //preference  in drop down box to be called on client side
  //gender - Male, Female, Others drop box
  if (!helper.validString(gender)) throw "Gender is not a valid string.";
  if (preference.length < 0) {
    throw `There should be atleast one preference`;
  }
  /*before storing email and username into DB, make sure there are no duplicate entries of email in DB */
  const allUsers = await getAllUsers();
  allUsers.forEach((user) => {
    if (user.email == email)
      throw "An account is already created with the provided email id.";
  });

  //create hashed password
  const hashedPassword = await bcrypt.hash(password, saltRounds);
  firstName = helper.trimString(firstName);
  lastName = helper.trimString(lastName);
  emailId = helper.trimString(emailId);
  age = age;
  phoneNumber = helper.trimString(phoneNumber);
  gender = helper.trimString(gender);
  nationality = helper.trimString(nationality);
  aboutMe = helper.trimString(aboutMe);
  /* Add new user to DB */
  let newUser = {
    firstName: firstName,
    lastName: lastName,
    emailId: emailId,
    password: hashedPassword,
    age: age,
    phoneNumber: phoneNumber,
    gender: gender,
    nationality: nationality,
    aboutMe: aboutMe,
    preference: preference,
    postId : [],
    commentId: []
  };

  const userCollection = await users();
  const insertInfo = await userCollection.insertOne(newUser);
  if (insertInfo.insertedCount === 0) throw "Could not add user.";

  const newId = insertInfo.insertedId;
  const userDetail = await getUserById(newId.toString());

  return userDetail;
};

const getAllUsers = async () => {
  const userCollection = await users();
  const userList = await userCollection.find({}).toArray();
  if (userList.length === 0) return [];
  return userList;
};

const getUserById = async (id) => {
  if (!helper.validString(id)) throw "id must be given";
  helper.validId(id);
  id = helper.trimString(id);
  const userCollection = await users();
  const user = await userCollection.findOne({ _id: ObjectId(id) });
  if (!user) throw "user with that id does not exist";
  return user;
};

const updateUser = async (id, updatedUser) => {
  let updatedUserData = {};
  if (!helper.validString(id)) throw "id must be given";
  helper.validId(id);
  id = helper.trimString(id);
  let = await getUserById(id);
  if (updatedUser.firstName) {
    if (!helper.validString(updatedUser.firstName))
      throw "First name is not a valid string.";
    updatedUser.firstName = helper.trimString(updatedUser.firstName);
    updatedUserData.firstName = updatedUser.firstName;
  }
  if (updatedUser.lastName) {
    if (!helper.validString(updatedUser.lastName))
      throw "Last name is not a valid string.";
    updatedUser.lastName = helper.trimString(updatedUser.lastName);
    updatedUserData.lastName = updatedUser.lastName;
  }
  // if(updatedUser.emailId){
  //   if (!helper.validEmail(updatedUser.emailId)) throw "Email is not a valid string.";
  //   updatedUser.emailId=helper.trimString(updatedUser.validEmail)
  //   updatedUserData.validEmail = updatedUser.validEmail.toLowerCase()
  // }
  if (updatedUser.age) {
    if (!helper.validAge(updatedUser.age))
      throw "Age must be a positive integer";
    updatedUser.age = helper.trimString(updatedUser.age);
    updatedUserData.age = updatedUser.age;
  }

  // if (!helper.validString(updatedUser.password)) throw "Password is not a valid string.";
  if (updatedUser.phoneNumber) {
    helper.validatePhoneNumber(updatedUser.phoneNumber);
    updatedUser.phoneNumber = helper.trimString(updatedUser.phoneNumber);
    updatedUserData.phoneNumber = updatedUser.phoneNumber;
  }

  if (updatedUser.aboutMe) {
    if (!helper.validString(updatedUser.aboutMe))
      throw "About  Me is not a valid string.";
    updatedUser.aboutMe = helper.trimString(updatedUser.aboutMe);
    updatedUserData.aboutMe = updatedUser.aboutMe;
  }

  //nationality call use npm package in drop down box to be called on client side
  if (updatedUser.nationality) {
    if (!helper.validString(updatedUser.nationality))
      throw "Nationality is not a valid string.";
    updatedUser.nationality = helper.trimString(updatedUser.nationality);
    updatedUserData.nationality = updatedUser.nationality;
  }
  //preference  in drop down box to be called on client side
  //gender - Male, Female, Others drop box
  if (updatedUser.gender) {
    if (!helper.validString(updatedUser.gender))
      throw "Gender is not a valid string.";
    updatedUser.gender = helper.trimString(updatedUser.gender);
    updatedUserData.gender = updatedUser.gender;
  }
  //Preference edit left
  // if (updatedUser.preference.length < 0) {
  //   throw `There should be atleast one preference`;
  // }
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

module.exports = {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
};

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
  if (!validator.validString(firstName))
    throw "First name is not a valid string.";
  if (!validator.validString(lastName))
    throw "Last name is not a valid string.";
  if (!validator.validEmail(emailId)) throw "Email is not a valid string.";
  let email = emailId.toLowerCase();
  if (typeof age === "string") {
    age = parseInt(age);
  }
  if (!validator.validAge(age)) throw "Age must be a positive integer";
  if (!validator.validString(password)) throw "Password is not a valid string.";
  validator.validatePhoneNumber(phoneNumber);
  if (!validator.validString(aboutMe)) throw "About  Me is not a valid string.";
  //nationality call use npm package in drop down box to be called on client side
  if (!validator.validString(nationality))
    throw "Nationality is not a valid string.";
  //preference  in drop down box to be called on client side
  //gender - Male, Female, Others drop box
  if (!validator.validString(gender)) throw "Gender is not a valid string.";
  if (preference.length < 0) {
    throw `There should be atleast one preference`;
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
  validator.validId(id);
  id = validator.trimString(id);
  let = await getUserById(id);
  if (updatedUser.firstName) {
    if (!validator.validString(updatedUser.firstName))
      throw "First name is not a valid string.";
    updatedUser.firstName = validator.trimString(updatedUser.firstName);
    updatedUserData.firstName = updatedUser.firstName;
  }
  if (updatedUser.lastName) {
    if (!validator.validString(updatedUser.lastName))
      throw "Last name is not a valid string.";
    updatedUser.lastName = validator.trimString(updatedUser.lastName);
    updatedUserData.lastName = updatedUser.lastName;
  }

  if (updatedUser.age) {
    if (!validator.validAge(updatedUser.age))
      throw "Age must be a positive integer";
    updatedUser.age = validator.trimString(updatedUser.age);
    updatedUserData.age = updatedUser.age;
  }

  if (updatedUser.phoneNumber) {
    validator.validatePhoneNumber(updatedUser.phoneNumber);
    updatedUser.phoneNumber = validator.trimString(updatedUser.phoneNumber);
    updatedUserData.phoneNumber = updatedUser.phoneNumber;
  }

  if (updatedUser.aboutMe) {
    if (!validator.validString(updatedUser.aboutMe))
      throw "About  Me is not a valid string.";
    updatedUser.aboutMe = validator.trimString(updatedUser.aboutMe);
    updatedUserData.aboutMe = updatedUser.aboutMe;
  }

  //nationality call use npm package in drop down box to be called on client side
  if (updatedUser.nationality) {
    if (!validator.validString(updatedUser.nationality))
      throw "Nationality is not a valid string.";
    updatedUser.nationality = validator.trimString(updatedUser.nationality);
    updatedUserData.nationality = updatedUser.nationality;
  }
  //preference  in drop down box to be called on client side
  //gender - Male, Female, Others drop box
  if (updatedUser.gender) {
    if (!validator.validString(updatedUser.gender))
      throw "Gender is not a valid string.";
    updatedUser.gender = validator.trimString(updatedUser.gender);
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

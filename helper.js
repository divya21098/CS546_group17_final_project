const { ObjectId } = require("mongodb");
const { parsePackageVersion } = require("mongodb/lib/utils");
// Takes in a string argument.
// Return true if the argument is non-empty, a string, and non-empty when trimmed; otherwise return false.
const validString = (str) => {
  if (!str || typeof str !== "string" || !str.trim()) throw "not valid string";
  return str;
};

// Takes in a string argument.
// Return true if the argument is non-empty, a string, and non-empty when trimmed; otherwise return false.
const validStringBool = (str) => {
  if (!str || typeof str !== "string" || !str.trim())
    return false
  return true;
};

// Takes in a number argument.
// Return true if the argument is above 0 and is a positive integer, false otherwise.
const validAge = (age) => {
  if (!age || typeof age != "number" || !Number.isInteger(age) || age < 1)
    return false;
  return true;
};

const validPassword = (password)=>{
  if(!validStringBool(password)) return false
const passRegex = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{8,15}$/;
return passRegex.test(password)
}
// Takes in a string argument.
// Return true if the argument is a valid email using regex expression.
const validEmail = (email) => {
  if (!validString(email)) return false;
  const re = /^[A-Za-z0-9._%+-]+@stevens\.edu$/
  return re.test(String(email).toLowerCase());
};

const validatePhoneNumber = (phoneNumber) => {
  if (phoneNumber === null || phoneNumber === undefined)
    throw `$Phone Number cannot be null or undefined`;
  const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
  if (!re.test(phoneNumber)) {
    throw `Phone Number (${phoneNumber}) is not valid. Please enter a valid 10-digit phone number without separators or separated by spaces, dashes, or periods`;
  }
};

const validId = (id) => {
  if (!id) throw "Error: You must provide an id to search for";
  if (typeof id !== "string") throw "Error: id must be a string";
  id = id.trim();
  if (id.length === 0)
    throw "Error: id cannot be an empty string or just spaces";
  if (!ObjectId.isValid(id)) throw "Error: invalid object ID";

  return id;
};

const trimString = (string) => {
  return string.trim();
};
function validDate(dateString) {
  // First check for the pattern
  if (!/^\d{2}\/\d{2}\/\d{4}$/.test(dateString)) return false;

  // Parse the date parts to integers
  var parts = dateString.split("/");
  var month = parseInt(parts[0], 10);
  var day = parseInt(parts[1], 10);
  var year = parseInt(parts[2], 10);

  //check year range
  let cur_year = new Date().getFullYear();
  if (year < 1900 || year > cur_year + 2 || month > 12) {
    return false;
  }
  var monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];

  // Check the range of the day
  return day > 0 && day <= monthLength[month - 1];
}

const validBool = (val) => {
  if (typeof val !== "boolean") {
    return false;
  }
  return true
}
const validArray=(arr,name)=>{
  if(typeof arr==="string")
    return arr.trim()
  if(!Array.isArray(arr)){
    throw `Input ${name} is not of type array!`
  }
  if (arr.length < 0) {
    throw `Input ${name} array cannot be empty`;
  }
};

const map_cord = (location) => {
  if (location === "Hoboken") {
    return [40.745255, -74.034775];
  } else if (location === "Jersey City") {
    return [40.71907, -74.050552];
  } else if (location === "Weehawken") {
    return [40.7683, -74.0190];
  } else if (location === "Union City") {
    return [40.77954, -74.023751];
  } else if (location === "Journal Square") {
    return [40.734572, -74.063154];
  } else if (location === "Newport") {
    return [40.727123, -74.038300];
  } else {
    return [39.833851, -74.871826]; //Random complete new jersey
  }
};

const validName = (name)=>{
  const reg=/^[A-Za-z]+$/
  return reg.test(name)

}
module.exports = {
  validString,
  validAge,
  validEmail,
  validatePhoneNumber,
  validId,
  trimString,
  validDate,
  validBool,
  validArray,
  validPassword,
  map_cord,
  validStringBool,
  validName
};

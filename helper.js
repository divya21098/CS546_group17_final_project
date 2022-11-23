// Takes in a string argument.
// Return true if the argument is non-empty, a string, and non-empty when trimmed; otherwise return false.
const validString=(str)=>{
  if (!str || typeof str !== "string" || !str.trim()) return false;
  return true;
}

// Takes in a number argument.
// Return true if the argument is above 0 and is a positive integer, false otherwise.
const validAge=(age)=>{
  if (!age || typeof age != "number" || !Number.isInteger(age) || age < 1)
    return false;
  return true;
}

// Takes in a string argument.
// Return true if the argument is a valid email using regex expression.
const validEmail=(email)=>{
  if (!validString(email)) return false;
  const re =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}

const validatePhoneNumber=(phoneNumber)=>{
    if (phoneNumber === null || phoneNumber === undefined)
        throw `$Phone Number cannot be null or undefined`;
    const re = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
    if (!re.test(phoneNumber)) {
        throw `Phone Number (${phoneNumber}) is not valid. Please enter a valid 10-digit phone number without separators or separated by spaces, dashes, or periods`;
    }
}

const isValidId = (id) => {
  if (!ObjectId.isValid(id)) {
    throw "invalid object ID";
  }
};

const trimString=(str)=>{
  return str.trim()
}

module.exports = {
  validString,
  validAge,
  validEmail,
  validatePhoneNumber,
  isValidId,
  trimString
};

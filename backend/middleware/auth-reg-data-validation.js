const { dataValidator, ValidationResult } = require("../validation");

async function validateRegData(user) {
  const { login, password, confirmPass, email, fullName } = user;

  if (
    dataValidator.checkIfAllRegFieldsIsPresent(user) ==
      ValidationResult.INVALID ||
    dataValidator.chekIfPasswordsMatch(password, confirmPass) ==
      ValidationResult.INVALID ||
    dataValidator.checkLoginLen(login) == ValidationResult.INVALID ||
    dataValidator.checkIfPasswdIsStrong(password) == ValidationResult.INVALID ||
    dataValidator.checkIfEmailIsValid(email) == ValidationResult.INVALID ||
    dataValidator.checkFullNameLen(fullName) == ValidationResult.INVALID ||
    dataValidator.checkIfFullNameIsValid(fullName) ==
      ValidationResult.INVALID ||
    //(await dataValidator.checkIfUserExistByEmailAndLogin(login, email)) ==
    //  ValidationResult.INVALID
    (await dataValidator.checkIfEmailExist(email)) ==
      ValidationResult.INVALID ||
    (await dataValidator.checkIfLoginExist(login)) == ValidationResult.INVALID
  )
    return ValidationResult.INVALID;
  return ValidationResult.VALID;
}

module.exports = async (req, res, next) => {
  if ((await validateRegData(req.body)) == ValidationResult.INVALID) {
    res.status(400).json({ message: ValidationResult.INVALID.msg });
  } else {
    next();
  }
};

// async function validateRegData(user) {
//   const { login, password, confirmPass, email, fullName } = user;
//   const validate = async (validator, ...args) =>
//     (await validator(...args)) === ValidationResult.INVALID;

//   if (
//     validate(dataValidator.checkIfAllRegFieldsIsPresent, user) ||
//     validate(dataValidator.chekIfPasswordsMatch, password, confirmPass) ||
//     validate(dataValidator.checkLoginLen, login) ||
//     validate(dataValidator.checkIfPasswdIsStrong, password) ||
//     validate(dataValidator.checkIfEmailIsValid, email) ||
//     validate(dataValidator.checkFullNameLen, fullName) ||
//     validate(dataValidator.checkIfFullNameIsValid, fullName) ||
//     validate(dataValidator.checkIfUserExistByEmailAndLogin, login, email)
//   ) {
//     return ValidationResult.INVALID;
//   }

//   return ValidationResult.VALID;
// }

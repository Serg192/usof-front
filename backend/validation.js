const validator = require("validator");
const userService = require("./services/user-service");

class ValidationResult {
  static VALID = new ValidationResult("valid");
  static INVALID = new ValidationResult("invalid");

  msg = "";

  constructor(msg) {
    this.msg = msg;
  }
}

const dataValidator = {
  checkIfAllRegFieldsIsPresent: (user) => {
    const { login, password, confirmPass, email, fullName } = user;
    if (!login || !password || !confirmPass || !email || !fullName) {
      ValidationResult.INVALID.msg =
        "Bad request. Check if all required fields are set properly";
      return ValidationResult.INVALID;
    }
    return ValidationResult.VALID;
  },
  chekIfPasswordsMatch: (password, confirmPass) => {
    if (password !== confirmPass) {
      ValidationResult.INVALID.msg = "Passwords do not match";
      return ValidationResult.INVALID;
    }
    return ValidationResult.VALID;
  },
  checkLoginLen: (login) => {
    if (
      login.length >= process.env.MAX_LOGIN_LEN ||
      login.length < process.env.MIN_LOGIN_LEN
    ) {
      ValidationResult.INVALID.msg = `Login should be >= ${process.env.MIN_LOGIN_LEN} and < ${process.env.MAX_LOGIN_LEN}`;
      return ValidationResult.INVALID;
    }
    return ValidationResult.VALID;
  },

  checkIfPasswdIsStrong: (password) => {
    console.log("Password is: ", password);
    const passReg =
      /^(?=.*[A-Z].*[A-Z].*[A-Z])(?=.*[!@#$&*])(?=.*[0-9].*[0-9].*[0-9]).{8,}$/;
    if (
      // !validator.isStrongPassword(password, {
      //   minLength: parseInt(process.env.MIN_PASSWORD_LEN),
      //   minUppercase: parseInt(process.env.MIN_PASSWORD_UPCASE),
      //   minNumbers: parseInt(process.env.MIN_PASSWORD_NUMS),
      //   minSymbols: parseInt(process.env.MIN_PASSWORD_SCHARS),
      // })
      !passReg.test(password)
    ) {
      console.log("It's weak");
      ValidationResult.INVALID.msg = `"The password must be at least ${process.env.MIN_PASSWORD_LEN} characters long, contain at least ${process.env.MIN_PASSWORD_UPCASE} uppercase letters, at least ${process.env.MIN_PASSWORD_NUMS} numbers, and at least ${process.env.MIN_PASSWORD_SCHARS} special characters."`;
      return ValidationResult.INVALID;
    }
    return ValidationResult.VALID;
  },

  checkIfEmailIsValid: (email) => {
    if (!validator.isEmail(email)) {
      ValidationResult.INVALID.msg = "Email is not valid";
      return ValidationResult.INVALID;
    }
    return ValidationResult.VALID;
  },

  checkFullNameLen: (fullName) => {
    if (
      fullName.length < 0 ||
      fullName.length >= process.env.MAX_USER_FULL_NAME_LEN
    ) {
      ValidationResult.INVALID.msg = `Full name should be not bigger than ${process.env.MAX_USER_FULL_NAME_LEN} chars`;
      return ValidationResult.INVALID;
    }
    return ValidationResult.VALID;
  },

  checkIfFullNameIsValid: (fullName) => {
    if (!/^[A-Za-z\s\-']+$/.test(fullName)) {
      ValidationResult.INVALID.msg = "Full name is not valid";
      return ValidationResult.INVALID;
    }
    return ValidationResult.VALID;
  },

  checkIfUserExistByEmailAndLogin: async (login, email) => {
    if (await userService.findUserByEmailOrLogin(email, login)) {
      ValidationResult.INVALID.msg = "User already exist";
      return ValidationResult.INVALID;
    }
    return ValidationResult.VALID;
  },

  checkIfNewLoginIsValid: async (newLogin, userID) => {
    const userInDB = await userService.findUserByLogin(newLogin);
    if (!userInDB || userInDB.id == userID) return ValidationResult.VALID;
    ValidationResult.INVALID.msg = "This login is already used by other user!";
    return ValidationResult.INVALID;
  },

  checkIfLoginExist: async (login) => {
    const userInDB = await userService.findUserByLogin(login);
    if (!userInDB) return ValidationResult.VALID;
    ValidationResult.INVALID.msg = "This login is already used by other user!";
    return ValidationResult.INVALID;
  },
  checkIfEmailExist: async (email) => {
    const userInDB = await userService.findUserByEmail(email);
    if (!userInDB) return ValidationResult.VALID;
    ValidationResult.INVALID.msg = "This email is already used by other user!";
    return ValidationResult.INVALID;
  },
};

module.exports = {
  dataValidator,
  ValidationResult,
};

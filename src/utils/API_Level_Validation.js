const validator = require("validator");

const validateSignUpData = (req) => {
  const { firstName, lastName, email, password, age, gender } = req.body;

  if (!firstName || !lastName) {
    throw new Error("First name and last name are required");
  }

  if (!email || !validator.isEmail(email)) {
    throw new Error("Invalid email address");
  }
  if (!age || age < 18) {
    throw new Error("18 is the min age");
  }
  const allowedGenders = ["Male", "Female", "Other", "male", "female", "other"];
  if (!gender || !allowedGenders.includes(gender)) {
    throw new Error("Invalid Gender");
  }
  if (!password || !validator.isStrongPassword(password)) {
    throw new Error(
      "Password must be at least 8 characters long, contain at least one uppercase letter, one lowercase letter, one number, and one special character"
    );
  }
};
const validateSecurityQuestions = (securityQuestions) => {
  if (!Array.isArray(securityQuestions) || securityQuestions.length === 0) {
    throw new Error("Security question must be a non-empty array");
  }

  const questionSet = new Set();

  for (const q of securityQuestions) {
    if (!q.question || !q.answer) {
      throw new Error(
        "Each security question must have both a question and an answer"
      );
    }

    if (questionSet.has(q.question)) {
      throw new Error("Duplicate security questions are not allowed");
    }

    questionSet.add(q.question);
  }
};

const validateProfileEditData = (req) => {
  const data = req.body;
  const ALLOWED_UPDATES = [
    "photourl",
    "skills",
    "about",
    "mobileNo",
    "primaryAddress",
    "permanentAddress",
  ];
  const isAllowed = Object.keys(data).every((key) =>
    ALLOWED_UPDATES.includes(key)
  );

  return isAllowed;
};
module.exports = {
  validateSignUpData,
  validateProfileEditData,
  validateSecurityQuestions,
};

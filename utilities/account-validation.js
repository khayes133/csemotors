const accountModel = require("../models/account-model");
const utilities = require(".");
const { body, validationResult } = require("express-validator");
const validate = {};

/*  **********************************
 *  REGISTRATION Data Validation Rules
 * ********************************* */
validate.registationRules = () => {
  return [
    // firstname is required and must be string
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    // lastname is required and must be string
    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    // valid email is required and cannot already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required.")
      .custom(async (account_email) => {
        const emailExists = await accountModel.checkExistingEmail(account_email);
        if (emailExists) {
          throw new Error("Email exists. Please log in or use a different email");
        }
      }),

    // password is required and must be strong password
    body("account_password")
      .trim()
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[?!.*@])[A-Za-z\d?!.*@]{12,}$/)
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to REGISTRATION
 * ***************************** */
validate.checkRegData = async (req, res, next) => {
  const { account_firstname, account_lastname, account_email } = req.body;
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Registration Validation Errors:', errors.array());
    let nav = await utilities.getNav();
    res.render("account/register", {
      errors,
      title: "Registration",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  LOGIN Data Validation Rules
 * ********************************* */
validate.loginRules = () => {
  return [
    // valid email is required and must already exist in the DB
    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("Please enter a valid email."),

    // password must match pattern validation
    body("account_password")
      .trim()
      .whitelist(/^[0-9a-zA-Z?!.*@]*$/)
      .isLength({ min: 12 })
      .withMessage('Incorrect password'),
  ];
};

/* ******************************
 * Check data and return errors or continue to LOGIN
 * ***************************** */
validate.checkLoginData = async (req, res, next) => {
  const { account_email } = req.body;
  let errors = validationResult(req);

  if (!errors.isEmpty()) {
    console.log('Login Validation Errors:', errors.array());
    let nav = await utilities.getNav();
    res.render("account/login", {
      errors,
      title: "Login",
      nav,
      account_email,
    });
    return;
  }
  next();
};

/*  **********************************
 *  account UPDATE rules
 * ********************************* */
validate.updateAccountRules = () => {
  return [
    body("account_firstname")
      .trim()
      .isLength({ min: 1 })
      .withMessage("Please provide a first name."),

    body("account_lastname")
      .trim()
      .isLength({ min: 2 })
      .withMessage("Please provide a last name."),

    body("account_email")
      .trim()
      .isEmail()
      .normalizeEmail()
      .withMessage("A valid email is required."),
  ];
};

/*  **********************************
 *  CHANGEPASSWORD Validation Rules
 * ********************************* */
validate.changePasswordRules = () => {
  return [
    body("account_password")
      .trim()
      .matches(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[?!.*@])[A-Za-z\d?!.*@]{12,}$/)
      .withMessage("Password does not meet requirements."),
  ];
};

/* ******************************
 * Check data and return errors or continue to EDITACCOUNT
 * ***************************** */
validate.checkEditAccountData = async (req, res, next) => {
  let nav = await utilities.getNav();
  const { account_firstname, account_lastname, account_email, account_id } = req.body;
  const account = await accountModel.getAccountById(account_id);

  if (account_email != account.account_email) {
    const emailExists = await accountModel.checkExistingEmail(account_email);
    if (emailExists) {
      errors.push("Email exists. Please log in or use a different email");
    }
  }
  
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log('Edit Account Validation Errors:', errors.array());
    res.render("./account/editaccount", {
      errors,
      title: "Edit Account Information",
      nav,
      account_firstname,
      account_lastname,
      account_email,
    });
    return;
  }
  next();
};

module.exports = validate;

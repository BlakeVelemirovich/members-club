const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');

exports.sign_up_get = (req, res, next) => {
    res.render('sign_up');
};

exports.sign_up_post = [
    // sanitization and validation
    body('username')
    .trim()
    .notEmpty().withMessage('Username is required')
    .isAscii().withMessage('Must use letters or numbers or special characters')
    .escape(),

    body('password')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isAscii().withMessage('Musst use letters or numbers or special characters')
    .escape(),

    body('firstname')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isAlpha().withMessage('Must use letters')
    .escape(),

    body('lastname')
    .trim()
    .notEmpty().withMessage('Password is required')
    .isAlpha().withMessage('Must use letters')
    .escape(),

    body('membership')
    .notEmpty().withMessage('Membership status is required'),

    body('admin')
    .notEmpty().withMessage('Admin status is required'),

    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            res.render('sign_up', {
                username: req.body.username,
                firstname: req.body.firstname,
                lastname: req.body.lastname,
                errors: errors.array()
            });
        }

            try {
              const hashedPassword = await bcrypt.hash(req.body.password, 10);
          
              const user = new User({
                first_name: req.body.firstname,
                last_name: req.body.lastname,
                username: req.body.username,
                password: hashedPassword,
                membership: req.body.membership,
                admin: req.body.admin
              });
              const result = await user.save();
              res.redirect("/");
            } catch(err) {
              return next(err);
            };
        })
];


/* exports.log_in = [
    body('username')
    .notEmpty().withMessage()
    .isAlphanumeric.withMessage()
    .trim(),

    body('password')
    .notEmpty().withMessage()
    .isAlphanumeric.withMessage()
    .trim(),

    asyncHandler(async (req, res, next) => {
        // Extract the validation errors from a request.
        const errors = validationResult(req);
        

        
      })
]; */


const asyncHandler = require('express-async-handler');
const { body, validationResult } = require('express-validator');
const passport = require('passport');
const bcrypt = require('bcryptjs');
const User = require('../models/user');
const Post = require('../models/post');
const LocalStrategy = require("passport-local").Strategy;

passport.use(
    new LocalStrategy(async(username, password, done) => {
      try {
        const user = await User.findOne({ username: username });
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        };
        bcrypt.compare(password, user.password, (err, res) => {
          if (res) {
            // Passwords match! log user in
            return done(null, user)
          } else {
            // Passwords do not match!
            return done(null, false, { message: "Incorrect password" })
          }
        })
        
        return done(null, user);
      } catch(err) {
        return done(err);
      };
    })
  );

  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });
  
  passport.deserializeUser(async function(id, done) {
    try {
      const user = await User.findById(id);
      done(null, user);
    } catch(err) {
      done(err);
    };
  });

exports.sign_up_get = (req, res, next) => {
    res.render('sign_up');
};

exports.sign_up_post = [
    // Sanitization and validation
    body('username')
    .trim()
    .notEmpty().withMessage('* Username is required')
    .isAscii().withMessage('* Username must use letters or numbers or special characters')
    .customSanitizer((value) => {
        // Forcing all letters to lowercase so unique usernames aren't case sensitive
        return value.toLowerCase();
    })
    .escape(),

    body('password')
    .trim()
    .notEmpty().withMessage('* Password is required')
    .isAscii().withMessage('* Password must only contain letters or numbers or special characters')
    .escape(),

    body('firstname')
    .trim()
    .notEmpty().withMessage('* First name is required')
    .isAlpha().withMessage('* First name must be only letters')
    .escape(),

    body('lastname')
    .trim()
    .notEmpty().withMessage('* Last name is required')
    .isAlpha().withMessage('* Last name must be only letters')
    .escape(),

    body('admin')
    .notEmpty().withMessage('* Admin status is required'),

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
                admin: req.body.admin
              });
              const result = await user.save();
              res.redirect("/");
            } catch(err) {
              res.render('sign_up', {
                duplicateUser: "*Username is already taken"
              })
            };
        })
];

exports.log_in = function(req, res, next) {
  passport.authenticate('local', function(err, user, info) {
    if (err) { return next(err); }
    if (!user) {
      // Authentication failed. Send an error message.
      return res.render('index', {
        error: 'Username or password is incorrect.'
      })
    }
    req.logIn(user, function(err) {
      if (err) { return next(err); }
      // Authentication succeeded. Log in the user and render our index template.
      return res.render('index', { 
        user: req.user,
        title: 'Chat Board'
      });
    });
  })(req, res, next);
};

exports.post = [
    body('message')
    .trim()
    .notEmpty().withMessage('Must contain a message')
    .escape(),
  
    asyncHandler(async (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          console.log(errors);
        }

        try {
          const post = new Post({
            message: req.body.message,
            postedAt: new Date(),
            user: req.user._id
          })

          await post.save();
          const allPosts = await Post.find().populate('user');
          console.log(allPosts)
          res.render('index', {
            user: req.user,
            title: 'Chat Board',
            posts: allPosts
          })
        } catch (err) {
          return next(err);
        }
    })

];

exports.delete = asyncHandler(async (req, res, next) => {
  try {
    const postId = req.params.postId;
    const deletedPost = await Post.findByIdAndDelete(postId);

    if (!deletedPost) {
      return res.status(404).send('Post not found');
    }

    res.redirect('/');
  } catch (err) {
    next(err);
  }
});
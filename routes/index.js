var express = require('express');
var router = express.Router();
const chat_controller = require('../controller/chat_controller');
const Post = require('../models/post');

// GET home page
router.get('/', async function(req, res, next) {
  const allPosts = await Post.find();

  res.render('index', { 
    user: req.user,
    title: 'Sign in',
    posts: allPosts
  });
});

// sign up routes
router.get('/sign-up', chat_controller.sign_up_get);
router.post('/sign-up', chat_controller.sign_up_post);

// log-in route
router.post('/log-in', chat_controller.log_in);

// new message board post
router.post('/post', chat_controller.post); 

module.exports = router;

var express = require('express');
var router = express.Router();
const chat_controller = require('../controller/chat_controller');

// GET home page
router.get('/', function(req, res, next) {
  res.render('index', { 
    user: req.username,
    title: 'Sign in'
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

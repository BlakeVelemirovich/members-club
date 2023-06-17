var express = require('express');
var router = express.Router();
const chat_controller = require('../controller/chat_controller');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.get('/sign-up', chat_controller.sign_up_get);
router.post('/sign-up', chat_controller.sign_up_post);

//router.post('log-in', chat_controller.log_in);

module.exports = router;

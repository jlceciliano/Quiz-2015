var express = require('express');
var router = express.Router();

var quizController = require('../controllers/quiz_controller.js');

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Quiz' });
});

//Autoload  de comandos con :quizId
// -- Si en la rula existe el parametro :quizId en parte de la cabecera, se 
// invoca el load
router.param ('quizId', quizController.load); //autoload quizID


router.get('/quizes'                       , quizController.index);
router.get('/quizes/:quizId(\\d+)'         , quizController.show);
router.get('/quizes/:quizId(\\d+)/answer'  , quizController.answer);
router.get('/author/author'                , quizController.author);
module.exports = router;

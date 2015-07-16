var models = require('../models/models.js'); 

// -----------Cambios en sqlite ------------------------------------
//      En las nuevas versiones de Sequelize el interfaz ha cambiado para 
// usar "Promesas". A grandes rasgos hay que cambiar: 
// .success por .then
// .error por .catch 
// .done por .finally.
// -----------------------------------------------------------
// en vez de usar find usamos findById

// GET quizes/:id
exports.show = function(req, res){
		models.Quiz.findById(req.params.quizId).then(function(quiz) {
		res.render('quizes/show', { quiz: quiz });
		})
	};

//GET quizes/:id/answer

exports.answer = function (req, res){
		models.Quiz.findById(req.params.quizId).then(function(quiz) {
			if (req.query.respuesta === quiz.respuesta) {
				res.render('quizes/answer', { quiz:quiz, respuesta: 'Correcto' });
			} else {
				res.render('quizes/answer', { quiz:quiz, respuesta: 'Incorrecto'});
			}
		})
	};

// GET /quizes
exports.index = function(req, res) {
		models.Quiz.findAll().then(function(quizes) {
    		res.render('quizes/index.ejs', { quizes: quizes});
   		})
 	};

// GET author
exports.author = function (req, res){
		res.render('author/author', {})

	};

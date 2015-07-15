var models = require('../models/models.js'); 

// -----------Cambios en sqlite ------------------------------------
//      En las nuevas versiones de Sequelize el interfaz ha cambiado para 
// usar "Promesas". A grandes rasgos hay que cambiar: 
// .success por .then
// .error por .catch 
// .done por .finally.
// -----------------------------------------------------------

// GET quizes/question
// cambiamos para que lo lea de la base de datos
exports.question = function (req, res){
		models.Quiz.findAll().then(function(quiz) {
		res.render('quizes/question', { pregunta: quiz[0].pregunta});
		})
	};
//GET quizes/answer

exports.answer = function (req, res){

		models.Quiz.findAll().then(function(quiz) {
			if (req.query.respuesta === quiz[0].respuesta) {
				res.render('quizes/answer', { respuesta: 'Correcto' });
			} else {
				res.render('quizes/answer', { respuesta: 'Incorrecto'});
			}
		})
	};

// GET author
exports.author = function (req, res){
		res.render('author/author', {})

	};

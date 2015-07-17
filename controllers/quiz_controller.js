var models = require('../models/models.js'); 

// -----------Cambios en sqlite ------------------------------------
//      En las nuevas versiones de Sequelize el interfaz ha cambiado para 
// usar "Promesas". A grandes rasgos hay que cambiar: 
// .success por .then
// .error por .catch 
// .done por .finally.
// -----------------------------------------------------------
// en vez de usar find usamos findById


//autoLoad  - factoria el codigo si la truta incluye un quizId
exports.load = function (req, res, next, quizId){
		models.Quiz.findById(quizId).then(
			function(quiz){
				if (quiz)  {
					req.quiz = quiz;
					next();
				} else {
					next (new Error('No existe quizId ='+quizId));
				};

			}
			).catch(function(error){next (error)})

	};


// GET quizes/:id
exports.show = function(req, res){
		res.render('quizes/show', { quiz: req.quiz });
	};

//GET quizes/:id/answer

exports.answer = function (req, res){
		var resultado = 'Incorrecto'; // Lo inicializamos a incorrecto

		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto'; // Si se cumple lo ponemos a correcto
		};
		res.render ('quizes/answer', { quiz:req.quiz, respuesta: resultado });
	};

// GET /quizes
exports.index = function(req, res) {
		models.Quiz.findAll().then(function(quizes) {
    		res.render('quizes/index.ejs', { quizes: quizes});
   		}).catch(function(error) {next(error);});
 	};

// GET author
exports.author = function (req, res){
		res.render('author/author', {})

	};

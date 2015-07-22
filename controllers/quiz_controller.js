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
		if (req.query.search === undefined )
		{models.Quiz.findAll().then(function(quizes) {
    		res.render('quizes/index.ejs', { quizes: quizes});
   		}).catch(function(error) {next(error);});
		} else 	{
			var patron = req.query.search.trim().replace(/\s/g,"%");
				// quito todos los espacios en blanco delante y detras
				// todos los espacios en blanco de dentro, los sustituye por 
				// el % 
			var filtro = 'pregunta like \'%' + patron + '%\'';
			models.Quiz.findAll({ where: [filtro] ,
							      order: [['pregunta', 'ASC'] ]
							     }).then(function(quizes){
			res.render('quizes/index.ejs', {quizes:quizes});
	});

		}

 	};

// Get para meter una pregunta una pregunta
exports.new = function(req, res){
		console.log("   -----   Estamos en NEW");
		var quiz = models.Quiz.build ( // creamos un objeto Quiz
			{ pregunta: "Pregunta",
			  respuesta: "Respuesta"
			});
		res.render('quizes/new', {quiz: quiz})

	};

	// Get crear una pregunta
exports.create = function(req, res){
	console.log("   -----   Estamos en CREATE");
		var quiz = models.Quiz.build (req.body.quiz);
		// guardamos ahora los campos en la BD
		quiz.save({
			fields: ["pregunta","respuesta"]
			}).then  (function(){
					res.redirect('/quizes');
			})	// Redireccion HTTP (URL relativo) lista de preguntas

	};

// GET author
exports.author = function (req, res){
		res.render('author/author', {})

	};
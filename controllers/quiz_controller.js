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
		models.Quiz.find({
							   where: { id : Number(quizId)},
							   include: [{model: models.Comment}]
						      }).then(
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
		res.render('quizes/show', { quiz: req.quiz, errors:[] });
	};

//GET quizes/:id/answer

exports.answer = function (req, res){
		var resultado = 'Incorrecto'; // Lo inicializamos a incorrecto

		if (req.query.respuesta === req.quiz.respuesta){
			resultado = 'Correcto'; // Si se cumple lo ponemos a correcto
		};
		res.render ('quizes/answer', { quiz:req.quiz, respuesta: resultado, errors:[] });
	};

// GET /quizes
exports.index = function(req, res) {
	console.log (" ----------- Estoy en Index --------------")
		if (req.query.search === undefined )
		{models.Quiz.findAll().then(function(quizes) {
    		res.render('quizes/index.ejs', { quizes: quizes, errors:[]});
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
			res.render('quizes/index.ejs', {quizes:quizes, errors:[]});
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
		res.render('quizes/new', {quiz: quiz, errors:[]})

	};

	// Get crear una pregunta
exports.create = function(req, res){
	console.log("   -----   Estamos en CREATE");
	var quiz = models.Quiz.build (req.body.quiz);
		// guardamos ahora los campos en la BD
	quiz
		.validate()
		.then(function(err)
				{
					if (err) {
        				res.render('quizes/new', {quiz: quiz, errors: err.errors});
      				} else {
        				quiz // save: guarda en DB campos pregunta y respuesta de quiz
        				.save({fields: ["pregunta", "respuesta", "categoria"]})
        				.then( function(){ res.redirect('/quizes')}) 
      				}      // res.redirect: Redirección HTTP a lista de preguntas
    			}
  		).catch(function(error){next(error)});
	}; 

// Get Edit
exports.edit = function (req, res) {
	var quiz = req.quiz // cargamos el quiz que se pasa
	res.render('quizes/edit', {quiz:quiz, errors: []})
	};


// PUT /quizes/:id
exports.update = function(req, res) {
  	req.quiz.pregunta  = req.body.quiz.pregunta;
  	req.quiz.respuesta = req.body.quiz.respuesta;
  	req.quiz.categoria = req.body.quiz.categoria;


  	req.quiz
  		.validate()
  		.then(
    		function(err){
      			if (err) {
        			res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      			} else {
        			req.quiz     // save: guarda campos pregunta y respuesta en DB
        				.save( {fields: ["pregunta", "respuesta", "categoria"]})
        				.then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  	req.quiz
  		.destroy()
  		.then( function() {
    		res.redirect('/quizes');
  		}).catch(function(error){next(error)});
};

// GET author
exports.author = function (req, res){
		res.render('author/author', {errors: []})

	};
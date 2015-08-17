var models = require('../models/models.js');
var Sequelize = require('sequelize');

// GET /quizes
exports.index = function(req, res) {
	
	console.log (" ----------- Estoy en Statics --------------")	

	var estadisticas = {};

    Sequelize.Promise.all(
    [
        models.Quiz.count(),
        models.Comment.count(),
        models.Comment.count({group: '"QuizId"'}),
        models.Comment.count({group: '"QuizId"', where: {publicado:true }}),
        models.Comment.count({group: '"QuizId"', where: {publicado:false}})
    ])
    .then(function(values)
    {
        //El número de preguntas
        numPregTotales = values[0];

        //El número de comentarios totales
        numComTotales = values[1];

        //El número medio de comentarios por pregunta
        numMedioComenPreg = Math.round(values[1] / values[0]);

        //El número de preguntas con comentarios
        numPregComen = values[2].length;

        //El número de preguntas sin comentarios
        pregSinComen = values[0] - values[2].length;
        if(pregSinComen < 0) pregSinComen = 0;

        //El número de preguntas con comentarios publicados
        pregComenPubli = values[3].length;

        //El número de preguntas sin comentarios publicados
        pregSinComenPubli = values[0] - values[3].length;
        if(pregSinComenPubli < 0) pregSinComenPubli = 0;

        //El número de preguntas con comentarios por publicar
        pregConComPendi = values[4].length;


        //res.render('quizes/estadisticas', {estadisticas: estadisticas, errors: []});
       	res.render('quizes/statistics.ejs', {numPregTotales: 	 numPregTotales, 
										 	 numComTotales: 	 numComTotales,
										 	 numMedioComenPreg : numMedioComenPreg,
										 	 numPregComen: 		 numPregComen,
										 	 pregSinComen: 		 pregSinComen,
										 	 pregComenPubli: 	 pregComenPubli,
										 	 pregSinComenPubli:  pregSinComenPubli,
										 	 pregConComPendi: 	 pregConComPendi,
										 	 errors:[]});

    })
    .catch(function(error)
    {
        next(error);
    });
};
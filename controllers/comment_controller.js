var models = require ('../models/models.js');

// Get  /quizes/:quizID(\\d+)/new
exports.new = function (req, res){
	console.log (" ------------   comment controller new !!")
	res.render ('comments/new.ejs', {quizId: req.params.quizId, errors: []} )
};

//POST /quizes/:quizId/comment


exports.create = function (req, res ){
	console.log (" ------------   comment controller create !!")
	var comment	= models.Comment.build(
		 {texto: req.body.comment.texto,
		  QuizId: req.params.quizId
		 }
		);
	comment
		.validate()
		.then(function(err){
			   if (err){
			   					console.log (" ------------   comment controller create !!    --> err: " + err);

			   	res.render('comments/new.ejs', {comment: comment, quizId: req.params.quizId, errors: err.errors} )
			   } else{
			   	comment
			   		.save()
			   		.then( function(){res.redirect('/quizes/' + req.params.quizId)})
			   } // del Else
			 }
			 ).catch (function(error){next(error);});
};
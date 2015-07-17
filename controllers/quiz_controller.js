var models = require('../models/models.js');

// Autoload - factoriza el código si la ruta incluye :quizId
exports.load = function(req, res, next, quizId) {
  models.Quiz.find(quizId).then(
    function(quiz) {
      if (quiz) {
	req.quiz = quiz;
	next();
      } else { next(new Error('No existe quizId= ' + quizId)); }
    }	
  ).catch(function(error) { next(error); } );
};
   
// GET /quizes
// GET /quizes?search=texto_a_buscar
exports.index = function(req, res) {
  // si en la consulta no se pone nada, saldrán todas las preguntas
  var consulta ={};

if(req.query.search) {
  // con trim se eliminan espacios en blanco del principio y del final
  // expresión regular reemplaza blancos intermedios por % 
  // delimitar con %
  var condicion='%' + req.query.search.trim().replace(/\s+/g,"%") + '%';

  // http://docs.sequelizejs.com/en/latest/api/model/#findalloptions-promisearrayinstance
  // lower para que las búsquedas no sean case sensitive
  consulta= {where: ["lower(pregunta) like lower(?)", condicion], order: 'pregunta ASC'};
  }
 
models.Quiz.findAll(consulta).then(function(quizes) {
  res.render('quizes/index', { quizes: quizes});
  }
  ).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz});
};

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto'; 
  if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado});
};

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
  res.render('quizes/index.ejs', { quizes: quizes, errors: []});
  }
  ).catch(function(error) { next(error);})
};

// GET /quizes/:id
exports.show = function(req, res) {
  res.render('quizes/show', { quiz: req.quiz, tema: req.quiz.tema, errors: []});
};  // req.quiz: instancia de quiz cargada con autoload

// GET /quizes/:id/answer
exports.answer = function(req, res) {
  var resultado = 'Incorrecto'; 
  if (req.query.respuesta === req.quiz.respuesta) {
      resultado = 'Correcto';
  }
  res.render('quizes/answer', {quiz: req.quiz, respuesta: resultado, errors: []});
};

// GET /quizes/new
exports.new = function(req, res) {
  var quiz = models.Quiz.build(  // crea objeto quiz
    {pregunta: "Pregunta", respuesta: "Respuesta", tema: "Tema"} 
  );
  res.render('quizes/new', {quiz: quiz, errors: []});
};

// POST /quizes/create
exports.create = function(req, res) {
  var quiz = models.Quiz.build(req.body.quiz);
// guarda en DB los campos pregunta y respuesta de quiz si no hay error
// también el tema
  quiz
  .validate()
  .then(
    function(err){
      if (err) {
	res.render('quizes/new', {quiz: quiz, tema: tema, errors: err.errors});
      } else {
	quiz 
	.save({fields: ["pregunta", "respuesta", "tema"]})
	.then(function(){ res.redirect('/quizes') } )  
      }   // Redirección HTTP (URL relativo) a lista de preguntas
    }
  ).catch(function(error){next(error)});
};

// GET /quizes/:id/edit
exports.edit = function(req, res) {
  var quiz = req.quiz;  // req.quiz: autoload de instancia de quiz
  res.render('quizes/edit', {quiz: quiz, errors: []});
};

// PUT /quizes/:id
exports.update = function(req, res) {
  req.quiz.pregunta  = req.body.quiz.pregunta;
  req.quiz.respuesta = req.body.quiz.respuesta;
  req.quiz.tema = req.body.quiz.tema;  // tema ejercicio módulo 8

  req.quiz
  .validate()
  .then(
    function(err){
      if (err) {
        res.render('quizes/edit', {quiz: req.quiz, errors: err.errors});
      } else {
        req.quiz     // save: guarda campos pregunta y respuesta en DB
        .save( {fields: ["pregunta", "respuesta", "tema"]})
        .then( function(){ res.redirect('/quizes');});
      }     // Redirección HTTP a lista de preguntas (URL relativo)
    }
  ).catch(function(error){next(error)});
};

// DELETE /quizes/:id
exports.destroy = function(req, res) {
  req.quiz.destroy().then( function() {
    res.redirect('/quizes');
  }).catch(function(error){next(error)});
};

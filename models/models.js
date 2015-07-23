// models.js construye la DB y el modelo importando (quiz.js)
// sequelize.sync() construye la DB según define el modelo.

var path = require('path');

// Postgres DATABASE_URL = postgres://user:passwd@host:port/database
// SQLite   DATABASE_URL = sqlite://:@:/
var url = process.env.DATABASE_URL.match(/(.*)\:\/\/(.*?)\:(.*)@(.*)\:(.*)\/(.*)/);
var DB_name  = (url[6]||null);
var user     = (url[2]||null);
var pwd      = (url[3]||null);
var protocol = (url[1]||null);
var dialect  = (url[1]||null);
var port     = (url[5]||null);
var host     = (url[4]||null);
var storage  = process.env.DATABASE_STORAGE;

// Cargar Modelo ORM
var Sequelize = require('sequelize');

// Usar BBDD SQLite o Postgres
var sequelize = new Sequelize(DB_name, user, pwd, 
  { dialect:  protocol,
    protocol: protocol,
    port:     port,
    host:     host,
    storage:  storage,  // solo SQLite (.env)
    omitNull: true      // solo Postgres
  }      
);

// Importar la definición de la tabla Quiz en quiz.js
var Quiz = sequelize.import(path.join(__dirname, 'quiz'));

// Importar definición de la tabla Comment
var comment_path = path.join(__dirname,'comment');
var Comment = sequelize.import(comment_path);

//relación Quiz 1:n Comment. Una pregunta tiene muchos comentarios.
Comment.belongsTo(Quiz);
//Quiz.hasMany(Comment);
// lo anterior deja en la base de datos comentarios con columna QuizId a Null en tabla Comments
// cuando se borran preguntas con comentarios, se puede hacer borrado en cascada
// http://docs.sequelizejs.com/en/latest/api/associations/
// Creating an association will add a foreign key constraint to the attributes. All associations use 
// CASCADE on update and SET NULL on delete, except for n:m, which also uses CASCADE on delete
Quiz.hasMany(Comment, {'hooks': true, 'constraints': true, onDelete: 'cascade'});

exports.Quiz = Quiz; // exportar definición de tabla Quiz
exports.Comment = Comment;

// sequelize.sync() crea e inicializa tabla de preguntas en DB
sequelize.sync().then(function() {
  // then(..) ejecuta el manejador una vez creada la tabla
  Quiz.count().then(function(count) {
    if(count === 0) {   // la tabla se inicializa solo si está vacía
      Quiz.create({ pregunta: 'Capital de Italia',
		    respuesta: 'Roma',
		    tema: 'Humanidades'
		 });
      Quiz.create({ pregunta: 'Capital de Portugal',
		    respuesta: 'Lisboa',
		    tema: 'Humanidades'
		 })
      .then(function(){console.log('Base de datos inicializada')});
     };
   });
});	


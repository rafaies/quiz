// Definición del modelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Quiz',
	    { pregunta: { 
		type: DataTypes.STRING,
		validate: { notEmpty: {msg: "-> Falta Pregunta"} }
	      },
	      respuesta: {
		type: DataTypes.STRING,
		validate: { notEmpty: {msg: "-> Falta Respuesta"} }
              },
	      tema: {
		type: DataTypes.STRING,
		validate: { notEmpty: {msg: "-> Falta Tema"} }
              }
	    }
	 );
}

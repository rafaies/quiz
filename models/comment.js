// Definición del módelo de Quiz con validación

module.exports = function(sequelize, DataTypes) {
  return sequelize.define(
    'Comment',
    { texto: {
        type: DataTypes.STRING,
        validate: { notEmpty: {msg: "-> Falta Comentario"}}
      },
      publicado: {
	type: DataTypes.BOOLEAN,
	defaultValue: false
      }
    },
    {
      classMethods: {
        countUnpublished: function () {
          return this.aggregate('QuizId', 'count', {'where': { 'publicado': false }});
        },
        countCommentedQuizes: function () {
          return this.aggregate('QuizId', 'count', {'distinct': true });
        }
      }
    }
  );
};

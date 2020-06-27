'use strict';
module.exports = (sequelize, DataTypes) => {
  const Fonction = sequelize.define('Fonction', {
    libelle_fonction:
        { type: DataTypes.STRING,
          allowNull: false,
          unique: true,
        }
  }, {});
  Fonction.associate = function(models) {
    // associations can be defined here
    var Utilisateur = require('./utilisateur');
    Fonction.hasMany(models.Utilisateur, {
      foreignKey : 'fonctionId',
      as: 'utilisateur'
    })
  };
  return Fonction;
};

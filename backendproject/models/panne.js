'use strict';
module.exports = (sequelize, DataTypes) => {
  const Panne = sequelize.define('Panne', {
    libelle_panne:
        { type: DataTypes.STRING,
          allowNull: false,
            unique: true,
        }
  }, {});
  Panne.associate = function(models) {
    // associations can be defined here
   var Reclamation = require('./reclamation');
      Panne.belongsToMany(models.Reclamation, {
          through : 'panne_reclamation'
      });
  };
  return Panne;
};

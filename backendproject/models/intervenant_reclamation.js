'use strict';
module.exports = (sequelize, DataTypes) => {
  const Intervenant_reclamation = sequelize.define('Intervenant_reclamation', {
    UtilisateurId : DataTypes.INTEGER,
    ReclamationId : DataTypes.INTEGER,
  }, {});
  Intervenant_reclamation.associate = function(models) {

  };
  return Intervenant_reclamation;
};

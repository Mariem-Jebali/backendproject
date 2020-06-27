'use strict';
module.exports = (sequelize, DataTypes) => {
  const Piece_stock = sequelize.define('Piece_stock', {
    libelle_piece:
         { type: DataTypes.STRING,
      allowNull: false,
           unique: true,
    },
    quantite: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  }, {});
  Piece_stock.associate = function(models) {
    // associations can be defined here
  var Reclamation = require('./reclamation');
    Piece_stock.belongsToMany(models.Reclamation, {
      through: 'Piece_reclamation',
    });
  };
  return Piece_stock;
};

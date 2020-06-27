'use strict';
module.exports = (sequelize, DataTypes) => {
  const Piece_reclamation = sequelize.define('Piece_reclamation', {
      ReclamationId: DataTypes.INTEGER,
      PieceStockId:DataTypes.INTEGER,
      quantite_piece_rec: {
                            type: DataTypes.INTEGER,
                            allowNull: false}


  }, {});
  Piece_reclamation.associate = function(models) {
    // associations can be defined here

  };
  return Piece_reclamation;
};

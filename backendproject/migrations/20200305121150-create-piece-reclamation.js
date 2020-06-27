'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Piece_reclamations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ReclamationId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        // primaryKey: true,
        references: {
          model: 'Reclamations',
          key: 'id',
          as: 'ReclamationId',
        },
      },
      PieceStockId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        // primaryKey: true,
        references: {
          model: 'Piece_stocks',
          key: 'id',
          as: 'PieceStockId',
        },
      },
      quantite_piece_rec: {
        allowNull: false,
        type: Sequelize.INTEGER
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {

        type: Sequelize.DATE
      },

    });
  },
  down: (queryInterface, Sequelize) => {
    return queryInterface.dropTable('Piece_reclamations');
  }
};

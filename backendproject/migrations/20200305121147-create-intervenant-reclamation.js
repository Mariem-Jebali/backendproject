'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Intervenant_reclamations', {
      ReclamationId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'Reclamations',
          key: 'id',
          as: 'ReclamationId',
        },
      },
      UtilisateurId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        onDelete: 'CASCADE',
        references: {
          model: 'Utilisateurs',
          key: 'id',
          as: 'UtilisateurId',
        },
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
    return queryInterface.dropTable('Intervenant_reclamations');
  }
};

'use strict';
module.exports = {
  up: (queryInterface, Sequelize) => {
    return queryInterface.createTable('Reclamations', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      etat: {
        allowNull: false,
        type: Sequelize.ENUM,
        values:['non affecter' ,'affecter','traiter','cloturer']
      },
      priorite: {
        allowNull: false,
        type: Sequelize.ENUM,
        values:['bas','moyenne','haut']
      },
      date_envoi: {
        allowNull: false,
        type: Sequelize.DATE
      },
      observation: {
        type: Sequelize.TEXT
      },
      date_affectation: {
        type: Sequelize.DATE
      },
      date_deb_interv: {
        type: Sequelize.DATE
      },
      date_limit_interv: {
        type: Sequelize.DATE
      },
      date_fin_inter: {
        type: Sequelize.DATE
      },
      description_interv: {
        type: Sequelize.TEXT
      },
      empId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'emplacements',
          key: 'id',
          as: 'empId',
        },
      },
      gouvId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'utilisateurs',
          key: 'id',
          as: 'gouvId',
        },
      },
      respId: {
        type: Sequelize.INTEGER,
        onDelete: 'CASCADE',
        references: {
          model: 'utilisateurs',
          key: 'id',
          as: 'respId',
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
    return queryInterface.dropTable('Reclamations');
  }
};

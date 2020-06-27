'use strict';
module.exports = (sequelize, DataTypes) => {
    const Reclamation = sequelize.define('Reclamation', {
        respId: DataTypes.INTEGER,
        gouvId: DataTypes.INTEGER,
        empId: DataTypes.INTEGER,
        etat:
            {
                type: DataTypes.ENUM,
                values: ['non affecter', 'affecter','traiter', 'cloturer'],
                allowNull: false,
            },
        priorite:
            {
                type: DataTypes.ENUM,
                values: ['bas', 'moyenne', 'haut'],
                allowNull: false,
            },
        date_envoi:
            {
                type: DataTypes.DATE,
                allowNull: false
            },
        observation: DataTypes.TEXT,
        date_affectation: DataTypes.DATE,
        date_limit_interv: DataTypes.DATE,
        date_deb_interv: DataTypes.DATE,
        date_fin_inter: DataTypes.DATE,
        description_interv: DataTypes.TEXT
    }, {});
    Reclamation.associate = function (models) {
        // associations can be defined here
        var Panne = require('./panne');
        var Piece_stock = require('./piece_stock');
        var Utilisateur = require('./utilisateur');
        var Emplacement = require('./emplacement');
        Reclamation.belongsToMany(models.Utilisateur, {
            through : 'Intervenant_reclamation',
            as: 'Intervenants'
        });
        Reclamation.belongsTo(models.Utilisateur, {
            foreignKey: 'respId',
            onDelete: 'CASCADE',
             as: 'Responsable'
        });
        Reclamation.belongsTo(models.Utilisateur, {
            foreignKey: 'gouvId',
            onDelete: 'CASCADE',
            as: 'Gouvernante'
        });

        Reclamation.belongsTo(models.Emplacement, {
            foreignKey: 'empId',
            onDelete: 'CASCADE',
        });

        Reclamation.belongsToMany(models.Panne, {
           through:  'Panne_reclamation'
        });
        Reclamation.belongsToMany(models.Piece_stock, {
            through: 'Piece_reclamation',
        });

    };
    return Reclamation;
};

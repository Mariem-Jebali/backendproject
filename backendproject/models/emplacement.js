'use strict';
module.exports = (sequelize, DataTypes) => {
    var Emplacement = sequelize.define('Emplacement', {
        reference:
            {
                type: DataTypes.STRING,
                allowNull: false,
            },
        type:
            {
                type: DataTypes.STRING,
                allowNull: false,
            },
        libelle_emplacement:
            {
                type: DataTypes.STRING,
                allowNull: false,
            },
        description: {
             type: DataTypes.STRING,
         },

    }, {});
    Emplacement.associate = function (models) {
        var Reclamation = require('./reclamation');
       Emplacement.hasMany(models.Reclamation, {
            foreignKey: 'empId',
            as: 'reclamation'
        });
    };
    return Emplacement;
};

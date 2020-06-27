'use strict';
module.exports = (sequelize, DataTypes) => {
    const Panne_reclamation = sequelize.define('Panne_reclamation', {
        PanneId : DataTypes.INTEGER,
        ReclamationId : DataTypes.INTEGER,
    }, {});
    Panne_reclamation.associate = function(models) {
        // associations can be defined here

    };
    return Panne_reclamation;
};

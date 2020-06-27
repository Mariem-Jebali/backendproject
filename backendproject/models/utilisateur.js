'use strict';
module.exports = (sequelize, DataTypes) => {
  const Utilisateur = sequelize.define('Utilisateur', {
      fonctionId :DataTypes.INTEGER,
    nom:
        { type: DataTypes.STRING,
          allowNull: false,
        },

    prenom:
        { type: DataTypes.STRING,
      allowNull: false,
     },
    email: { type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          msg: "Email address must be valid"
        },
      }
    },
    mdp:
    { type: DataTypes.STRING,
      allowNull: false,
    },
    telephone:
  { type: DataTypes.STRING,
      allowNull: false,
  },
    /*fonction:
        { type: DataTypes.STRING,
          allowNull: false,
        }*/
  }, {});
  Utilisateur.associate = function(models) {
    // associations can be defined here
      var Reclamation = require('./reclamation');
      var Fonction = require('./fonction');
      Utilisateur.belongsToMany(models.Reclamation, {
          through :'Intervenant_reclamation',
          as: 'Intervenants'
      });
      Utilisateur.belongsTo(models.Fonction, {
          foreignKey : 'fonctionId',
          onDelete: 'CASCADE',
      });

    Utilisateur.hasMany(models.Reclamation, {
      foreignKey: 'respId',
      onDelete: 'CASCADE',
        as: 'Responsable'
    });

    Utilisateur.hasMany(models.Reclamation, {
      foreignKey:'gouvId',
      onDelete: 'CASCADE',
        as: 'Gouvernante'
    });


  };
  return Utilisateur;
};

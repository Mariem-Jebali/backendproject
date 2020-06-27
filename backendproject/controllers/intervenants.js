const Reclamation = require('../models').Reclamation;
const Utilisateur = require('../models').Utilisateur;
const Intervenant_reclamation = require('../models').Intervenant_reclamation;
const Fonction = require('../models').Fonction;
const adminId= require('../config/config.json').adminId;
const gouvernanteId= require('../config/config.json').gouvernanteId;
const responsableId= require('../config/config.json').responsableId;
const jwt = require('jsonwebtoken');
module.exports = {
    // afficher pour le responsable tous les intervenants de son equipe
    list(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata){
            if(err){
                return res.status(400).json({message:' Demande non autorisée'});
            }
            if(tokendata){
                decodedToken = tokendata;

                if ((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )){
                    return res.status(400).json({message: ' Demande non autorisée'});
                }
            }

            const { Op } = require("sequelize");
            return Utilisateur.findAll(
                {
                    where: {fonctionId : {
                        [Op.notIn] : [adminId, gouvernanteId, responsableId]
                        }},
                    include:{
                        model : Fonction,
                        attributes: {exclude: ['id',"createdAt","updatedAt"]}
                    },


                    attributes :{ exclude:['fonctionId',"email", "mdp", "dateNaissance", "createdAt", "updatedAt"]}
                })
                .then(utilisateur => res.json(utilisateur))
                .catch(error => res.json({message:'Une erreur s\'est produite lors de la récupération de tous les utilisateurs', error}));//------not sure here ??????

        });
    },
    //afficher le planning d'un intervenant
    planning(req,res){
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata){
            if(err){
                return res.status(400).json({message:' Demande non autorisée'});
            }
            if(tokendata){
                decodedToken = tokendata;

                if((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )){
                    return res.status(400).json({message: ' Demande non autorisée'});
                }
            }
            return Reclamation.findAll({
                where: {etat: 'affecter'},
                include: [
                    {
                        model: Utilisateur,
                        as: 'Intervenants',
                        where: {id: req.params.id}, //id pour intervenant id
                        attributes:[],
                        through: {attributes: []}
                    },

                ],
                attributes: {exclude: ['empId', 'etat','observation','date_envoi','priorite','respId', 'gouvId', 'date_affectation', 'date_fin_inter', 'description_interv', "createdAt", "updatedAt"]}
            }).then(reclamation => {
                if (!reclamation) {
                    return res.json({message: 'reclamations introuvable.',});
                }
                return res.json(reclamation);
            })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération des reclamations ',
                    error
                }));

        })

    }


};

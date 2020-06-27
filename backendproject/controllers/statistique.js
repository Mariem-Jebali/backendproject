const Reclamation = require('../models').Reclamation;
const Panne = require('../models').Panne;
const Panne_reclamation = require('../models').Panne_reclamation;
const Utilisateur = require('../models').Utilisateur;
const sequelize = require('sequelize');
var mysql = require('mysql');
var env       = process.env.NODE_ENV || 'development';
var config    = require(__dirname +'/../config/config.json')[env];
module.exports = {

    /*--------------------------------  stat des reclamations ----------------------------------------------------------  */
    // Reclamation envoyer par jour
    RecEnvoyerJour(req, res) {
        // const date = new Date();
        //  date.setDate(date.getDate()+1)
        // const today= date.toISOString().slice(0,10);

        const {Op} = require("sequelize");
        const date = new Date();
        const today = date.toISOString().slice(0, 10);
        const deb = today + ' 01:00:00'
        const fin = today + ' 23:59:59'
        return Reclamation
            .findAll({
                where: [{etat: "non affecter"} && {date_envoi: {[Op.between]: [deb, fin]}}],
           attributes: [[sequelize.fn('COUNT', 'id'), 'RecCount']]

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

    },

    // reclamation traitée par jour

    RecTraiterJour(req, res) {
        const {Op} = require("sequelize");
        const date = new Date();
        const today = date.toISOString().slice(0, 10);
        const deb = today + ' 01:00:00'
        const fin = today + ' 23:59:59'
        return Reclamation
            .findAll({
                where: [{etat: "Traiter"} && {date_fin_inter: {[Op.between]: [deb, fin]}}],

               attributes: [[sequelize.fn('COUNT', 'id'), 'RecCount']]
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
    },
// Reclamation non traiter par jour
    RecNonTraiterJour(req, res) {

        const {Op} = require("sequelize");
        const date = new Date();
        const today = date.toISOString().slice(0, 10);
        const deb = today + ' 01:00:00'
        const fin = today + ' 23:59:59'
        return Reclamation
            .findAll({
                where: [{etat: "affecter"} && {date_affectation: {[Op.between]: [deb, fin]}}],

                attributes: [[sequelize.fn('COUNT', 'id'), 'RecCount']]
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

    },

    /*-------------------------------------  stat des pannes -------------------------------------------------------  */
    statPanne(req,res){
    var con = mysql.createConnection({
        host: config.host,
        user: config.username,
        password: config.password,
        database: config.database
    });

    con.connect(function(err) {
        if (err) throw err;
        con.query("SELECT libelle_panne, COUNT(PanneId) as panneCount FROM panne_reclamations, pannes where panne_reclamations.PanneId = pannes.id GROUP BY PanneId ", function (err, result, fields) {
            if (err) throw err;
            return res.json(result)
        });
    });
},

    /*-------------------------------------  stat reclamation par gouv ------------------------------------------------  */

    GouvernanteRec(req, res) {

        return Reclamation
            .findAll({
                attributes: [[sequelize.fn('COUNT', 'gouvId'), 'GouvCount']],
                group: ['gouvId'],
                include:[{
                        model: Utilisateur,
                        attributes: ["nom","prenom"],
                        as: 'Gouvernante',
                }]
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
    },
    /*-------------------------------------  stat sur les dates d'interventions-------------------------------------*/
    // respectdate(req,res){
    //     const {Op} = require("sequelize");
    //     return Reclamation
    //         .findAll({
    //             where: [{etat: {[Op.in]: ["Traiter","cloturer"]}}  ],
    //             //&& {date_fin_inter : date_limit_interv}
    //           //  attributes: [[sequelize.fn('COUNT', 'id'), 'RespectCount']]
    //             attributes:["id"]
    //         }).then(reclamation => {
    //             if (!reclamation) {
    //                 return res.json({message: 'reclamations introuvable.',});
    //             }
    //             return res.json(reclamation);
    //         })
    //         .catch(error => res.json({
    //             message: 'Une erreur s\'est produite lors de la récupération des reclamations ',
    //             error
    //         }));
    //
    // },
    nonrespectdate(req,res){
        var con = mysql.createConnection({
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database
        });

        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT COUNT(*) as respectCount FROM reclamations where  (etat='Traiter' or etat='cloturer') AND (date_fin_inter > date_limit_interv) ", function (err, result, fields) {
                if (err) throw err;
                return res.json(result)
            });
        });
    },
    respectdate(req,res){
            var con = mysql.createConnection({
                host: config.host,
                user: config.username,
                password: config.password,
                database: config.database
            });

            con.connect(function(err) {
                if (err) throw err;
                con.query("SELECT COUNT(*) as respectCount FROM reclamations where  (etat='Traiter' or etat='cloturer') AND (date_fin_inter <= date_limit_interv) ", function (err, result, fields) {
                    if (err) throw err;
                    return res.json(result)
                });
            });
        },
    /*-------------------------------------  stat les pièces bientot epuisées-------------------------------------*/
    stockepuise(req,res){
        var con = mysql.createConnection({
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database
        });

        con.connect(function(err) {
            if (err) throw err;
            con.query("SELECT id,libelle_piece,quantite FROM piece_stocks where  quantite<=1 ", function (err, result, fields) {
                if (err) throw err;
                return res.json(result)
            });
        });
    },

    /*-------------------------------------  stat reclamations par type d'emplacement-------------------------------------*/

    recTypeEmplacement(req,res){
        var con = mysql.createConnection({
            host: config.host,
            user: config.username,
            password: config.password,
            database: config.database
        });

 con.connect(function(err) {
 if (err) throw err;
con.query("SELECT type, COUNT(empId) as emplacementCount FROM reclamations, emplacements where reclamations.empId = emplacements.id GROUP BY type ", function (err, result, fields) {
 if (err) throw err;
 return res.json(result)
            });
        });
    },
};

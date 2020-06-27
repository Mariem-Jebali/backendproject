const Reclamation = require('../models').Reclamation;
const Panne = require('../models').Panne;
const Panne_reclamation = require('../models').Panne_reclamation;
const Utilisateur = require('../models').Utilisateur;
const Fonction = require('../models').Fonction;
const Emplacement = require('../models').Emplacement;
const Intervenant_reclamation = require('../models').Intervenant_reclamation;
const Piece_reclamation = require('../models').Piece_reclamation;
const Piece_stock = require('../models').Piece_stock;
const jwt = require('jsonwebtoken');
const adminId= require('../config/config.json').adminId;
 const gouvernanteId= require('../config/config.json').gouvernanteId;
 const responsableId= require('../config/config.json').responsableId;



module.exports = {
    // -------------------API de gouvernante----------------------------

    envoi(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if (!(decodedToken.fonctionId === gouvernanteId)) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }
            }
            let current_date = Date.now();
            console.log(current_date)
            return Reclamation
                .create({
                    gouvId: decodedToken.id,
                    empId: req.body.empId,
                    priorite: req.body.priorite,
                    date_envoi: current_date,
                    observation: req.body.observation,
                    etat: 'non affecter'
                }).then(function (reclamation) {
                    let reclamationid = reclamation.id;
                    let PanneId = req.body.PanneId;
                    let arraypanne = PanneId;
                    for (var i = 0; i < arraypanne.length; i++) {
                        Panne_reclamation.create({
                            ReclamationId: reclamationid,
                            PanneId: arraypanne[i],
                        })
                    }
                    return reclamation
                }).then(reclamation => {
                    if (!reclamation) {
                        return res.json({message: 'Erreur!'});
                    }
                    return res.json(reclamation);
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de l\'envoi de reclamation',
                    error
                }));
        })
    },

    //liste de toutes les  reclamations par gouvernante id

    gouverReclamationall(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if (!(decodedToken.fonctionId === gouvernanteId)) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }
            }
            return Reclamation.findAll({
                where: {gouvId: decodedToken.id},

                include: [
                    {
                        model: Utilisateur,
                        as: 'Gouvernante',
                        attributes:["prenom"]
                    },
                    {
                        model: Emplacement,
                        attributes: ['libelle_emplacement']
                    },
                    {
                        model: Panne,
                        attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                        through: {attributes: []} //pour n'est pas afficher le contenu de la table Panne_reclamation le resultat de belongsToMany
                    }],
                order:  [['id' , 'DESC']],
                attributes: {exclude: ['empId','date_limit_interv' ,'respId', 'gouvId', 'date_affectation', 'date_deb_interv', 'date_fin_inter', 'description_interv', "createdAt", "updatedAt"]}
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
    },


//afficher une seule reclamation par gouvernante

    gouverReclamationone(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if (!(decodedToken.fonctionId === gouvernanteId)) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }
            }
            // let userId = req.params.userId;
            return Reclamation
                .findOne(
                    {
                        where: {id: req.params.id},
                        include: [
                            {
                                model: Utilisateur,
                                as: 'Gouvernante',
                                where: [{id: decodedToken.id}],
                                attributes: {exclude: ["id", "fonctionId", "nom", "prenom", "email", "mdp", "dateNaissance", "telephone", "createdAt", "updatedAt"]}
                            },
                            {
                                model: Emplacement,
                                attributes: ['libelle_emplacement']
                            },
                            {
                                model: Panne,
                                attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                                through: {attributes: []} //pour n'est pas afficher le contenu de la table Panne_reclamation le resultat de belongsToMany
                            },
                        ],
                        attributes: {exclude: ['empId','date_limit_interv' ,'respId', 'gouvId', 'date_affectation', 'date_deb_interv', 'date_fin_inter', 'description_interv', "createdAt", "updatedAt"]}
                    }).then(reclamation => {
                    if (!reclamation) {
                        return res.json({message: 'reclamation introuvable.',});
                    }
                    return res.json(reclamation);
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de la reclamation ',
                    error
                }));
        })
    },
    // -------------------API de responsable maintennace ----------------------------------------------------------
    //afficher toutes les reclamations non affectées
    list(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                // if ((decodedToken.fonctionId !== responsableId)||(decodedToken.fonctionId !==adminId )) {
                //     return res.status(400).json({message: 'Demande non autorisée'});
                // }

                if ((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                        return res.status(400).json({message: 'Demande non autorisée'});
                    }
            }
            return Reclamation
                .findAll({
                    where: {etat: "non affecter"},
                    include: [

                        {
                            model: Emplacement,
                            attributes: ['libelle_emplacement']
                        },
                        {
                            model: Panne,
                            attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                            through: {attributes: []}
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", 'nom', 'telephone', "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Gouvernante',
                        },
                    ],

                    attributes: {exclude: ['etat','gouvId','empId','respId','date_limit_interv','date_affectation', 'date_deb_interv', 'date_fin_inter', 'description_interv', "createdAt", "updatedAt"]}
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
    },
    //afficher  les reclamations non affectées par id
    retrieve(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )){
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
            return Reclamation
                .findAll(
                    {
                        where: [{id: req.params.id}, {etat: "non affecter"}],
                        include: [
                            {
                                model: Utilisateur,
                                as: 'Gouvernante',
                                attributes: {exclude: ["fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]}
                            },
                            {
                                model: Emplacement,
                                attributes: ['libelle_emplacement']
                            },
                            {
                                model: Panne,
                                attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                                through: {attributes: []}
                            },
                        ],
                        attributes: {exclude: ['gouvId', 'empId','date_limit_interv','respId', 'date_affectation', 'date_deb_interv', 'date_fin_inter', 'description_interv', "createdAt", "updatedAt"]}

                    }
                )
                .then(utilisateur => {
                    if (!utilisateur) {
                        return res.json({message: 'Reclamation introuvable.',});
                    }
                    return res.json(utilisateur);
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de la réclamation ',
                    error
                }));
        })
    },
    //affecter un ordre de travail (modifier table reclamation)
    affecter(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
            let current_date = Date.now();
            return Reclamation
                .findOne({where: [{id: req.params.id}, {etat: 'non affecter'}]})
                .then(reclamation => {
                    if (!reclamation) {
                        return res.json({message: 'Reclamation introuvable ou affectée.',});
                    }
                    return reclamation
                        .update({
                            date_affectation: current_date,
                            date_deb_interv: req.body.date_deb_interv,
                            date_limit_interv: req.body.date_limit_interv,
                            respId: decodedToken.id,
                            etat: 'affecter',
                        })
                        .then(function () {
                            let reclamationid = reclamation.id;
                            let UtilisateurId = req.body.UtilisateurId;
                            let arrayintervenant = UtilisateurId;
                            for (var i = 0; i < arrayintervenant.length; i++) {
                                Intervenant_reclamation.create({
                                    UtilisateurId: arrayintervenant[i],
                                    ReclamationId: reclamationid,
                                })
                            }
                        }).then(resultat => {
                        res.json(reclamation);
                        res.json(resultat);
                        })
                        .catch(error => res.json({message: 'Impossible d\'affecter un ordre de tarvail.', error}));

                })
        })
    },


    modifier(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
            let current_date = Date.now();
            return Reclamation
                .findOne({where: [{id: req.params.id}, {etat: 'affecter'}]})
                .then(reclamation => {
                    if (!reclamation) {
                        return res.json({message: 'Reclamation introuvable.',});
                    }
                    return reclamation
                        .update({
                            date_affectation: current_date,
                            date_deb_interv: req.body.date_deb_interv,
                            date_limit_interv: req.body.date_limit_interv,
                            respId: decodedToken.id,
                            etat: 'affecter',
                        })
                        .then(function () {
                            let reclamationid = reclamation.id;
                            Intervenant_reclamation.destroy({where:{ReclamationId: reclamationid}}
                            ).then(intervenant=>{
                            let reclamationid = reclamation.id;
                            let UtilisateurId = req.body.UtilisateurId;
                            let arrayintervenant = UtilisateurId;
                            for (var i = 0; i < arrayintervenant.length; i++) {
                                Intervenant_reclamation.create({
                                    UtilisateurId: arrayintervenant[i],
                                    ReclamationId: reclamationid,
                                })
                            }})})
                        .then(resultat => {
                            res.json(reclamation);
                            res.json(resultat);
                        })
                        .catch(error => res.json({message: 'Impossible de modifier un ordre de tarvail.', error}));
                })
        })
    },
    //liste de toutes les reclamations non traiter = affecter
    nonTraiterList(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
            return Reclamation
                .findAll({
                    where: {etat: "affecter"},
                    include: [
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", 'nom', 'telephone', "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Responsable',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", 'nom', 'telephone', "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Gouvernante',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ["id", "fonctionId", 'nom', 'telephone', "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Intervenants',
                            through: {attributes: []}
                        },
                        {
                            model: Emplacement,
                            attributes: ['libelle_emplacement']
                        },
                        {
                            model: Panne,
                            attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                            through: {attributes: []}
                        },

                    ],
                    order:  [['id' , 'DESC']],
                    attributes: {exclude: ['respId', "date_envoi","date_fin_inter" ,"description_interv",'gouvId', 'etat', 'empId', "createdAt", "updatedAt"]}
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
    },
    //liste des reclamations non traitées par id
    nonTraiterOne(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )){
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
            return Reclamation
                .findAll({
                    where: [{id: req.params.id}, {etat: "affecter"}],
                    include: [
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Responsable',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Gouvernante',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ["id", "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Intervenants',
                            include: {
                                model: Fonction,
                                attributes: {exclude: ['id', "createdAt", "updatedAt"]}
                            },
                            through: {attributes: []}
                        },
                        {
                            model: Emplacement,
                            attributes: ['libelle_emplacement']
                        },
                        {
                            model: Panne,
                            attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                            through: {attributes: []}
                        },

                    ],
                    attributes: {exclude: ['etat','respId',"date_envoi","date_fin_inter" ,"description_interv", 'gouvId', 'empId', "createdAt", "updatedAt"]}
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
    },
    // liste de toutes les reclamations trairées
    traiterlist(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
            return Reclamation
                .findAll({
                    where: {etat: "Traiter"},
                    include: [
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", 'nom', 'telephone', "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Responsable',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", 'nom', 'telephone', "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Gouvernante',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ["id", "fonctionId", 'nom', 'telephone', "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Intervenants',

                            through: {attributes: []}
                        },
                        {
                            model: Emplacement,
                            attributes: ['libelle_emplacement']
                        },
                        {
                            model: Panne,
                            attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                            through: {attributes: []}
                        },
                        {
                            model: Piece_stock,
                            attributes: ["libelle_piece"],
                            through: {attributes: []}
                        }
                    ],
                    order:  [['date_fin_inter' , 'DESC']],
                    attributes: {exclude: ['etat','respId', 'gouvId', 'empId', "createdAt", "updatedAt"]}
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
    },
    //liste des reclamations traitées par id

    traiterOne(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
                if (err) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }
                if (tokendata) {
                    decodedToken = tokendata;
                    if((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                        return res.status(400).json({message: 'Demande non autorisée'});
                    }

                }
        return Reclamation
            .findAll({
                where: [{id: req.params.id}, {etat: "Traiter"}],
                include: [
                    {
                        model: Utilisateur,
                        attributes: {exclude: ['id', "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                        as: 'Responsable',
                    },
                    {
                        model: Utilisateur,
                        attributes: {exclude: ['id', "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                        as: 'Gouvernante',
                    },
                    {
                        model: Utilisateur,
                        attributes: {exclude: ["id", "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                        as: 'Intervenants',
                        include: {
                            model: Fonction,
                            attributes: {exclude: ['id', "createdAt", "updatedAt"]}
                        },
                        through: {attributes: []}
                    },
                    {
                        model: Emplacement,
                        attributes: ['libelle_emplacement']
                    },
                    {
                        model: Panne,
                        attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                        through: {attributes: []}
                    },
                    {
                        model: Piece_stock,
                        attributes: ["libelle_piece"],
                        through: {
                            attributes: ['quantite_piece_rec'],

                        }
                    }
                ],
                attributes: {exclude: ['etat','respId', 'gouvId', 'etat', 'empId', "createdAt", "updatedAt"]}
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
    },

    // cloturer un OT
    cloturer(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
            return Reclamation
                .findOne({where: [{id: req.params.id}, {etat: 'traiter'}]})
                .then(reclamation => {
                    if (!reclamation) {
                        return res.json({message: 'Reclamation introuvable ou affectée.',});
                    }
                    return reclamation
                        .update({
                            etat: 'cloturer'
                        }).then(resultat => {
                            res.json(reclamation);
                            res.json(resultat)
                        })
                        .catch(error => res.json({message: 'Impossible de cloturer un ordre de tarvail.', error}));

                })
        })
    },
    // liste de toutes les reclamations cloturées
    cloturerlist(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )){
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
            return Reclamation
                .findAll({
                    where: {etat: "cloturer"},
                    include: [
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", 'nom', 'telephone', "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Responsable',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", 'nom', 'telephone', "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Gouvernante',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ["id", "fonctionId", 'nom', 'telephone', "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Intervenants',
                            through: {attributes: []}
                        },
                        {
                            model: Emplacement,
                            attributes: ['libelle_emplacement']
                        },
                        {
                            model: Panne,
                            attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                            through: {attributes: []}
                        },
                        {
                            model: Piece_stock,
                            attributes: ["libelle_piece"],
                            through: {attributes: []}
                        }
                    ],
                    order:  [['id' , 'DESC']],
                    attributes: {exclude: ['etat','respId', 'gouvId', 'empId', "createdAt", "updatedAt"]}
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
    },

    // afficher une reclamation cloturer par id
    cloturerOne(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
            return Reclamation
                .findAll({
                    where: [{id: req.params.id}, {etat: "cloturer"}],
                    include: [
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Responsable',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Gouvernante',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ["id", "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Intervenants',
                            include: {
                                model: Fonction,
                                attributes: {exclude: ['id', "createdAt", "updatedAt"]}
                            },
                            through: {attributes: []}
                        },
                        {
                            model: Emplacement,
                            attributes: ['libelle_emplacement']
                        },
                        {
                            model: Panne,
                            attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                            through: {attributes: []}
                        },
                        {
                            model: Piece_stock,
                            attributes: ["libelle_piece"],
                            through: {
                                attributes: ['quantite_piece_rec'],

                            }
                        }
                    ],
                    attributes: {exclude: ['etat','respId', 'gouvId', 'etat', 'empId', "createdAt", "updatedAt"]}
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
    },

    ResponsableTraiter(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                fonctionId = decodedToken.fonctionId;
                if((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )){
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
               idrec= req.params.id;
            return Reclamation
                .findOne({
                    where: [{id: req.params.id}, {etat: 'affecter'}],
                    include: [
                        {
                            model: Utilisateur,
                            as: 'Intervenants',
                            attributes: {exclude: ['id', "fonctionId", "nom", "prenom", "email", "mdp", "dateNaissance", "telephone", "createdAt", "updatedAt"]},
                            include: {
                                model: Fonction,
                                attributes: {exclude: ['id', "createdAt", "updatedAt"]}
                            },
                            through: {attributes: []}
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "telephone", "nom", "prenom", "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Responsable',
                        },
                        {
                            model: Utilisateur,
                            attributes: {exclude: ['id', "telephone", "nom", "prenom", "fonctionId", "email", "mdp", "dateNaissance", "createdAt", "updatedAt"]},
                            as: 'Gouvernante',
                        },
                        {
                            model: Emplacement,
                            attributes: ['libelle_emplacement']
                        },
                        {
                            model: Panne,
                            attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                            through: {attributes: []} //pour n'est pas afficher le contenu de la table Panne_reclamation le resultat de belongsToMany
                        }
                    ]
                })
                .then(reclamation => {

                    if (!reclamation) {

                        return res.json({message: 'Reclamation introuvable ou affectée.',});
                    }
                   //    return  idrec;
                    return reclamation
                        .update({
                            date_fin_inter: req.body.date_fin_inter ,
                            description_interv: req.body.description_interv ,
                            etat: 'Traiter' ,
                        })
                        .then(function (reclamation) {
                            let reclamationid = reclamation.id;
                            let PieceStockId = req.body.PieceStockId;
                            let quantite = req.body.quantite;
                            let arraypiece = PieceStockId;
                            let arrayquantite = quantite;
                            for (var j = 0; j < arraypiece.length; j++) {
                                Piece_reclamation.create({
                                    ReclamationId: reclamationid,
                                    quantite_piece_rec: arrayquantite[j],
                                    PieceStockId: arraypiece[j],
                                });
                                let tab = arrayquantite[j];
                                Piece_stock.findOne({where: {id: arraypiece[j]}})
                                    .then(piece => {
                                        if (!piece) {
                                            return res.json({message: 'piece introuvable ou affectée.',});
                                        }
                                        return piece
                                            .update({
                                                quantite: piece.quantite - parseInt(tab)
                                            })
                                    })
                            }
                            return reclamation
                        }).then(reclamation => {
                            res.json(reclamation)
                        })


                        .catch(error => res.json({message:'Impossible de traiter ce OT ', error}));

                })
       })
    },


// -------------------API de l'intervenant --------------------------------------------------------------

    //afficher tous les ordres de travail
    OTListAll(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                // if(decodedToken.fonctionId === [responsableId,gouvernanteId,adminId]){
                //     return res.status(400).json({message: 'Demande non autorisée'});
                // }
                if ((decodedToken.fonctionId === responsableId)||(decodedToken.fonctionId === adminId) ||
                    (decodedToken.fonctionId === gouvernanteId)) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }
            }
            return Reclamation
                .findAll({
                    where: {etat: 'affecter'},
                    include:
                        [{
                            model: Utilisateur,
                            as: 'Intervenants',
                            where: {id:decodedToken.id},
                            attributes:[],
                            through: {attributes: []}
                        },
                            {
                                model: Utilisateur,
                                as: 'Responsable',
                                attributes: ["prenom"],
                            },
                            {
                                model: Utilisateur,
                                as: 'Gouvernante',
                                attributes: ["prenom"]
                            },
                            {
                                model: Emplacement,
                                attributes: ['libelle_emplacement']
                            },
                            {
                                model: Panne,
                                attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                                through: {attributes: []} //pour n'est pas afficher le contenu de la table Panne_reclamation le resultat de belongsToMany
                            }
                        ],
                    attributes: {exclude: ['etat', 'gouvId','respId','date_envoi','empId', 'date_affectation', 'date_fin_inter', 'description_interv', "createdAt", "updatedAt"]}
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
    },


    //afficher chaque ordre de travail par id

    OTListOne(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if((decodedToken.fonctionId === responsableId)||(decodedToken.fonctionId === adminId)
                    ||(decodedToken.fonctionId === gouvernanteId)){
                    return res.status(400).json({message: 'Demande non autorisée'});
                }
            }

            return Reclamation
                .findOne({
                    where: [{id: req.params.id}, {etat: 'affecter'}],
                    include:
                        [{
                            model: Utilisateur,
                            as: 'Intervenants',
                          where: {id: decodedToken.id}, //id pour intervenant id
                            attributes: [],
                            include:[{model: Fonction,
                            attributes:["libelle_fonction"]}],
                            through: {attributes: [],

                            }},
                            {
                                model: Utilisateur,
                                attributes: ["nom","prenom","telephone"],
                                as: 'Responsable',
                            },
                            {
                                model: Utilisateur,
                                attributes: ["nom","prenom","telephone"],
                                as: 'Gouvernante',
                            },
                            {
                                model: Emplacement,
                                attributes: ['libelle_emplacement']
                            },
                            {
                                model: Panne,
                                attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                                through: {attributes: []}
                            }
                        ],

                    attributes: {exclude: ['etat', 'empId', 'gouvId', 'respId', 'date_affectation', 'date_fin_inter', 'description_interv', "createdAt", "updatedAt"]}
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
    },
    //traiter les Ot
    remplir(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                fonctionId = decodedToken.fonctionId;
                if((decodedToken.fonctionId === responsableId)||(decodedToken.fonctionId === adminId)
                    ||(decodedToken.fonctionId === gouvernanteId)){
                    return res.status(400).json({message: 'Demande non autorisée'});
                }
            }

            return Reclamation
                .findOne({
                    where: [{id: req.params.id}, {etat: 'affecter'}],
                    include: [
                        {
                            model: Utilisateur,
                            as: 'Intervenants',
                            where: {id: decodedToken.id }, //id pour intervenant id
                            attributes: [],
                            through: {attributes: []}

                        },
                        {
                            model: Utilisateur,
                            attributes: [],
                            as: 'Responsable',
                        },
                        {
                            model: Utilisateur,
                            attributes: [],
                            as: 'Gouvernante',
                        },
                        {
                            model: Emplacement,
                            attributes: ['libelle_emplacement']
                        },
                        {
                            model: Panne,
                            attributes: {exclude: ['id', 'createdAt', 'updatedAt']},
                            through: {attributes: []} //pour n'est pas afficher le contenu de la table Panne_reclamation le resultat de belongsToMany
                        }
                    ]
                })
                .then(reclamation => {
                    if (!reclamation) {
                        return res.json({message: 'Reclamation introuvable ou affectée.',});
                    }
                    return reclamation
                        .update({
                            date_fin_inter: req.body.date_fin_inter ,
                            description_interv: req.body.description_interv ,
                            etat: 'Traiter',
                        })
                        .then(function (reclamation) {
                            let reclamationid = reclamation.id;
                            let PieceStockId = req.body.PieceStockId;
                            let quantite = req.body.quantite;
                            let arraypiece = PieceStockId;
                            let arrayquantite = quantite;
                            for (var j = 0; j < arraypiece.length; j++) {
                                Piece_reclamation.create({
                                    ReclamationId: reclamationid,
                                    quantite_piece_rec: arrayquantite[j],
                                    PieceStockId: arraypiece[j],
                                });
                                let tab = arrayquantite[j];
                                Piece_stock.findOne({where: {id: arraypiece[j]}})
                                    .then(piece => {
                                        if (!piece) {
                                            return res.json({message: 'piece introuvable ou affectée.',});
                                        }
                                        return piece
                                            .update({
                                                quantite: piece.quantite - parseInt(tab)
                                            })
                                    })
                            }
                            return reclamation
                        }).then(reclamation => {
                            res.json(reclamation)
                        })


                      .catch(error => res.json({message:'Impossible de traiter ce OT ', error}));

                })
        })
    },

};

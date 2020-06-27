const Utilisateur = require('../models').Utilisateur;
const Fonction = require('../models').Fonction;
var bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
const adminId = require('../config/config.json').adminId;
module.exports = {

    modifierMdp(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
              ancien= decodedToken.mdp

            }

            return Utilisateur
                .findOne({where: {id: decodedToken.id}})
                .then(utilisateur => {
                        ancienmdp2 = bcrypt.hashSync(req.body.ancienmdp, saltRounds);
                        ancienmdp = req.body.ancienmdp;
                        bcrypt.compare(req.body.ancienmdp, decodedToken.mdp, function (err, result) {
                            if (!result) {
                                res.json({message: 'Ancien mot de passe incorrect'})
                            }
                            if (result) {
                             return   utilisateur.update({
                                    mdp: bcrypt.hashSync(req.body.mdp, saltRounds)
                                })
                                 .then(resultat=>
                               {      if(resultat){ res.json({message: 'modification avec sucées'})}
                               }
                                 )
                            }
                        })

                    }

                ).catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la modification de mot de passe', error
                }));

        })
    },


    create(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if (!(decodedToken.fonctionId === adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }
            }
            return Utilisateur
                .create({
                    nom: req.body.nom,
                    prenom: req.body.prenom,
                    email: req.body.email,
                    mdp: bcrypt.hashSync(req.body.mdp, saltRounds),
                    telephone: req.body.telephone,
                    fonctionId: req.body.fonctionId
                })
                .then(utilisateur => res.json(utilisateur))
                .catch(error => res.json({
                    message: 'Compte existe déja'}));
        })
    },

    list(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                userid = decodedToken.id;
                // email = decodedToken.email;
                fonctionId = decodedToken.fonctionId;
                if (!(fonctionId === adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }

            return Utilisateur.findAll(
                {
                    attributes: ['id', 'nom','prenom', "telephone", "email", "mdp"],
                    include: {
                        model: Fonction,
                        attributes: ["libelle_fonction"],
                    },
                    order:  [['id' , 'DESC']],

                })
                .then(utilisateur => res.json(utilisateur))
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de tous les utilisateurs',
                    error
                }));//------not sure here ??????

        });
    },

    retrieve(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if (!(decodedToken.fonctionId === adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
            return Utilisateur
                .findAll(
                    {
                        where: {id: req.params.id},
                        include: {
                            model: Fonction,
                            attributes: ['id','libelle_fonction']
                        },
                        attributes: {exclude: ['fonctionId']}
                    }
                )
                .then(utilisateur => {
                    if (!utilisateur) {
                        return res.json({message: 'Utilisateur introuvable.',});
                    }
                    return res.json(utilisateur);
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de l\'utilisateur ',
                    error
                }));
        })
    },


    update(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if (!(decodedToken.fonctionId === adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
            return Utilisateur
                .findByPk((req.params.id))
                .then(utilisateur => {
                    if (!utilisateur) {
                        return res.json({message: 'Utilisateur introuvable.',});
                    }
                    return utilisateur
                        .update({
                            nom: req.body.nom,
                            prenom: req.body.prenom,
                            email: req.body.email,
                            telephone: req.body.telephone,
                            fonctionId: req.body.fonctionId,
                            mdp: bcrypt.hashSync(req.body.mdp, saltRounds),
                        })
                        .then(() => res.json(utilisateur))
                        .catch(error => res.json({message: 'Impossible de mettre à jour l\'utilisateur.', error}));
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la mise à jour de l\'utilisateur',
                    error
                }));
        })
    },
    destroy(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if (!(decodedToken.fonctionId === adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
            return Utilisateur.findByPk(req.params.id)
                .then(utilisateur => {
                    if (!utilisateur) {
                        return res.json({message: 'Utilisateur introuvable.',});
                    }
                    return utilisateur
                        .destroy()
                        .then(() => res.json({message: 'Utilisateur supprimé avec succès.'}))
                        .catch(error => res.json(error));
                })
                .catch(error => res.json(error));
        })
    },


};

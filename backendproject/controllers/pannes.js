const Panne = require('../models').Panne;
const jwt = require('jsonwebtoken');
const responsableId= require('../config/config.json').responsableId;
const adminId= require('../config/config.json').adminId;
module.exports = {

    create(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
                    return Panne
                        .create({
                            libelle_panne: req.body.libelle_panne,
                        })
                        .then(panne => res.json(panne))
                        .catch(error => res.json({
                            message: 'Une erreur s\'est produite lors de la création d\'un panne.',
                            error
                        }));

        })
    },
    list(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;


            }
            return Panne
                .findAll({ order:  [['id' , 'DESC']],})
                .then(panne => res.json(panne))
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de tous les pannes.',
                    error
                }));
        })
    },
    retrieve(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }
            }
            return Panne
                .findByPk(req.params.id)
                .then(panne => {
                    if (!panne) {
                        return res.json({message: 'Panne introuvable',});
                    }
                    return res.json(panne);
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de panne',
                    error
                }));
        })
    },
    update(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
            return Panne
                .findByPk(req.params.id)
                .then(panne => {
                    if (!panne) {
                        return res.json({message: 'Panne introuvable',});
                    }
                    return panne
                        .update({
                            libelle_panne: req.body.libelle_panne
                        })
                        .then(() => res.json(panne))  // Send back the updated action.
                        .catch(error => res.json({message: 'Impossible de mettre à jour le panne', error}));
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la mise à jour de panne',
                    error
                }));
        })
    },
    destroy(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId)&&(decodedToken.fonctionId !== adminId )) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
            return Panne
                .findByPk(req.params.id)
                .then(panne => {
                    if (!panne) {
                        return res.json({message: 'Panne introuvable',});
                    }
                    return panne
                        .destroy()
                        .then(() => res.json({message: 'Panne supprimé avec succès.'}))
                        .catch(error => res.json(error));
                })
                .catch(error => res.json(error));
        })
    },
};

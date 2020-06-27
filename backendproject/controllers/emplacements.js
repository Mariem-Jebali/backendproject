const Emplacement = require('../models').Emplacement;
const jwt = require('jsonwebtoken');
const responsableId = require('../config/config').responsableId;
const adminId = require('../config/config.json').adminId;
module.exports = {

    create(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId) && (decodedToken.fonctionId !== adminId)) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }

            return Emplacement
                .create({
                    reference: req.body.reference,
                    type: req.body.type,
                    libelle_emplacement: req.body.libelle_emplacement,
                    description: req.body.description
                })
                .then(emplacement => res.json(emplacement))
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la création d\'emplacement',
                    error
                }));

        })
    },
    list(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;

            }
            return Emplacement
                .findAll(
                    {
                        order: [['id', 'DESC']],
                    }
                )
                .then(emplacement => res.json(emplacement))
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de tous les emplacements',
                    error
                }));
        })
    },
    retrieve(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId) && (decodedToken.fonctionId !== adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }
            }
            return Emplacement
                .findByPk(req.params.id)
                .then(emplacement => {
                    if (!emplacement) {
                        return res.json({message: 'Emplacement introuvable',});
                    }
                    return res.json(emplacement);
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de l\'emplacement',
                    error
                }));
        })
    },
    update(req, res) {
        let token = req.headers['authorization'];
        jwt.verify(token, 'secret', function (err, tokendata) {
            if (err) {
                return res.status(400).json({message: 'Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;
                if ((decodedToken.fonctionId !== responsableId) && (decodedToken.fonctionId !== adminId)) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }

            }
            return Emplacement
                .findByPk(req.params.id)
                .then(emplacement => {
                    if (!emplacement) {
                        return res.json({message: 'Emplacement introuvable',});
                    }
                    return emplacement
                        .update({
                            reference: req.body.reference,
                            type: req.body.type,
                            libelle_emplacement: req.body.libelle_emplacement,
                            description: req.body.description
                        })
                        .then(() => res.json(emplacement))
                        .catch(error => res.json({message: 'Impossible de mettre à jour l\'emplacement', error}));
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la mise à jour de l\'emplacement.',
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
                if ((decodedToken.fonctionId !== responsableId) && (decodedToken.fonctionId !== adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
            return Emplacement.findByPk(req.params.id)
                .then(emplacement => {
                    if (!emplacement) {
                        return res.json({message: 'Emplacement introuvable.',});
                    }
                    return emplacement
                        .destroy()
                        .then(() => res.json({message: 'Emplacement supprimé avec succès.'}))
                        .catch(error => res.json(error));
                })
                .catch(error => res.json(error));
        })
    },
};

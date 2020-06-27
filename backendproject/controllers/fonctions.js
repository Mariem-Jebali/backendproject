const  Fonction = require('../models').Fonction;
const jwt = require('jsonwebtoken');
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
                if (!(decodedToken.fonctionId === adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
            return Fonction
                .create({
                    libelle_fonction: req.body.libelle_fonction,
                })
                .then(fonction => res.json(fonction))
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la création du fonction',
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
                if (!(decodedToken.fonctionId === adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
        return Fonction
            .findAll(
                {  order:  [['id' , 'DESC']],}
            )
            .then(fonction => res.json(fonction))
            .catch(error => res.json({
                message: 'Une erreur s\'est produite lors de la récupération de toutes les fonctions',
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
                if (!(decodedToken.fonctionId === adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
        return Fonction
            .findByPk(req.params.id)
            .then(fonction => {
                if (!fonction) {
                    return res.json({message: 'Fonction introuvable.',});
                }
                return res.json(fonction);
            })
            .catch(error => res.json({
                message: 'Une erreur s\'est produite lors de la récupération de fonction',
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
                if (!(decodedToken.fonctionId ===adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
            return Fonction
                .findByPk(req.params.id)
                .then(fonction => {
                    if (!fonction) {
                        return res.json({message: 'Fonction introuvable.',});
                    }
                    return fonction
                        .update({
                            libelle_fonction: req.body.libelle_fonction,
                        })
                        .then(() => res.json(fonction))  // Send back the updated action.
                        .catch(error => res.json({message: 'Impossible de mettre à jour la fonction.', error}));
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la mise à jour de la fonction',
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
                if (!(decodedToken.fonctionId === adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }

        return Fonction.findByPk(req.params.id)
            .then(fonction => {
                if (!fonction) {
                    return res.json({message: 'Fonction introuvable.',});
                }
                return fonction
                    .destroy()
                    .then(() => res.json({message: 'Fonction supprimée avec succès.'}))
                    .catch(error => res.json(error));
            })
            .catch(error => res.json(error));
    })
    },
};

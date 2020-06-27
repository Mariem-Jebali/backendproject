const  Piece_stock = require('../models').Piece_stock;
const jwt = require('jsonwebtoken');
const adminId= require('../config/config.json').adminId;
const responsableId = require('../config/config').responsableId;
const sequelize = require('sequelize');
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
                    return Piece_stock
                        .create({
                            libelle_piece: req.body.libelle_piece,
                            quantite: req.body.quantite
                        })
                        .then(piece_stock => res.json(piece_stock))
                        .catch(error => res.json({
                            message: '\'Une erreur s\'est produite lors de la création du piece_stock',
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
                if ((decodedToken.fonctionId !== responsableId) && (decodedToken.fonctionId !== adminId)) {
                    return res.status(400).json({message: 'Demande non autorisée'});
                }
            }
            return Piece_stock
                .findAll({  order:  [['id' , 'DESC']],}
                )
                .then(piece_stock => res.json(piece_stock))
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de toutes les pièces en stock',
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
            return Piece_stock
                .findByPk(req.params.id)
                .then(piece_stock => {
                    if (!piece_stock) {
                        return res.json({message: 'Pièce introuvable',});
                    }
                    return res.json(piece_stock);
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de la pièce',
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
                if (!(decodedToken.fonctionId === adminId)) {
                    return res.status(400).json({message: ' Demande non autorisée'});
                }

            }
            return Piece_stock
                .findByPk(req.params.id)
                .then(piece_stock => {
                    if (!piece_stock) {
                        return res.json({message: 'Pièce introuvable',});
                    }
                    return piece_stock
                        .update({
                            libelle_piece: req.body.libelle_piece ,
                            quantite: req.body.quantite
                        })
                        .then(() => res.json(piece_stock))  // Send back the updated action.
                        .catch(error => res.json({message: 'Impossible de mettre à jour la pièce.', error}));
                })
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la mise à jour du pièce',
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
            return Piece_stock
                .findByPk(req.params.id)
                .then(piece_stock => {
                    if (!piece_stock) {
                        return res.json({message: 'Pièce introuvable',});
                    }
                    return piece_stock
                        .destroy()
                        .then(() => res.json({message: 'Pièce supprimée avec succès.'}))
                        .catch(error => res.json(error));
                })
                .catch(error => res.json(error));
        })
    },

    pieceutilisee(req, res) {
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;

            }
            const {Op} = require("sequelize");
            return Piece_stock
                .findAll({  order:  [['id' , 'DESC']],where:{quantite : {[Op.gt]: 0} }}
                )
                .then(piece_stock => res.json(piece_stock))
                .catch(error => res.json({
                    message: 'Une erreur s\'est produite lors de la récupération de toutes les pièces en stock',
                    error
                }));
        })
    },


};

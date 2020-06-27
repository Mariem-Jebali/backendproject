const  Utilisateur = require('../models').Utilisateur;
const Fonction = require('../models').Fonction;
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

module.exports = {


    login(req, res) {
        return Utilisateur
            .findOne({
                where: {
                    email: req.body.email
                } })
            .then(utilisateur => {
                if(!utilisateur){
                    res.status(501).json({message:'email introuvale.'})
                }
                else  {
                    if (bcrypt.compareSync(req.body.mdp || '', utilisateur.mdp))
                    {
                        let token = jwt.sign({id:utilisateur.id, email:utilisateur.email,fonctionId:utilisateur.fonctionId,mdp:utilisateur.mdp},'secret', {expiresIn : '2h'});
                        res.status(200).json(token);
                    }
                    else{
                        res.status(501).json({message:'mot de passe invalide'});
                    }
                }

                })
    },

    detailMe(req,res){
        let token= req.headers['authorization'];
        jwt.verify(token,'secret', function(err, tokendata) {
            if (err) {
                return res.status(400).json({message: ' Demande non autorisée'});
            }
            if (tokendata) {
                decodedToken = tokendata;

            }
            return Utilisateur
                .findOne(
                    {
                        where: {id: decodedToken.id},
                        include: {
                            model: Fonction,
                            attributes: ["libelle_fonction"]
                        },
                        attributes: ["nom","prenom","fonctionId"]

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


};


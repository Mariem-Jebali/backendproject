const express = require('express');
const app = express();
const PannesController = require("../controllers").pannes;
const EmplacementsController = require("../controllers").emplacements;
const utilisateurController = require("../controllers").utilisateurs;
const piece_stocksController = require("../controllers").piece_stocks;
const fonctionsController = require("../controllers").fonctions;
const authController = require("../controllers").auth;
const reclamationsController = require("../controllers").reclamation;
const intervenantsController = require('../controllers').intervenants;
const statistiqueController = require('../controllers').statistique;
module.exports = (app) => {
    // app.get('/api', (req, res) => res.status(200).send({
    //    message: 'api na9ess !',
    //  }));
    app.get('/api', function (req, res) {
        res.send("API manquant");
    });
    // app.post('/api', function(req,res) {
    //       res.send("API manquant");
    //   });

    //pannes API
    app.post("/api/pannes/", PannesController.create);
    app.get("/api/pannes/all/", PannesController.list);
    app.get('/api/pannes/:id/', PannesController.retrieve);
    app.put('/api/pannes/:id/', PannesController.update);
    app.delete('/api/pannes/:id/', PannesController.destroy);

    // piece_stock API
    app.post("/api/pieces/", piece_stocksController.create);
    app.get("/api/pieces/all/", piece_stocksController.list);
    app.get("/api/pieceutilisee/all/", piece_stocksController.pieceutilisee);
    app.get('/api/pieces/:id/', piece_stocksController.retrieve);
    app.put('/api/pieces/:id/', piece_stocksController.update);
    app.delete('/api/pieces/:id/', piece_stocksController.destroy);

    //emplacement API
    app.post("/api/emplacements/", EmplacementsController.create);
    app.get("/api/emplacements/all/", EmplacementsController.list);
    app.get('/api/emplacements/:id/', EmplacementsController.retrieve);
    app.put('/api/emplacements/:id/', EmplacementsController.update);
    app.delete('/api/emplacements/:id/', EmplacementsController.destroy);

    // fonction API
    app.post("/api/fonctions/", fonctionsController.create);
    app.get("/api/fonctions/all/", fonctionsController.list);
    app.get('/api/fonctions/:id/', fonctionsController.retrieve);
    app.put('/api/fonctions/:id/', fonctionsController.update);
    app.delete('/api/fonctions/:id/', fonctionsController.destroy);


    //utilisateur API
    app.post("/api/utilisateurs/", utilisateurController.create);
    app.get("/api/utilisateurs/all/", utilisateurController.list);
    app.get('/api/utilisateurs/:id/', utilisateurController.retrieve);
    app.put('/api/utilisateurs/:id/', utilisateurController.update);
    app.delete('/api/utilisateurs/:id/', utilisateurController.destroy);
     app.put('/api/utilisateurs/', utilisateurController.modifierMdp);
    // authentification API
    app.post("/api/login/", authController.login);
    app.get("/api/login/detailme/", authController.detailMe);
   // app.get("/api/login/verifier/", authController.verifier);
 // intervenant API
    app.get("/api/intervenant/all/", intervenantsController.list);
    app.get("/api/intervenantPlanning/:id/", intervenantsController.planning);
    //reclamtions API
    // API responsable maintenance --respId
    app.get("/api/reclamations/nonAffecter/all/", reclamationsController.list);
    app.get("/api/reclamations/nonAffecter/:id/", reclamationsController.retrieve);
    app.patch('/api/reclamations/:id/affecter/', reclamationsController.affecter);
    app.patch('/api/OrdreTravail/:id/modifier/', reclamationsController.modifier);
    app.get("/api/OrdreTravail/nontraiter/all/", reclamationsController.nonTraiterList);
    app.get("/api/OrdreTravail/nontraiter/:id/", reclamationsController.nonTraiterOne);
    app.get("/api/OrdreTravail/traiter/all/", reclamationsController.traiterlist);
    app.get("/api/OrdreTravail/traiter/:id/", reclamationsController.traiterOne);
    app.patch('/api/OrdreTravail/:id/traiter/', reclamationsController.ResponsableTraiter);
    app.patch('/api/OrdreTravail/:id/cloturer/', reclamationsController.cloturer);
    app.get('/api/OrdreTravail/cloturer/all/', reclamationsController.cloturerlist);
    app.get('/api/OrdreTravail/cloturer/:id/', reclamationsController.cloturerOne);

    // API gouvernante
    app.post("/api/utilisateurs/reclamations/", reclamationsController.envoi);
    app.get("/api/utilisateurs/reclamations/all/", reclamationsController.gouverReclamationall);
    app.get("/api/utilisateurs/reclamations/:id/", reclamationsController.gouverReclamationone);
    //API intervenant
    app.get("/api/utilisateurs/OrdreTravail/all/", reclamationsController.OTListAll);
    app.get("/api/utilisateurs/OrdreTravail/:id/", reclamationsController.OTListOne);
    app.patch('/api/intervenant/OrdreTravail/traiter/:id/', reclamationsController.remplir);
     //  API statistique
    app.get('/api/reclamation/envoyer/all/', statistiqueController.RecEnvoyerJour);
    app.get('/api/reclamation/nonTraiter/all/', statistiqueController.RecNonTraiterJour);
    app.get('/api/reclamation/traiter/all/', statistiqueController.RecTraiterJour);
    app.get('/api/reclamation/panne/all/', statistiqueController.statPanne);
    app.get('/api/reclamation/gouvPanne/all/', statistiqueController.GouvernanteRec);
    app.get('/api/reclamation/respectdate/', statistiqueController.respectdate);
    app.get('/api/reclamation/nonrespectdate/', statistiqueController.nonrespectdate);
    app.get('/api/stockepuise/all/', statistiqueController.stockepuise);
    app.get('/api/reclamations/typeEmplacement/all/', statistiqueController.recTypeEmplacement);
};

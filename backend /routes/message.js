// Mise en place de la Logique de routing et la logique métier dans le controller message.js
// Importer express
const express = require('express');
// Créér un router avec la méthode routeur d'Express
const router = express.Router();
// Importer multer pour la configuration des fichiers
const multer = require('../middleware/multer-config');
// Importer le controller pour associées aux différentes routes
const messageCtrl = require('../controllers/message');

// Les différentes routes
router.post('/add/:id', multer, messageCtrl.createMessage);/**/
  
router.get('/get', messageCtrl.listMessage);/**/ 
  
router.delete('/delete/:id', messageCtrl.deleteMessage);

router.put('/update/:id', messageCtrl.updateMessage);//

module.exports = router;
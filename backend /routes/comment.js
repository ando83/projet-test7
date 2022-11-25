// Mise en place de la Logique de routing et la logique métier dans le controller message.js
// Importer express
const express = require('express');
// Créér un router avec la méthode routeur d'Express
const router = express.Router();
// Importer le controller pour associées aux différentes routes
const commentCtrl = require('../controllers/comment');

// Les différentes routes
router.post('/add/:id', commentCtrl.createComment);
  
router.get('/get/:id', commentCtrl.listComment);
  
router.delete('/delete/:id', commentCtrl.deleteComment);

router.put('/update/:id', commentCtrl.updateComment);

module.exports = router;
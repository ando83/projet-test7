// Importer Express
const express = require ('express');

// Méthode router d'Express
const router = express.Router();

// Associer les fonctions aux différentes routes
const userCtrl = require('../controllers/user');

// les routes user
router.post('/signup', userCtrl.signup);
router.post('/login', userCtrl.login);
router.get('/profile', userCtrl.getUserProfile);
router.put('/profile', userCtrl.updateUserProfile);/** */
//router.put('/profile/:id', userCtrl.updateUserProfile);
//router.delete('/profile/:id', userCtrl.deleteUserProfile);//
router.delete('/profile/:id', userCtrl.deleteUserProfile);//

module.exports = router;
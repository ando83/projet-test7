// Importer express
const express = require('express');

// Importer path (chemin d'accès au fichier)
const path = require("path");

// Importer dotenv,variables d'environnement pour stocker des informations sensibles(exemple: mot de passe) dans le fichier .env(en production on mettra dans .gitignore)
require('dotenv').config();

//Déclarer une variable pour express
const server = express();

const cors = require('cors');

// Importer le router du fichier routes/user.js
const userRoutes = require('./routes/user');
// Importer le router du fichier routes/message.js
const messageRoutes = require('./routes/message');
// Importer le router du fichier routes/comment.js
const commentRoutes = require('./routes/comment');

server.use(cors())
// Configuration des en-têtes cors(headers) pour que l'application accède à l'API
server.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*'); //accessible pour toute origine 
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');//les headers qui sont autorisés à l'accès réponse
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');// les méthodes autorisées
    next();
  });

// Analyse les corps de l'url
// Récupérer des arguments et paramètres fournis dans le body d'une requête http en objet Json, objet javascript utilisable venant du front
server.use(express.urlencoded({extended: true})); 
server.use(express.json()); 

// Configuration des routes avec une fonction callback déclenchée lorsque la route sera appelée par l'utilisateur
server.get('/', function(req, res){
    // l'entête de la requête response
     res.setHeader('Content-type', 'text/html');
     // Succès de la requête
     res.status(200).send('<h1>Bienvenu sur le serveur</h1');
});

// Extraire le chemin d'accès au fichier, dédier à la partie du dossier des images
server.use('/images', express.static(path.join(__dirname, 'images')));

// la route liée à l'authentification
server.use('/api/user', userRoutes );
// la route pour la partie message
server.use('/api/message', messageRoutes);
// la route pour la partie commentaire
server.use('/api/comment', commentRoutes);

//Mettre en écoute le serveur
server.listen(6000, function(){
    console.log('Succès du serveur au port 6000');
})
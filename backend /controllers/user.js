// Importer bcrypt pour la hashage du mot de passe utilisateur
const bcrypt = require('bcrypt');
// Importer jwtUtils intégré avec jsonwebtoken afin de définir des tokens aux utilisateurs lors de la connexion
const jwtUtils = require('../utils/jwtUtils');
// Importer models qu'on a définit avec l'orm sequelize 
const models = require('../models');

//Définir une constante pour vérifier l'email avec l'expression régulière regex
const emailRegex = /^([a-zA-Z0-9_\-\.]+)@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.)|(([a-zA-Z0-9\-]+\.)+))([a-zA-Z]{2,4}|[0-9]{1,3})(\]?)$/;
//Validateur de mot de passe
const passwordValidator = require('password-validator');
// Schéma
const schema = new passwordValidator();
// Les propriétés acceptés
schema
.is().min(4)                                    
.is().max(30)                                                                                         
.has().not().spaces() 

// Fonction signup pour l'enregistrement de nouveau utilisateur
exports.signup = (req, res) => {
    //Récupérer les paramètres envoyés dans la requête(req)
    
    const email = req.body.email;
    const username = req.body.username;
    const password = req.body.password;
    const bio = req.body.bio;
    
    // Vérifier si les paramètres sont manquants ou pas
    if (!email|| !username || !password || !bio){
        return res.status(400).json({ 'error': 'Les champs ne sont pas remplis'})
    }
    // Vérifier la taille du pseudo
    if (username.length <= 2 || username.length >= 15) {
        return res.status(400).json({ 'error' : 'La taille du nom d\'utilisateur doit être supérieur à 2 caractères et maximum 15 caractères'})
    }

    //Vérifier l'adresse email
    if(!emailRegex.test(email)){
        return res.status(400).json({ 'error' : 'l\'email n\'est pas valide'})
    }
    // Vérifier le mot de passe
    if(!schema.validate(password)){
        return res.status(400).json({ 'error' : 'Le Mot de passe doit contenir au minimum 6 caractères et sans-espaces'}) 
    }    

    // Vérifier et rajouter à la base de donnée l'utilisateur
    models.User.findOne({
        attributes: ['email'],
        where: { email: email}
    })
    .then(function(userFound){
        if(!userFound){// si l'utilisateur existe
        //Appel de la fonction hachage de bcrypt pour crypter un mot de passe
          bcrypt.hash(password, 10, function( err, bcryptedPassword){
            let newUser = models.User.create({
                email: email,
                username: username,
                password: bcryptedPassword,
                bio: bio,
                isAdmin: 0
            })
            .then(function(newUser){
                return res.status(201).json({ // pas d'erreur
                    'userId': newUser.id
                })
            })
            .catch(function(error){
                return res.status(500).json({'error': 'Impossible d\'ajouter un utilisateur'});
            })
          })
    
        } else {
            return res.status(409).json({ 'error': ' l\'utilisateur est déjà enregistré' });
        }
    }).catch(function(error) {
        console.log(error);
        res.status(500).json({ 'error': 'erreur serveur'});
      });
    
};

// Fonction login pour connecter les utilisateurs existants
exports.login = (req, res) => {

    // Paramètres envoyés dans la requête
    const email = req.body.email;
    const password = req.body.password;

    // Vérifier si les données sont corrects
    if (!email || !password ){
        return res.status(400).json({ 'error': 'les champs ne sont pas remplis'})
    }
    // Vérifier si l'adresse email existe
    models.User.findOne({
        
        where: { email: email}
    })
    .then(function(userFound){
        // Si l'utilisateur existe
        if(userFound){
            // Vérifie et compare le bon mot de passe avec bcrypt ( mot de passe salé dans la DB)
            bcrypt.compare(password, userFound.password, function(errBycrypt, resBycrypt){
            // mot de passe valide
                if(resBycrypt){
                    return res.status(200).json({
                        'userId': userFound.id,
                        'token': jwtUtils.generateToken(userFound)
                    });
            // Sinon retourne une erreur        
                }else{
                    return res.status(403).json({'error': 'Le mot de passe est invalide'})
                }
            });    
        }else{
            return res.status(404).json({'error': 'l\'utilisateur n\'existe pas dans DB'});
        }
    }).catch(function(error) {
        console.log(error);
        res.status(500).json({ 'error': 'erreur serveur'});
      });
    
};

// Fonction pour récupérer le profil 
exports.getUserProfile = (req, res) => {
  // Récupérer l'entête autorisation de la requête, vérifier si le token est valide, récupérer l'id de l'utilisateur et faire une requête sur la DB
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    
    if(userId < 0)
     return res.status(400).json({ 'error': 'délai expiré'})

    // On récupère l'userId précisé dans le token 
    models.User.findOne({
      attributes:['id', 'email', 'username', 'bio','isAdmin', 'createdAt','updatedAt'],
      where: { id: userId } 
    }).then(function(user){
        if(user){
            res.status(201).json(user);
        }else{
            res.status(404).json({ 'error': 'l\'utilisateur est introuvable'})
        }
    }).catch(function(error) {
        console.log(error);
        res.status(500).json({ 'error': 'erreur serveur'});
      });
};

// Fonction qui va permettre de modifier le profil de l'utilisateur
exports.updateUserProfile = (req, res) => {
    
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    
    //Récupérer les paramètres envoyés dans la requête(req)
    const email = req.body.email;
    const username = req.body.username;
    const bio = req.body.bio;
    const isAdmin = req.body.isAdmin;
    
    //Récupérer le profil de l'utilisateur dans la DB
    models.User.findOne({
        // Vérifier l'id de l'utilisateur, email, username et bio qu'on va pouvoir modifier
        attributes:['id','email','username','bio', 'isAdmin','createdAt','updatedAt'],
        // Récupérer les informations sur l'utilisateur existant précisé dans le token
        where: { id: userId}  
      }).then(function(userFound){
          if(userFound){
            // Après récupération avec findone on va utiliser la fonction update pour modifier les paramètres qu'on souhaite modifier
             userFound.update({
               // On va vérifier si les informations renseignés par l'utilisateur sont valides et on les met à jour
               // Condition ternaire
               bio: (bio ? bio : userFound.bio),
               username: (username ? username: userFound.username),
               email: (email ? email : userFound.email),
               isAdmin: (isAdmin ? isAdmin : userFound.isAdmin),
               
             }).then(function(userFound){
                 return res.status(201).json ({userFound})
             }).catch(function(error){
                 return res.status(500).json({'error': 'Modification impossible'})
             })
              
          }else{
              res.status(404).json({ 'error': 'l\'utilisateur est introuvable'})
          }
      }).catch(function(error) {
           console.log(error);
           res.status(500).json({ 'error': 'erreur serveur '});
      });
};  

// Fonction qui permet de supprimer le profil de l'utilisateur
exports.deleteUserProfile = (req, res) => {
    // Récupérer l'entête autorisation envoyée dans la requête
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    
    models.User.findOne({
        attributes:['id'],
        where: {id: userId}
       //attributes: ['id','email','username'],
       //where: {id: req.params.id}
    }).then(function(userFound){
        if(userFound){
          // Après récupération avec findone on va utiliser la fonction update pour modifier les paramètres qu'on souhaite modifier
           userFound.destroy({where:{id: userId}});
           //userFound.destroy({where:{id: req.params.id}});
           return res.status(201).json({message:'Le compte est supprimé'})
        }
        
    }).catch(function(error){
           res.status(404).json({ 'error':'le compte n\'est pas dans la BD'})
    });
};  


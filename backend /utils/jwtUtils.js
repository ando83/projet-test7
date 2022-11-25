// Importer 
const jwt = require('jsonwebtoken');
// Signer le token avec une constante
const JWT_SECRET_KEY = process.env.JWT_SECRET_KEY;

// Fonctions d'authentification à exportées
// On va générer et signer(hashage) le token par le serveur
module.exports = {   
generateToken : function(userData) {  
  // On va retourner la méthode de hashage sign du token
    return jwt.sign({
 // On va récupérer l'identifiant de l'utilisateur depuis userData.id   
    userId: userData.id,
 // Vérifier s'il est admin ou non
    isAdmin: userData.isAdmin
    },
    JWT_SECRET_KEY, 
    {
 // Au boût de 24h le token ne sera plus valide    
    expiresIn: "24h"
    })
},
// Fonction pour récupérer seulement le token sans bearer
parseAuthorization : function(authorization){
     return (authorization != null) ? authorization.replace('Bearer', ''): null;
},

// Fonction pour récupérer le userId et son token
getUserId : function(authorization){
    let userId = -1;
    let token = module.exports.parseAuthorization(authorization);
    if(token != null){
        try{
            let jwtToken = jwt.verify(token, process.env.JWT_SECRET_KEY );
            if(jwtToken != null)
              userId = jwtToken.userId;  
        }catch(err){ }
    }
    return userId;
 }
};
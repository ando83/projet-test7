// Importer les models créés dans sequelize
const models = require('../models');
// Utiliser le package fs pour gérer les fichiers
const fs = require("fs");

// Importer jwtUtils pour utiliser la fonction getUserId
const jwtUtils = require('../utils/jwtUtils');

// Créér message
exports.createMessage = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    models.User.findOne({
        where: { id: userId}  
    })
        .then(function(userFound) {
            if (userFound !== null) {
                //Récupérer les paramètres(corps de la requête) envoyés dans la requête
                const {title, content} = req.body;
                const attachment = `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
                
                // Vérifier si les champs sont remplis
                if ((!title || !content )) {
                    res.status(400).json({ 'error': 'Les champs ne sont pas remplis' });
               
                } else {
                    models.Message.create({
                        title: title,
                        content: content,
                        UserId: userFound.id,
                        attachment: attachment
                        
                    })
                        .then((newMessage) => {
                            res.status(201).json(newMessage)
                        })
                        .catch((error) => {
                            res.status(500).json({'error': 'Message n\'existe pas'});
                        })
                };
            } else {
                res.status(400).json({'error' : 'Impossible de trouver l\'utilisateur'});
            }
        }).catch(function(error){
            res.status(500).json({ 'error':'erreur serveur'})
        });    
}


// Fonctions pour lister tous les messages
exports.listMessage = (req, res, next) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);
    
    // L'ordre des messages que l'on souhaite afficher
    const order   = req.query.order;
    
    // On récupére tous les messages avec la méthode findAll du model message
    models.Message.findAll({
        // Paramétrer les attributs pour s'assurer que les utilisateurs rentrent des données correctes
        order: [(order != null) ? order.split(':') : ['createdAt', 'DESC']],// ordre décroissant
        
        // Un tableau pour inclure la relation avec la table user
        include: [{
          model: models.User,
          // On va seulement afficher l'attribut username
          attributes: [ 'username' ]
        }]
      }).then(function(message) {
        if (message) {
          res.status(200).json(message);
        } else {
          res.status(404).json({ 'error': 'aucun message n\'est trouvé' });
        }
      }).catch(function(error) {
        console.log(error);
        res.status(500).json({ 'error': 'erreur serveur '});
      });
    };

// Supprimer message
exports.deleteMessage = (req, res, next) => {  
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    models.Message.findOne({
        where: { id: req.params.id }
    }).then(function(message) {
      const filename = message.attachment.split('/images/')[1];
      // fonction unlick pour supprimer un fichier
      fs.unlink(`images/${filename}`, () => {
        // Supprimer dans la base de donnée  
        message.destroy ({ where : { id :req.params.id }})
          .then(() => res.status(200).json({ message: 'Publication supprimée !'}))
          .catch(error => res.status(400).json({ 'error': 'Impossible de supprimer la publication' }));
      });

    }).catch(function(error){
        res.status(500).json({ 'error':'erreur serveur'})
    });
};    

// Met à jour la publication
exports.updateMessage = (req, res, next) => {   
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    // Attribuer une constante au paramètre de route envoyée en front
    const id = req.params.id; 
    // Attribuer des constantes au corps de la requête
    const title = req.body.title;
    const content = req.body.content;
    
    // Objet qui vérifie req.file, traite une nouvelle image et effectue la modification
    const message = req.file ?
    {
        ...JSON.parse(req.body.message),
        attachment: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
      } : { ...req.body };
    
    // Vérifier si le message existe et sélectionner l'attribut
    models.Message.findOne({
        attributes:['id','title','content'],/*id*/
        where: { id: id}
      
    }).then(function(message){
        
        if(message){
           message.update({
            
               title: title,
               content: content,
               id  : id,
               ...message,

            });
           
           return res.status(201).json({message:'Le message est modifié'})
        } else{
            res.status(404).json({ 'error': 'le message est introuvable'})
        }

   }).catch(function(error){
    res.status(500).json({ 'error':'erreur serveur'})
   }); 
   
};   








// Importer les models créés dans sequelize
const models = require('../models');

// Importer jwtUtils pour utiliser la fonction getUserId
const jwtUtils = require('../utils/jwtUtils');

// Créér message
exports.createComment = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    models.User.findOne({
        where: { id: userId}  
    })
        .then(function(userFound) {
            if (userFound !== null) {
              
                const {content} = req.body;
                // Vérifier si le champs est rempli
                if ( !content) {
                    res.status(400).json({ 'error': 'Le champs n\'est pas rempli' })
                } else {
                    models.Comment.create({
                        
                        content: content,
                        UserId: userFound.id,
                        messageId: req.params.id 
                    })
                        .then((newComment) => {
                            res.status(201).json(newComment)
                        })
                        .catch((error) => {
                            res.status(500).json({'error': 'Commentaire n\'existe pas'});
                        })
                };
            } else {
                res.status(400).json({'error' : 'Impossible de trouver l\'utilisateur'});
            }
        }).catch(function(error) {
            console.log(error);
            res.status(500).json({ 'error': 'erreur serveur '});
          });
};    

// Récupérer les commentaires
exports.listComment = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    // L'ordre des commentaires que l'on souhaite afficher
    const order   = req.query.order;

    // On récupére tous les commentaires avec la méthode findAll du model comment
    models.Comment.findAll({
        
        order: [(order != null) ? order.split(':') : ['createdAt', 'ASC']],// ordre croissant

        // Un tableau pour inclure la relation avec la table user
        include: [{
          model: models.User,
          attributes: [ 'id','username' ],
        }],
        where : {messageId : req.params.id},

      }).then(function(commentaires) {
        if (commentaires) {
          res.status(200).json(commentaires);
        } else {
          res.status(404).json({ 'error': 'aucun commentaire n\'est trouvé' });
        }
      }).catch(function(error) {
        console.log(error);
        res.status(500).json({ 'error': 'erreur serveur '});
      });
};

// Supprimer des commentaires
exports.deleteComment = (req, res) => {

    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    const id = req.params.id; 
    // Vérifier si le message existe et sélectionner l'attribut
    models.Comment.findOne({
        attributes:['id'],
        where: { id: id}
    }).then(function(userFound){
        if(userFound){
           userFound.destroy({where:{id: id}});
           return res.status(201).json({message:'Le commentaire est supprimé'})
        } else{
            res.status(404).json({ 'error': 'le commentaire est introuvable'})
        }

   }).catch(function(error) {
       console.log(error);
       res.status(500).json({ 'error': 'erreur serveur '});
   });
};    

exports.updateComment = (req, res) => {
    const headerAuth = req.headers['authorization'];
    const userId = jwtUtils.getUserId(headerAuth);

    // Attribuer une constante au paramètre de route envoyée en front
    const id = req.params.id; 
    // Attribuer des constantes au corps de la requête
    const content = req.body.content;

    // Vérifier si le message existe et sélectionner l'attribut
    models.Comment.findOne({
        attributes:['id'],
        where: { id: id}
    }).then(function(userFound){
        if(userFound){
           userFound.update({
            // On va vérifier si les informations renseignés par l'utilisateur sont valides et on les met à jour
            // Condition ternaire
               content: (content ? content: userFound.content),
               where: { userId : req.params.userId,
                        messageId : req.params.messageId
               }

            });
           // Réponse attendue
           return res.status(201).json({message:'Le commentaire est modifié'})
        } else{
            res.status(404).json({ 'error': 'le commentaire est introuvable'})
        }

   }).catch(function(error) {
       console.log(error);
       res.status(500).json({ 'error': 'erreur serveur '});
   });
};    
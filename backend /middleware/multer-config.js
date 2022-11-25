// Middleware pour la configuration des fichiers
const multer = require('multer');

const MIME_TYPES = {
  'image/jpg': 'jpg',
  'image/jpeg': 'jpg',
  'image/png': 'png',
  'image/gif': 'gif'
};
// Objet de configuration pour multer,enregistrer sur le disque
const storage = multer.diskStorage({
  // Destination d'enregistrement des images  
  destination: (req, file, callback) => {
    // Envoyer dans le dossier images
    callback(null, 'images');
  },
  // Fonction filename, pour expliquer à multer le nom du fichier utilisé
  filename: (req, file, callback) => {
    const name = file.originalname.split(' ').join('_');
    const extension = MIME_TYPES[file.mimetype];
    callback(null, name + Date.now() + '.' + extension);
  }
});

module.exports = multer({storage: storage}).single('attachment');
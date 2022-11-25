
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    email: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    bio: DataTypes.STRING,
    isAdmin: DataTypes.BOOLEAN,
     
  });
  User.associate = function(models) {
      models.User.hasMany(models.Message,{
      hooks: true,  //
      onDelete: 'cascade',//  La relation pour supprimer l'utilisateur avec le post(message)
      });
      
  };
  return User;
};
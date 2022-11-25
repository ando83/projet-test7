
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('Message', {
    
    title: DataTypes.STRING,
    content: DataTypes.STRING,
    attachment: DataTypes.STRING
    
  });
  Message.associate = function(models) {
    models.Message.belongsTo(models.User, {
    foreignKey: models.User.userId
  });
  models.Message.hasMany(models.Comment, {
    
  });
    


  }
  return Message;
}
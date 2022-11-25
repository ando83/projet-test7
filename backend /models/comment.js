
'use strict';
module.exports = (sequelize, DataTypes) => {
  const Comment = sequelize.define('Comment', {
    
    userId: DataTypes.INTEGER,
    messageId: DataTypes.INTEGER,
    content: DataTypes.STRING
    
  });
    Comment.associate = function(models) {
    models.Comment.belongsTo(models.User, {
    foreignKey: models.User.userId,
    onDelete: 'cascade',
  });
    models.Comment.belongsTo(models.Message, {
    foreignKey: models.Message.messageId,
    onDelete: 'cascade',
  });
    
  }
  return Comment;
}
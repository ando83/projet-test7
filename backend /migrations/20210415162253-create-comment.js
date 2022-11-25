'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      userId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        references: { // on a deux propriétés
          model: 'Users', // modèle créé
          key: 'id' // identifiant de l'utilisateur
        }
      },
      messageId: {
        allowNull: false,
        type: Sequelize.INTEGER,
        onDelete:'cascade',
        references: { 
          model: 'Messages',
          key: 'id'
        }  
      },
      content: {
        type: Sequelize.STRING
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Comments');
  }
};
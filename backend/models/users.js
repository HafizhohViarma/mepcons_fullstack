const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    const Users = sequelize.define('Users', {
      id_user: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
        defaultValue: () => uuidv4(),
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      telp: {
        type: DataTypes.STRING,
        allowNull: false
      },
      profil: {
        type: DataTypes.STRING,
        allowNull: true
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false
      },
      level: {
        type: DataTypes.STRING,
        allowNull: false
      },
     
    }, {
      tableName: 'users',
      timestamps: false
    });
  
    return Users;
  };
  
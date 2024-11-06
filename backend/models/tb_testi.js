const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
    const Testi = sequelize.define('tb_testi', {
      id_testi: {
        type: DataTypes.STRING,
        primaryKey: true,
        autoIncrement: true,
        defaultValue: uuidv4 
      },
      nama_peserta: {
        type: DataTypes.STRING,
        allowNull: false
      },
      sampul: {
        type: DataTypes.STRING,
        allowNull: true
      },
      testimoni: {
        type: DataTypes.STRING,
        allowNull: true
      }
    }, {
      timestamps: false,
      tableName: 'tb_testi'
    });
    return Testi;
  };
  
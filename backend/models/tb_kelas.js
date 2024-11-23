const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {

    const Kelas = sequelize.define('tb_Kelas', {
      id_kelas: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      sampul_kelas: {
        type: DataTypes.STRING,
        allowNull: false
      },
      judul_kelas: {
        type: DataTypes.STRING,
        allowNull: false
      },
      deskripsi_kelas: {
        type: DataTypes.STRING,
        allowNull: false
      },
      jadwal: {
        type: DataTypes.STRING,
        allowNull: false
      },
      harga_kelas: {
        type: DataTypes.STRING,
        allowNull: false
      }
    }, {
      tableName: 'tb_kelas',
      timestamps: false
    });

    
  
    return Kelas;
  };
  
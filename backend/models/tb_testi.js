const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Testi = sequelize.define('Testi', {
    id_testi: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => uuidv4() // Memanggil fungsi uuidv4 untuk menghasilkan nilai UUID
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

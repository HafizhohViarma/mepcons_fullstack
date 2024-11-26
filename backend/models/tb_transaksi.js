const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const tb_Transaksi = sequelize.define('tb_transaksi', {
    id_transaksi: {
      type: DataTypes.STRING,
      primaryKey: true,
      defaultValue: () => uuidv4(),
    },
    id_user: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    id_video: {
      type: DataTypes.STRING,
      allowNull: true, 
    },
    id_ebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_kelas: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    nama: {
      type: DataTypes.STRING, 
      allowNull: false,
    },
    tipe_produk: {
      type: DataTypes.ENUM('video', 'kelas', 'ebook'),
      allowNull: false,
    },
    tgl_transaksi: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('pending', 'settlement', 'cancel'),
      allowNull: false,
      defaultValue: 'pending',
    },
  }, {
    timestamps: false,
    tableName: 'tb_transaksi',
  });

  // Asosiasi dengan model lain
  tb_Transaksi.associate = (models) => {
    tb_Transaksi.belongsTo(models.Users, {
      foreignKey: 'id_user',
      as: 'Users', 
    });
    tb_Transaksi.belongsTo(models.Video, {
      foreignKey: 'id_video',
      as: 'Video',
    });
    tb_Transaksi.belongsTo(models.Ebook, {
      foreignKey: 'id_ebook',
      as: 'Ebook',
    });
    tb_Transaksi.belongsTo(models.Kelas, {
      foreignKey: 'id_kelas',
      as: 'Kelas',
    });

    tb_Transaksi.hasMany(models.DetailTransaksi, {
      foreignKey: 'id_transaksi',
      as: 'DetailTransaksi',  
    });
  };

  return tb_Transaksi;
};

module.exports = (sequelize, DataTypes) => {
  const tb_Transaksi = sequelize.define('tb_transaksi', {
    id_transaksi: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    id_user: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    id_video: {
      type: DataTypes.STRING,
      allowNull: true, // Diubah ke allowNull: true karena tidak selalu terisi
    },
    id_ebook: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    id_kelas: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    nama_user: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    tipe_produk: {
      type: DataTypes.ENUM('video', 'kelas', 'ebook'),
      allowNull: false,
    },
    tgl_transaksi: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    harga: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    payment: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    bukti_bayar: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'konfirmasi', 'tolak'),
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
      as: 'user',
    });
    tb_Transaksi.belongsTo(models.Video, {
      foreignKey: 'id_video',
      as: 'video',
    });
    tb_Transaksi.belongsTo(models.Ebook, {
      foreignKey: 'id_ebook',
      as: 'ebook',
    });
    tb_Transaksi.belongsTo(models.Kelas, {
      foreignKey: 'id_kelas',
      as: 'kelas',
    });
  };

  return tb_Transaksi;
};

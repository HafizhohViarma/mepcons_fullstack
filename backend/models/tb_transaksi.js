module.exports = (sequelize, DataTypes) => {
    const Transaksi = sequelize.define('tb_transaksi', {
      id_transaksi: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
      },
      id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
      },
      id_video: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      id_ebook: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      id_kelas: {
        type: DataTypes.INTEGER,
        allowNull: true
      },
      nama_user: {
        type: DataTypes.STRING,
        allowNull: true
      },
      tipe_produk: {
        type: DataTypes.ENUM('video', 'kelas', 'ebook'),
        allowNull: false
      },
      tgl_transaksi: {
        type: DataTypes.DATE,
        allowNull: false
      },
      harga: {
        type: DataTypes.STRING,
        allowNull: true
      },
      payment: {
        type: DataTypes.STRING,
        allowNull: true
      },
      bukti_bayar: {
        type: DataTypes.STRING,
        allowNull: true
      },
      status: {
        type: DataTypes.ENUM('pending', 'konfirmasi', 'tolak'),
        allowNull: false
      }
    }, {
      timestamps: false,
      tableName: 'tb_transaksi'
    });
    return Transaksi;
  };
  
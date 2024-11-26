const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const detail_Transaksi = sequelize.define('detail_transaksi', {
        id_detailtrans: {
            type: DataTypes.STRING,
            primaryKey: true,
            defaultValue: () => uuidv4(),
        },
        id_transaksi: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        order_id: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        id_ebook: { 
            type: DataTypes.STRING,
            allowNull: true,
        },
        id_kelas: { 
            type: DataTypes.STRING,
            allowNull: true,
        },
        id_video: { 
            type: DataTypes.STRING,
            allowNull: true,
        },
        id_user: { 
            type: DataTypes.STRING,
            allowNull: false,
        },
        tipe_produk: {
            type: DataTypes.ENUM('video', 'kelas', 'ebook'),
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
        status: {
            type: DataTypes.ENUM('pending', 'settlement', 'cancel'),
            allowNull: false,
            defaultValue: 'pending',
        },
    }, {
        timestamps: false,
        tableName: 'detail_transaksi',
    });

    // Defining the relationships
    detail_Transaksi.associate = (models) => {
        detail_Transaksi.belongsTo(models.Users, {
            foreignKey: 'id_user',
            as: 'users', 
        });

        // Relasi lainnya (opsional)
        detail_Transaksi.belongsTo(models.tb_ebook, {
            foreignKey: 'id_ebook',
            as: 'Ebook',
        });
        detail_Transaksi.belongsTo(models.tb_Kelas, {
            foreignKey: 'id_kelas',
            as: 'kelas',
        });
        detail_Transaksi.belongsTo(models.Video, {
            foreignKey: 'id_video',
            as: 'video',
        });
        detail_Transaksi.belongsTo(models.tb_Transaksi, {
            foreignKey: 'id_transaksi',
            as: 'tb_transaksi',
        });
    };

    return detail_Transaksi;
};
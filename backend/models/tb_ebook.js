const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
    const Ebook = sequelize.define('tb_ebook', {
        id_ebook: {
            type: DataTypes.STRING, 
            primaryKey: true,
            defaultValue: uuidv4 
        },
        sampul_ebook: {
            type: DataTypes.STRING,
            allowNull: true
        },
        ebook_file: {
            type: DataTypes.STRING,
            allowNull: true
        },
        judul_ebook: {
            type: DataTypes.STRING,
            allowNull: false
        },
        deskripsi_ebook: {
            type: DataTypes.STRING,
            allowNull: true
        },
        harga_ebook: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        timestamps: false,
        tableName: 'tb_ebook'
    });

    return Ebook;
};

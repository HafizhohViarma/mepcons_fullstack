const { v4: uuidv4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    'Users',
    {
      id_user: {
        type: DataTypes.STRING,
        primaryKey: true,
        defaultValue: () => uuidv4(),
      },
      nama: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      telp: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      profil: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      level: {
        type: DataTypes.STRING,
        allowNull: false,
      },

      resetPasswordOTP: {
        type: DataTypes.STRING,
        allowNull: true
      },
      resetPasswordExpires: {
        type: DataTypes.DATE,
        allowNull: true
      }
    },
    {
      tableName: 'users',
      timestamps: false,
    }
  );

  // Defining the relationships
  Users.associate = (models) => {
    // Relasi antara Users dan Detail_Transaksi
    Users.hasMany(models.Detail_Transaksi, {
        foreignKey: 'id_user',
        as: 'detail_Transaksi',
    });

    // Relasi antara Users dan Transaksi
    Users.hasMany(models.tb_Transaksi, {
        foreignKey: 'id_user',
        as: 'tb_transaksi',
    });
};
  return Users;
};

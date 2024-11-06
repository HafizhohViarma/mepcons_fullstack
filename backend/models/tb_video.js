const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const Video = sequelize.define('Video', {
    id_video: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4,
    },
    sampul_video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    judul_video: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    keterangan_video: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    harga_video: {
      type: DataTypes.DECIMAL,
      allowNull: true,
    },
  }, {
    timestamps: false,
    tableName: 'tb_video',
  });

  Video.associate = (models) => {
    Video.hasMany(models.VideoFile, {
      foreignKey: 'id_video',
      sourceKey: 'id_video',
      as: 'file',
    });
  };

  return Video;
};

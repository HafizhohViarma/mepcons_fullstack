const { v4: uuidv4 } = require('uuid');

module.exports = (sequelize, DataTypes) => {
  const VideoFile = sequelize.define('VideoFile', {
    id_file: {
      type: DataTypes.STRING,
      primaryKey: true,
      allowNull: false,
      defaultValue: uuidv4,
    },
    id_video: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sub_judul: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    video_file: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  }, {
    timestamps: false,
    tableName: 'video_file',
  });

  VideoFile.associate = (models) => {
    VideoFile.belongsTo(models.Video, {
      foreignKey: 'id_video',
      targetKey: 'id_video',
      as: 'video',
    });
  };

  return VideoFile;
};

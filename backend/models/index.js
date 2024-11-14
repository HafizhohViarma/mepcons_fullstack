const Sequelize = require('sequelize');
const config = require('../config/dbconfig.js');

const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle
  }
});

// Inisialisasi db object
const db = {};

db.Sequelize = Sequelize;
db.sequelize = sequelize;

// Import semua model
db.Testi = require('./tb_testi.js')(sequelize, Sequelize.DataTypes);
db.Kelas = require('./tb_kelas.js')(sequelize, Sequelize.DataTypes);
db.Ebook = require('./tb_ebook.js')(sequelize, Sequelize.DataTypes);
db.tb_Transaksi = require('./tb_transaksi.js')(sequelize, Sequelize.DataTypes);
db.Video = require('./tb_video.js')(sequelize, Sequelize.DataTypes);
db.VideoFile = require('./video_file.js')(sequelize, Sequelize.DataTypes);
db.Users = require('./users.js')(sequelize, Sequelize.DataTypes);

// Relasi antara Users dan Transaksi (id_user)
db.Users.hasMany(db.tb_Transaksi, { foreignKey: 'id_user', as: 'tb_transaksi' });
db.tb_Transaksi.belongsTo(db.Users, { foreignKey: 'id_user', as: 'user' });

// Relasi antara Video dan Transaksi (id_video)
db.Video.hasMany(db.tb_Transaksi, { foreignKey: 'id_video', as: 'tb_transaksi' });
db.tb_Transaksi.belongsTo(db.Video, { foreignKey: 'id_video', as: 'video' });

// Relasi antara Ebook dan Transaksi (id_ebook)
db.Ebook.hasMany(db.tb_Transaksi, { foreignKey: 'id_ebook', as: 'tb_transaksi' });
db.tb_Transaksi.belongsTo(db.Ebook, { foreignKey: 'id_ebook', as: 'ebook' });

// Relasi antara Kelas dan Transaksi (id_kelas)
db.Kelas.hasMany(db.tb_Transaksi, { foreignKey: 'id_kelas', as: 'tb_transaksi' });
db.tb_Transaksi.belongsTo(db.Kelas, { foreignKey: 'id_kelas', as: 'kelas' });

// 1 Video bisa memiliki banyak VideoFile (sub judul)
db.Video.hasMany(db.VideoFile, { foreignKey: 'id_video', as: 'file' });
db.VideoFile.belongsTo(db.Video, { foreignKey: 'id_video', as: 'video' });

// Sinkronisasi database
db.sequelize.sync({ force: false })
  .then(() => {
    console.log("Database & tables synchronized!");
  })
  .catch(err => {
    console.error("Error syncing database:", err);
  });

module.exports = db;
const Sequelize = require('sequelize');
const config = require('../config/dbconfig.js');

// koneksi ya gess yakkk
const sequelize = new Sequelize(config.DB, config.USER, config.PASSWORD, {
  host: config.HOST,
  dialect: config.dialect,
  pool: {
    max: config.pool.max,
    min: config.pool.min,
    acquire: config.pool.acquire,
    idle: config.pool.idle,
  },
  logging: false, 
});

// Inisialisasi objek guys
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
db.detail_Transaksi = require('./detail_transaksi.js')(sequelize, Sequelize.DataTypes);

// Relasi antara Users dan Transaksi
db.Users.hasMany(db.tb_Transaksi, { foreignKey: 'id_user', as: 'tb_transaksi' });
db.tb_Transaksi.belongsTo(db.Users, { foreignKey: 'id_user', as: 'Users' });

// Relasi antara Video dan Transaksi
db.Video.hasMany(db.tb_Transaksi, { foreignKey: 'id_video', as: 'tb_transaksi' });
db.tb_Transaksi.belongsTo(db.Video, { foreignKey: 'id_video', as: 'Video' });

// Relasi antara Ebook dan Transaksi
db.Ebook.hasMany(db.tb_Transaksi, { foreignKey: 'id_ebook', as: 'tb_transaksi' });
db.tb_Transaksi.belongsTo(db.Ebook, { foreignKey: 'id_ebook', as: 'Ebook' });

// Relasi antara Kelas dan Transaksi
db.Kelas.hasMany(db.tb_Transaksi, { foreignKey: 'id_kelas', as: 'tb_transaksi' });
db.tb_Transaksi.belongsTo(db.Kelas, { foreignKey: 'id_kelas', as: 'Kelas' });

// Relasi antara Video dan VideoFile (sub judul)
db.Video.hasMany(db.VideoFile, { foreignKey: 'id_video', as: 'file' });
db.VideoFile.belongsTo(db.Video, { foreignKey: 'id_video', as: 'Video' });

// Relasi antara Transaksi dan DetailTransaksi
db.tb_Transaksi.hasMany(db.detail_Transaksi, { foreignKey: 'id_transaksi', as: 'detail_Transaksi' });
db.detail_Transaksi.belongsTo(db.tb_Transaksi, { foreignKey: 'id_transaksi', as: 'tb_transaksi' });


// Relasi antara Users dan DetailTransaksi
db.Users.hasMany(db.detail_Transaksi, { foreignKey: 'id_user', as: 'detail_Transaksi' });
db.detail_Transaksi.belongsTo(db.Users, { foreignKey: 'id_user', as: 'users' });

// Relasi antara Video dan DetailTransaksi
db.Video.hasMany(db.detail_Transaksi, { foreignKey: 'id_video', as: 'detail_Transaksi' });
db.detail_Transaksi.belongsTo(db.Video, { foreignKey: 'id_video', as: 'Video' });

// Relasi antara Ebook dan DetailTransaksi
db.Ebook.hasMany(db.detail_Transaksi, { foreignKey: 'id_ebook', as: 'detail_Transaksi' });
db.detail_Transaksi.belongsTo(db.Ebook, { foreignKey: 'id_ebook', as: 'Ebook' });

// Relasi antara Kelas dan DetailTransaksi
db.Kelas.hasMany(db.detail_Transaksi, { foreignKey: 'id_kelas', as: 'detail_Transaksi' });
db.detail_Transaksi.belongsTo(db.Kelas, { foreignKey: 'id_kelas', as: 'Kelas' });

// Sinkronisasi database
db.sequelize
  .sync({ force: false, alter: true }) 
  .then(() => {
    console.log("Database & tables synchronized!");
  })
  .catch((err) => {
    console.error("Error syncing database:", err);
  });

module.exports = db;
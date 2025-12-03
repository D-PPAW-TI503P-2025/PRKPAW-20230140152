"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Presensi extends Model {
    static associate(models) {

      Presensi.belongsTo(models.User, {
        foreignKey: "userId",
        as: "user",
      });
    }
  }

  Presensi.init(
    {
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "users",
          key: "id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },

      checkIn: {
        type: DataTypes.DATE,
        allowNull: false,
      },

      checkOut: {
        type: DataTypes.DATE,
        allowNull: true,
      },

      // ➕ Tambahan sesuai modul (TIDAK mengubah coding lama)
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true, // Jika user menolak izin lokasi
      },

      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: "Presensi",
      tableName: "presensis",
    }
  );

  return Presensi;
};
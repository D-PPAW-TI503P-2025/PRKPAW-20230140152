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

      // Lokasi (latitude & longitude)
      latitude: {
        type: DataTypes.DECIMAL(10, 8),
        allowNull: true,
      },

      longitude: {
        type: DataTypes.DECIMAL(11, 8),
        allowNull: true,
      },

      // ➕ Tambahan: buktiFoto
      buktiFoto: {
        type: DataTypes.STRING,
        allowNull: true, // bisa kosong jika tidak upload foto
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
/*jshint esversion:6*/
module.exports = function(sequelize, DataTypes) {
  var Gallery = sequelize.define("Gallery", {
    author: {
      type: DataTypes.STRING,
      allowNull: false
    },
    link: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false
    }
  });

  return Gallery;
};
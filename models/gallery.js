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
      }, {
      classMethods: {
        associate: function(models) {
          Gallery.belongsTo(models.User);
        }
      }
    });

    return Gallery;
  };


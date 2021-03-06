'use strict';
var bcrypt = require('bcrypt-nodejs');

module.exports = function(sequelize, DataTypes) {
  var Organization = sequelize.define('Organization', {
    name: DataTypes.STRING,
    address: DataTypes.STRING,
    city: DataTypes.STRING,
    state: DataTypes.STRING,
    zip: DataTypes.STRING,
    country: DataTypes.STRING,
    industry: DataTypes.STRING,
    password_hash: DataTypes.STRING,
    web_name: DataTypes.STRING
  }, {
    hooks: {
      beforeCreate: function(org, options, fn) {
        org.hashPassword(org.password_hash, org.createWebName, fn);
      }
    },
    classMethods: {
      associate: function(models) {
        Organization.hasMany(models.User);
        Organization.hasMany(models.Session);
      }
    },
    instanceMethods: {
      hashPassword: function(password, cb, fn) {
        var org = this;
        return bcrypt.genSalt(10, function(err, salt) {
          if (err) {
            return cb(err);
          }
          return bcrypt.hash(password, salt, null, function(error, hash) {
            if (err) {
              return cb(err);
            }
            org.password_hash = hash;
            return cb(org, fn);
          });
        });
      },
      checkPassword: function(password, cb) {
        return bcrypt.compare(password, this.password_hash, function(err, result) {
          if(err){
            return cb(err);
          }
          return cb(result);
        });
      },
      createWebName: function(org, fn) {
        var org_name = org.name;
        org.web_name = org_name.replace(/ /g,'');
        fn();
      }
    }
  });
  return Organization;
};

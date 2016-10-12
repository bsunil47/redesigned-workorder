'use strict';
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');

var Users = mongoose.model('Collection_Users');
var Roles = mongoose.model('Collection_Roles');

exports.up = function(next) {

    var roles = new Roles({"role_name":'admin'});
  roles.save();

  var user = new Users(
      {
        "username": "Admin",
        "firstname": "Admin",
        "lastname": "1",
        "email": "admin@gmail.com",
        "password": "admin123",
        "status": 1,
        "userrole": roles._id,
      }
  );
  user.save();
  var roles = new Roles({"role_name":'operator'});
  roles.save();

  var user = new Users(
      {
        "username": "Operator",
        "firstname": "Operator",
        "lastname": "1",
        "email": "operator@gmail.com",
        "password": "operator123",
        "__v": 0,
        "status": 1,
        "userrole": roles._id,
      }
  );
  user.save();
  var roles = new Roles({"role_name":'manager'});
  roles.save();

  var user = new Users(
      {
        "username": "Manager",
        "firstname": "Manager",
        "lastname": "1",
        "email": "manager@gmail.com",
        "password": "manager123",
        "__v": 0,
        "status": 1,
        "userrole": roles._id,
      }
  );
  user.save(); var roles = new Roles({"role_name":'clerk'});
  roles.save();

  var user = new Users(
      {
        "username": "Clerk",
        "firstname": "Clerk",
        "lastname": "1",
        "email": "clerk@gmail.com",
        "password": "clerk123",
        "status": 1,
        "userrole": roles._id,
      }
  );
  user.save();
  var roles = new Roles({"role_name":'technician'});
  roles.save();
  var user = new Users(
      {
        "username": "Technician",
        "firstname": "Technician",
        "lastname": "1",
        "email": "technician@gmail.com",
        "password": "technician123",
        "__v": 0,
        "status": 1,
        "userrole": roles._id,
      }
  );
  user.save();
  next();
};

exports.down = function(next) {
  next();
};



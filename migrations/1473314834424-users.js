'use strict'
require('../config/db');
var express = require('express');
var mongoose = require('mongoose');
var Users = mongoose.model('Collection_Users');
var Roles = mongoose.model('Collection_Roles');

exports.up = function (next) {
    //Admin user list
    Roles.findOne({"role_name": 'admin'}, function (err, role) {
        if (err) {
            next(err);
        }
        var user = new Users({
            "username": "Costa Daniel",
            "firstname": "Costa",
            "lastname": "Daniel",
            "email": "Daniel.Costa@prysmiangroup.com",
            "password": "admin123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
    });
    //Manager users list
    Roles.findOne({"role_name": 'manager'}, function (err, role) {
        if (err) {
            next(err);
        }
        var user = new Users({
            "username": "Mcneil Daniel",
            "firstname": "Mcneil",
            "lastname": "Daniel",
            "email": "Daniel.McNeil@prysmiangroup.com",
            "password": "manager123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        var user = new Users({
            "username": "Lemoine Joel",
            "firstname": "Joel",
            "lastname": "Daniel",
            "email": "Joel.Lemoine@prysmiangroup.com",
            "password": "manager123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        /*user = new Users({
         "username": "Pereira Virginio",
         "firstname": "Pereira",
         "lastname": "Virginio",
         "email": "Virginio.Pereira@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "Pimentel TC",
         "firstname": "TC",
         "lastname": "Pimentel",
         "email": "TC.Pimentel@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "James White",
         "firstname": "White",
         "lastname": "James",
         "email": "James.White@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "Fonseca Joe",
         "firstname": "Fonseca",
         "lastname": "Joe",
         "email": "Jose.Fonseca@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "Mark Denne",
         "firstname": "Mark",
         "lastname": "Denne",
         "email": "Mark.Denne@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "Randy Almeida",
         "firstname": "Randy",
         "lastname": "Almeida",
         "email": "randy.almeida@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "David Moniz",
         "firstname": "David",
         "lastname": "Moniz",
         "email": "David.Moniz@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "Tim Pacheco",
         "firstname": "Tim",
         "lastname": "Pacheco",
         "email": "Tim.Pacheco@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "Bill Caron",
         "firstname": "Bill",
         "lastname": "Caron",
         "email": "Bill.Caron@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "Pedro Baptista",
         "firstname": "Pedro",
         "lastname": "Baptista",
         "email": "Pedro.Baptista@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "Elvis Freitas",
         "firstname": "Elvis",
         "lastname": "Freitas",
         "email": "elvis.freitas@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "Todd Dollarhide",
         "firstname": "Todd",
         "lastname": "Dollarhide",
         "email": "todd.dollarhide@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();
         user = new Users({
         "username": "Ed Voisine",
         "firstname": "Ed",
         "lastname": "Voisine",
         "email": "Ed.Voisine@prysmiangroup.com",
         "password": "manager123",
         "status": 1,
         "userrole": role._id,
         });
         user.save();*/

    });
    //Technician users list
    Roles.findOne({"role_name": 'technician'}, function (err, role) {
        if (err) {
            next(err);
        }
        var user = new Users({
            "username": "Paul Kenney",
            "firstname": "Paul",
            "lastname": "Kenney",
            "email": "paul.kenney@prysmiangroup.com",
            "password": "technician123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        var user = new Users({
            "username": "George Tourgee",
            "firstname": "George",
            "lastname": "Tourgee",
            "email": "george.tourgee@prysmiangroup.com",
            "password": "technician123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        var user = new Users({
            "username": "Bob Santheson",
            "firstname": "Bob",
            "lastname": "Santheson",
            "email": "bob.santheson@prysmiangroup.com",
            "password": "technician123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        var user = new Users({
            "username": "Mark Achin",
            "firstname": "Mark",
            "lastname": "Achin",
            "email": "mark.achin@prysmiangroup.com",
            "password": "technician123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        var user = new Users({
            "username": "Thomas Showstead",
            "firstname": "Thomas",
            "lastname": "Showstead",
            "email": "thomas.showstead@prysmiangroup.com",
            "password": "technician123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        var user = new Users({
            "username": "Joseph Souza",
            "firstname": "Joseph",
            "lastname": "Souza",
            "email": "joseph.souza@prysmiangroup.com",
            "password": "technician123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        var user = new Users({
            "username": "Dave Perkins",
            "firstname": "Dave",
            "lastname": "Perkins",
            "email": "dave.perkins@prysmiangroup.com",
            "password": "technician123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        var user = new Users({
            "username": "Paul Pacheco",
            "firstname": "Paul",
            "lastname": "Pacheco",
            "email": "paul.pacheco@prysmiangroup.com",
            "password": "technician123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        var user = new Users({
            "username": "Dale Bindas",
            "firstname": "Dale",
            "lastname": "Bindas",
            "email": "dale.bindas@prysmiangroup.com",
            "password": "technician123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
        var user = new Users({
            "username": "Brian Rebelo",
            "firstname": "Brian",
            "lastname": "Rebelo",
            "email": "brian.rebelo@prysmiangroup.com",
            "password": "technician123",
            "status": 1,
            "userrole": role._id,
        });
        user.save();
    });
    next();
};

exports.down = function (next) {
    next();
};

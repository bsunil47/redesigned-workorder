var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Users = mongoose.model('Collection_Users');
var Roles = mongoose.model('Collection_Roles');


router.post('/', function(req, res, next) {
  Users.findOne({email: req.body.username,password: req.body.password},function(err, users) {
    if (err) { return next(err); }

    if (users != null) {
      Roles.findOne({_id: users.userrole},function(err,role) {
        if (err) { return next(err); }
        res.json({Code: 200,Info: {user: users,role: role.role_name}});
      })


    }else {
      res.json({Code: 406,Info: 'no user'});
    }

  });
  //Res.json('respond with asa resource');
});

router.post('/userlist', function(req, res, next) {
  Users.find({},function(err, users) {
    if (err) {
      return next(err)

    };

    if (users != null) {
      Roles.find({},function(err,role) {
        if (err) { return next(err); }
        res.json({Code: 200,Info: {users: users, roles: role}});
      })

    }else {
      res.json({Code: 406,Info: 'no user'});
    }

  });
  //Res.json('respond with asa resource');
});

router.post('/createuser', function(req, res, next) {
  Roles.findOne({role_name: req.body.userrole},function(err,role) {
    if (err) { return next(err); }
    var user = new Users({
      username: req.body.username,
      firstname: req.body.firstname,
      lastname: req.body.lastname,
      email: req.body.email,
      userrole: role._id,
      status: 1,
      password: req.body.password,
    });
    user.save(function(err,resp) {
      if (err) {
        console.log(err);
        res.json({
          Code: 499,
          message: 'Already used',
        });
      } else {
        res.json({Code: 200,Info: 'sucessfull'});
      }
    });
    //Res.json({Code:200,Info:{user:users,role:role.role_name}});
  })

  //User.save();
  //res.json({Code:200,Info:"sucessfull"});
  //res.json('respond with asa resource');
});

router.post('/changepassword', function(req, res, next) {
  //Return res.json({Code:200,Info:"sucessfull"});
  var query = {_id: req.body.id};
  Users.findOne(query,function(err,user) {
    if (err) {
      res.json({
        Code: 499,
        message: err,
      });
    }else {
      Users.findOneAndUpdate(query, {password: req.body.password}, {upsert: true}, function(err, doc) {
        if (err) return res.send(500, {error: err});
        return res.json({Code: 200, Info: 'sucessfull'});
      });
    }

  });

  //User.save();
  //res.json({Code:200,Info:"sucessfull"});
  //res.json('respond with asa resource');
});


module.exports = router;

var express = require('express');
var router = express.Router();
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/user.js")
const bcrypt = require("bcryptjs")

passport.serializeUser(function(user, done) {
    done(null, user.id);
 });
 
 passport.deserializeUser(function(id, done) {
   User.findById(id, function(err, user) {
      done(err, user);
   });
});
passport.use(
    new LocalStrategy((username, password, done) => {
      User.findOne({ username: username }, (err, user) => {
        if (err) { 
          return done(err);
        }
        if (!user) {
          return done(null, false, { message: "Incorrect username" });
        }
        bcrypt.compare(password, user.password, (err, res) => {
            if (res) {
              // passwords match! log user in
              return done(null, user)

            } else {
              // passwords do not match!

              return done(null, false, { message: "Incorrect password" })
            }
        })  
      });
    })
  );

router.post('/api/login', 
  passport.authenticate('local'),
  function(req, res, user) {
    res.status(200).json({success: true, user: req.user.username, status: req.user.membershipStatus})
  });

  router.post("/api/logout", (req, res) => {
    req.logout();
    res.status(205).json()
});

router.post("/api/signup", (req, res, next) => {
    User.findOne({username: req.body.username}, (err,user) => {
      if (err) return next(err)
      if (user) {
        res.status(303).json({success: false, message: "User already exists"})
      }
      else {
        bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
          // if err, do something
          if (err)
              return console.log(err)
          // otherwise, store hashedPassword in DB
          const user = new User({
              username: req.body.username,
              password: hashedPassword,
              fullName: req.body.fName + " " + req.body.lName,
              firstName: req.body.fName,
              lastName: req.body.lName,
              membershipStatus: 'noob'
            }).save(err => {
              if (err) { 
                return next(err);
              }
              res.status(200).json({success: true})
            });
    });
      }
    })
    
});
module.exports = router;
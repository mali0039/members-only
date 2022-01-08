/////// app.js

const express = require("express");
const bcrypt = require("bcryptjs")
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const mongoose = require("mongoose");

require("dotenv").config()
const User = require("./models/user.js")
const Post = require("./models/post.js")
const Schema = mongoose.Schema;
const secret = process.env.SECRET
const mongoDb = process.env.DB_URL
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));



const app = express();


app.use(session({ secret: secret, resave: false, saveUninitialized: true }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

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
  


// app.get("/", (req, res) => {
//   const testUser = new User({
//     firstName: "Mustafa",
//     lastName: "Ali",
//     fullName: "Mustafa Ali",
//     username: "mali39@student.gsu.edu",
//     password: "Test123",
//     membershipStatus: "admin"
//   }).save(err => {
//     if (err) { 
//       return next(err);
//     }
//     console.log("USER SAVED")
//   })
// });
// app.get("/sign-up", (req,res) => {
//     res.render('sign-up-form')
// })

app.post("/api/sign-up", (req, res, next) => {
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
app.get('/api/messages', (req,res,next) => {
  Post.find().populate("createdBy", "username").exec((err, posts) => {
    if (err) return next(err);
    if (req.query.status == 'noob' || req.query.status == "") {
      posts.forEach((post) => {
        post.createdBy.username = "Anonymous"
      })
    }

    res.status(200).json({messages: posts, success: true })
  })
})  
app.post('/api/message', (req,res,next) => {
  console.log("test")
  User.findOne({username: req.body.username}, (err,user) => {
    console.log(req.body.username)
    console.log(user)
    if (err) return next(err)
      if (user) {
        const post = new Post({
          text: req.body.message,
          createdBy: user._id
        }).save((err,post) => {
          if (err) {
            return next(err);
          }
          res.status(201).json({success: true, post: post})
        })
      }
  })
})
app.post('/api/log-in', 
  passport.authenticate('local'),
  function(req, res, user) {
    res.status(200).json({success: true, user: req.user.username, status: req.user.membershipStatus})
  });

  app.delete('/api/message', (req,res, next) => {
    Post.deleteOne({_id: req.body.id}, (err, result) => {
      if (err) return next(err)
      res.status(200).json({success: true, result})
    })
  })
app.post("/api/log-out", (req, res) => {
    req.logout();
    res.status(205)
});
app.post("/api/member", (req,res,next) => {
  const username = req.body.user;
  User.findOneAndUpdate({username}, {membershipStatus: 'member'}, (err, result) => {
    if (err) return next(err);
    res.status(204).json({success: true, status: "updated"})
  })
})
const PORT = process.env.PORT || 3000
app.listen((PORT), () => console.log("app listening on port " + PORT));

module.exports = app;

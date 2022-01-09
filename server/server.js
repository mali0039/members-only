/////// app.js

const express = require("express");
const path = require("path");
const session = require("cookie-session");
const passport = require("passport");
const compression = require('compression');
const helmet = require('helmet');
const mongoose = require("mongoose");

require("dotenv").config()
const User = require("./models/user.js")
const Post = require("./models/post.js")
const login = require("./routes/login") 
const message = require('./routes/message.js')
const Schema = mongoose.Schema;
const secret = process.env.SECRET
const mongoDb = process.env.DB_URL
mongoose.connect(mongoDb, { useUnifiedTopology: true, useNewUrlParser: true });
const db = mongoose.connection;
db.on("error", console.error.bind(console, "mongo connection error"));



const app = express();

app.use(compression())
app.use(express.static('dist/members-only'))
app.use(helmet());
app.use(session({ 
  name: 'session',
  keys: [secret],

  // Cookie Options
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
 }));
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: true }));
app.use(express.json())

app.use(login)
app.use('/api/message', message)



  




app.post("/api/member", (req,res,next) => {
  const username = req.body.user;
  User.findOneAndUpdate({username}, {membershipStatus: 'member'}, (err, result) => {
    if (err) return next(err);
    res.status(204).json({success: true, status: "updated"})
  })
})

app.get("*", (req,res) => {
  res.redirect('/')
})
const PORT = process.env.PORT || 3001
app.listen((PORT), () => console.log("app listening on port " + PORT));

module.exports = app;

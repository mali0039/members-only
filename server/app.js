/////// app.js

const express = require("express");
const path = require("path");
const session = require("express-session");
const passport = require("passport");

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

app.use(express.static('members-only'))

app.use(session({ secret: secret, resave: false, saveUninitialized: true }));
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
const PORT = process.env.PORT || 3000
app.listen((PORT), () => console.log("app listening on port " + PORT));

module.exports = app;

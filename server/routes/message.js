var express = require('express');
var router = express.Router();
const Post = require("../models/post.js")
const User = require("../models/user.js")


router.get('/', (req,res,next) => {
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
router.post('/create', (req,res,next) => {

  User.findOne({username: req.body.username}, (err,user) => {

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


router.delete('/delete', (req,res, next) => {
  Post.deleteOne({_id: req.body.id}, (err, result) => {
    if (err) return next(err)
    res.status(200).json({success: true, result})
  })
})
module.exports = router;

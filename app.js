//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require('lodash');

const homeStartingContent = "This is a WebApp for publishing blog posts. You can create posts, store them in Mongo database and read it";
const aboutContent = "Hac habitasse platea dictumst vestibulum rhoncus est pellentesque. Dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Non diam phasellus vestibulum lorem sed. Platea dictumst quisque sagittis purus sit. Egestas sed sed risus pretium quam vulputate dignissim suspendisse. Mauris in aliquam sem fringilla. Semper risus in hendrerit gravida rutrum quisque non tellus orci. Amet massa vitae tortor condimentum lacinia quis vel eros. Enim ut tellus elementum sagittis vitae. Mauris ultrices eros in cursus turpis massa tincidunt dui.";
const contactContent = "Scelerisque eleifend donec pretium vulputate sapien. Rhoncus urna neque viverra justo nec ultrices. Arcu dui vivamus arcu felis bibendum. Consectetur adipiscing elit duis tristique. Risus viverra adipiscing at in tellus integer feugiat. Sapien nec sagittis aliquam malesuada bibendum arcu vitae. Consequat interdum varius sit amet mattis. Iaculis nunc sed augue lacus. Interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit. Pulvinar elementum integer enim neque. Ultrices gravida dictum fusce ut placerat orci nulla. Mauris in aliquam sem fringilla ut morbi tincidunt. Tortor posuere ac ut consequat semper viverra nam libero.";

const app = express();
//setting view engine
app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));

//database
const mongoose = require("mongoose")
mongoose.connect("mongodb://localhost:27017/blogDB", {useUnifiedTopology: true, useNewUrlParser: true});
const postSchema = {
  title: String,
  content: String
 };
 //define  posts collection
const Post = mongoose.model("Post", postSchema);

app.get('/', function (req, res) {
  Post.find({}, function(err, posts){
    res.render('home', {
      //here is a key value pair, key match with variable name
      // in home.ejs and value = whatever data but here is we have variable
      homeStartingContent: homeStartingContent,
      posts: posts
    });
  })
});

app.get('/posts/:postId', function (req, res) {
  //res.send(req.params)
  // const requestedTitle = _.lowerCase(req.params.postId);
  const requestedPostId = req.params.postId;

  Post.findOne({_id: requestedPostId}, function(err, post){
    res.render("post", {
      title: post.title,
      content: post.content
    });
  });

});

app.get('/about', function (req, res) {
  res.render('about', {
    aboutContent: aboutContent
  })
});

app.get('/contact', function (req, res) {
  res.render('contact', {
    contactContent: contactContent
  })
});
app.get('/compose', function (req, res) {
  res.render('compose')
});

app.post('/compose', function (req, res) {
  const post = new Post ({
    title: req.body.newTitle,
    content: req.body.newPost
  });
  //we save the post
  post.save(function(err){
    if (!err){
      res.redirect("/");
    }
  });
});

app.listen(3000, function () {
  console.log("Server started on port 3000");
});
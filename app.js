const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override')
const mongoose = require('mongoose');
const sanitize = require('express-sanitizer')
const app = express();

//creating utility
mongoose.connect('mongodb://localhost/my_blog');
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({extended: true}));
app.use(sanitize());
app.use(methodOverride('_method'));

//create new blog schema for mongo - standard blog schema
let blogSchema = new mongoose.Schema({
  title: String,
  image: String,
  body: String,
  created: {type: Date, default: Date.now}
  });

let Blog = mongoose.model('Blog', blogSchema);



//begin restful routing
//INDEX routes
app.get('/', function(req, res){
  res.redirect('/blogs');
})

app.get('/blogs', function(req, res){
  Blog.find({}, function(err, blogs){
    if (err){
      console.log(err);
    }else {
      res.render('index', {blogs: blogs});
    }
  })
})

//NEW route
app.get('/blogs/new', function(req,res){
  res.render('new');
})

//CREATE route
app.post('/blogs', function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.create(req.body.blog, function(err, newBlog){
    if (err){
      res.render('/new');
    } else{
      res.redirect('/blogs');
    }
  })
})

//SHOW route
app.get('/blogs/:id', function(req, res){
  Blog.findById(req.params.id, function(err,foundBlog){
    if (err){
      res.redirect('/')
    } else{
      res.render('show', {blog: foundBlog});
    }
  })

})

//EDIT route
app.get('/blogs/:id/edit', function(req, res){
  Blog.findById(req.params.id, function(err, foundBlog){
    if (err){
      res.redirect('/blogs')
    } else {
      res.render('edit',{blog: foundBlog});
    }
  })
})

//UPDATE route
app.put('/blogs/:id', function(req,res){
  req.body.blog.body = req.sanitize(req.body.blog.body);
  Blog.findByIdAndUpdate(req.params.id, req.body.blog, function(err, updatedBlog){
    if (err){
      res.redirect('/blogs');
    } else{
      res.redirect('/blogs/'+req.params.id);
    }
  })
});

//DELETE route
app.delete('/blogs/:id', function(req,res){
  Blog.findByIdAndRemove(req.params.id, function(err){
    if (err){
      res.redirect('/blogs');
    } else {
      res.redirect('/blogs');
    }
  })
})
//listening on localhost. Change value after deployment
app.listen(3000, '127.0.0.1', function(){
  console.log('Initializing Blog server...');

})

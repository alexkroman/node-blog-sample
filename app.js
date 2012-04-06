
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes');

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/blog');

var Schema = mongoose.Schema
  , ObjectId = Schema.ObjectId;

var BlogPost = new Schema({
    author    : ObjectId
  , title     : String
  , body      : String
});

mongoose.model('Blog', BlogPost)
var Blog = mongoose.model('Blog')

var app = module.exports = express.createServer();

// Configuration

app.configure(function(){
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(require('stylus').middleware({ src: __dirname + '/public' }));
  app.use(app.router);
  app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes


app.get('/', function(req, res){
    Blog.find( function(error,docs){
        res.render('index.jade', { locals: {
            title: 'Blog',
            articles:docs
            }
        });
    })
});

app.get('/blog/new', function(req, res) {
    res.render('blog_new.jade', { locals: {
        title: 'New Post'
    }
    });
});

app.post('/blog/new', function(req, res){
	new Blog({
		title: req.param('title'),
        body: req.param('body')
	}).save( function(error, data) {
		res.redirect('/')	
	});
});

app.listen(3000, function(){
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});

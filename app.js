// Config Stuff

var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	swig = require('swig'),
	thinky = require('thinky'),
	db = require('./db'),
	config = require('./config'),
	schema = require('./schema'),
	thinky = require('thinky'),
	r = thinky.r,
	type = thinky.type,
	Query = thinky.Query;

app.engine('html', swig.renderFile);
app.set('view engine', 'html');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/views/static'));
app.use(cookieParser());
app.use(session({secret: 'anything', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.set('view cache', false);
swig.setDefaults({cache: false});

app.locals = {

};

// Main Gets
app.get('*', function(req, res, next) {
	next();
});
app.get('/', function(req, res) {
  res.render('index');
});
app.get('/content/community', function(req, res) {
  res.render('communitycontent');
});
app.get('/content/twitch', function(req, res) {
  res.render('twitchcontent');
});
app.get('/authors', function(req, res) {
  res.render('authors');
});
app.get('/submit', function(req, res) {
  res.render('submit');
});

app.get('/content/community/:id', function(req, res) {
  var id = req.params.id;
	db.content.select(id).then(function(result) {
		res.render('community-content', {content: result[0] })
	})
});

// Posts

app.post('/content/submit', function(req,res) {
	req.body.approved = (req.body.approved == "true")
	db.content.create(req.body).then(function(result) {
  	res.status(200).send('Content submitted and awaiting approval!')
	}).catch(function(error) {
  	console.log("err : " + error);
	})
});

// Get 404
app.get('*', function(req, res, next) {
	res.render('404');
});

var server = app.listen(7000, function() {
	console.log('Listening on port ' + 7000 + '.');
});

// Config Stuff

var express = require('express'),
	bodyParser = require('body-parser'),
	app = express(),
	session = require('express-session'),
	cookieParser = require('cookie-parser'),
	swig = require('swig'),
	db = require('./db'),
	config = require('./config'),
	helpers = require('./helpers'),
	schema = require('./schema'),
	restler = require('restler'),
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
	authurl: config.auth.authurl
};

// Main Gets
app.get('*', function(req, res, next) {
	app.locals.loggedin = req.session.name;
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

app.get('/admin', function(req, res) {
	if (helpers.isMod(req.session.name)) {
		db.content.getpending().then(function(result) {
			res.render('admin', {pending: result})
		})
	}
	else {
		res.render('error', { title: "Sorry! You don't have permission to do that.", subtext: "Only subreddit moderators and community helpers are permitted to view admin sections of the site."})
	}
});

app.get('/content/community/:id', function(req, res) {
  var id = req.params.id;
	db.content.select(id).then(function(result) {
		res.render('community-content', {content: result[0] })
	})
});

app.get('/auth/', function(req, res) {
    restler.post('https://www.reddit.com/api/v1/access_token', {
        username: config.auth.cid,
        password: config.auth.secret,
        data: {
            code: req.query.code,
            grant_type: 'authorization_code',
            redirect_uri: config.auth.redirect
        }
    }).on('complete', function(data) {
				restler.get('https://oauth.reddit.com/api/v1/me', {
		 			'headers': {
				 		'User-Agent': 'SubredditWiki',
				 		'Authorization': 'bearer ' + data.access_token
		 			}
				}).on('complete', function(finaldata) {
					req.session.name = finaldata.name
					req.session.auth = data.access_token
					res.redirect('/')
				});
    });
});

app.get('/logout/', function(req, res) {
	req.session.destroy(function() {
		res.redirect('/');
	});
});

// Posts

app.post('/content/submit', function(req,res) {
	req.body.approved = (req.body.approved == "true")
	req.body.latest = (req.body.latest == "true")
	db.content.create(req.body).then(function(result) {
  	res.status(200).send('Content submitted and awaiting approval!')
	}).catch(function(error) {
  	console.log("err : " + error);
	})
	db.author.isAuthor(req.body.author).then(function(result) {
		if (result == true) {
			db.author.select(req.body.author).then(function(trueresult) {
				var AuthorData = trueresult[0]
				var content = AuthorData.content
				var id = parseInt(req.body.id)
				content.push(id)
				db.author.update({id: AuthorData.id, twitchname: AuthorData.twitchname, flair: AuthorData.flair, image: AuthorData.image, content: content})
			})
		}
		else if (result == false) {
			db.author.create({id: req.body.author, twitchname: null, twittername: null, flair: null, image: null,  content: JSON.parse("[" + req.body.id + "]")}).then(function(createresult) {
			}).catch(function(error) {
		  	console.log("err : " + error);
			})
		}
	}).catch(function(error) {
		console.log("err : " + error);
	})
	res.redirect("/content/community/" + req.body.id)
});

app.post('/content/upvote', function(req, res) {
	db.content.select(req.body.id).then(function(result) {
		result[0].votes = result[0].votes + 1
		db.content.upvote(result[0]).run()
	})
})

app.post('/admin/approve', function(req, res) {
	db.content.select(req.body.id).then(function(result) {
		result[0].approved = true
		db.content.approve(result[0]).run()
	})
	res.status(200).send("Content Approved")
});

app.post('/admin/reject', function(req, res) {
	db.content.reject(req.body.id)
	res.status(200).send("Content Rejected")
});

// Get 404
app.get('*', function(req, res, next) {
	res.render('error', { title: "404", subtext: "That page does not exist."});
});

var server = app.listen(7000, function() {
	console.log('Listening on port ' + 7000 + '.');
});

var	config = require('./config'),
  thinky = require('thinky')({host:config.app.rethink.host, port:config.app.rethink.port, db: config.app.rethink.db}),
  r = thinky.r,
  type = thinky.type,
  Query = thinky.Query;

var schema = {};

schema.primarykey = {
  content: "id",
  author: "redditname"
};

schema.content = {
  id: type.number(),
  author: type.string(),
  version: type.number(),
  title: type.string(),
  link: type.string(),
  body: type.string(),
  approved: type.boolean()
};

schema.author = {
  redditname: type.string(),
  twitchname: type.string(),
  twittername: type.string(),
  type: type.string(),
  image: type.string(),
  content: type.array()
}

schema.official = {
  id: type.number(),
  article: type.object()
}

module.exports = schema;

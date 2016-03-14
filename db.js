var	config = require('./config'),
  schema = require('./schema'),
  needle = require('needle'),
  async = require('async'),
  thinky = require('thinky')({host:config.app.rethink.host, port:config.app.rethink.port, db: config.app.rethink.db}),
	r = thinky.r,
	type = thinky.type,
	Query = thinky.Query,
  ContentModel = thinky.createModel('content', schema.content, schema.primarykey.content);

var content = {
  select: (id) => {
    console.log(id)
		return new Promise((resolve, reject) => {
      var id = id
      console.log(id)
      ContentModel.filter({id: id}).run().then((db) => {
        resolve(db);
      }).catch(function(err) {
        console.log(err)
      });
    });
	},
  create: (object) => {
		return new Promise((resolve, reject) => {
			ContentModel.get(object.id).run().then((db) => {
					resolve("id_exists");
			}).catch(thinky.Errors.DocumentNotFound, (err) => {
				var ContentData = new ContentModel(object);
				ContentData.save((err) => {
					if(err) { reject(err) };
					resolve("content_created");
				});
			});
    });
	}
}

module.exports = {
  content: content
}

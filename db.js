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
		return new Promise((resolve, reject) => {
      ContentModel.filter(r.row("id").eq(id)).run().then((db) => {
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

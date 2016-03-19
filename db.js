var	config = require('./config'),
  schema = require('./schema'),
  thinky = require('thinky')({host:config.app.rethink.host, port:config.app.rethink.port, db: config.app.rethink.db}),
	r = thinky.r,
	type = thinky.type,
	Query = thinky.Query,
  ContentModel = thinky.createModel('content', schema.content, schema.primarykey.content);
  AuthorModel = thinky.createModel('author', schema.author, schema.primarykey.author);

var content = {
  select: (id) => {
		return new Promise((resolve, reject) => {
      var key = parseInt(id)
      ContentModel.filter({id: key}).run().then((db) => {
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
	},
  getpending: () => {
    return new Promise((resolve, reject) => {
      ContentModel.filter({approved: false}).run().then((db) => {
        resolve(db)
      }).catch(function(err) {
        console.log(err)
      });
    })
  },
  approve: (object) => {
    return new Promise((resolve, reject) => {
      ContentModel.filter({id: object.id, version: object.version}).update(object).run().then((db) => {
        resolve(db)
      })
    })
  },
  reject: (id) => {
    return new Promise((resolve, reject) => {
      var key = parseInt(id)
      ContentModel.filter({id: key}).delete().run().then((db) => {
        resolve(db)
      })
    })
  },
  upvote: (object) => {
    return new Promise((resolve, reject) => {
      var key = parseInt(object.id)
      ContentModel.filter({id: key, latest: true}).update(object).run().then((db) => {
        resolve(db)
      })
    })
  }
}

var author = {
  isAuthor: (author) => {
    return new Promise((resolve, reject) => {
      AuthorModel.get(author).run().then((db) => {
        resolve(true)
      }).catch(thinky.Errors.DocumentNotFound, (err) => {
        resolve(false)
      })
    })
  },
  create: (author, id) => {
    return new Promise((resolve, reject) => {
      var id = parseInt(id)
			var AuthorData = new AuthorModel(author);
			AuthorData.save((err) => {
				if(err) { reject(err) };
				resolve("content_created");
			});
    })
  },
  update: (object) => {
    return new Promise((resolve, reject) => {
      AuthorModel.filter({id: object.id}).update(object).run().then((db) => {
        resolve(db);
      });
    });
  },
  select: (id) => {
    return new Promise((resolve, reject) => {
      AuthorModel.filter({id: id}).run().then((db) => {
        resolve(db)
      })
    })
  }
}

module.exports = {
  content: content,
  author: author
}

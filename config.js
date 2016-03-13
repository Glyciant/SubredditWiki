var config = {};

config.app = {};
config.twitch = {};
config.app.rethink = {};


config.app.port = 7000;
config.app.baseurl = "http://localhost:"+config.app.port;
config.app.cookie = " ";

config.app.rethink.host = "127.0.0.1";
config.app.rethink.port = "28015";
config.app.rethink.db = "WikiDB";

config.twitch.grant = 'authorization_code';
config.twitch.redirect = config.app.baseurl+"/auth/";

config.twitch.cid = " ";
config.twitch.secret = " ";
config.twitch.authurl = 'https://api.twitch.tv/kraken/oauth2/authorize?response_type=code&client_id='+config.twitch.cid+'&redirect_uri='+config.twitch.redirect+'&scope=user_read';

config.twitch.mods = ["distortednet","mellownebula","boomliam","conceptional","laagone","heep123","decicus","zcotticus","zcotticus"];
config.twitch.helpers = ["moorlly", "saaitv"];



module.exports = config;

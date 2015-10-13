var FB = require('fb');
var FBgoogle = require('fb');
var Step = require('step');
var config = require('../../config/local');
var passport = require('passport')




module.exports = {
	getUri: function(req, res){

		var request = require('request');
		var cheerio = require('cheerio');
		var db=[],news,newsid=1;
		//var incomingurl = '', 測試用
		var incomingurl = req.body.Uri,
			title,content,pic,exist, media = "nothing";
		switch(req.body.Uri.split('/')[2]) {
		case 'www.appledaily.com.tw':
			media = "apple";
			break;
		case 'www.chinatimes.com':
			media = "china";
			break;
		case 'www.ettoday.net':
			media = "et";
			break;
		default:
			res.send({scrape: false});
		}
		if(media != "nothing"){
			console.log("media: " + media);
			request(incomingurl, function (err, resb, html) {
				if (!err && resb.statusCode == 200) {
					console.log("Load the page successfully!");
					var $ = cheerio.load(html);
					switch(media){
						case "apple":
							title = $('h1#h1').text();
							content = $('div.articulum p').text();
							pic = $('figure.sgimg').children('a').children('img').attr('src');
							break;
						case"et":
							title = $('h2.title').text();
							content = $('div.story p').nextUntil('div').text();
							pic = $('div.story img').attr('src');
							break;
						case "china":
							title = $('header').children('h1').text();
							content = $('article.clear-fix p').text();
							pic = $('article.clear-fix div.pic img').attr('src');
							break;
						default:
							console.log("Scrap nothing!");
					};
					News.findOne()
					.where({url: incomingurl})
					.exec(function(err, fnews){
						console.log(fnews);
						if(!fnews){
							exist = 0;
							res.send({
								scrape: true,
								newsTitle: title,
								newsContent: content,
								newsPic: pic,
								newsExist: exist,
								newsUrl: incomingurl,
								newshot: 0


							});
						}
						else{
							exist = 1;
							res.send({
								scrape: true,
								newsTitle: title,
								newsContent: content,
								newsPic: pic,
								newsExist: exist,
								newsUrl: incomingurl,
								newshot: fnews.hot


							});
						}

					});
				}
			})
		}
	},

    fblogin: function(req, res, next){

    	var code            = req.query.code;

	    if(req.query.error) {
	        // user might have disallowed the app
	        return res.send('login-error ' + req.query.error_description);
	    } else if(!code) {
	        return res.redirect('/')
	    }

	    Step(
	        function exchangeCodeForAccessToken() {
	            FB.napi('oauth/access_token', {
	                client_id:      FB.options('appId'),
	                client_secret:  FB.options('appSecret'),
	                redirect_uri:   config.facebook.redirectUri+"google/login",
	                code:           code
	            }, this);

	        },
	        function extendAccessToken(err, result) {
	            if(err) throw(err);
	            FB.napi('oauth/access_token', {
	                client_id:          FB.options('appId'),
	                client_secret:      FB.options('appSecret'),
	                grant_type:         'fb_exchange_token',
	                fb_exchange_token:  result.access_token
	            }, this);
	            	        },
	        //set session
	        function (err, result) {
	            if(err) return next(err);
	            req.session.access_token    = result.access_token;
	            req.session.expires         = result.expires || 0;



		    	res.redirect('/');



	        }
	    )
    },

    getSession: function(req, res){
    	res.send({
    		loginUrl: FB.getLoginUrl({
    			 scope: 'public_profile,user_photos,email',
    			 redirect_uri: config.facebook.redirectUri+"google/login"
    		}),
    		Session: req.session
    	})
    },

    getSessionBack: function(req, res){
    	res.send({
    		Session: req.session
    	})
    },
};


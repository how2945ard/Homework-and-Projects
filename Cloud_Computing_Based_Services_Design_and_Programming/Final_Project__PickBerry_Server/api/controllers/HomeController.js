var FB = require('fb');
var FBgoogle = require('fb');
var Step = require('step');
var config = require('../../config/local');
var passport = require('passport')


FB.options({
    appId:          config.facebook.appId,
    appSecret:      config.facebook.appSecret,
    redirectUri:    config.facebook.redirectUri+"fblogin"
});


module.exports = {
	index: function(req,res){
		var accessToken = req.session.access_token;
		var session_id = req.session.fbid;
		if(!accessToken){
	      		console.log('accesstoken is null');
	           res.render("home/login", {
	            title: "login page",
	            loginUrl: FB.getLoginUrl({ scope: 'public_profile,user_photos,email'}),
	          });
	    }
	    else{
      		FB.setAccessToken(accessToken);
            FB.api('/me',{field:['id','name','photos','gender','email']}, function (response) {
			  if(!response || response.error) {
			    console.log(!response ? 'error occurred' : response.error);
			    return;
			  }
			 console.log(response)
			User.findOne()
				.where({fbid: response.id})
				.where({name: response.name})
				.exec(function(err,user){
					if(err) throw err;
					if(!user){
						console.log('Find nothing...');

						User.create({fbid: response.id, name: response.name, sex: response.gender, email: response.email })
							.exec(function(err,user){
								console.log("Create user: "+user.name);
								req.session.user = user.id
								req.session.authenticated = true
								req.session.save()
								res.view("home/index",{
						            title: "News",
						            user: user
					        	})
					            // user_photo: user.photos
							});
					}
					else{
						user.name =  response.name
						user.sex =response.gender
						user.email = response.email
						user.save()
						console.log("Get user:" +user.name);
						req.session.user = user.id
						req.session.authenticated = true
						req.session.save()
						console.log(req.session.authenticated)

						res.view("home/index",{
				            title: "News",
				            user: user
			        	})
					}
				})
          	});
		};
    },
    fblogout: function(req,res){
		// req.logout();
		 if (req.session.authenticated) {
		    req.session.authenticated = false;
			req.session.cookie.expires = 0;
			req.session.access_token = null
			req.session.expires = 0
			req.session.user = null
			req.session.save()
			res.redirect('/');
		  }
    },



    fblogin: function(req, res, next){

    	var code            = req.query.code;

	    if(req.query.error) {
	        // user might have disallowed the app
	        return res.send('login-error ' + req.query.error_description);
	    } else if(!code) {
	        return res.redirect('/');
	    }

	    Step(
	        function exchangeCodeForAccessToken() {
	            FB.napi('oauth/access_token', {
	                client_id:      FB.options('appId'),
	                client_secret:  FB.options('appSecret'),
	                redirect_uri:   FB.options('redirectUri'),
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


	            console.log(req.session)
		    	res.redirect('/');



	        }
	    )
    },

    exfblogin: function(req ,res, next){
    	var code            = req.query.code;

	    if(req.query.error) {
	        // user might have disallowed the app
	        return res.send('login-error ' + req.query.error_description);
	    } else if(!code) {
	        return res.send({
	        	login: false

	        });
	    }

	    Step(
	        function exchangeCodeForAccessToken() {
	            FB.napi('oauth/access_token', {
	                client_id:      FB.options('appId'),
	                client_secret:  FB.options('appSecret'),
	                redirect_uri:   "http://localhost:1337/exfblogin",
	                code:           code
	            }, this);
	            console.log('exfblogin!')

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



		    	res.send({
		    		login: "login",
		    	});



	        }
	    )
	},


    getSession: function(req, res){
    	console.log(FB.getLoginUrl({ scope: 'public_profile,user_photos,email'}));
    	console.log(req.session)
    	res.send({
    		loginUrl: FB.getLoginUrl({ scope: 'public_profile,user_photos,email'}),
    		Session: req.session
    	})
    },
};
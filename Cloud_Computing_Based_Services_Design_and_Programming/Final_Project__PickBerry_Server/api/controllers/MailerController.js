/**
 * ReasonController
 *
 * @description :: Server-side logic for managing reasons
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */
var nodemailer = require("nodemailer");
var email;
var news;
var request = require('request');


module.exports = {
	mail_form: function(req,res){

		console.log(req.param('url'));
		console.log(req.param('media'));

		Company.findOne({name: req.param('media')})
			.exec(function(err, data){
				if(data)
				{
					email = data.email;
					console.log(email);
				}
				else{
					email = "";
				}
				News.findOne({url: req.param('url')}).exec(function(err, data){
					if(data){
						console.log('found')
						news = data.title;
						console.log(news);
						res.view("mailer/mailForm",{
							id: data.id,
							media: req.param('media'),
							url: req.param('url'),
							news: news,
							email: email
						})
					}
					else{
						var uri = req.param('url')
						request.post('http://localhost:1337/news/addNews',{
							form:{
								uri: uri
							}
						},function(err,response,html){
							console.log(response.body)
							res.view("mailer/mailForm",{
								id: response.body.news.id,
								media: req.param('media'),
								url: req.param('url'),
								news: response.body.news.title,
								email: email
							})
						})
					}

				})
			})
	},
	send_mail: function(req,res){
		var smtpTransport = nodemailer.createTransport("SMTP",{
		    service: "Gmail",
		    auth: {
		        user: "blueberrycollector@gmail.com",
		        pass: "ccsp2014"
		    }
		});
		var mailOptions = {
	    	// from: "<News Reporter>", // sender address   +report.owner.email
		    to: req.body.to,//report.owner.email+" , "+company.email // list of receivers
		    subject: req.body.title, // Subject line
		    text: req.body.content, // plaintext body
		    // html:  // html body
		}
		smtpTransport.sendMail(mailOptions, function(error, response){
		    if(error){
		        console.log(error);
		    }else{
		        console.log("Message sent: " + response.message);
		        res.redirect("/news/show/"+req.body.url)
		    }
		    // if you don't want to use this transport object anymore, uncomment following line
		    smtpTransport.close(); // shut down the connection pool, no more messages
		});
	}
};
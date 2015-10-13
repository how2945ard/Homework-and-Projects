/**
 * NewsController
 *
 * @description :: Server-side logic for managing news
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

var request = require('request')
var nodemailer = require("nodemailer");

module.exports = {
	addNews: function(req,res){
		var request = require('request');
		var cheerio = require('cheerio');
		var db=[],news,newsid=1;
		//var incomingurl = '', 測試用
		console.log(req.body.uri)
		var incomingurl = req.body.uri,
			title,content,pic,exist, media = "nothing";
		switch(req.body.uri.split('/')[2]) {
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
			console.log('NOT media OR unscrapable!')
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
					Company.findOne({
						name: media
					}).exec(function(err,company){
						News.findOne({
							title: title,
							media: media,
							content: content
						}).exec(function(err, news){
							if(err){
								console.log(err)
							}
							if(!news){
								exist = 0;
								News.create({
									title: title,
									media: media,
									parent_domain: company,
									content: content,
									imgurl: pic,
									url: incomingurl,
									hot: 1
								}).exec(function(err,news){
									Boo.create({
										owner: req.session.user,
										parent_news: news.id
									}).exec(function(err, boo){
										console.log("boo created!");
										res.send({
											news: news,
											booed: true
										});
									})

								})
							}
							else{
								console.log("USER:"+ req.session.user);
								Boo.findOne({
									owner: req.session.user,
									parent_news: news.id
								}).exec(function(err, findboo){
									if(findboo){
										console.log('already booed!');
										res.send({
											booed: true,
											news: news,
											news_title: news.title
										});
									}
									else{
										exist = 1;
										news.hot += 1;
										news.save(function(err){
											Boo.create({
												owner: req.session.user,
												parent_news: news.id
											}).exec(function(err, boo){
												res.send({
													booed: false,
													news: news,
													news_title: news.title
												});
											})
										});
									}
								})
							}
						});
					})
				}
			})
		}

	},

	getAllCommenter: function(req,res){
		var id = req.param('id')
		Comment.find({
			com_news: id
		}).populate('owner').exec(function(err,comments){
			res.send({
				comments: comments
			})
		})
	},

	getAllReasoner: function(req,res){
		var id = req.param('id')
		Reason.find({
			parent_news: id
		}).populate('owner').populate('voters').exec(function(err,reasons){
			console.log(reasons)
			res.send({
				reasons: reasons
			})
		})
	},

	showAll: function(req,res){
		res.view("news/showAll",{
			title: "All the news"
		})
	},

	showAll_angular: function(req,res){
		News.find()
		.populate('reports')
		.populate('reasons')
		.populate('comments')
		.exec(function(err,data){
			console.log(data)
			res.send({
				newses: data
			})
		})
	},

	reportThisNews: function(req,res){
		Report.create({
			content: req.param('content'),
			rep_news: req.param('id'),
			owner: req.session.user
		}).exec(function(e,report){
			Report.findOne({
				content: report.content,
				rep_news: report.rep_news,
				owner: report.owner
			}).populate('owner')
			.populate('rep_news').exec(function(e,report){
				Company.findOne({
					name: report.rep_news.media
				}).exec(function(err,company){
					var smtpTransport = nodemailer.createTransport("SMTP",{
					    service: "Gmail",
					    auth: {
					        user: "blueberrycollector@gmail.com",
					        pass: "ccsp2014"
					    }
					});
					console.log(report.owner.email+","+company.email)
					var mailOptions = {
				    	// from: "<News Reporter>", // sender address   +report.owner.email
					    to: "how2945ard@gmail.com",//report.owner.email+" , "+company.email // list of receivers
					    subject: "Hello ✔", // Subject line
					    text: report.content, // plaintext body
					    // html:  // html body
					}
					smtpTransport.sendMail(mailOptions, function(error, response){
					    if(error){
					        console.log(error);
					    }else{
					    	report.sent = true
					        console.log("Message sent: " + response.message);
					    }
					    console.log(report.owner.email+","+company.email)
					    // if you don't want to use this transport object anymore, uncomment following line
					    res.redirect('/news/show/'+req.param('id'));
					    console.log('/news/show/'+req.param('id'))
					    smtpTransport.close(); // shut down the connection pool, no more messages
					});
				})
			})
		})

		// request.post('https://www.win.org.tw/cap/pleadSend_010401.jsp',{
		// 	form:{
		// 		'src_type':'9',
		// 		'protect':'9',
		// 		'Classification':'6.4',
		// 		'PleadURL':'',
		// 		'Description':'',
		// 		'countdown':'300',
		// 		'Name':'HOwearfd',
		// 		'eMail':'how2945ard@gmail.com',
		// 		'Sex':'Male',
		// 		'submit.x':'85',
  		//		'submit.y':'7'
		// 	},
		// 	header:{
		// 		'Content-Type': 'application/x-www-form-urlencoded',
		// 		'Referer': 'http://www.win.org.tw/iwin/report.html'
		// 	}},
		// 	function(e,r,body){
		// 		res.redirect('/');
		// })
	},



	show: function(req,res){
		var id = req.param("id");
		News.findOne({
			id: id
		})
		.populate('reports')
		.populate('reasons')
		.populate('comments')
		.exec(function (err, news) {
			console.log(news)
			if (err) {
				req.flash("info", "info: you point to wrong number");
				return res.redirect("/");
			}
			else if(news){
				res.view("news/show", {
					id: news.id,
					content: news.content,
					imgurl: news.imgurl,
					url: news.url,
					hot: news.hot,
					reasons: news.reasons,
					comments: news.comments,
					comments_user: news.comments.owner,
					parent_domain: news.parent_domain,
					news: news,
					content: news.content,
					title: news.title
				});
			}
			else{
				return res.redirect("/");
			}
		});
	},

	findByUrl: function(req, res){
		var url = req.body.url;
		console.log('新聞URL: '+url);
		News.findOne({url: url})
		.populate('reports')
		.populate('reasons')
		.populate('comments')
		.exec(function (err, news){
			if (err) {
				req.flash("info", "info: you point to wrong number");
				return res.redirect("/");
			}
			if (news){
				console.log(news);
				res.send( {
					find: true,
					id: news.id,
					content: news.content,
					imgurl: news.imgurl,
					url: news.url,
					hot: news.hot,
					reasons: news.reasons,
					comments: news.comments,
					comments_user: news.comments.owner,
					parent_domain: news.parent_domain,
					news: news,
					content: news.content,
					title: news.title
				});
			}
			else{
				res.send({
					find: false
				})
			}
		});

	}
};


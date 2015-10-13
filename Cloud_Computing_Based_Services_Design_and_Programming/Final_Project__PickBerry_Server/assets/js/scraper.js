var request = require('request');
var cheerio = require('cheerio');
var fs = require('fs');

var db=[],news,newsid=1,mediadb;
//var incomingurl = '', 測試用
var incomingurl = req.body,
	title,content,pic;

function newsscraper(media){
	request(incomingurl, function (err, res, html) {
		if (!err && res.statusCode == 200) {
			var $ = cheerio.load(html);
			switch(media){					
				case "apple":
				title = $('h1#h1').text();
				content = $('div.articulum p').text();
				pic = $('figure.sgimg').children('a').children('img').attr('src');
				mediadb = './appleparser.json';
				break;
				
				case"et":
				title = $('h2.title').text();
				content = $('div.story p').nextUntil('div').text();
				pic = $('div.story img').attr('src');
				mediadb = './etparser.json';
				break;
				
				default:
				title = $('header').children('h1').text();
				content = $('article.clear-fix p').text();
				pic = $('div.pic img').attr('src');
				mediadb = './chinaparser.json';
			};

			fs.readFile(mediadb, function reader(err, data) {
			  	if (err) {
			  		console.log('still no news in'+mediadb);
			  		writer(media);
			  	}else{
			  		db = JSON.parse(data);
			  		console.log('readFile success');
					if (db.length>0){
						newsid = db.length+1;
						var counter = db.length;
						db.forEach(function(element){
							if (element.url === incomingurl){								
								console.log("news already in db");
								return;
								//res.end();
							}else{counter--;} //計算是否每一筆資料都不同，每跑一次-1
						})
						if (counter===0){
							writer(media);	//每一個都不同counter歸零 進writer()
						}
					}
				}
			});
		}
	})
}


function writer(media){
	news = {
				"newsid":newsid,
				"url":incomingurl,
				"title":title,
				"content":content,
				"picture":pic
			};
	db.push(news);
	fs.writeFile(mediadb, JSON.stringify(db, null, 4), function (err) {
		if (err) throw err;
	});
	console.log('news recorded')
}

//newsscraper("apple");  測試用
//newsscraper("china");  測試用
//newsscraper("et");  測試用

exports.appledaily = function (req, res) {newsscraper("apple")};
exports.chinatimes = function (req, res) {newsscraper("china")};
exports.ettoday = function (req, res) {newsscraper("et")};
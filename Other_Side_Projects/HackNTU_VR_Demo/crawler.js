var staringDate = 20150820;
var endingDate = 20150101;

var Promise = require("bluebird");
var moment = require('moment');

var request = Promise.promisifyAll(require("request"));

var cheerio = require('cheerio');

var Promise = require('bluebird');
var fs = require('fs');

var settings = require('./settings');

var promiseArray = [];

var LibertyTimesSort = ['politics', 'society', 'local', 'life', 'opinion', 'world', 'business', 'sports', 'entertainment', 'consumer', 'supplement'];

var mongodURL = settings.mongoUrl;

var mongojs = require("mongojs");

var db = mongojs(mongodURL, ['news']);
var news = db.collection('news');

function insertIntoDB(title, text, date, link, agency,images) {
  news.insert({
    title: title,
    context: text,
    release_date: date,
    link: link,
    agency: agency,
    images: images
  }, function(err, data) {
    return new Promise(function(resolve, reject) {
      if (err) {
        reject(err);
      }
      console.log(link);
      resolve(data);
    });
  });
}

function getContentApple(link, title) {
  var urlHEAD = 'http://';
  var baseUrl = 'http://www.appledaily.com.tw';
  if (link.substr(0, urlHEAD.length) !== urlHEAD) {
    link = baseUrl + link;
  }
  console.log(link);
  return request.getAsync(link)
    .then(function(data) {
      var $ = cheerio.load(data[0].body);
      var text = $('.articulum p').text();
      var date = $('time[datetime]')['0'];
      if (date) {
        date = date.attribs.datetime;
        date = date.substr(0, date.length - 1);
        date = moment(date, 'yyyy/mm/dd').toDate();
        return insertIntoDB(title, text, date, link, 'apple');
      }
    });
}

function gettingUrlApple(i, e) {
  if (i >= e) {
    var url = 'http://www.appledaily.com.tw/appledaily/archive/' + i;
    request.get(url, function(err, body, response) {
      console.log(url);
      if (!err) {
        var $ = cheerio.load(response);
        if ($(".nclns").length !== 0) {
          $(".nclns").each(function(index, element) {
            $(this).find('a').each(function(index, element) {
              promiseArray.push(getContentApple(element.attribs.href, element.attribs.title));
            });
          });
        }
      }
      gettingUrlApple(i - 1, e);
    });
  } else {
    return apple_callback();
  }
}


function getContentLibertyTimes(link, title) {
  var baseUrl = 'http://news.ltn.com.tw';
  link = baseUrl + link;
  console.log(link);
  return request.getAsync(link)
    .then(function(data) {
      var $ = cheerio.load(data[0].body);
      var text = $('#newstext').text();
      var date = $('#newstext').find('span').text();
      if (date) {
        date = moment(date, 'yyyy/mm/dd').toDate();
        return insertIntoDB(title, text, date, link, 'liberty_times');
      }
    });
}

function gettingUrlLibertyTimes(i, c, e) {
  console.log(i < e);
  if (i >= e) {
    var url = 'http://news.ltn.com.tw/newspaper/' + LibertyTimesSort[c] + '/' + i;
    request.get(url, function(err, body, response) {
      console.log(url);
      if (c <= 9) {
        if (!err) {
          var $ = cheerio.load(response);
          var urls = $(".picword");
          if (urls.length !== 0) {
            urls.each(function(index, element) {
              if (element.children) {
                promiseArray.push(getContentLibertyTimes(element.attribs.href, element.children[0].data));
              }
            });
          }
          gettingUrlLibertyTimes(i, c + 1, e);
        }
      } else {
        gettingUrlLibertyTimes(i - 1, 0, e);
      }
    });
  } else {
    return ltn_callback();
  }
}

var ltn_callback = function() {
  gettingUrlApple(staringDate, endingDate);
};

var apple_callback = function() {
  Promise.settle(promiseArray).then(function(data) {
    return process.exit(0);
  });
};

gettingUrlLibertyTimes(staringDate, 0, endingDate, ltn_callback);


Array.prototype.contains = function(needle) {
  for (var i in this) {
    if (this[i] == needle) return true;
  }
  return false;
};
var fs = require('fs');
var Promise = require('bluebird');
var _ = require('lodash');
Promise.promisifyAll(fs);
var stemmer = require('porter-stemmer').stemmer;
var token = /[\s,\.\']+/;
var stopwords = require('stopwords').english;
var final_txt = '';
var mongoose = require('mongoose');

Promise.promisifyAll(mongoose);

mongoURI = 'mongodb://localhost/irtm';

mongoose.connect(mongoURI);

var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

var TermSchema = new Schema({
  creative_id: {
    type: String
  }
});

TermSchema.plugin(timestamps, {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});

var term = mongoose.model('Term', TermSchema);

function iteration(count) {
  return fs.readFileAsync(count + '.txt', 'utf8')
    .then(function(data) {
      tokens = data.split(token);
      tokens = _.map(tokens, function(element) {
        element = stemmer(element.toLowerCase());
        var stopword = stopwords.contains(element);
        if (!stopword) {
          final_txt += element + '\n';
        }
      });
    });
}
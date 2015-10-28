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
 fs.readFileAsync('IR.txt', 'utf8')
   .then(function(data) {
     tokens = data.split(token);
     tokens = _.map(tokens, function(element) {
       element = stemmer(element.toLowerCase());
       var stopword = stopwords.contains(element);
       if (!stopword) {
         final_txt += element + '\n';
       }
     });
     fs.writeFileSync('final.txt', final_txt, 'utf-8');
   });
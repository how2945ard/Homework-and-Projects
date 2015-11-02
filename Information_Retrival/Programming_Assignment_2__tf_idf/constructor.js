Array.prototype.contains = function(needle) {
  for (var i in this) {
    if (this[i] == needle) return true;
  }
  return false;
};
var Promise = require('bluebird');

var promiseWhile = function(condition, action) {
  var resolver = Promise.defer();

  var loop = function() {
    if (!condition()) return resolver.resolve();
    return Promise.cast(action())
      .then(loop);
  };

  process.nextTick(loop);

  return resolver.promise;
};

var ProgressBar = require('progress');

var fs = require('fs');
var moment = require('moment');
var _ = require('lodash');
Promise.promisifyAll(fs);
var stemmer = require('porter-stemmer').stemmer;
var token = /[\s,\.\'\ \"]+/;
var stopwords = require('stopwords').english;
var final_txt = '';
var mongoose = require('mongoose');

Promise.promisifyAll(mongoose);

mongoURI = 'mongodb://localhost/irtm';

mongoose.connect(mongoURI);

var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

var TermSchema = new Schema({
  tid: {
    type: Number
  },
  term: {
    type: String
  },
  idf: {
    type: Number
  },
  frequency: {
    type: Number
  },
  posting: {
    type: [
      String
    ]
  }
});

TermSchema.index({
  term: 1
});


TermSchema.plugin(timestamps, {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
var Term = mongoose.model('Term', TermSchema);

var DocSchema = new Schema({
  id: {
    type: Number
  },
  doc_tf_idf: [{
    type: Schema.Types.Mixed
  }],
});

DocSchema.plugin(timestamps, {
  createdAt: 'created_at',
  updatedAt: 'updated_at'
});
var Doc = mongoose.model('Doc', DocSchema);

var taskArray = [];
var dictionary = [];
var tf_array = [];
var tid = 0;

var index = 0;
var TOTAL_DOC_COUNT = 1095;
var condition = 0;

var bar = new ProgressBar('Stage :current, Done: :percent, ETA: :eta seconds, Time elapsed :elapsed seconds, :bar', {
  total: 3,
  width: 40
});

var dcoument_bar = new ProgressBar('Processing document #:current, Done: :percent, ETA: :eta seconds, Time elapsed :elapsed seconds, :bar', {
  total: TOTAL_DOC_COUNT,
  width: 40
});

var inMemoryTermCollection = [];
var tid = 0;
var base_idf = Math.log(TOTAL_DOC_COUNT / 1);

function iteration(count) {
  return fs
    .readFileAsync('./IRTM/' + count + '.txt', 'utf8')
    .then(function(data) {
      tf_array[count] = [];
      tokens = data.split(token);
      _.each(tokens, function(element) {
        element = stemmer(element.toLowerCase());
        var stopword = stopwords.contains(element);
        if (!stopword && element !== '' && element !== ' ' && element && element !== '"') {
          var id = _.findIndex(tf_array[count], {
            term: element
          });
          var inc = 1;
          if (id === -1) {
            tf_array[count].push({
              term: element,
              frequency: 1
            });
          } else {
            inc = 0;
            var tf = tf_array[count][id];
            tf.frequency += 1;
            tf_array[count][id] = tf;
          }

          var termId = _.findIndex(inMemoryTermCollection, {
            term: element
          });
          if (termId === -1) {
            inMemoryTermCollection.push({
              term: element,
              frequency: 1,
              idf: base_idf,
              posting: [count]
            });
          } else {
            var term = inMemoryTermCollection[termId];
            term.frequency += 1;
            term.idf = Math.log(TOTAL_DOC_COUNT / term.frequency);
            if (_.findIndex(term.posting, count) === -1) {
              term.posting.push(count);
            }
            inMemoryTermCollection[termId] = term;
          }
        }
      });
      dcoument_bar.tick();
      return new Promise(function(resolve, reject) {
        return resolve(inMemoryTermCollection);
      });
    });
}

var start = moment();
console.log("Start at: " + start.toISOString());
return Term
  .removeAsync()
  .then(function(data) {
    bar.tick();
    return promiseWhile(function() {
      return index < TOTAL_DOC_COUNT;
    }, function() {
      index += 1;
      return iteration(index);
    });
  })
  .then(function() {
    inMemoryTermCollection = _.sortBy(inMemoryTermCollection, function(term) {
      return term.term;
    });
    bar.tick();
    var dictionary_text = '';
    _.each(inMemoryTermCollection, function(term) {
      tid += 1;
      term.tid = tid;
      dictionary_text += term.tid + ' ';
      dictionary_text += term.term + ' ';
      dictionary_text += term.frequency + '\n';
    });
    var fileTaskArray = [fs.writeFileAsync('dictionary.txt', dictionary_text, 'utf-8')];
    var index_doc = 1;
    var tf_dictonary = [];
    while (index_doc <= TOTAL_DOC_COUNT) {
      var data_array = [];
      var array = tf_array[index_doc];
      array = _.sortBy(array, function(term) {
        return term.term;
      });
      tf_dictonary[index_doc] = array.length + '\n';
      _.each(array, function(term) {
        var id = _.findIndex(tf_array[index_doc], {
          term: term.term
        });
        if (id !== -1) {
          var doc = _.findWhere(inMemoryTermCollection, {
            term: term.term
          });
          var tf_idf = term.frequency * doc.idf;
          data_array.push({
            tid: doc.tid,
            tf_idf: tf_idf
          });
          tf_dictonary[index_doc] += doc.tid + ' ';
          tf_dictonary[index_doc] += tf_idf + '\n';
        }
      });
      fileTaskArray.push(
        Doc
        .findOneAndUpdateAsync({
          id: index_doc
        }, {
          doc_tf_idf: data_array
        }, {
          upsert: true
        })
      );
      fileTaskArray.push(fs.writeFileAsync('./results/' + index_doc + '.txt', tf_dictonary[index_doc], 'utf-8'));
      index_doc += 1;
    }
    return Promise
      .all(fileTaskArray);
  })
  .then(function(data) {
    bar.tick();
    var end = moment();
    console.log("End at: " + end.toISOString());
    console.log("Takes: " + start.fromNow(true));
    process.exit(0);
  });
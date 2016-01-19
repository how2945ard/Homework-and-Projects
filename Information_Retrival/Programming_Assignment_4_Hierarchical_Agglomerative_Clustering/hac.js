var Promise = require('bluebird');
var HAC = require("hac");
var hac = new HAC();
var fs = require('fs-extra');
Promise.promisifyAll(fs);

var argv = require('optimist').argv;

var _ = require('lodash');
var index = 0;
var docArray = [];

var TOTAL_DOC_COUNT = argv.docs;

var numerOfClusters = argv.cluster;

return promiseWhile(function() {
    return index < TOTAL_DOC_COUNT;
  }, function() {
    index += 1;
    return iteration(index);
  })
  .then(function(data) {
    _.each(docArray, function(element) {
      var doc = element.content;
      var id = element.id;
      hac.addDocument(doc, id);
    });
    hac.cluster(HAC.CompleteLink);
    var clusters = hac.getClusters(numerOfClusters, ["id"]);
    _.forEach(clusters, function(cluster) {
      _.forEach(_.sortBy(cluster.docs, ['id']), function(doc) {
        console.log(doc.id);
      });
      console.log();
    });

  });


function iteration(count) {
  return fs
    .readFileAsync('./IRTM/' + count + '.txt', 'utf8')
    .then(function(data) {
      docArray.push({
        content: data,
        id: count
      });
      return;
    });
}

function promiseWhile(condition, action) {
  var resolver = Promise.defer();

  var loop = function() {
    if (!condition()) return resolver.resolve();
    return Promise.cast(action())
      .then(loop);
  };

  process.nextTick(loop);

  return resolver.promise;
}
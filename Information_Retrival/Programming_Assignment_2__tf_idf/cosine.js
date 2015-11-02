var Promise = require('bluebird');
var fs = require('fs');
var _ = require('lodash');
Promise.promisifyAll(fs);
var argv = require('optimist').argv;
var math = require('mathjs');
var x = argv.x;
var y = argv.y;

if (x === y) {
  console.log('cosine similarity of doc #' + x + ' and doc #' + y + ': ' + 1);
  process.exit(0);
}

var mongoose = require('mongoose');

Promise.promisifyAll(mongoose);

mongoURI = 'mongodb://localhost/irtm';

mongoose.connect(mongoURI);

var Schema = mongoose.Schema;
var timestamps = require('mongoose-timestamp');

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

return Doc
  .aggregateAsync([{
    $match: {
      id: {
        $in: [x, y]
      }
    }
  }, {
    $unwind: "$doc_tf_idf"
  }, {
    $project: {
      tid: "$doc_tf_idf.tid",
      tf_idf: "$doc_tf_idf.tf_idf",
    }
  }, {
    $sort: {
      tid: 1
    }
  }, {
    $group: {
      _id: {
        tid: "$tid"
      },
      tf_idf: {
        $push: "$tf_idf"
      }
    }
  }])
  .then(function(data) {
    var xArray = [];
    var yArray = [];
    var xUnit = 0;
    var yUnit = 0;
    _.each(data, function(element) {
      var xValue = element.tf_idf[0];
      var yValue = element.tf_idf[1];
      if (!yValue) {
        yValue = 0;
      }
      xArray.push(xValue);
      xUnit += math.pow(xValue, 2);
      yArray.push(yValue);
      yUnit += math.pow(yValue, 2);
    });
    var product = math.dot(xArray, yArray);
    var length = math.sqrt(xUnit) * math.sqrt(yUnit);
    console.log('cosine similarity of doc #' + x + ' and doc #' + y + ': ' + product / length);
    process.exit(0);
  });
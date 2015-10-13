var cheerio = require('cheerio');
var request = require('request');
var iconv = require('iconv-lite');
var _ = require('underscore');
var Promise = require('bluebird');
var async = require('async');
Promise.promisifyAll(request);

function pad(num, size) {
	var s = num + "";
	while (s.length < size) s = "0" + s;
	return s;
}
var getID = function(school, N) {
	var grades = [];
	grades = _.map(["00", "01", "02", "03"], function(grade) {
		return "B" + grade + school;
	});
	var array = Array.apply(null, {
		length: N
	}).map(Number.call, Number);
	var result = [];
	grades.forEach(function(grade, index) {
		var temp = _.map(array, function(item) {
			return grade + pad(item, 3);
		});
		result[index] = [];
		result[index] = temp;
	});
	return result;
};
var fs = require('fs');
var util = require('util');
var log_file = fs.createWriteStream('data.log', {
	flags: 'a'
});
var log_stdout = process.stdout;

console.log = function(d) { //
	log_file.write(util.format(d) + '\n');
	log_stdout.write(util.format(d) + '\n');
};


var getSchool = function(school, number) {
	return new Promise(function(resolve, reject) {
		var student_lists = _.flatten(getID(school + "", number));
		var collector = [];
		async.eachSeries(student_lists, function(id, callback) {
				request.getAsync({
						uri: "https://investea.aca.ntu.edu.tw/gept/eng_password.asp?regno=" + id,
						encoding: null
					})
					.then(function(response) {
						var body = response[0].body;
						body = iconv.decode(new Buffer(body), "Big5");
						$ = cheerio.load(body);
						if ($('input[name="tID"]').attr('value') !== undefined) {
							var json = {
								id: $('input[name="tID"]').attr('value'),
								phone: $('input[name="tphone"]').attr('value'),
								address: $('input[name="taddrm"]').attr('value'),
								area: $('input[name="taream"]').attr('value'),
								email: $('input[name="temail"]').attr('value')
							};
							collector.push(json);
							console.log(json);
						}
						callback();
					});
			},
			function(err) {
				if (err) {
					console.log(err);
				} else {
					resolve();
					console.log('Processed successfully');
				}
			});
	});
};


var allshcools = ["101", "102", "103", "104", "105", "106", "107", "108", "109", "121", "122", "123", "124", "125", "126", "127", "129", "141", "142", "144", "145", "146", "147", "200", "201", "202", "203", "204", "207", "208", "209", "221", "222", "223", "224", "225", "226", "227", "228", "229", "241", "242", "243", "244", "245", "246", "300", "301", "302", "303", "305", "310", "322", "323", "325", "330", "341", "342", "343", "400", "401", "402", "403", "404", "406", "408", "409", "420", "421", "422", "423", "424", "426", "428", "429", "441", "442", "443", "444", "445", "446", "447", "448", "449", "450", "451", "452", "453", "454", "455", "456", "457", "458", "500", "501", "502", "504", "505", "507", "521", "522", "524", "525", "527", "541", "543", "544", "546", "548", "549", "600", "601", "602", "603", "604", "605", "606", "607", "608", "609", "610", "611", "612", "613", "621", "622", "623", "625", "626", "627", "628", "629", "630", "631", "632", "633", "641", "642", "643", "644", "645", "700", "701", "702", "703", "704", "705", "706", "722", "723", "724", "725", "740", "741", "742", "743", "744", "745", "746", "747", "748", "749", "750", "800", "801", "841", "842", "843", "844", "845", "846", "847", "848", "849", "900", "901", "902", "921", "922", "941", "942", "943", "944", "945", "A00", "A01", "A21", "A41", "B00", "B01", "B02", "B21", "B22", "B41", "B42", "B43", "B44", "B45", "B46", "B47", "B48", "H00", "H01", "H02", "H41", "J00", "J10", "J11"];

async.eachSeries(allshcools, function(item, callback) {
	getSchool(item, 200)
		.then(function(data) {
			callback();
		});
}, function(err) {
	if (err) {
		console.log(err);
	} else {
		console.log('Processed successfully');
	}
});
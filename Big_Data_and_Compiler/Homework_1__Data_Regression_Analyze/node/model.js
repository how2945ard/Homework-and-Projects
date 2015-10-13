/* raw data */
var ad = require('./dataMod.js').ad;
var sale = require('./dataMod.js').sale;
var medias = require('./dataMod2.js').medias;
var mediaType = require('./mediaType.js');

var month = ['01','02','03','04','05','06','07','08','09','10','11','12'];
var mediaTypeI = ['type1', 'type2', 'type3', 'type4', 'type5', 'type6', 'type7'];
var result = [];

for(var i in month){ 
    result.push({
    	month: month[i],
    	adsByMedia: [],
    	salesAmount: 0
    });

    for(var j in mediaTypeI){
    	result[i].adsByMedia.push({
    		media: mediaTypeI[j],
    		amount: 0
    	});
    }
}

/**/
for(var i in ad){ 
    for(var j in mediaTypeI){
        if(mediaType[mediaTypeI[j]].indexOf(ad[i].media) != -1){
            result[month.indexOf(ad[i].time.split('-')[1])].adsByMedia[j].amount += ad[i].amount;
        }
    }
}
for(var i in sale){ 
	result[month.indexOf(sale[i].time.split('-')[1])].salesAmount += sale[i].amount
}

// console.log(ad[0].time.split('-')[1]);
// console.log(JSON.stringify(result));

/* output for excel */
process.stdout.write('month\t');
for(var i in mediaTypeI){
	process.stdout.write('mt' + (medias[i]+1) + '\t');
}
process.stdout.write('sales\n');
for(var i in result){
	process.stdout.write(result[i].month + '\t');

	for(var j in mediaTypeI){
		process.stdout.write(result[i].adsByMedia[j].amount + '\t');
	}

	process.stdout.write(result[i].salesAmount + '\n');
}


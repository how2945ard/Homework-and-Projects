/* raw data */
var ad = require('./dataMod.js').ad;
var sale = require('./dataMod.js').sale;

/* constant */
var maxd = 0;
var mind = 999;

for(var i in ad){ 
    if(ad[i].time_parsed > maxd){
        maxd = ad[i].time_parsed;
    }
    if(ad[i].time_parsed < mind){
        mind = ad[i].time_parsed;
    }
}
for(var i in sale){ 
    if(sale[i].time_parsed > maxd){
        maxd = sale[i].time_parsed;
    }
    if(sale[i].time_parsed < mind){
        mind = sale[i].time_parsed;
    }
}

console.log(maxd + ' '+ mind);


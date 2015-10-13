/**********************************************************************
This program is used to count the number of occurence of three kinds
of event for each area
And 
**********************************************************************/

/* raw data */
var ad = require('./dataMod.js').ad;
var sale = require('./dataMod.js').sale;
var visit = require('./dataMod.js').visit;

/* constant */
var areaMAX = 101; // the largest area code 

/* main */
var areaSum = []; // summary of event for each area
var areaType = {
    onlyAd: [],
    target: [],
    none:[]
}; // catagorize areas

for(var i = 0; i <= areaMAX; i++){
    areaSum.push({
        areaID: i,
        ad: 0,
        visit: 0,
        sale: 0
    });
}

for(var i in ad){ 
    areaSum[ad[i].area].ad++;
}
for(var i in visit){ 
    areaSum[visit[i].area].visit++;
}
for(var i in sale){ 
    areaSum[sale[i].area].sale++;
}

console.log(areaSum);

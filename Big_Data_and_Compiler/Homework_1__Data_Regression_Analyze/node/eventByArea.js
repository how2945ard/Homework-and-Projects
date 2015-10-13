/**********************************************************************
This program is used to count the related event for each sale
**********************************************************************/

/* raw data */
var ad = require('./dataMod.js').ad;
var sale = require('./dataMod.js').sale;
var visit = require('./dataMod.js').visit;

/* constant */
var daysWithin = 7;
var targetArea = [5, 8, 10, 21, 28, 29, 31, 33, 38, 45, 46, 47, 56, 57, 62, 63, 64, 65, 66, 71, 72, 73, 80, 82, 89, 91, 92, 93, 94, 96, 97, 98, 100];

/* main */
var eventByArea = [];

for (var i in targetArea) {
    eventByArea.push({
        areaID: targetArea[i],
        ad: [],
        sale: []
    });
}

ad = ad.sort(function(a, b) {
    return a.time_parsed - b.time_parsed
});
for (var i in ad) {
    if (targetArea.indexOf(ad[i].area) != -1) {
        eventByArea[targetArea.indexOf(ad[i].area)].ad.push({
            // time: ad[i].time,
            time_parsed: ad[i].time_parsed,
            amount: ad[i].amount
        });
    }
}

sale = sale.sort(function(a, b) {
    return a.time_parsed - b.time_parsed
});
for (var i in sale) {
    if (targetArea.indexOf(sale[i].area) != -1) {
        eventByArea[targetArea.indexOf(sale[i].area)].sale.push({
            // time: sale[i].time,
            time_parsed: sale[i].time_parsed,
            amount: sale[i].amount
        });
    }
}

// console.log(JSON.stringify(eventByArea));

/* merge sales on the same day */
for (var i in eventByArea) {
    var newSale = [];
    var cur = -1;
    for (var j in eventByArea[i].sale) {
        if (cur == -1) {
            newSale.push({
                time_parsed: eventByArea[i].sale[j].time_parsed,
                amount: eventByArea[i].sale[j].amount,
                influencedAd: 0
            });
            cur++;
        } else {
            if (eventByArea[i].sale[j].time_parsed == newSale[cur].time_parsed) {
                newSale[cur].amount += eventByArea[i].sale[j].amount;
            } else {
                newSale.push({
                    time_parsed: eventByArea[i].sale[j].time_parsed,
                    amount: eventByArea[i].sale[j].amount,
                    influencedAd: 0
                });
                cur++;
            }
        }
    }
    eventByArea[i].sale = newSale;
}

// console.log(JSON.stringify(eventByArea));

/* count influenced advertisement */
for (var i in eventByArea) {
    var pptr = 0;
    var cptr;
    for (var j in eventByArea[i].sale) {

        while (pptr < eventByArea[i].ad.length && eventByArea[i].ad[pptr].time_parsed + 7 <= eventByArea[i].sale[j].time_parsed) {
            pptr++;
        }
        cptr = pptr;
        while (cptr < eventByArea[i].ad.length && eventByArea[i].ad[cptr].time_parsed < eventByArea[i].sale[j].time_parsed) {
            eventByArea[i].sale[j].influencedAd += eventByArea[i].ad[cptr].amount;
            cptr++;
        }
    }
}

console.log(JSON.stringify(eventByArea[1]));
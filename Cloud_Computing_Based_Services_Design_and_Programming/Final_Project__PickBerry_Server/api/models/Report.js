/**
* Reports.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/


module.exports = {
  // schema : true,
  attributes: {
  	content:'string', //檢舉信件內容

  	rep_news:{    //檢舉的新聞
  		model: 'news'
  	},

  	sent:'bool',	//是否寄出

  	owner:{			//檢舉人
  		model: 'user'
  	}

  }
};



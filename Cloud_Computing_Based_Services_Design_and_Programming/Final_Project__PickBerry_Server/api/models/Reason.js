/**
* Reason.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  // schema : true,
  attributes: {
  	content:'string',
  	vote: {
        type:'integer',
        defaultsTo: 0

    },

  	owner:{
  		model:'user'
  	},

  	parent_news:{             //原始的新聞
  		model:'news'
  	},


  	voters:{                  //投票者
  		collection: 'user',
  		via: 'reasons_user',
  		// through: 'reason_voter'
      dominant: true
  	}

  }
};


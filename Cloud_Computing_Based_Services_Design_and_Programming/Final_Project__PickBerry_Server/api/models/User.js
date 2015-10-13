/**
* User.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  // schema : true,
  attributes: {
    fbid: 'string',
    name: 'string',
  	email: 'string',
  	sex: 'string',

    boos:{
      collection: 'boo',
      via: 'owner'
    },

  	reports:{
  		collection: 'report',
  		via: 'owner'
  	},

  	comments:{
  		collection: 'comment',
  		via: 'owner'
  	},

  	reasons_maker:{
  		collection: 'reason',
  		via:'owner'
  	},

  	reasons_user:{
  		collection: 'reason',
  		via:'voters',
  		// through:'reason_voter'
  	}

  }
};


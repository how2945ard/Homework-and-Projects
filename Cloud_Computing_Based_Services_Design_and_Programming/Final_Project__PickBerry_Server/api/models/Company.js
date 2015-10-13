/**
* Company.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
  // schema : true,
  attributes: {
  	domain: 'string',
  	name: 'string',
  	money: 'string', //金主
  	relation: 'string',  //關聯
    email: 'string',
    phone: 'string',
  	news_pool: {		//一個企業有很多新聞
  		collection:'news',
  		via:'parent_domain'
  	}
  }
};


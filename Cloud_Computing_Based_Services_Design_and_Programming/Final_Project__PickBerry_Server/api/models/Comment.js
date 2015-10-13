/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {
	// schema : true,
	attributes: {
		content: 'string',
		com_news:{
			model:'news'
		},  //評論的新聞

		owner:{
			model: 'user'
		}
	}
};


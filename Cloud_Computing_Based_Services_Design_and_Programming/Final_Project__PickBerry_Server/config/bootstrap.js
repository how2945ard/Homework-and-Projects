/**
 * Bootstrap
 *
 * An asynchronous boostrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.bootstrap = function (cb) {

  // It's very important to trigger this callack method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  Company.findOrCreate({
  	domain: 'www.appledaily.com.tw',
  	name: 'apple',
  	email:'web@appledaily.com.tw'
  },{
  	domain: 'www.appledaily.com.tw',
  	name: 'apple',
  	email:'web@appledaily.com.tw',
  	phone: '0809-012-555'
  }).exec(function(err,company){
	  Company.findOrCreate({
	  	domain: 'www.chinatimes.com',
	  	name: 'china',
	  	email: 'editorplan@mail.chinatimes.com.tw'
	  },{
	  	domain: 'www.chinatimes.com',
	  	name: 'china',
	  	email: 'editorplan@mail.chinatimes.com.tw',
	  	phone: '02-23087111'

	  }).exec(function(err,company){
		  Company.findOrCreate({
		  	domain: "ncc",
		  	name: 'ncc',
		  	email: 'ncc48@ncc.gov.tw'
		  },{
		  	domain: "ncc",
		  	name: 'ncc',
		  	email: 'ncc48@ncc.gov.tw',
		  	phone: '0800-201-205'
		  }).exec(function(err,company){
			  Company.findOrCreate({
			  	domain: 'www.ettoday.net',
			  	name: 'et',
			  	email: 'service@ettoday.net'
			  },{
			  	domain: 'www.ettoday.net',
			  	name: 'et',
			  	email: 'service@ettoday.net',
			  	phone: '+886-2-5555-6366'
			  }).exec(function(err,company){
			  cb();
				})
			})
		})
	})
};
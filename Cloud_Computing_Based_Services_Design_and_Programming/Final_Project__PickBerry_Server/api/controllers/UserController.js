/**
 * UserController
 *
 * @description :: Server-side logic for managing users
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	booNews: function(req,res){
		var id = req.param('id')
		User.findOne({
			id: id
		}).populate('boos')
		.exec(function(err,user){
			var urls=[]
			user.boos.forEach(function(val,index){
				urls.push("/news/show/"+val.parent_news)
			})
			res.send(urls)
		})
	},

	getCurrentUser: function(req,res){
		res.json(req.session.user)
	},

	show: function(req,res){
		var id = req.param("id");
		User.findOne({
			id: id
		}).exec(function (err, user) {
			if (err) {
				req.flash("info", "info: you point to wrong number");
				return res.redirect("/");
			}
			console.log(user)
			res.view("user/show", {
				id: user.id,
				name: user.name,
				education: user.education,
				job: user.job,
				email: user.email,
				sex: user.sex,
				reports: user.reports
			});
		});
	},

	getAllComments: function(req,res){
		var id = req.param('id')
		User.findOne({
			id:id
		}).exec(function (err, user){
			if (err) {
				req.flash("info", "info: you point to wrong number");
				return res.redirect("/");
			}
			console.log(user)
			res.view("user/comments", {
				id: user.id,
				name: user.name,
			});
		})
	},
	getAllReports: function(req,res){
		var id = req.param('id')
		User.findOne({
			id:id
		}).exec(function (err, user){
			if (err) {
				req.flash("info", "info: you point to wrong number");
				return res.redirect("/");
			}
			console.log(user)
			res.view("user/reports", {
				id: user.id,
				name: user.name,
			});
		})
	},
	getAllReasons: function(req,res){
		var id = req.param('id')
		User.findOne({
			id:id
		}).exec(function (err, user){
			if (err) {
				req.flash("info", "info: you point to wrong number");
				return res.redirect("/");
			}
			console.log(user)
			res.view("user/reasons", {
				id: user.id,
				name: user.name,
			});
		})
	}

};


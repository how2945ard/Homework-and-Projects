/**
 * ReportController
 *
 * @description :: Server-side logic for managing reports
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

module.exports = {
	getReportForm: function(req,res){
		var id = req.param("id");
		console.log(id)
		News.findOne({
			id: id
		}).exec(function (err, news) {
			if (err) {
				req.flash("info", "info: you point to wrong number");
				return res.redirect("/");
			}
			res.view("reports/show", {
				id: news.id,
				content: news.content,
				imgurl: news.imgurl,
				url: news.url,
				reasons: news.reasons,
				comments: news.comments,
				parent_domain: news.parent_domain,
				news: news,
				content: news.content,
				title: "Report "+news.title
			});
		});
	}
};


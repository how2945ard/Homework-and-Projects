/**
 * PostController
 *
 * @module      :: Controller
 * @description	:: A set of functions called `actions`.
 *
 *                 Actions contain code telling Sails how to respond to a certain type of request.
 *                 (i.e. do stuff, then send some JSON, show an HTML page, or redirect to another URL)
 *
 *                 You can configure the blueprint URLs which trigger these actions (`config/controllers.js`)
 *                 and/or override them with custom routes (`config/routes.js`)
 *
 *                 NOTE: The code you write here supports both HTTP and Socket.io automatically.
 *
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {


  /**
   * Action blueprints:
   *    `/post/form`
   */

  create: function (req, res) {

    var title = req.body.title;
    var content = req.body.content;

    // Send a JSON response
    Post.create({
      title: title,
      content: content
    }).done(function (err, post) {
      if (err) {
        return res.erro();
      }

      req.flash('info', 'info: Create post success !!!');
      res.redirect("/");
    });
  },


  /**
   * Action blueprints:
   *    `/post/destroy`
   */
   destroy: function (req, res) {

    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },

   updatePage: function (req, res) {
     var id = req.param("id");

     Post.findOne({
       id: id
     }).done(function (err, post) {
       if (err) {
         req.flash("info", "info: you point to wrong number");
         return res.redirect("/");
       }
       console.log(post)
       return res.view("home/update", {
         post: post
       });
     });
   },

  /**
   * Action blueprints:
   *    `/post/update`
   */
   update: function (req, res) {
    var id = req.param("id");
    var title = req.body.title;
    var content = req.body.content

    if (title && content && title.length > 0 && content.length > 0) {
      // update post
      Post.update({
        id: id
      }, {
        title: title,
        content: content
      })
      .done(function (err, post) {
        if (err) {
          req.flash("info", "info: you point to wrong number");
          return res.redirect("/");
        }
        return res.redirect("/post/get/" + post.id);
      })
      return;
    }
    return res.redirect("/");

    // // Send a JSON response
    // return res.json({
    //   hello: 'world'
    // });
  },


  /**
   * Action blueprints:
   *    `/post/list`
   */
   list: function (req, res) {

    // Send a JSON response

    Post
    .find({})
    .sort('updatedAt DESC')
    .done(function (err, posts) {
      return res.view("home/index", {
        title: "home page - title",
        posts: posts
      });
    });
  },


  /**
   * Action blueprints:
   *    `/post/get`
   */
   get: function (req, res) {
     var id = req.param("id");
     if (isNaN(id)) {
       req.flash("info", "info: you point to wrong number");
       return res.redirect("/");
     }

     Post.findOne({
       id: id
     })
     .sort('updatedAt desc')
     .done(function (err, post) {
       res.view("home/page", {
         title: post.title + " - blog post",
         post: post
       });
     });
    // Send a JSON response

  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PostController)
   */
  _config: {}


};

/**
 * Routes
 *
 * Sails uses a number of different strategies to route requests.
 * Here they are top-to-bottom, in order of precedence.
 *
 * For more information on routes, check out:
 * http://sailsjs.org/#documentation
 */



/**
 * (1) Core middleware
 *
 * Middleware included with `app.use` is run first, before the router
 */


/**
 * (2) Static routes
 *
 * This object routes static URLs to handler functions--
 * In most cases, these functions are actions inside of your controllers.
 * For convenience, you can also connect routes directly to views or external URLs.
 *
 */

module.exports.routes = {

  // By default, your root route (aka home page) points to a view
  // located at `views/home/index.ejs`
  //
  // (This would also work if you had a file at: `/views/home.ejs`)
  '/': {
    controller: "home",
    action: "index"
  },
  'post /mailer/send':{
    controller: "mailer",
    action: 'send_mail'
  },
  'get /mailer/form':{
    controller: "mailer",
    action: 'mail_form'
  },
  'post /news/addNews':{
    controller: 'news',
    action: 'addNews'
  },
  '/fblogin': {
    controller: "home",
    action: "fblogin"
  },
  'POST /logout':{
    controller: 'home',
    action: 'fblogout'
  },
  'get /logout':{
    controller: 'home',
    action: 'fblogout'
  },
  '/news/show/:id':{
    controller: "news",
    action: 'show'
  },
  '/user/show/:id':{
    controller: "user",
    action: 'show'
  },

  '/comments/show/user/:id':{
    controller: "user",
    action: 'getAllComments'
  },



  /////////VOTE的東東////////////



  '/reasons/show/user/:id':{
    controller: "user",
    action: 'getAllReasons'
  },

  '/reasons/vote/:rid/:uid':{
    controller: "reason",
    action: "vote"
  },
  '/voter/:id':{
    controller:"reason",
    action:"getVoter"
  },
//538eefa3fca6bdab071b1250






//////檢舉的東東///////

  '/reports/show/user/:id':{
    controller: "user",
    action: 'getAllReports'
  },
  '/getCurrentUser':{
    controller: "user",
    action: 'getCurrentUser'
  },
  'post /news/report/:id':{
    controller: "news",
    action: 'reportThisNews'
  },
  '/user/boo/:id':{
    controller: "user",
    action: 'booNews'
  },
  '/news/showAll':{
    controller: "news",
    action: 'showAll'
  },
  '/news/showAll_angular':{
    controller: 'news',
    action: 'showAll_angular'
  },
  '/news/reportForm/:id':{
    controller: "report",
    action: 'getReportForm'
  },
  '/news/getAllCommenter/:id':{
    controller: 'news',
    action: 'getAllCommenter'
  },
  '/news/getAllReasoner/:id':{
    controller: 'news',
    action: 'getAllReasoner'
  },
  ////這邊是 GOOGLE EXTENSION的PART

  'post /google/uri':{
    controller: 'google',
    action: 'getUri'
  },

  '/google/checkLogin':{
    controller: 'google',
    action: 'getSession'
  },
  '/google/checkLoginBack':{
    controller: 'google',
    action:'getSessionBack'
  },

  '/google/login':{
    controller: 'google',
    action: 'fblogin'
  },

  'post /google/newsdata':{
    controller: 'news',
    action: 'findByUrl'
  },

  'post /google/boo':{
    controller:'boo',
    action:'verifyBoo'
  },

  //boo

  'post /boo/getNewsId':{
    controller:'boo',
    action: 'getNewsId'
  },



  // '/comments/api/user/:id':{
  //   controller: "comment",
  //   action: 'commentOfUser'
  // },
  "GET /:controller/:action/:id?": {}

  // "GET /news/api_get" :{
  //   controller: "news",
  //   action: "api_get"
  // },
  // "GET /news/send_mail":{
  //   controller: "news",
  //   action: "send_mail"
  // }


  /*
  // But what if you want your home page to display
  // a signup form located at `views/user/signup.ejs`?
  '/': {
    view: 'user/signup'
  }


  // Let's say you're building an email client, like Gmail
  // You might want your home route to serve an interface using custom logic.
  // In this scenario, you have a custom controller `MessageController`
  // with an `inbox` action.
  '/': 'MessageController.inbox'


  // Alternatively, you can use the more verbose syntax:
  '/': {
    controller: 'MessageController',
    action: 'inbox'
  }


  // If you decided to call your action `index` instead of `inbox`,
  // since the `index` action is the default, you can shortcut even further to:
  '/': 'MessageController'


  // Up until now, we haven't specified a specific HTTP method/verb
  // The routes above will apply to ALL verbs!
  // If you want to set up a route only for one in particular
  // (GET, POST, PUT, DELETE, etc.), just specify the verb before the path.
  // For example, if you have a `UserController` with a `signup` action,
  // and somewhere else, you're serving a signup form looks like:
  //
  //    <form action="/signup">
  //      <input name="username" type="text"/>
  //      <input name="password" type="password"/>
  //      <input type="submit"/>
  //    </form>

  // You would want to define the following route to handle your form:
  'post /signup': 'UserController.signup'


  // What about the ever-popular "vanity URLs" aka URL slugs?
  // (you might remember doing this with `mod_rewrite` in Apache)
  //
  // This is where you want to set up root-relative dynamic routes like:
  // http://yourwebsite.com/twinkletoez
  //
  // NOTE:
  // You'll still want to allow requests through to the static assets,
  // so we need to set up this route to ignore URLs that have a trailing ".":
  // (e.g. your javascript, CSS, and image files)
  'get /*(^.*)': 'UserController.profile'

  */
};



/**
 * (3) Action blueprints
 * These routes can be disabled by setting (in `config/controllers.js`):
 * `module.exports.controllers.blueprints.actions = false`
 *
 * All of your controllers ' actions are automatically bound to a route.  For example:
 *   + If you have a controller, `FooController`:
 *     + its action `bar` is accessible at `/foo/bar`
 *     + its action `index` is accessible at `/foo/index`, and also `/foo`
 */


/**
 * (4) Shortcut CRUD blueprints
 *
 * These routes can be disabled by setting (in config/controllers.js)
 *      `module.exports.controllers.blueprints.shortcuts = false`
 *
 * If you have a model, `Foo`, and a controller, `FooController`,
 * you can access CRUD operations for that model at:
 *    /foo/find/:id?  ->  search lampshades using specified criteria or with id=:id
 *
 *    /foo/create   ->  create a lampshade using specified values
 *
 *    /foo/update/:id ->  update the lampshade with id=:id
 *
 *    /foo/destroy/:id  ->  delete lampshade with id=:id
 *
 */

/**
 * (5) REST blueprints
 *
 * These routes can be disabled by setting (in config/controllers.js)
 *    `module.exports.controllers.blueprints.rest = false`
 *
 * If you have a model, `Foo`, and a controller, `FooController`,
 * you can access CRUD operations for that model at:
 *
 *    get /foo/:id? ->  search lampshades using specified criteria or with id=:id
 *
 *    post /foo   -> create a lampshade using specified values
 *
 *    put /foo/:id  ->  update the lampshade with id=:id
 *
 *    delete /foo/:id ->  delete lampshade with id=:id
 *
 */

/**
 * (6) Static assets
 *
 * Flat files in your `assets` directory- (these are sometimes referred to as 'public')
 * If you have an image file at `/assets/images/foo.jpg`, it will be made available
 * automatically via the route:  `/images/foo.jpg`
 *
 */



/**
 * (7) 404 (not found) handler
 *
 * Finally, if nothing else matched, the default 404 handler is triggered.
 * See `config/404.js` to adjust your app's 404 logic.
 */

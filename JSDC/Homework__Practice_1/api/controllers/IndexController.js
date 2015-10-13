/**
 * PhotoController
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
   *    `/photo/index`
   *    `/photo`
   */
   index: function (req, res) {
    res.charset = 'utf-8'
    var forms = require('forms'),
        fields = forms.fields
    var form = forms.create({
        fanpagefront: fields.string({required: true}),
    });
    res.send("<!DOCTYPE html><head><title>Facebook Fanpage Photo Show</title><link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css'></head><body><div  style='width:500;'><div class='col-xs-8' style='margin-left: 300px;  margin-right: auto; position:absolute;top:50%;'><form role='form' action='/new' method='get'><label for='id_fanpagefront'>Fanpagefront</label><input class='form-control  input-lg' placeholder='Enter the fanpage id , url or name you want to browse' id='id_fanpagefront' type='text' name='fanpagefront'><br><input  class='btn btn-default' type='submit' value='Submit'></form></div></div></body>");
  },
  new: function(req,res){
    var errorCount = 0
      function photo (photos,res,callback) {
        if(photos!=undefined){
            sails.request.get(photos, function (err, body, response) {
              if(err!=undefined){
                errorCount = 1
                callback&&callback()
              }
              if(response!=undefined){
                response = JSON.parse(response);
                if(errorCount===1&&(response.error!=undefined||response.data===undefined||(response.data!=undefined&&response.data[2]===undefined))){
                  console.log("not pathname")
                  res.redirect('http://facebook-photo-show.herokuapp.com/error');
                  return
                }
                else if(response.error!=undefined||(response.data!=undefined&&response.data[2]===undefined)){
                  errorCount = 1
                  console.log(response.error!=undefined)
                  console.log("not URL")
                  callback&&callback()
                }
                else{
                  count+=1
                  if(response&&response.data){
                      response.data.forEach(function (val, idx) {
                          if(val.images[2]!=undefined){
                              photoCount +=1
                              data +="<section id='Section' style='background: url(" +val.images[2].source+ ") 50% 0% fixed repeat;                 min-height:650px;'><div style='padding:50px;color:#FFFFFF;'><a style='color:#FFFFFF;' href='/'><h1 style='color:#FFFFFF;'>Back to home</p></h1></a><h1 style='color:#FFFFFF;'>"+photoCount+"</h1></div></section>"
                          }
                      });
                  }
                  res.write(data)
                  data= ""
                  console.log(count+"  "+photos)
                  if(response.paging&&response.paging.next!=undefined){
                    photo(response.paging.next,res,callback);
                  }
                }
              }
            })
        }
        else{
            if(photos===undefined){
                callback&&callback()
            }
        }
    }
    res.charset = 'utf-8'
    var url = require("url");
    console.log(req.url)
    var params = url.parse(req.url,true).query;
    var gettingUrl = url.parse(params.fanpagefront,true,true).pathname
    console.log(params)
    console.log(gettingUrl)
    var fanpageparams = params.fanpagefront
    var photoCount = 0
    var count = 0
    var data = "<!-- Default home page --><link type='text/css' href='http://sailsjs.org/styles/fonts.css' rel='stylesheet'/><style>    /* Styles included inline since you'll probably be deleting this page anyway */    html,body{text-align:left;font-size:1em}html,body,img,form,textarea,input,fieldset,div,p,div,ul,li,ol,dl,dt,dd,h1,h2,h3,h4,h5,h6,pre,code{margin:0;padding:0}ul,li{list-style:none}img{display:block}a img{border:0}a{text-decoration:none;font-weight:normal;font-family:inherit}*:active,*:focus{outline:0;-moz-outline-style:none}h1,h2,h3,h4,h5,h6{font-weight:normal}div.clear{clear:both}.clearfix:after{clear:both;content:'.';display:block;font-size:0;height:0;line-height:0;visibility:hidden}body{font-family:'Open Sans',Arial,sans-serif;font-weight:300;font-size:15px}h1{color:#0c8da0;font-size:2em;font-weight:300}h2{font-size:1.5em;font-weight:300;margin-top:4%}h3{font-size:1.25em;font-weight:300;font-style:italic;margin-bottom:5px}h4{color:#0c8da0;font-weight:300;font-size:1.5em}span{font-weight:700}ul{margin-top:5%;margin-bottom:5%}a{text-decoration:none;color:inherit}p{margin-bottom:7px;font-size:.9em}.container{max-width:997px;margin:0 auto;padding:0 4%}.sprite{font-weight:normal;background:url(http://sailsjs.org/images/newapp.sprite.png) no-repeat}.top-bar{position:relative;padding-top:10px;background-color:#001c20;height:55px}.main{float:left;max-width:610px;height:555px;margin-top:50px}.steps{height:250px}.getting-started p{ margin-bottom: 30px; line-height: 26px; }.getting-started div{float:left;width:540px}.getting-started li{clear:both;height:60px;margin-top:20px;margin-bottom:20px}.getting-started .sprite{margin-left:10px;padding-left:60px;height:42px;width:0}.getting-started .one{background-position:0 0}.getting-started .two{background-position:0 -42px}.getting-started .three{background-position:0 -83px}.delete{margin-top:5%;height:52px;background:#e3f0f1;border:1px solid #118798;color:#118798;clear:both}.delete .sprite{margin-top:10px;margin-bottom:10px;margin-left:9%;padding-left:42px;padding-top:7px;height:25px;background-position:0 -126px}.delete a{color:#0c8da0;font-weight:bold;padding-left:1%}.side-bar{max-width:327px;height:555px;float:left;border-left:1px solid #0c8da0;margin-left:25px;margin-top:50px;padding-left:25px}.side-bar ul{margin-bottom:10%}.side-bar ul li{margin-top:5px;margin-bottom:.25em}.side-bar ul li a{margin-bottom:.25em}.side-bar .sprite{padding-left:25px}.side-bar .single_page{background-position:0 -199px}.side-bar .traditional{background-position:0 -219px}.side-bar .realtime{background-position:0 -179px}.side-bar .api{background-position:0 -158px}.boxy{font-family:Courier,'Courier New',sans-serif;background-color:#e4edec;border:1px solid #d0d6d6;padding-left:5px;padding-right:5px;padding-top:2px;padding-bottom:2px;font-weight:100}.sixteen{margin-right:10px}.nineteen{margin-right:7px}        .main { width: 100%; }        body { min-width: 925px; }</style><!--[if IE 7]>    <style>    .getting-started li{overflow:visible;clear:both}.delete{width:690px}    </style><![endif]-->    <head><!DOCTYPE html><html lang='en'><title>Facebook Fanpage Photo Show</title><!-- GOOGLE FONT--><link href='http://fonts.googleapis.com/css?family=Roboto:400,300,700italic,700,500&amp;subset=latin,latin-ext' rel='stylesheet' type='text/css'><!-- /GOOGLE FONT-->    <!-- Le styles --><link href='assets/css/bootstrap.css' rel='stylesheet'><link href='assets/css/bootstrap-responsive.css' rel='stylesheet'><style type='text/css'>      body {        padding-top: 0px;       padding-bottom: 0px;       font-family: 'Roboto', sans-serif;     }      h1,h2,h3,h4,h5,h6{        font-weight:200;        text-shadow: 0 1px 3px rgba(0,0,0,.4);      }      header#top-section{        position:relative;        overflow:hidden;        padding-top:0px;        background: url(images/m3.jpg) 50% 0% fixed no-repeat;        background-size:100% 100%;        min-height:700px;        width:100%;        min-width:100%;        z-index:0;      }      .inner-top-bg{            position:absolute;           top:0px;            left:0px;            bottom:0px;            display:inline-block;            width:100%;            min-width:100%;            height:100%;            min-height:100%;            background: rgba(0, 0, 0, 0.3);      }      .hero-unit {            background: none;            text-shadow: 0 1px 3px rgba(0,0,0,.4), 0 0 30px;            position:fixed;            top:0px;            left:0px;            right:0px;            z-index:1;            width:100%;            text-align:center;            padding-right:0px;            padding-left:0px;      }      .hero-unit h1{            color:#fff;            padding-top:220px;      }      .hero-unit p.lead {            color:#fff;            font-size:120%;            max-width:60%;           margin-left:auto;            margin-right:auto;            position:relative;        }        .btn.btn-start{            background: rgba(0,0,0, 0);            border:4px solid #fff;            color:#fff;            padding: 19px 24px;            font-size: 24px;            font-weight: 200;            margin-top:40px;            z-index:2;        }        .btn.btn-start:hover{           background: rgba(0,0,0, 0.5);           color:#fff;            padding: 19px 24px;            font-size: 24px;            font-weight: 200;            margin-top:40px;            z-index:2;        }      section {        padding-top:50px;        padding-bottom:100px;        min-height:600px;        width:100%;        min-width:100%;        position:relative;        overflow:hidden;      }      #Section{            background: url(images/mob1.jpg) 50% 0% fixed repeat;            background-size:100% 100%;            min-height:650px;      }      footer{        width:100%;        min-width:100%;        padding-top:50px;        min-height:600px;       position:relative;     }      .color-white{        color:#fff;      }      .box{        background: rgba(250,250,250, 0.65);        padding:20px;        margin-bottom:30px;        -webkit-box-shadow: 1px 1px 12px rgba(0, 0, 0, 0.5);        -moz-box-shadow:    1px 1px 12px rgba(0, 0, 0, 0.5);        box-shadow:         1px 1px 12px rgba(0, 0, 0, 0.5);        border:1px solid rgba(250,250,250, 0.5);      }      .box.dark{        background: rgba(250,250,250, 0.4);        padding:20px;        margin-bottom:30px;        -webkit-box-shadow: 1px 1px 12px rgba(50, 50, 50, 0.5);        -moz-box-shadow:    1px 1px 12px rgba(50, 50, 50, 0.5);        box-shadow:         1px 1px 12px rgba(50, 50, 50, 0.5);      }      /****************** NAVIGATION STYLES *************************/    .navbar .nav > li > a {        float: none;        padding: 15px 20px 15px;        color: #777777;        text-decoration: none;        text-shadow: none;        font-size:14px;        font-wight:bold;        text-transform:uppercase;    }    .navbar .nav > .active > a,    .navbar .nav > .active > a:hover,    .navbar .nav > .active > a:focus {        color: #333;       text-decoration: none;        background-color: #fff;        -webkit-box-shadow:  none;            -moz-box-shadow:   none;                box-shadow:  none;    }    .navbar .brand {        padding: 15px 0px 15px;    }   .navbar-fixed-top .navbar-inner,    .navbar-static-top .navbar-inner {        -webkit-box-shadow: 0 3px 0px rgba(0, 0, 0, 0.1);            -moz-box-shadow: 0 3px 0px rgba(0, 0, 0, 0.1);                    box-shadow:0 3px 0px rgba(0, 0, 0, 0.1);    }    .navbar-inner {        min-height: 30px;        padding-right: 20px;        padding-left: 20px;        background-color: #fafafa;        background-image: -moz-linear-gradient(top, #ffffff, #ffffff);        background-image: -webkit-gradient(linear, 0 0, 0 100%, from(#ffffff), to(#ffffff));        background-image: -webkit-linear-gradient(top, #ffffff, #ffffff);        background-image: -o-linear-gradient(top, #ffffff, #ffffff);        background-image: linear-gradient(to bottom, #ffffff, #ffffff);        background-repeat: repeat-x;        border: none;        -webkit-border-radius: 0px;        -moz-border-radius: 0px;        border-radius: 0px;        filter: progid:DXImageTransform.Microsoft.gradient(startColorstr='#ffffffff', endColorstr='#ffffffff', GradientType=0);        -webkit-box-shadow: none;            -moz-box-shadow: none;                box-shadow: none;    }    .navbar .nav > li > a{        border-bottom:3px solid transparent;    }    .navbar .nav > .active > a, .navbar .nav > .active > a:hover, .navbar .nav > .active > a:focus {        color: #333;        fon-weight:600;        border-bottom:3px solid #666;        }        /*************** @media ******************/    @media (max-width: 979px){        body{            padding:0px;       }        .navbar-fixed-top {            margin-bottom: 0px;        }        .navbar-fixed-top, .navbar-fixed-bottom {            position: fixed;        }        .navbar .container {            width: auto;            padding: 0px 20px;        }        .navbar .brand {            padding-right: 10px;            padding-left: 10px;            margin: 0 0 0 15px;        }        .container{            padding:0px 20px;        }        .hero-unit {            padding: 0px;            top:30px;        }        .hero-unit h1 {            color: #fff;            padding-top: 150px;            font-size:40px;        }        footer .page-header h3{            padding-top:100px !important;        }    }    </style><link href='assets/css/font-awesome.min.css' rel='stylesheet'><!--[if lt IE 7]>    <link href='assets/css/font-awesome-ie7.min.css' rel='stylesheet'>    <![endif]-->   <!-- Fav and touch icons --><!-- Le HTML5 shim, for IE6-8 support of HTML5 elements --><!--[if lt IE 9]>      <script src='http://html5shim.googlecode.com/svn/trunk/html5.js' type='text/javascript'></script>    <![endif]--><!-- Le fav and touch icons --><link rel='shortcut icon' href='assets/ico/favicon.ico'><link rel='apple-touch-icon-precomposed' sizes='144x144' href='assets/ico/apple-touch-icon-144-precomposed.png'><link rel='apple-touch-icon-precomposed' sizes='114x114' href='assets/ico/apple-touch-icon-114-precomposed.png'><link rel='apple-touch-icon-precomposed' sizes='72x72' href='assets/ico/apple-touch-icon-72-precomposed.png'><link rel='apple-touch-icon-precomposed' href='assets/ico/apple-touch-icon-57-precomposed.png'></head><!-- /HEAD--><!--  SECTION-1 -->"
    // console.log(params.fanpagefront)
    console.log(fanpageparams)
    var end = "<script src='assets/js/jquery.js' type='text/javascript'></script>    <script src='assets/js/bootstrap.min.js' type='text/javascript'></script><script src='assets/js/jquery.parallax-1.1.3.js' type='text/javascript' ></script><script src='assets/js/jquery.localscroll-1.2.7-min.js' type='text/javascript' ></script><script src='assets/js/jquery.scrollTo.min.js' type='text/javascript' ></script><script src='assets/js/jquery.nicescroll.min.js' type='text/javascript' ></script><script>jQuery(document).ready(function(){jQuery('#Section').parallax('50%', 0.3);})</script><script> jQuery('.nav-collapse .nav > li > a').click(function(){        jQuery('.collapse.in').removeClass('in').css('height', '0');        });</script><script> jQuery(document).ready(  function() {    jQuery('html').niceScroll({cursorcolor:'#ffffff'});  });</script></body></html>"
    photo("https://graph.facebook.com"+gettingUrl+"/photos?type=uploaded",res,function(){
      if (true) {
        photo("https://graph.facebook.com/"+fanpageparams+"/photos?type=uploaded",res)
      };
    })
  },


  error: function(req,res){
    var forms = require('forms'),
        fields = forms.fields
    var form = forms.create({
        fanpagefront: fields.string({required: true}),
    });
    res.send("<!DOCTYPE html><head><title>Facebook Fanpage Photo Show</title><link rel='stylesheet' href='//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css'></head><body><div  style='width:500;'><div class='col-xs-8' style='margin-left: 300px;  margin-right: auto; position:absolute;top:50%;'><div style='color:red;'>WRONG FANPAGE NAME or ID </div><form role='form' action='/new' method='get'><label for='id_fanpagefront'>Fanpagefront</label><input class='form-control input-lg' placeholder='Enter the fanpage id , url or name you want to browse' id='id_fanpagefront' type='text' name='fanpagefront'><br><input  class='btn btn-default' type='submit' value='Submit'></form></div></div></body>");
  },

  /**
   * Action blueprints:
   *    `/photo/show`
   */
   show: function (req, res) {

    // Send a JSON response
    return res.json({
      hello: 'world'
    });

  },

  /**
   * Action blueprints:
   *    `/photo/edit`
   */
   edit: function (req, res) {

    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },


  /**
   * Action blueprints:
   *    `/photo/delete`
   */
   delete: function (req, res) {

    // Send a JSON response
    return res.json({
      hello: 'world'
    });
  },




  /**
   * Overrides for the settings in `config/controllers.js`
   * (specific to PhotoController)
   */
  _config: {}


};

"format global";"deps angular";"deps moment";!function(){"use strict";function a(a,b){return a.module("angularMoment",[]).constant("angularMomentConfig",{preprocess:null,timezone:"",format:null,statefulFilters:!0}).constant("moment",b).constant("amTimeAgoConfig",{withoutSuffix:!1,serverTime:null,titleFormat:null}).directive("amTimeAgo",["$window","moment","amMoment","amTimeAgoConfig","angularMomentConfig",function(b,c,d,e,f){return function(g,h,i){function j(){var a;if(e.serverTime){var b=(new Date).getTime(),d=b-u+e.serverTime;a=c(d)}else a=c();return a}function k(){q&&(b.clearTimeout(q),q=null)}function l(a){if(h.text(a.from(j(),s)),t&&!h.attr("title")&&h.attr("title",a.local().format(t)),!x){var c=Math.abs(j().diff(a,"minute")),d=3600;1>c?d=1:60>c?d=30:180>c&&(d=300),q=b.setTimeout(function(){l(a)},1e3*d)}}function m(a){y&&h.attr("datetime",a)}function n(){if(k(),o){var a=d.preprocessDate(o,v,r);l(a),m(a.toISOString())}}var o,p,q=null,r=f.format,s=e.withoutSuffix,t=e.titleFormat,u=(new Date).getTime(),v=f.preprocess,w=i.amTimeAgo.replace(/^::/,""),x=0===i.amTimeAgo.indexOf("::"),y="TIME"===h[0].nodeName.toUpperCase();p=g.$watch(w,function(a){return"undefined"==typeof a||null===a||""===a?(k(),void(o&&(h.text(""),m(""),o=null))):(o=a,n(),void(void 0!==a&&x&&p()))}),a.isDefined(i.amWithoutSuffix)&&g.$watch(i.amWithoutSuffix,function(a){"boolean"==typeof a?(s=a,n()):s=e.withoutSuffix}),i.$observe("amFormat",function(a){"undefined"!=typeof a&&(r=a,n())}),i.$observe("amPreprocess",function(a){v=a,n()}),g.$on("$destroy",function(){k()}),g.$on("amMoment:localeChanged",function(){n()})}}]).service("amMoment",["moment","$rootScope","$log","angularMomentConfig",function(b,c,d,e){var f=this;this.preprocessors={utc:b.utc,unix:b.unix},this.changeLocale=function(d){var e=(b.locale||b.lang)(d);return a.isDefined(d)&&(c.$broadcast("amMoment:localeChanged"),c.$broadcast("amMoment:languageChange")),e},this.changeLanguage=function(a){return d.warn("angular-moment: Usage of amMoment.changeLanguage() is deprecated. Please use changeLocale()"),f.changeLocale(a)},this.preprocessDate=function(c,f,g){return a.isUndefined(f)&&(f=e.preprocess),this.preprocessors[f]?this.preprocessors[f](c,g):(f&&d.warn("angular-moment: Ignoring unsupported value for preprocess: "+f),!isNaN(parseFloat(c))&&isFinite(c)?b(parseInt(c,10)):b(c,g))},this.applyTimezone=function(a){var b=e.timezone;return a&&b&&(a.tz?a=a.tz(b):d.warn("angular-moment: timezone specified but moment.tz() is undefined. Did you forget to include moment-timezone.js?")),a}}]).filter("amCalendar",["moment","amMoment","angularMomentConfig",function(a,b,c){function d(c,d){if("undefined"==typeof c||null===c)return"";c=b.preprocessDate(c,d);var e=a(c);return e.isValid()?b.applyTimezone(e).calendar():""}return d.$stateful=c.statefulFilters,d}]).filter("amDateFormat",["moment","amMoment","angularMomentConfig",function(a,b,c){function d(c,d,e){if("undefined"==typeof c||null===c)return"";c=b.preprocessDate(c,e);var f=a(c);return f.isValid()?b.applyTimezone(f).format(d):""}return d.$stateful=c.statefulFilters,d}]).filter("amDurationFormat",["moment","angularMomentConfig",function(a,b){function c(b,c,d){return"undefined"==typeof b||null===b?"":a.duration(b,c).humanize(d)}return c.$stateful=b.statefulFilters,c}]).filter("amTimeAgo",["moment","amMoment","angularMomentConfig",function(a,b,c){function d(c,d,e){if("undefined"==typeof c||null===c)return"";c=b.preprocessDate(c,d);var f=a(c);return f.isValid()?b.applyTimezone(f).fromNow(e):""}return d.$stateful=c.statefulFilters,d}])}"function"==typeof define&&define.amd?define("angular-moment",["angular","moment"],a):"undefined"!=typeof module&&module&&module.exports?a(angular,require("moment")):a(angular,window.moment)}();
angular.module('app', [
  'ui.bootstrap',
  'ui.select2',
  'angular-underscore',
  'highcharts-ng',
  'angularMoment',
  'duScroll',

  'app.controller',
  'map',
  'like',
  'event'
  ])
.run(function(amMoment) {
    amMoment.changeLocale('zh-tw');
})
.constant('angularMomentConfig', {
    preprocess: 'unix', // optional
    timezone: 'Asia/Taipei' // optional
});
angular.module('app.controller', [])
  .controller("index", [
    '$scope',
    function(
      $scope
    ) {
      console.log('index')
    }
  ])
;
angular.module('event', [
  'event.controller'
  ]);


angular.module('event.controller', [])
  .controller("event", [
    '$scope',
    '$http',
    '$window',
    function(
      $scope,
      $http,
      $window
    ) {
      console.log('event')
      var url = "/api/all/events"
      $scope.all = false
      if($window.location.pathname==='/events'){
        $scope.all =true
      }
      $http.get('/api/get_current_user').success(function(data, status, headers, config) {
        $scope.current_user_id = data
        if(!$scope.all){
          url = "/api/events/" + $scope.current_user_id
        }
        $http.get(url).success(function(data, status, headers, config) {
          $scope.length =data.length
          $scope.years = []
          $scope.done = true
          var year
          var event_year
          _.each(data,function(event){
            if(event.start_time!==null){
              event_year= moment(event.start_time).format('YYYY')
              year = _.findWhere($scope.years, {year: event_year})
              if( year !== undefined){
                index = _.indexOf($scope.years,year)
                $scope.years[index].events.push(event)
              }else{
                $scope.years.push({
                  year: event_year,
                  events: [event]
                })
              }
            }
          })
          $scope.years = _.sortBy($scope.years,function(year){
            return -year.year
          })
        })
      })
    }
  ])
;
angular.module('like', [
  'like.controller'
  ]);


angular.module('like.controller', [])
  .controller("like", [
    '$scope',
    '$http',
    '$window',
    function(
      $scope,
      $http,
      $window
    ) {
      console.log('like')
      var url = "/api/all/likes"
      var likeData = []
      $scope.all = false
      if($window.location.pathname==='/likes'){
        $scope.all =true
      }
      $http.get('/api/get_current_user').success(function(data, status, headers, config) {
        $scope.current_user_id = data
        if(!$scope.all){
          url = "/api/likes/" + $scope.current_user_id
        }
        $http({
          method: "GET",
          url: url
        }).success(function(data, status, headers, config) {
          var doughnutData = [];
          var cate;
          $scope.done = true
          var index;
          var colorArray = ["#637b85","#2c9c69","#dbba34","#c62f29","#F38630","#E0E4CC","#69D2E7", '#003399','#3366AA','#FFD700','#FF4500','#FFFF00']
          var likesNum = data.length
          $scope.likes = data
          _.each(data,function(like){
            cate = _.findWhere(likeData, {label: like.category})
            if( cate !== undefined){
              index = _.indexOf(likeData,cate)
              likeData[index].value = likeData[index].value+1;
              likeData[index].items.push(like)
            }else{
              likeData.push({
                label: like.category,
                value: 1,
                color: colorArray[likeData.length%colorArray.length],
                items: [like]
              })
            }
          })
          _.each(likeData ,function(like){
            if(like.value>likesNum*0.01){
              doughnutData.push(like)
            }
          })
          var ctx = document.getElementById("chart-area").getContext("2d");
          window.myDoughnut = new Chart(ctx).Doughnut(doughnutData, {responsive : true});
          document.getElementById("chart-area").onclick = function(evt){
              var activeBars = window.myDoughnut.getSegmentsAtEvent(evt);
              $scope.likes = _.findWhere(likeData, {label: activeBars[0].label}).items
              $scope.$apply()
          };
        })
      })
    }
  ])
;
angular.module('map', [
  'map.controller'
  ]);


angular.module('map.controller', [])
  .controller("map", [
    '$scope',
    '$http',
    '$window',
    function(
      $scope,
      $http,
      $window
    ) {
      function inTaiwan(lat,lan){
        var lat_d = (lat-23.69781)*(lat-23.69781)
        var lan_d = (lan-120.960515)*(lan-120.960515)
        var range = 2
        return !(lan_d>range*range||lat_d>range*range)
      }
      console.log('map')
      var url = "/api/all/places"
      $scope.all = false
      if($window.location.pathname==='/places'){
        $scope.all =true
      }
      var handler = Gmaps.build('Google', {
        markers: {
          clusterer: undefined
        }
      });
      var markers;
      $http.get('/api/get_current_user').success(function(data, status, headers, config) {
        $scope.current_user_id = data
        $scope.abroad = []
        if(!$scope.all){
          url = "/api/places/" + $scope.current_user_id
        }
        $http({
          method: "GET",
          url: url
        }).success(function(data, status, headers, config) {
          $scope.places = data;
          $scope.done = true
          var location_item;
          var markerInfos = _.map($scope.places, function(place) {
            location_item = place.location
            var street = (location_item.street !== null) ? location_item.street : ""
            var city = (location_item.city !== null) ? location_item.city : ""
            var country = (location_item.country !== null) ? location_item.country : ""
            var where = (street + " " + city + " " + country) ? street + " " + city + " " + country : ""
            var info = "<div class='map-container'><h3>" + place.name + "</h3>" + "<p>" + where + "</p>"

            if(!inTaiwan(location_item.latitude,location_item.longitude)){
              $scope.abroad.push(location_item)
            }
            _.each(place.tagged_user, function(user) {
              info = info + '<img width="100" src="' + user.user.pic + '">' + '<h4>' + user.user.name + '</h4>'
            })
            info = info + "</div>"
            return {
              "infowindow": info,
              "picture": {
                url: location_item.image_url,
                width: 36,
                height: 36
              },
              "lat": (location_item.latitude) ? (location_item.latitude) : (26.0 + location_item.id * 0.001),
              "lng": (location_item.longitude) ? (location_item.longitude) : (123.0 + location_item.id * 0.001),
              "id": location_item.id
            };
          })
          handler.buildMap({
            provider: {},
            internal: {
              id: 'map'
            }
          }, function() {
            markers = markerInfos.map(function(m) {
              var marker = handler.addMarker(m);
              marker.serviceObject.id = m.id;
              google.maps.event.addListener(marker.serviceObject, 'click', function() {
                $scope.location = _.find($scope.places, function(location) {
                  return location.id == marker.serviceObject.id
                });
                $scope.$apply();
              });
              return marker;
            });
            handler.bounds.extendWith(markers);
            handler.fitMapToBounds();
          });
        })
      })
    }
  ])
;
// This is a manifest file that'll be compiled into application.js, which will include all the files
// listed below.
//
// Any JavaScript/Coffee file within this directory, lib/assets/javascripts, vendor/assets/javascripts,
// or vendor/assets/javascripts of plugins, if any, can be referenced here using a relative path.
//
// It's not advisable to add code directly here, but if you do, it'll appear at the bottom of the
// compiled file.
//
// Read Sprockets README (https://github.com/sstephenson/sprockets#sprockets-directives) for details
// about supported directives.
//

;

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

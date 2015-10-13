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

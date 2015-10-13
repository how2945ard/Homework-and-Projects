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

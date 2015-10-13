/**
 * app.js
 *
 * This file contains some conventional defaults for working with Socket.io + Sails.
 * It is designed to get you up and running fast, but is by no means anything special.
 *
 * Feel free to change none, some, or ALL of this file to fit your needs!
 */


(function (io) {
  // as soon as this file is loaded, connect automatically,
  var socket = io.connect();
  if (typeof console !== 'undefined') {
    log('Connecting to Sails.js...');
  }

  socket.on('connect', function socketConnected() {

    // Listen for Comet messages from Sails
    socket.on('message', function messageReceived(message) {

      ///////////////////////////////////////////////////////////
      // Replace the following with your own custom logic
      // to run when a new message arrives from the Sails.js
      // server.
      ///////////////////////////////////////////////////////////
      log('New comet message received :: ', message);
      //////////////////////////////////////////////////////

    });


    ///////////////////////////////////////////////////////////
    // Here's where you'll want to add any custom logic for
    // when the browser establishes its socket connection to
    // the Sails.js server.
    ///////////////////////////////////////////////////////////
    log(
        'Socket is now connected and globally accessible as `socket`.\n' +
        'e.g. to send a GET request to Sails, try \n' +
        '`socket.get("/", function (response) ' +
        '{ console.log(response); })`'
    );
    ///////////////////////////////////////////////////////////


  });


  // Expose connected `socket` instance globally so that it's easy
  // to experiment with from the browser console while prototyping.
  window.socket = socket;


  // Simple log function to keep the example simple
  function log () {
    if (typeof console !== 'undefined') {
      console.log.apply(console, arguments);
    }
  }

  var app = angular.module("fucknews", ['ngResource'])

  console.log("Angularjs loaded")

  app.factory('userFactory',function($resource){
    return $resource('/user/:id',{ id: '@_id' })
  })

  app.controller("homepage", function($scope, userFactory,$http) {
    console.log('Homepage controller loaded')

    socket.get('/news',function(newses){
      $scope.newses = newses
      $scope.$apply()
      console.log($scope.newses)
    })

    var current_user
    socket.get('/getCurrentUser',function(data){
      current_user = data
    })

    $scope.news = {};
    $scope.submitNews = function(){
      socket.post('/news/addNews',{uri:$scope.news.uri},function(data){
        $scope.newses.push(data.news);
        $scope.$apply();
      })
    }



    socket.on('message', function messageReceived(message) {
      console.log(message)
      if(message.verb=== "create"){
        switch (message.model){
          case newses:
            $scope.newses.push(message.data);
            $scope.$apply();
            break;
          case reason:
            $scope.reason.push(message.data);
            $scope.$apply();
            break;
          case report:
            $scope.reports.push(message.data);
            $scope.$apply();
            break;
        }
      }
      if(message.verb=== "destroy"){
        $scope.reports.forEach(function(report,idx){
          if(report.id==message.id){
            $scope.reports.splice(idx,1);
            $scope.$apply();
          }
        })
      }
    });

  }).directive('forceModelUpdate', function($compile) {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attrs, ctrl) {
            scope.$on('event:force-model-update', function() {
                ctrl.$setViewValue(element.val());
            });
        }
    }
  });
  app.controller('news-all',function($scope,$location){
    socket.get('/news/showAll_angular',function(data){
      console.log(data)
      $scope.newses = data.newses
      $scope.$apply()
    })
  })
  app.controller("news", function($scope,$location) {

    var current_user
    socket.get('/getCurrentUser',function(data){
      current_user = data
      console.log(data)
    })

    $scope.vote = function(id,$index){
      socket.get('/reason/'+id,function(data){
        var found = false
        data.voters.forEach(function(val,idx){
          if(val.id === current_user){
            data.voters.splice(idx,1)

            found = true
          }
        })
        if(!found){
          data.voters.push(current_user)
        }
        console.log(data.voters)
        var voteNum =data.voters.length;
        console.log("VOTE!!!!!!!!!!!"+data.vote)
        socket.put('/reason/'+id,{voters: data.voters, vote: voteNum},function(data){
          console.log(data)
          $scope.news.reasons[$index] = data
          $scope.$apply()
        })
      })
    }

    socket.on('message', function messageReceived(message) {
      console.log(message)
      if(message.verb=== "create"){
        switch (message.model){
          case "report":
            $scope.news.reports.push(message.data);
            $scope.$apply();
            break;
          case "reason":
            $scope.news.reasons.push(message.data);
            $scope.$apply();
            break;
          }
      }
      else if(message.verb=== "destroy"){
        switch (message.model){
          case "report":
            $scope.reports.forEach(function(report,idx){
              if(report.id==message.id){
                $scope.news.reports.splice(idx,1);
                $scope.$apply();
              }
            })
            break;
          case "reason":
            $scope.reasons.forEach(function(reason,idx){
              if(reason.id==message.id){
                $scope.news.reasons.splice(idx,1);
                $scope.$apply();
              }
            })
            break;
          }
      }
    });

    var new_id = $location.absUrl().split('/').pop()

    console.log('News controller loaded')
    socket.get('/news/'+new_id,function(news){
      $scope.news = news
      socket.get('/news/getAllCommenter/'+new_id,function(data){
        data.comments.forEach(function(val,index){
          $scope.news.comments[index] = val
          $scope.$apply()
        })
        socket.get('/news/getAllReasoner/'+new_id,function(data){
          console.log(data)
          data.reasons.forEach(function(val,index){
            $scope.news.reasons[index] = val
            $scope.$apply()
          })
        })
      })
    })

    $scope.report = {};
    $scope.submitReport = function() {
        socket.get('/report/create?rep_news='+new_id+'&content='+$scope.report.content+'&owner='+current_user,function(data){
          $scope.news.reports.push(data);
          $scope.$apply();
        })
    }

    $scope.comment = {}
    $scope.submitComment = function(){
      socket.get('/comment/create?content='+$scope.comment.content+'&com_news='+new_id+'&owner='+current_user,function(data){
        socket.get('/news/getAllCommenter/'+new_id,function(data){
          data.comments.forEach(function(val,index){
            $scope.news.comments[index] = val
            $scope.$apply()
          })
        })
      })
    }

    $scope.reason = {};
    $scope.submitReason = function() {
      socket.get('/reason/create?parent_news='+new_id+'&content='+$scope.reason.content+'&owner='+current_user,function(data){
        socket.get('/news/getAllReasoner/'+new_id,function(data){
          data.reasons.forEach(function(val,index){
            $scope.news.reasons[index] = val
            $scope.$apply()
          })
        })
      })
    }
  })

  app.controller("user", function($scope,$location) {
    var current_user
    socket.get('/getCurrentUser',function(data){
      current_user = data
    })

    console.log('user controller loaded')
  })

  app.controller("userComments", function($scope,$location) {

    var current_user
    socket.get('/getCurrentUser',function(data){
      current_user = data
    })

    console.log('userComments controller loaded')
    var user_id = $location.absUrl().split('/').pop()
    socket.get('/user/'+user_id,function(data){
        console.log(data)
        $scope.comments = data.comments
        $scope.$apply()
    })
  })


  app.controller("userReasons", function($scope,$location) {

    var current_user
    socket.get('/getCurrentUser',function(data){
      current_user = data
    })

    console.log('userReasons controller loaded')
    var user_id = $location.absUrl().split('/').pop()
    socket.get('/user/'+user_id,function(data){
        console.log(data)
        $scope.reasons = data.reasons_maker
        $scope.$apply()
    })
  })

  app.controller("userReports", function($scope,$location) {

    var current_user
    socket.get('/getCurrentUser',function(data){
      current_user = data
    })

    console.log('userReports controller loaded')
    var user_id = $location.absUrl().split('/').pop()
    socket.get('/user/'+user_id,function(data){
        console.log(data)
        $scope.reports = data.reports
        $scope.$apply()
    })
  })
})

(

  // In case you're wrapping socket.io to prevent pollution of the global namespace,
  // you can replace `window.io` with your own `io` here:
  window.io

);



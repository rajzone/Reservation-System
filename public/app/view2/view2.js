'use strict';

angular.module('myAppRename.view2', ['ngRoute'])

  .config(['$routeProvider', function ($routeProvider) {
    $routeProvider.when('/view2', {
      templateUrl: 'app/view2/view2.html',
      controller: 'View2Ctrl'
    });
  }])
  .controller('View2Ctrl', ['$scope', '$http', function ($scope, $http) {
    $http({
      method: 'GET',
      url: 'userApi/test'
    })
      .success(function (data, status, headers, config) {
        $scope.info = data;
        $scope.error = null;
      }).
      error(function (data, status, headers, config) {
        if (status == 401) {
          $scope.error = "You are not authenticated to request these data";
          return;
        }
        $scope.error = data;
      });

        $scope.flightList = "";
        $scope.startAirport = "";
        $scope.endAirport= "";
        $scope.date = "";
        $scope.firstForm = {};
        $scope.getReservationForm = {};
        $scope.firstForm.submitForm = function(){

        var pathStr = "userApi/flights/"+$scope.firstForm.startAirport+"/"+$scope.firstForm.date;
        $http({

            method: 'GET',
            url:pathStr
        })
            .success(function(data,status,headers,config){

                $scope.flightList = data;
                console.log(data+'dataASD');
            })
            .error(function(data,status,headers,config){

                $scope.flightList = 'some effin error occured';
            });
        }
        $scope.getReservationForm.submitForm = function(){

            var pathStr = "userApi/reservation/"+'MMJ'+"/"+$scope.getReservationForm.getThisID;
            $http({

                method: 'GET',
                url:pathStr
            })
                .success(function(data,status,headers,config){

                    $scope.getReservationForm.reservationx = data;
                    console.log(data+'dataASD');
                })
                .error(function(data,status,headers,config){

                    console.log('data error', status);
                    $scope.getReservationForm.reservationx = data.toString();
                });
        }
  }]);
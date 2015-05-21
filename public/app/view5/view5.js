'use strict';

angular.module('myAppRename.view5', ['ngRoute'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.when('/view5', {
            templateUrl: 'app/view5/view5.html',
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
        $scope.departure = "";
        $scope.endAirport = "";
        $scope.date = "";
        $scope.search = {};
        $scope.getReservationForm = {};

        $scope.search.submit = function () {

            var timestamp = new Date($scope.search.departure_date).getTime() / 1000;

            var pathStr = "userApi/flights/" + $scope.search.departure + "/" + $scope.search.destination + "/" + '1438423200';

            $http({
                method: 'GET',
                url: pathStr
            }).success(function (data, status, headers, config) {

                    $scope.flightList = data;
                    //console.log(data + 'dataASD');
                    console.log(data);
                })
                .error(function (data, status, headers, config) {

                    $scope.flightList = 'some effin error occured';
                });
        }
        $scope.getReservationForm.submit = function () {

            var pathStr = "userApi/reservation/" + 'MMJ' + "/" + $scope.getReservationForm.getThisID;
            $http({

                method: 'GET',
                url: pathStr
            })
                .success(function (data, status, headers, config) {

                    $scope.getReservationForm.reservationx = data;
                    console.log(data + 'dataASD');
                })
                .error(function (data, status, headers, config) {

                    console.log('data error', status);
                    $scope.getReservationForm.reservationx = data.toString();
                });
        }
    }]);
'use strict';

var modalInstance = null;

angular.module('myAppRename.view5', ['ngRoute', 'ui.bootstrap'])

    .config(['$routeProvider', function ($routeProvider) {
        $routeProvider.
            when('/view5', {
                templateUrl: 'app/view5/view5.html',
                controller: 'View2Ctrl'
            });
    }]).controller('View2Ctrl', ['$scope', '$http', '$modal', '$log', 'reservationFactory', function ($scope, $http, $modal, $log, reservationFactory) {
        $http({
            method: 'GET',
            url: 'userApi/test'
        }).success(function (data, status, headers, config) {
            $scope.info = data;
            $scope.error = null;
        }).error(function (data, status, headers, config) {
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
            var pathStr = "userApi/flights/" + $scope.search.departure + "/" + $scope.search.destination + "/" + timestamp;

            $http({
                method: 'GET',
                url: pathStr
            }).success(function (data, status, headers, config) {
                $scope.flightList = data;
            }).error(function (data, status, headers, config) {

                $scope.flightList = 'some effin error occured';
            });
        };

        $scope.getReservationForm.submit = function () {

            var pathStr = "userApi/reservation/" + 'MMJ' + "/" + $scope.getReservationForm.getThisID;
            $http({
                method: 'GET',
                url: pathStr
            }).success(function (data, status, headers, config) {

                $scope.getReservationForm.reservationx = data;
            }).error(function (data, status, headers, config) {
                $scope.getReservationForm.reservationx = data.toString();
            });
        };

        $scope.open = function (flightid, airline) {

            reservationFactory.flightID = flightid;
            reservationFactory.airline = airline;

            modalInstance = $modal.open({
                animation: true,
                templateUrl: 'app/view5/modal.html',
                controller: 'ModalCtrl'
            });

            modalInstance.result.then(function (selectedItem) {
                $scope.selected = selectedItem;
            }, function () {
                $log.info('Modal dismissed at: ' + new Date());
            });
        };


    }]).controller('ModalCtrl', ['$scope', '$modal', '$log', '$http', 'reservationFactory', function ($scope, $modal, $log, $http, reservationFactory) {

        $scope.purchase = function () {
            var payload = [{
                firstName: $scope.firstName,
                lastName: $scope.lastName,
                city: $scope.city,
                country: $scope.country,
                street: $scope.street
            }];

            var pathStr = "userApi/reservation/" + 'MMJ' + "/" + reservationFactory.flightID;

            $http.post(pathStr, payload).
                success(function (data, status, headers, config) {
                    console.log('Reservation Successful');
                    console.log(data);
                }).
                error(function (data, status, headers, config) {
                    console.log('Reservation unsuccessful');
                    console.log(data);
                });

            modalInstance.close();
        };

        $scope.cancel = function () {
            modalInstance.dismiss();
        };

    }]).
    factory('reservationFactory', function () {
        var reservationData = [];
        reservationData.flightID = '';
        reservationData.airline = '';
        return reservationData;
    });
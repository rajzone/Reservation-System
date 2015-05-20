/**
 * Created by Michael on 20/05/15.
 */
'use strict';

angular.module('myAppRename.viewTickets', ['ngRoute'])

    .config(['$routeProvider', function($routeProvider) {
        $routeProvider.when('/viewTickets', {
            templateUrl: 'app/viewTickets/viewTickets.html',
            controller: 'ViewTicketsCtrl'
        });
    }])

    .controller('ViewTicketsCtrl', function ($scope, $http) {

        $http({
            method: 'GET',
            url: 'userApi/test'
        })
            .success(function (data, status, headers, config) {
                $scope.info = data;
                $scope.error = null;
                $http({
                    method: 'GET',
                    url: 'userApi/tickets/michael'
                })
                    .success(function(data, status,headers,config){

                        if(data.constructor === Array && typeof data[0] !== 'undefined'){

                            $scope.tickets=data;
                            $scope.noTicketsFound=false;
                        }else{

                            $scope.noTicketsFound=true;
                        }
                    })
                    .error(function(data,status,headers,config){

                        $scope.error = 'An error occured getting your reservations';
                    });
                $scope.getDetails = function(airline, resId){

                    console.log('airlineResIdSSOMETHING asd'+airline+resId);
                    $http({
                        method: 'GET',
                        url: 'userApi/reservation/'+airline+'/'+resId
                    })
                        .success(function(data,status,headers,config){

                            $scope.showDetailsOnWebsite = true;
                            $scope.reservationDetails = data;
                        })
                        .error(function(data,status,headers,config){

                            $scope.showDetailsOnWebsite = false;
                            $scope.error = 'An error occured getting the details of your reservation';
                        });
                    $scope.details = true;
                }
            }).
            error(function (data, status, headers, config) {
                if (status == 401) {
                    $scope.error = "You are not authenticated to request these data";
                    return;
                }
                $scope.error = data;
            });
    });


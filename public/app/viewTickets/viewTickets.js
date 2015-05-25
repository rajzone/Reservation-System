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
                    url: 'userApi/tickets/'+$scope.username
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

                    $scope.reservationDetails = null;
                    console.log('airlineResIdSSOMETHING asd'+airline+resId);
                    $http({
                        method: 'GET',
                        url: 'userApi/reservation/'+airline+'/'+resId
                    })
                        .success(function(data,status,headers,config){

                            console.log(data);
                            $scope.showDetailsOnWebsite = true;
                            $scope.reservationDetails = data;
                        })
                        .error(function(data,status,headers,config){

                            $scope.showDetailsOnWebsite = false;
                            $scope.error = 'An error occured getting the details of your reservation';
                        });
                    $scope.details = true;
                }
                $scope.delete = function(airline, resId){

                    if(confirm('Are you sure you want to delete this reservation?')){
                        console.log('Confirmed');
                        console.log(airline+'/'+resId);
                        $http({
                            method: 'DELETE',
                            url: 'userApi/reservation/'+resId
                        })
                            .success(function(data,status,headers,config){

                                $scope.reservationDetails=null;
                                alert('Reservation removed');
                            })
                            .error(function(data,status,headers,config){

                                alert('Reservation not removed');
                            });
                    }
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


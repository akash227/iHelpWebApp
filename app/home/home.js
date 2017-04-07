'use strict';

angular.module('iFeed.home', ['ui.router'])
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $stateProvider
            .state('home', {
                url: '/home',
                templateUrl: 'home/home.html',
                controller: 'HomeCtrl'

            })
    })

    .controller('HomeCtrl', ['userService', function(userService) {

    }]);
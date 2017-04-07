'use strict';

// Declare app level module which depends on views, and components
angular.module('iFeed', [
        'ui.router',
        'iFeed.login',
        'iFeed.signup',
        'iFeed.home',
        'iFeed.main',
        'myApp.version'
    ])
    .controller('NavCtrl', function ($rootScope) {
        $rootScope.nav = false;
    })
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
        // $locationProvider.html5Mode(true);

        $urlRouterProvider.otherwise("/home");
    })
    .service("userService", function ($state) {
        let $this = this;
        this.user = {};
        firebase.auth().onAuthStateChanged(function (user) {
            if (user) {
                $this.user = user;
                $state.go('main');
            }
        });
    });

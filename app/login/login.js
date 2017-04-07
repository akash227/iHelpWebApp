'use strict';

angular.module('iFeed.login', ['ui.router'])
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $stateProvider
            .state('login', {
                url: '/login',
                templateUrl: 'login/login.html',
                controller: 'LoginCtrl'
            })
    })

.controller('LoginCtrl', ['userService','$scope', function(userService, $scope) {

    $scope.login = () => {
        firebase.auth().signInWithEmailAndPassword($scope.mail, $scope.password).catch(function (error) {
            console.log(error);
        });
    }
}]);

'use strict';

angular.module('iFeed.signup', ['ui.router'])
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $stateProvider
            .state('signup', {
                url: '/signup',
                templateUrl: 'signup/signup.html',
                controller: 'SignupCtrl',
                data: {
                    css: 'TagYourTrouble.css'
                }

            })
    })

    .controller('SignupCtrl', ['userService', '$scope', '$state', function(userService, $scope, $state) {
        $scope.signup = () => {
            firebase.auth().createUserWithEmailAndPassword($scope.email, $scope.password).catch(function (error) {
            }).then(() => {
                var user = firebase.auth().currentUser;
                user.updateProfile({
                    displayName: $scope.orgName,
                    phone: $scope.phone
                }).then(function () {
                    $state.go('main');
                    console.log("Done!")
                }, function (error) {
                    console.log(error);
                });
            })
        }
    }]);
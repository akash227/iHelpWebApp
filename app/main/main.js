'use strict';

angular.module('iFeed.main', ['ui.router'])
    .config(function ($urlRouterProvider, $stateProvider, $locationProvider) {
        $stateProvider
            .state('main', {
                url: '/main',
                templateUrl: 'main/main.html',
                controller: 'MainCtrl'
            })
    })

    .controller('MainCtrl', ['userService', '$rootScope', '$scope', '$http', function (userService, $rootScope, $scope, $http) {
        $(document).ready(function () {
            $(".button-collapse").sideNav();
            $('.collapsible').collapsible();
            $('select').material_select();
            $('.modal').modal();
        });
        $scope.helpers = [];
        NProgress.start();

        $http.get("http://localhost:3000/fetchHelper").then(function (res) {
            NProgress.done();

            $scope.helpers = res.data;
            console.log("Helpers");
            console.log(res);
        });

        $scope.helper = {};
        $scope.foods = [];
        $scope.modalTrigger = () => {
            $('#modal1').modal('open');
        };
        $scope.userFoods = [];
        let id = -1;
        $scope.collect = function (ind) {
            let food = $scope.foods[ind];
            $scope.message = `Collect ${food.name} from https://www.google.co.in/maps?q=${food.latitude},${food.longitude}`;
            console.log(ind);
            $('#modal2').modal('open');
            id = ind;
        };

        $scope.allocatedHelper = null;
        $scope.selectUser = (ind) => {
            $scope.allocatedHelper = $scope.helpers[ind];
            console.log($scope.allocatedHelper);
        };

        $scope.done = () => {
            $scope.allocate(id);
        }
        $scope.allocate = (i) => {
            $scope.userFoods.push($scope.foods[i]);
            $scope.foods.splice(i, 1);
            NProgress.start();
            console.log(`http://smshorizon.co.in/api/sendsms.php?user=akhilo&apikey=z05GBrEqPHqghTDcFg0a&mobile=91${$scope.allocatedHelper.phone}&message=${$scope.message}&senderid=abcdef&type=txt`);
            $http.get(`http://smshorizon.co.in/api/sendsms.php?user=akhilo&apikey=z05GBrEqPHqghTDcFg0a&mobile=91${$scope.allocatedHelper.phone}&message=${$scope.message}&senderid=abcdef&type=txt`).then(function () {
                console.log("Done!");
                NProgress.done();
            })
        };
        $scope.submit = function () {
            if (confirm("Are you sure you wanna collect these?")) {
                console.log($scope.userFoods);
            }
        };
        $scope.addHelper = () => {
            // $scope.helper
            NProgress.start();
            console.log($scope.name1);
            $http.post("http://localhost:3000/addHelper", {
                name: $scope.name1,
                phone: $scope.phone1,
                type: $scope.type
            }).success(function (data) {
                NProgress.done();
                console.log("insert succesful!!!!!");
            });

        };
        $scope.sortOpts = ['title', 'web_address', 'tag'];
        $scope.fetch = function () {
            function getLocation() {
                NProgress.start();
                if (navigator.geolocation) {
                    navigator.geolocation.getCurrentPosition(showPosition);
                }
            }

            function showPosition(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                console.log(position.coords.latitude);
                var radius = parseFloat($scope.locate);
                $http.post("http://localhost:3000/fetchFeed", {
                    latitude: latitude,
                    longitude: longitude,
                    radius: radius
                }).success(function (data) {
                    NProgress.done();
                    console.log(data);
                    $scope.foods = data;
                });
            }

            getLocation();
        }
        $rootScope.nav = true;
    }]);

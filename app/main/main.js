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
        var lessThanTen = [{
            name:"Fruits/Vegetables",
            quantity:10,
            time:"20:06",
            address:"Vijayawada Multi Cusine Restaurant AC,Kavaraipettai, Tamil Nadu - 601206"
        },{
            name:"Rice",
            quantity:22,
            time:"10:02",
            address:"Sangeetha Punjabi Dhaba,Kavaraipettai, Tamil Nadu - 601206"
        },{
            name:"Bread",
            quantity:22,
            time:"18:07",
            address:"R.M.K Engineering College,Kavaraipettai, Tamil Nadu - 601206"
        }];
        var lessThanHundred = [{
            name:"Fruits/Vegetables",
            quantity:10,
            time:"20:06",
            address:"Vijayawada Multi Cusine Restaurant AC,Kavaraipettai, Tamil Nadu - 601206"
        },{
            name:"Rice",
            quantity:30,
            time:"10:02",
            address:"Sangeetha Punjabi Dhaba,Kavaraipettai, Tamil Nadu - 601206"
        },{
            name:"Bread",
            quantity:92,
            time:"18:07",
            address:"Sangeetha Punjabi Dhaba,Kavaraipettai, Tamil Nadu - 601206"
        },{
            name:"Dairy",
            quantity:29,
            time:"17:07",
            address:"Hotel SRM Grands –Chennai, No. 9, Jayanthi Nagar, 200th Feet Road,Kolathur, Anthony Nagar, Kolathur, Chennai, Tamil Nadu 600099"
        },
        {
            name:"Rice",
            quantity:99,
            time:"18:27",
            address:"Hotel Pandia,T H Road, Old Washermanpet, 527, Korukkupet, Old Washermanpet, Chennai, Tamil Nadu 600021"
        },
        {
            name:"Bread",
            quantity:79,
            time:"19:27",
            address:"Fairmont Hotel Private Limited,No 171, Jawaharlal Nehru Inner Ring Road, Arumbakkam, Chennai, Tamil Nadu 600106"
        },
        {
            name:"Rice",
            quantity:88,
            time:"20:27",
            address:"HOTEL EMPIRE,NO.52A/72, PERAMBUR HIGH ROAD, PERAMBUR, Samathamman Colony, Ayanavaram, Chennai, Tamil Nadu 600011"
        },{
            name:"Dairy",
            quantity:68,
            time:"22:26",
            address:"Hotel Shri Valli Residency,79,80, Millers Road, Kilpauk, Kilpauk, Chennai, Tamil Nadu 600010"
        }];

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
                    if(data.length < 2){
                        console.log("Here123");
                        if($scope.locate < 10){
                            $scope.foods = lessThanTen;
                        }else{
                            $scope.foods = lessThanHundred;
                        }
                    }else{
                        console.log("Here12312");
                        $scope.foods = data;
                    }
                    
                });
            }

            getLocation();
        }
        $rootScope.nav = true;
    }]);

var auth = angular.module('newsBoard.auth', ['ui.router']);

auth.config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouteProvider) {
		$stateProvider 
			.state('login', {
				url: '/login',
				templateUrl: '../templates/login.html',
				controller: 'AuthCtrl',
				onEnter: ['$rootScope', '$state', 'auth', function ($rootScope, $state, auth) {
					$rootScope.header = "Angular News Board - Login";
					
					if (auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			})
			.state('register', {
				url: '/register',
				templateUrl: '../templates/register.html',
				controller: 'AuthCtrl',
				onEnter: ['$rootScope', '$state', 'auth', function ($rootScope, $state, auth) {
					$rootScope.header = "Angular News Board - Register";

					if (auth.isLoggedIn()) {
						$state.go('home');
					}
				}]
			});
}]);

auth.controller('AuthCtrl', ['$scope', '$state', 'auth',
	function ($scope, $state, auth) {
		$scope.user = {};

		$scope.register = function () {
			auth.register($scope.user).error(function (error) {
				$scope.error = error;
			}).then(function () {
				$state.go('home');
			});
		};

		$scope.logIn = function () {
			auth.logIn($scope.user).error(function (error) {
				$scope.error = error;
			}).then(function () {
				$state.go('home');
			});
		};
	}
]);
var main = angular.module('newsBoard.main', ['ui.router']);

main.config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouteProvider) {
		$stateProvider 
			.state('home', {
				url: '/home',
				templateUrl: 'templates/home.html',
				controller: 'MainCtrl',
				resolve: {
					postPromise: ['posts', function(posts){
						return posts.getAll();
					}]
				}
			});
}]);

main.controller('MainCtrl', ['$scope', '$rootScope', 'auth', 'posts',
	function ($scope, $rootScope, auth, posts) {
		$rootScope.header = "Angular News Board";

		$scope.isLoggedIn = auth.isLoggedIn;
  		$scope.posts = posts.posts;

		$scope.addPost = function () {
			if ($scope.title === '' || !$scope.title) {
				return ;
			}

			posts.create({
				title: $scope.title,
				link: $scope.link,
			});

			$scope.title = '';
			$scope.link = '';
		};

		$scope.upVote = function (post) {
			if (post.upvotedBy.indexOf(auth.currentUser()) === -1) {
				posts.upvote(post);
			} else {
				
			}
		};

		$scope.downVote = function (post) {
			posts.downvote(post);
		};
	}
]);
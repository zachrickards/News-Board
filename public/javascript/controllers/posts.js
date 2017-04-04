var posts = angular.module('newsBoard.posts', ['ui.router']);

posts.config(['$stateProvider', '$urlRouterProvider',
	function ($stateProvider, $urlRouteProvider) {
		$stateProvider 
			.state('posts', {
				url: '/posts/{id}',
				templateUrl: '../templates/posts.html',
				controller: 'PostsCtrl',
				resolve: {
					post: ['$stateParams', 'posts', function($stateParams, posts) {
						return posts.get($stateParams.id);
					}]
				}
			});
}]);

posts.controller('PostsCtrl', ['$scope', '$rootScope', 'auth', 'posts', 'post',
	function ($scope, $rootScope, auth, posts, post) {
		$rootScope.header = "Angular News Board";
		
		$scope.isLoggedIn = auth.isLoggedIn;
		$scope.post = post;

		$scope.addComment = function () {
			if ($scope.body === '') {
				return;
			}

			posts.addComment(post._id, {
				body: $scope.body,
				author: 'user',
			}).success(function (comment) {
				$scope.post.comments.push(comment);
			});

			$scope.body = '';
		};

		$scope.upvoteComment = function (comment) {
			posts.upvoteComment(post, comment);
		};

		$scope.downvoteComment = function (comment) {
			posts.downvoteComment(post, comment);
		};
	}
]);
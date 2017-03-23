var app = angular.module('newsBoard', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',

	function ($stateProvider, $urlRouteProvider) {
		$stateProvider.state('posts', 
			{
				url: '/posts/{id}',
				templateUrl: '/posts.html',
				controller: 'PostsCtrl'
			})
			.state('home', 
			{
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl'
			});

		$urlRouteProvider.otherwise('home');
	}
]);

app.factory('posts', [function () {
	var postObj = {
		posts: []
	};

	return postObj;
}]);

app.controller('MainCtrl', ['$scope', 'posts',

	function ($scope, posts){
  		$scope.posts = posts.posts;

		$scope.addPost = function () {
			if ($scope.title === '' || !$scope.title) {
				return ;
			}

			$scope.posts.push({
				title: $scope.title,
				link: $scope.link,
				upvotes: 0,
				comments: [
					{author: 'Joe', body: 'Cool post!', upvotes: 0},
					{author: 'Bob', body: 'Great idea but everything is wrong!', upvotes: 0}
				]
			});

			$scope.title = '';
			$scope.link = '';
		}

		$scope.upVote = function (post) {
			post.upvotes++;
		}
	}
]);

app.controller('PostsCtrl', ['$scope', '$stateParams', 'posts',

	function ($scope, $stateParams, posts) {
		$scope.post = posts.posts[$stateParams.id];

		$scope.addComment = function () {
			if ($scope.body === '') {
				return;
			}

			$scope.post.comments.push({
				body: $scope.body,
				author: 'user',
				upvotes: 0
			});

			$scope.body = '';
		}
	}
]);
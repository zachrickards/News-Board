var app = angular.module('newsBoard', ['ui.router']);

app.config(['$stateProvider', '$urlRouterProvider',

	function ($stateProvider, $urlRouteProvider) {
		$stateProvider 
			.state('home', {
				url: '/home',
				templateUrl: '/home.html',
				controller: 'MainCtrl',
				resolve: {
					postPromise: ['posts', function(posts){
						return posts.getAll();
					}]
				}
			})
			.state('posts', {
				url: '/posts/{id}',
				templateUrl: '/posts.html',
				controller: 'PostsCtrl',
				resolve: {
					post: ['$stateParams', 'posts', function($stateParams, posts) {
						return posts.get($stateParams.id);
					}]
				}
			});

		$urlRouteProvider.otherwise('home');
	}
]);

app.factory('posts', ['$http', function ($http) {
	var postObj = {
		posts: []
	};

	postObj.get = function (id) {
		return $http.get('/posts/' + id).then(function (res) {
			return res.data;
		});
	};

	postObj.getAll = function () {
		return $http.get('/posts').success(function (data) {
			angular.copy(data, postObj.posts);
		});
	};

	postObj.create = function (post) {
		return $http.post('/posts', post).success(function (data) {
			postObj.posts.push(data);
		});
	};

	postObj.upvote = function (post) {
		return $http.put('/posts/' + post._id + '/upvote')
			.success(function (data) {
				post.upvotes += 1;
			});
	};

	postObj.addComment = function (id, comment) {
		return $http.post('/posts/' + id + '/comments', comment);
	};

	postObj.upvoteComment = function (post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote')
			.success(function (data) {
				comment.upvotes += 1;
			});
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

			posts.create({
				title: $scope.title,
				link: $scope.link,
			});

			$scope.title = '';
			$scope.link = '';
		}

		$scope.upVote = function (post) {
			posts.upvote(post);
		}
	}
]);

app.controller('PostsCtrl', ['$scope', 'posts', 'post',

	function ($scope, posts, post) {
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
	}
]);
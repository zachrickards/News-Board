var app = angular.module('newsBoard', ['ui.router',
									   'newsBoard.main',
									   'newsBoard.nav',
									   'newsBoard.auth',
									   'newsBoard.posts']);

app.factory('posts', ['$http', 'auth', function ($http, auth) {
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
		return $http.post('/posts', post, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function (data) {
			postObj.posts.push(data);
		});
	};

	postObj.upvote = function (post) {
		return $http.put('/posts/' + post._id + '/upvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function (data) {
			post.upvotedBy = data.upvotedBy;
			post.upvotes += 1;
		});
	};

	postObj.removeUpvote = function (post) {
		return $http.put('/posts/' + post._id + '/removeUpvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function (data) {
			post.upvotedBy = data.upvotedBy;
			post.upvotes -= 1;
		});
	};

	postObj.downvote = function (post) {
		return $http.put('/posts/' + post._id + '/downvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function (data) {
			post.downvotedBy = data.downvotedBy;
			post.downvotes += 1;
		});
	};

	postObj.removeDownvote = function (post) {
		return $http.put('/posts/' + post._id + '/removeDownvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function (data) {
			post.downvotedBy = data.downvotedBy;
			post.downvotes -= 1;
		})
	}

	postObj.addComment = function (id, comment) {
		return $http.post('/posts/' + id + '/comments', comment, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		});
	};

	postObj.upvoteComment = function (post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/upvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function (data) {
			comment.upvotes += 1;
		});
	};

	postObj.downvoteComment = function (post, comment) {
		return $http.put('/posts/' + post._id + '/comments/' + comment._id + '/downvote', null, {
			headers: {Authorization: 'Bearer ' + auth.getToken()}
		}).success(function (data) {
			comment.downvotes += 1;
		});
	};

	return postObj;
}]);

app.factory('auth', ['$http', '$window', function ($http, $window) {
	var auth = {};

	auth.saveToken = function (token) {
		$window.localStorage['news-board-token'] = token;
	};

	auth.getToken = function () {
		return $window.localStorage['news-board-token'];
	};

	auth.isLoggedIn = function () {
		var token = auth.getToken();

		if (token) {
			var payload = JSON.parse($window.atob(token.split('.')[1]));

			return payload.exp > Date.now() / 1000;
		} else {
			return false;
		}
	};

	auth.currentUser = function () {
		if (auth.isLoggedIn()) {
			var token = auth.getToken();
			var payload = JSON.parse($window.atob(token.split('.')[1]));
		
			return payload.username;
		}
	};

	auth.register = function (user) {
		return $http.post('/register', user).success(function (data) {
			auth.saveToken(data.token);
		});
	};

	auth.logIn = function (user) {
		return $http.post('/login', user).success(function (data) {
			auth.saveToken(data.token);
		});
	};

	auth.logOut = function () {
		$window.localStorage.removeItem('news-board-token');
	};

	return auth;
}]);
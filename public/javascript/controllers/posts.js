var posts = angular.module('newsBoard.posts', ['ui.router', 'newsBoard.modal']);

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
			checkUserVotes(post, comment, 'upvote');
		};

		$scope.downvoteComment = function (comment) {
			checkUserVotes(post, comment, 'downvote');
		};

		function checkUserVotes (post, comment, voteType) {
			$scope.comment = comment;

			if (comment.upvotedBy.indexOf(auth.currentUser()) === -1 && comment.downvotedBy.indexOf(auth.currentUser()) === -1) {
				if (voteType === 'upvote') {
					posts.upvoteComment(post, comment);
				} else if (voteType === 'downvote') {
					posts.downvoteComment(post, comment);
				}
			} else if (comment.upvotedBy.indexOf(auth.currentUser()) >= 0) {
				showModal(voteType, 'upvote');
			} else if (comment.downvotedBy.indexOf(auth.currentUser()) >= 0) {
				showModal(voteType, 'downvote');
			} 
		}

		function showModal (voteType, prevVote) {
			if (voteType === prevVote) {
				$scope.modalTitle = 'Already Upvoted or Downvoted';
				$scope.modalMessage = 'You can only upvote or downvote a comment once. ' +
									  'If you would like to switch your vote, ' +
									  'you may do so by clicking the opposite thumb.';
				$scope.modalType = 'okay';
				$scope.voteType = voteType;
			} else {
				$scope.modalTitle = 'Switch Vote';
				$scope.modalMessage = 'You have already upvoted or downvoted this comment. ' +
									  'Would you like to switch your vote from your previous?';
				$scope.modalType = 'switch';
				$scope.voteType = voteType;
			}

			angular.element(document.querySelector('#myModal')).addClass('show');
		}
		
		$scope.switchVote = function () {
			if ($scope.voteType === 'upvote') {
				posts.removeCommentDownvote(post, $scope.comment);
				posts.upvoteComment(post, $scope.comment);
			} else if ($scope.voteType === 'downvote') {
				posts.removeCommentUpvote(post, $scope.comment);
				posts.downvoteComment(post, $scope.comment);
			}

			angular.element(document.querySelector('#myModal')).removeClass('show');
		};
	}
]);
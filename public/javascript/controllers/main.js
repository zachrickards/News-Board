var main = angular.module('newsBoard.main', ['ui.router', 'newsBoard.modal']);

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
		$rootScope.header = 'Angular News Board';

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
			checkUserVotes(post, 'upvote');
		};

		$scope.downVote = function (post) {
			checkUserVotes(post, 'downvote');
		};

		function checkUserVotes (post, voteType) {
			$scope.post = post;

			if (post.upvotedBy.indexOf(auth.currentUser()) === -1 && post.downvotedBy.indexOf(auth.currentUser()) === -1) {
				if (voteType === 'upvote') {
					posts.upvote(post);
				} else if (voteType === 'downvote') {
					posts.downvote(post);
				}
			} else if (post.upvotedBy.indexOf(auth.currentUser()) >= 0) {
				showModal(voteType, 'upvote');
			} else if (post.downvotedBy.indexOf(auth.currentUser()) >= 0) {
				showModal(voteType, 'downvote');
			} 
		}

		function showModal (voteType, prevVote) {
			if (voteType === prevVote) {
				$scope.modalTitle = 'Already Upvoted or Downvoted';
				$scope.modalMessage = 'You can only upvote or downvote a post once. ' +
									  'If you would like to switch your vote, ' +
									  'you may do so by clicking the opposite thumb.';
				$scope.modalType = 'okay';
				$scope.voteType = voteType;
			} else {
				$scope.modalTitle = 'Switch Vote';
				$scope.modalMessage = 'You have already upvoted or downvoted this post. ' +
									  'Would you like to switch your vote from your previous?';
				$scope.modalType = 'switch';
				$scope.voteType = voteType;
			}

			angular.element(document.querySelector('#myModal')).addClass('show');
		}

		$scope.switchVote = function () {
			if ($scope.voteType === 'upvote') {
				posts.removeDownvote($scope.post);
				posts.upvote($scope.post);
			} else if ($scope.voteType === 'downvote') {
				posts.removeUpvote($scope.post);
				posts.downvote($scope.post);
			}

			angular.element(document.querySelector('#myModal')).removeClass('show');
		};
	}
]);
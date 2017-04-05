var modal = angular.module('newsBoard.modal', []);

app.directive('newsBoardModal', function() {
	return {
		templateUrl: 'javascript/directives/modal/modal.html',
		link: newsBoardModal,
	}
});

function newsBoardModal ($scope, $element, $attr) {
	
} 
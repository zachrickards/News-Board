var mongoose = require('mongoose');

var CommentSchema = new mongoose.Schema({
	body: String,
	author: String,
	upvotes: {type: Number, default: 0},
	upvotedBy: [],
	downvotes: {type: Number, default: 0},
	downvotedBy: [],
	post: { type: mongoose.Schema.Types.ObjectId, ref: 'Post' },
	createdDate: {type: Date, default: Date.now},
	updatedDate: {type: Date, default: Date.now}
});

CommentSchema.methods.upvote = function (cb, user) {
	this.upvotedBy.push(user);
	this.upvotes += 1;
	this.save(cb);
};

CommentSchema.methods.removeUpvote = function (cb, user) {
	var index = this.upvotedBy.indexOf(user);

	this.upvotedBy.splice(index, 1);
	this.upvotes -= 1;
	this.save(cb);
};

CommentSchema.methods.downvote = function (cb, user) {
	this.downvotedBy.push(user);
	this.downvotes += 1;
	this.save(cb);
};

CommentSchema.methods.removeDownvote = function (cb, user) {
	var index = this.downvotedBy.indexOf(user);

	this.downvotedBy.splice(index, 1);
	this.downvotes -= 1;
	this.save(cb);
};

mongoose.model('Comment', CommentSchema);
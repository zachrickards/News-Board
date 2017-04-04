var mongoose = require('mongoose');

var PostSchema = new mongoose.Schema({
	title: String,
	link: String,
	author: String,
	upvotes: {type: Number, default: 0},
	upvotedBy: [],
	downvotes: {type: Number, default: 0},
	downvotedBy: [],
	comments: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }],
	createdDate: {type: Date, default: Date.now},
	updatedDate: {type: Date, default: Date.now}
});

PostSchema.methods.upvote = function (cb, user) {
	this.upvotedBy.push(user);
	this.upvotes += 1;
	this.save(cb);
};

PostSchema.methods.downvote = function (cb) {
	this.downvotes += 1;
	this.save(cb);
};

mongoose.model('Post', PostSchema);
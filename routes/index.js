var express = require('express');
var router = express.Router();

var mongoose = require('mongoose');
var Post = mongoose.model('Post');
var Comment = mongoose.model('Comment');

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
});


// Preload post objects on routes with ':post'
router.param('post', function (req, res, next, id) {
  	var query = Post.findById(id);

  	query.exec(function (err, post){
	    if (err) { 
	    	return next(err); 
	    }
	    
	    if (!post) { 
	    	return next(new Error('can\'t find post'));
	    }

    	req.post = post;
    	return next();
	});
});

// Preload comment objects on routes with ':comment'
router.param('comment', function (req, res, next, id) {
	var query = Comment.findById(id);

	query.exec(function (err, comment) {
		if (err) {
			return next(err);
		}

		if (!comment) {
			return next(new Error('can\'t find comment'));
		}

		req.comment = comment;
		return next();
	});
});

router.get('/posts', function (req, res, next) {
	Post.find(function (err, posts) {
		if (err) {
			return next(err);
		}

		res.json(posts);
	});
});

router.post('/posts', function (req, res, next) {
	var post = new Post(req.body);

	post.save(function (err, post) {
		if (err) {
			return next(err);
		}

		res.json(post);
	});
});

// Get a post by id
router.get('/posts/:post', function (req, res) {
	req.post.populate('comments', function (err, next) {
		if (err) {
			return next(err);
		}

		res.json(req.post);
	});
});


// Update a post w/ upvote
router.put('/posts/:post/upvote', function (req, res, next) {
  	req.post.upvote(function (err, post) {
	    if (err) {
	    	return next(err);
	    }

    	res.json(post);
  	});
});

// Create a new comment
router.post('/posts/:post/comments', function (req, res, next) {
	var comment = new Comment(req.body);
	
	comment.post = req.post;
	// comment.author = req.payload.username;

	comment.save(function (err, comment) {
		if (err) {
			return next(err);
		}

		req.post.comments.push(comment);
		req.post.save(function (err, post) {
			if (err) {
				return next(err);
			}

			res.json(comment);
		});
	});
});

// Update a comment w/ upvote
router.put('/posts/:post/comments/:comment/upvote', function (req, res, next) {
	req.comment.upvote(function (err, comment) {
		if (err) {
			return next(err);
		}

		res.json(comment);
	});
});

module.exports = router;

import express from 'express';
import PostModel from '../models/PostModel.js';
import UserModel from '../models/UserModel.js';

const router = express.Router();

// create post
router.post('/', async (req, res) => {
	const newPost = new PostModel(req.body);
	try {
		await newPost.save();
		res.status(200).json(newPost);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// update post
router.put('/:id', async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await PostModel.updateOne({ $set: req.body });
			res.status(200).json('Post updated successfully');
		} else {
			res.status(403).json('You can only update your own posts!');
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// delete post
router.delete('/:id', async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		if (post.userId === req.body.userId) {
			await PostModel.deleteOne();
			res.status(200).json('Post deleted successfully');
		} else {
			res.status(403).json('You can only delete your own posts!');
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// like / dislike post
router.put('/:id/like', async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		if (!post.like.includes(req.body.userId)) {
			await post.updateOne({ $push: { like: req.body.userId } });
			res.status(200).json('Post liked successfully');
		} else {
			await post.updateOne({ $pull: { like: req.body.userId } });
			res.status(200).json('Post disliked successfully');
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// love / notlove post
router.put('/:id/love', async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		if (!post.love.includes(req.body.userId)) {
			await post.updateOne({ $push: { love: req.body.userId } });
			res.status(200).json('Post loved successfully');
		} else {
			await post.updateOne({ $pull: { love: req.body.userId } });
			res.status(200).json('Post not loved anymore');
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// get post
router.get('/:id', async (req, res) => {
	try {
		const post = await PostModel.findById(req.params.id);
		res.status(200).json(post);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// get all User's posts
router.get('/profile/:profileId', async (req, res) => {
	try {
		const user = await UserModel.findOne({ _id: req.params.profileId });
		{
			const posts = await PostModel.find({
				userId: user._id
			});
			if (posts) {
				res.status(200).json(posts);
			} else {
				return 'No posts available yet.';
			}
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// get timeline
router.get('/timeline/:userId', async (req, res) => {
	try {
		const currentUser = await UserModel.findById(req.params.userId);
		const userPosts = await PostModel.find({
			userId: currentUser._id
		});
		const followingPosts = await Promise.all(
			currentUser.following.map((followingId) => {
				return PostModel.find({ userId: followingId });
			})
		);

		if (Array.isArray(userPosts) && Array.isArray(followingPosts)) {
			const timeline = userPosts.concat(...followingPosts);
			res.status(200).json(timeline);
		} else {
			let timeline = [];
			timeline.push(userPosts);
			timeline.push(followingPosts);
			res.status(200).json(timeline);
		}
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;

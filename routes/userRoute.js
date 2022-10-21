import express from 'express';
import bcrypt from 'bcrypt';
import UserModel from '../models/UserModel.js';

const router = express.Router();

// Update user
router.put('/:id', async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		if (req.body.password) {
			try {
				const salt = await bcrypt.genSalt(10);
				const hashedPassword = await bcrypt.hash(req.body.password, salt);
				req.body.password = hashedPassword;
			} catch (error) {
				res.status(500).json({ message: error.message });
			}
		}
		try {
			await UserModel.findByIdAndUpdate(req.params.id, { $set: req.body });
			res.status(200).json('Account updated successfully');
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	} else {
		res.status(403).json('You can only update your account!');
	}
});

// Delete user
router.delete('/:id', async (req, res) => {
	if (req.body.userId === req.params.id || req.body.isAdmin) {
		try {
			await UserModel.findByIdAndDelete(req.params.id);
			res.status(200).json('Account deleted successfully');
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	} else {
		res.status(403).json('You can only delete your account!');
	}
});

// get a user
router.get('/', async (req, res) => {
	const userId = req.query.id;
	try {
		const user = userId
			? await UserModel.findById({ _id: userId })
			: await UserModel.findOne(req.query);
		const { password, ...otherDetails } = user._doc;
		if (!user) {
			res.status(404).json('User not found');
		}
		res.status(200).json(otherDetails);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Follow a user
router.put('/:id/follow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const followUser = await UserModel.findById(req.params.id);
			const followingUser = await UserModel.findById(req.body.userId);
			if (!followUser.followers.includes(req.body.userId)) {
				await followUser.updateOne({ $push: { followers: req.body.userId } });
				await followingUser.updateOne({ $push: { following: req.params.id } });
				res.status(200).json('User followed successfully');
			} else {
				res.status(403).json('you are already following this user');
			}
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	} else {
		res.status(403).json('You cannot follow yourself');
	}
});

// Unfollow a user
router.put('/:id/unfollow', async (req, res) => {
	if (req.body.userId !== req.params.id) {
		try {
			const followUser = await UserModel.findById(req.params.id);
			const followingUser = await UserModel.findById(req.body.userId);
			if (followUser.followers.includes(req.body.userId)) {
				await followUser.updateOne({ $pull: { followers: req.body.userId } });
				await followingUser.updateOne({ $pull: { following: req.params.id } });
				res.status(200).json('User unfollowed successfully');
			} else {
				res.status(403).json('you are not following this user yet');
			}
		} catch (error) {
			res.status(500).json({ message: error.message });
		}
	} else {
		res.status(403).json('You cannot unfollow yourself');
	}
});

export default router;

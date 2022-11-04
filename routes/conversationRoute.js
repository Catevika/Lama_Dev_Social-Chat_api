import express from 'express';
import ConversationModel from '../models/ConversationModel.js';

const router = express.Router();

// New Conversation
router.post('/', async (req, res) => {
	const newConversation = new ConversationModel({
		members: [req.body.senderId, req.body.receiverId]
	});
	try {
		const savedConversation = await newConversation.save();
		res.status(200).json(savedConversation);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Conversation of a user
router.get('/:userId', async (req, res) => {
	try {
		const conversation = await ConversationModel.find({
			members: { $in: req.params.userId }
		});
		res.status(200).json(conversation);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Conversation of 2 users
router.get('/find/:firstUserId/:secondUserId', async (req, res) => {
	try {
		const conversation = await ConversationModel.findOne({
			members: { $all: [req.params.firstUserId, req.params.secondUserId] }
		});
		res.status(200).json(conversation);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;

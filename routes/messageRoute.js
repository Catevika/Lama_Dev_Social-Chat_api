import express from 'express';
import MessageModel from '../models/MessageModel.js';

const router = express.Router();

// Add message
router.post('/', async (req, res) => {
	const newMessage = new MessageModel(req.body);
	try {
		const savedMessage = await newMessage.save();
		res.status(200).json(savedMessage);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get all messages from a conversation
router.get('/:conversationId', async (req, res) => {
	try {
		const messages = await MessageModel.find({
			conversationId: req.params.conversationId
		});
		res.status(200).json(messages);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

// Get a message
router.get('/:messageId', async (req, res) => {
	try {
		const message = await MessageModel.findById(req.params.messageId);
		res.status(200).json(message);
	} catch (error) {
		res.status(500).json({ message: error.message });
	}
});

export default router;

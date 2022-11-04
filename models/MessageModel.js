import mongoose from 'mongoose';

const MessageSchema = mongoose.Schema(
	{
		conversationId: {
			type: String
		},
		senderId: {
			type: String
		},
		senderUsername: {
			type: String
		},
		text: {
			type: String
		}
	},
	{ timestamps: true }
);

const MessageModel = mongoose.model('Message', MessageSchema);

export default MessageModel;

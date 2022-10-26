import mongoose from 'mongoose';

const PostSchema = mongoose.Schema(
	{
		userId: {
			type: String,
			required: true
		},
		postAuthor: {
			type: String,
			required: true
		},
		postAuthorPicture: {
			type: String,
			required: true
		},
		description: {
			type: String,
			max: 500
		},
		img: {
			type: String
		},
		like: {
			type: Array,
			default: []
		},
		love: {
			type: Array,
			default: []
		}
	},
	{ timestamps: true }
);

const PostModel = mongoose.model('Post', PostSchema);

export default PostModel;

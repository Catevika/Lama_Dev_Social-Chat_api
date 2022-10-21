import mongoose from 'mongoose';

const UserSchema = mongoose.Schema(
	{
		username: {
			type: String,
			required: true,
			min: 3,
			max: 20,
			unique: true
		},
		email: {
			type: String,
			required: true,
			max: 50,
			unique: true
		},
		password: {
			type: String,
			required: true,
			min: 6
		},
		profilePicture: {
			type: String,
			default: ''
		},
		coverPicture: {
			type: String,
			default: ''
		},
		followers: {
			type: Array,
			default: []
		},
		following: {
			type: Array,
			default: []
		},
		isAdmin: {
			type: Boolean,
			default: false
		},
		description: {
			type: String,
			max: 50
		},
		city: {
			type: String,
			max: 50
		},
		from: {
			type: String,
			max: 50
		},
		relationship: {
			type: Number,
			Enum: [1, 2, 3]
		}
	},
	{ timestamps: true }
);

const UserModel = mongoose.model('Users', UserSchema);

export default UserModel;

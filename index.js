import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import multer from 'multer';
import path from 'path';
import { fileURLToPath } from 'url';
import cors from 'cors';

import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import postRoute from './routes/postRoute.js';
import conversationRoute from './routes/conversationRoute.js';
import messageRoute from './routes/messageRoute.js';

dotenv.config();
const app = express();
app.use(cors());

mongoose.set('strictQuery', true);

mongoose.connect(process.env.MONGO_URI, () =>
	console.log('\x1b[33m', 'MongoDB connected successfully')
);

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: 'cross-origin' }));
app.use(morgan('common'));

// To serve images to public
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// app.use(express.static('public'));
app.use('/images', express.static(path.join(__dirname, 'public/images')));

const storage = multer.diskStorage({
	destination: (req, file, cb) => {
		cb(null, 'public/images/Post');
	},
	filename: (req, file, cb) => {
		cb(null, req.body.name);
	}
});

const upload = multer({ storage: storage });
app.post('/api/upload', upload.single('file'), (req, res) => {
	try {
		return res.status(200).json('File uploaded successfully');
	} catch (error) {
		console.log(error);
	}
});

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);
app.use('/api/conversations', conversationRoute);
app.use('/api/messages', messageRoute);

app.listen(process.env.EXPRESS_PORT, () =>
	console.log('\x1b[33m', `Server running on port ${process.env.EXPRESS_PORT}`)
);

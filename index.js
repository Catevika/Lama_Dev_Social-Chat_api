import express from 'express';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';

import userRoute from './routes/userRoute.js';
import authRoute from './routes/authRoute.js';
import postRoute from './routes/postRoute.js';

dotenv.config();
const app = express();
app.use(cors());

mongoose.connect(process.env.MONGO_URI, () =>
	console.log('\x1b[33m', 'MongoDB connected successfully')
);

app.use(express.json());
app.use(helmet());
app.use(morgan('common'));

// To serve images to public
app.use(express.static('public'));
app.use('/images', express.static('images'));

app.use('/api/users', userRoute);
app.use('/api/auth', authRoute);
app.use('/api/posts', postRoute);

app.listen(process.env.EXPRESS_PORT, () =>
	console.log('\x1b[33m', `Server running on port ${process.env.EXPRESS_PORT}`)
);

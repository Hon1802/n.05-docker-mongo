import dotenv from 'dotenv';
dotenv.config();
export const port = process.env.PORT || 6666;
export const mongoURL = process.env.MONGO_URI;
export const salt_rounds = process.env.SALT_ROUNDS;
export const jwt_secret = process.env.JWT_SECRET

import dotenv from 'dotenv';
const result = dotenv.config();
export const port = process.env.PORT || 6666;
export const mongoURL = process.env.MONGO_URI || "mongodb+srv://zdragonz999:nguyenli999@book.lz6e25l.mongodb.net/?retryWrites=true&w=majority";
export const salt_rounds = process.env.SALT_ROUNDS;
export const jwt_secret = process.env.JWT_SECRET

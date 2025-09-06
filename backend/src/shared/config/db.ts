import mongoose from 'mongoose';


const MONGODB_URI = 'mongodb://localhost:27017/food-delivery-app';

export const connectDB = async () => {
    try {
        await mongoose.connect(MONGODB_URI);
        console.log('MongoDB connected successfully via Mongoose!');
    } catch (error) {
        console.error('Error connecting to MongoDB:', error);
       
        process.exit(1); 
    }
};

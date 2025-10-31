const mongoose = require('mongoose');

const connectMongoDb = async () => {
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${process.env.DATABASE}`, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected successfully');
    } catch (error) {
        console.log(`MongoDB connection error : ${JSON.stringify(error)}`);
        process.exit(1); // Exit process on connection failure
    }
}


module.exports = connectMongoDb;
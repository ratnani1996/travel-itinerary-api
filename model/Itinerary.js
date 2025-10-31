const mongoose = require('mongoose');
const { randomUUID } = require('crypto');

const activitySchema = new mongoose.Schema({
    time: { type: String, required: true },
    description: { type: String, required: true },
    location: { type: String, required: true },
});

const itinerarySchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        destination: {
            type: String,
            required: true,
            index: true,
        },
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        },
        activities: [activitySchema],
        shareableId: {
            type: String,
            default: () => randomUUID(),
            unique: true,
            index: true,
        },
    },
    { timestamps: true }
);

module.exports = mongoose.model('Itinerary', itinerarySchema);
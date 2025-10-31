const Itinerary = require('../model/Itinerary');
const redisClient = require('../config/redisConnection');

const createItinerary = async (req, res) => {
    try {
        const userId = req.user.id;
        const itinerary = new Itinerary({ ...req.body, userId });
        const savedItinerary = await itinerary.save();
        res.status(201).json(savedItinerary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error creating itinerary' });
    }
};

const getItineraries = async (req, res) => {
    try {
        const userId = req.user.id;

        const { destination, page = 1, limit = 10, sort = 'createdAt' } = req.query;

        const filter = { userId };
        if (destination) filter.destination = destination;

        const itineraries = await Itinerary.find(filter)
            .sort({ [sort]: 1 })
            .skip((page - 1) * limit)
            .limit(parseInt(limit));

        const total = await Itinerary.countDocuments(filter);

        res.status(200).json({
            total,
            page: parseInt(page),
            limit: parseInt(limit),
            itineraries,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching itineraries' });
    }
};

const getItineraryById = async (req, res) => {
    try {
        const cachedData = await redisClient.get(`itinerary:${req.params.id}`);
        if (cachedData) {
            return res.status(200).json(JSON.parse(cachedData));
        }
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary)
            return res.status(404).json({ message: 'Itinerary not found' });

        // ensure the itinerary belongs to the logged-in user
        if (itinerary.userId.toString() !== req.user.id)
            return res.status(403).json({ message: 'Unauthorized' });
        await redisClient.set(`itinerary:${req.params.id}`, JSON.stringify(itinerary));
        res.status(200).json(itinerary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching itinerary' });
    }
};

const updateItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary)
            return res.status(404).json({ message: 'Itinerary not found' });

        if (itinerary.userId.toString() !== req.user.id)
            return res.status(403).json({ message: 'Unauthorized' });

        Object.assign(itinerary, req.body);
        const updated = await itinerary.save();
        await redisClient.del(`itinerary:${req.params.id}`);
        await redisClient.set(`itinerary:${req.params.id}`, JSON.stringify(itinerary));

        res.status(200).json(updated);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error updating itinerary' });
    }
};

const deleteItinerary = async (req, res) => {
    try {
        const itinerary = await Itinerary.findById(req.params.id);
        if (!itinerary)
            return res.status(404).json({ message: 'Itinerary not found' });

        if (itinerary.userId.toString() !== req.user.id)
            return res.status(403).json({ message: 'Unauthorized' });

        await itinerary.deleteOne();
        await redisClient.del(`itinerary:${req.params.id}`);

        res.status(200).json({ message: 'Itinerary deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error deleting itinerary' });
    }
};


const getItineraryByShareableId = async (req, res) => {
    try {
        const { shareableId } = req.params;
        const itinerary = await Itinerary.findOne({ shareableId });

        if (!itinerary)
            return res.status(404).json({ message: 'Itinerary not found' });

        const sanitized = itinerary.toObject();
        delete sanitized.userId;

        res.status(200).json(sanitized);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching shared itinerary' });
    }
};


module.exports = {
    deleteItinerary,
    updateItinerary,
    getItineraryById,
    getItineraries,
    createItinerary,
    getItineraryByShareableId
}
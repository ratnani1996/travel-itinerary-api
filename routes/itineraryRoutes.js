const express = require('express');
const router = express.Router();
const { verifyToken } = require('../middleware/authMiddleware');
const {
    createItinerary,
    getItineraries,
    getItineraryById,
    updateItinerary,
    deleteItinerary,
    getItineraryByShareableId
} = require('../controller/itineraryController');

/**
 * @swagger
 * tags:
 *   name: Itineraries
 *   description: API for managing travel itineraries
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     Activity:
 *       type: object
 *       required:
 *         - time
 *         - description
 *         - location
 *       properties:
 *         time:
 *           type: string
 *           description: Time of the activity
 *         description:
 *           type: string
 *           description: Description of the activity
 *         location:
 *           type: string
 *           description: Location where the activity takes place
 *
 *     Itinerary:
 *       type: object
 *       required:
 *         - title
 *         - destination
 *         - startDate
 *         - endDate
 *       properties:
 *         _id:
 *           type: string
 *           description: Auto-generated ID
 *         userId:
 *           type: string
 *           description: ID of the user who created the itinerary
 *         title:
 *           type: string
 *           description: Title of the trip
 *         destination:
 *           type: string
 *           description: Destination of the trip
 *         startDate:
 *           type: string
 *           format: date
 *           description: Trip start date
 *         endDate:
 *           type: string
 *           format: date
 *           description: Trip end date
 *         activities:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Activity'
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * /api/itineraries:
 *   post:
 *     summary: Create a new itinerary (includes auto-generated shareable link)
 *     tags: [Itineraries]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - destination
 *               - startDate
 *               - endDate
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Trip to Paris"
 *               destination:
 *                 type: string
 *                 example: "Paris"
 *               startDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-01"
 *               endDate:
 *                 type: string
 *                 format: date
 *                 example: "2025-11-05"
 *               activities:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     time:
 *                       type: string
 *                       example: "09:00 AM"
 *                     description:
 *                       type: string
 *                       example: "Visit Eiffel Tower"
 *                     location:
 *                       type: string
 *                       example: "Champ de Mars, Paris"
 *     responses:
 *       201:
 *         description: Itinerary created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Itinerary created successfully"
 *                 itinerary:
 *                   type: object
 *                   properties:
 *                     _id:
 *                       type: string
 *                       example: "671b2c7a812f4d12345d9a1f"
 *                     title:
 *                       type: string
 *                       example: "Trip to Paris"
 *                     destination:
 *                       type: string
 *                       example: "Paris"
 *                     startDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-11-01"
 *                     endDate:
 *                       type: string
 *                       format: date
 *                       example: "2025-11-05"
 *                     activities:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           time:
 *                             type: string
 *                             example: "09:00 AM"
 *                           description:
 *                             type: string
 *                             example: "Visit Eiffel Tower"
 *                           location:
 *                             type: string
 *                             example: "Champ de Mars, Paris"
 *                     shareableId:
 *                       type: string
 *                       example: "b3c2b7e8-2a8b-4d3a-9823-bb04f75db5b2"
 *       401:
 *         description: Unauthorized - Missing or invalid token
 *       500:
 *         description: Server error
 */

router.post('/', verifyToken, createItinerary);

/**
 * @swagger
 * /api/itineraries:
 *   get:
 *     summary: Get all itineraries (filter, sort, paginate)
 *     tags: [Itineraries]
 *     parameters:
 *       - in: query
 *         name: destination
 *         schema: { type: string }
 *         description: Filter by destination
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 *       - in: query
 *         name: sort
 *         schema: { type: string }
 *         description: Sort by field (createdAt, startDate, title)
 *     responses:
 *       200:
 *         description: List of itineraries
 */
router.get('/', verifyToken, getItineraries);


/**
 * @swagger
 * /api/itineraries/{id}:
 *   get:
 *     summary: Get a specific itinerary by ID
 *     tags: [Itineraries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The itinerary ID
 *     responses:
 *       200:
 *         description: Itinerary details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Itinerary'
 *       404:
 *         description: Itinerary not found
 */
router.get('/:id', verifyToken, getItineraryById);

/**
 * @swagger
 * /api/itineraries/{id}:
 *   put:
 *     summary: Update an existing itinerary
 *     tags: [Itineraries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The itinerary ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Itinerary'
 *     responses:
 *       200:
 *         description: Itinerary updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Itinerary'
 *       404:
 *         description: Itinerary not found
 */
router.put('/:id', verifyToken, updateItinerary);

/**
 * @swagger
 * /api/itineraries/{id}:
 *   delete:
 *     summary: Delete an itinerary
 *     tags: [Itineraries]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: The itinerary ID
 *     responses:
 *       200:
 *         description: Itinerary deleted successfully
 *       404:
 *         description: Itinerary not found
 */
router.delete('/:id', verifyToken, deleteItinerary);


/**
 * @swagger
 * /api/itineraries/share/{shareableId}:
 *   get:
 *     summary: Get public itinerary by shareable ID (no authentication required)
 *     tags: [Itineraries]
 *     parameters:
 *       - in: path
 *         name: shareableId
 *         required: true
 *         schema:
 *           type: string
 *         description: Unique shareable ID of the itinerary
 *     responses:
 *       200:
 *         description: Itinerary data (excluding sensitive info)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Itinerary'
 *       404:
 *         description: Itinerary not found
 */
router.get('/share/:shareableId', getItineraryByShareableId);

module.exports = router;

const express = require('express');
const app = express();
const dotenv = require('dotenv');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swaggerConfiguration'); // Import the config
const connectMongoDb = require('./config/mongoDbConnection');
dotenv.config();

const {
    PORT
} = process.env;
app.use(express.json());
connectMongoDb();

app.use('/api/auth', require('./routes/authenticationRoute'));
app.use('/api/itineraries', require('./routes/itineraryRoutes'));

app.get('/', (req, res) => {
    res.send('Hello World! Swagger is running at /api-docs 🚀');
});

//swagger setup
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));



app.listen(PORT, () => {
    console.log(`Running on port ${PORT}`);
})
const express = require('express');
const config = require('./config/config');
const apiDataRoutes = require('./routes/apiData.routes');
const cors = require('cors');     // tO handle Cross Origin Resource Sharing problems.
const mongoose = require('mongoose');
const apiData = require('./models/apiData.model')

const app = express();

// json middleware
app.use(express.json());
// enable cors
app.use(cors());   // install cors
app.options('*', cors());    // responds to **** preflight requests (from any origin) **** with appropriate cors headers
app.use('/', apiDataRoutes);

let server;
mongoose.connect(config.mongoose.mongo_url, config.mongoose.options)
    .then(() => {
        server = app.listen(config.port, async () => {
            console.log(`Server Running at PORT ${config.port}`);
            await seedDatabase();
        });
    })
    .catch((e) => {
        console.log("Server " + e);
        process.exit(1);
    });



async function seedDatabase() {
    try {
        const apiSeedData = await fetch(config.apiSeedData);
        if (!apiSeedData.ok) {
            console.error(`Unable to get seed data! Error: ` + apiSeedData.status);
        }

        const data = await apiSeedData.json();

        const newData = await Promise.all(data.map(async (item) => {
            const doc = item.dateOfSale.split('-');
            item.month = parseInt(doc[1]);
            return item;
        }));

        const existingDataCount = await apiData.countDocuments();

        if (existingDataCount === 0) {
            await apiData.insertMany(newData);
            console.log('Database initialized with seed data.');
        } else {
            console.log('Data already exists. Initialization skipped.');
        }
    } catch (error) {
        console.error('Error initializing the database:', error);
    }
}
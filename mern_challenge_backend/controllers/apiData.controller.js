const config = require('../config/config');
const apiData = require('../models/apiData.model');

// function to get API data with paginAtion based on months
exports.getAPIData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const monthsRes = parseInt(req.query.month) || 3;

        const apiDataBatch = await apiData.find({ month: monthsRes })
            .skip(skip)
            .limit(limit);

        const totalRecords = await apiData.countDocuments({ month: monthsRes });
        const totalPages = Math.ceil(totalRecords / limit);

        res.status(200).json({
            data: apiDataBatch,
            page,
            totalPages,
            totalRecords,
            hasNextPage: page < totalPages,
            hasPrevPage: page > 1
        });
    } catch (error) {
        res.status(500).json({ error: "Server Error! Data Not Found!" });
    }
};

exports.apiDataAll = async (req, res) => {
    try{
        const monthsRes = parseInt(req.query.month) || 2;

        const apiDataBatch = await apiData.find({ month: monthsRes })
        res.status(200).json({ data: apiDataBatch });
    }
    catch (error) {
        res.status(500).json({ error: "Server Error! Data Not Found!" });
    }
}

exports.apiSales = async (req, res) => {
    try {
        const month = req.query.month;

        if (!month) {
            return res.status(400).json({ error: "Month is required." });
        }

        console.log(month);
        
        const products = await apiData.find({ month: parseInt(month) });

        if (!products || products.length === 0) {
            return res.status(404).json({ message: "No data available for the selected month." });
        }

        let totalSaleAmount = 0;
        let totalSoldItems = 0;
        let totalNotSoldItems = 0;

        products.forEach(product => {
            if (product.sold) {
                totalSaleAmount += product.price;
                totalSoldItems += 1;
            } else {
                totalNotSoldItems += 1;
            }
        });

        res.status(200).json({
            totalSaleAmount,
            totalSoldItems,
            totalNotSoldItems,
        });

    } catch (error) {
        console.error("Error calculating sales statistics:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// in case we want to start seeding from external point
exports.initializeSeedData = async (req, res) => {
    try {
        const apiSeedData = await fetch(config.apiSeedData);
        if (!apiSeedData.ok) {
            console.error(`Unable to get seed data! Error: ` + apiSeedData.status);
            return res.status(500).json({ error: 'Failed to fetch seed data.' });
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
            res.status(200).json({ message: 'Database initialized with seed data.' });
        } else {
            res.status(200).json({ message: 'Data already exists. Initialization skipped.' });
        }
    } catch (error) {
        console.error('Error initializing the database:', error);
        res.status(500).json({ error: 'Server Error! Failed to initialize the database.' });
    }
};

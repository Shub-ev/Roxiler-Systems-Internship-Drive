const config = require('../config/config');
const apiData = require('../models/apiData.model');

// *******  01  *******
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


// *******  02  *******
// function to get API data with paginAtion based on months
exports.getAPIData = async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        const searchString = req.query.search || '';

        const filter = {};

        if (searchString) {
            const isNumeric = !isNaN(parseFloat(searchString));

            if (isNumeric) {
                const searchPrice = parseFloat(searchString);
                filter.price = { $gte: searchPrice - 10, $lte: searchPrice + 10 };
            } else {
                filter.$or = [
                    { title: { $regex: searchString, $options: 'i' } },
                    { description: { $regex: searchString, $options: 'i' } }
                ];
            }
        }

        const apiDataBatch = await apiData.find(filter)
            .sort({ _id: 1 })
            .skip(skip)
            .limit(limit);

        const totalRecords = await apiData.countDocuments(filter);
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

// *******  03  *******
// gives the sales data i.e. total amount, sold items, unsold items
exports.apiSales = async (req, res) => {
    try {
        const monthNo = parseInt(req.query.month) || 3; 

        if (isNaN(monthNo) || monthNo < 1 || monthNo > 12) {
            return res.status(400).json({ error: "Valid month (1-12) is required." });
        }

        const products = await apiData.find({ month: monthNo });
        
        // console.log("All products for month:", monthNo, products);

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


// *******  04  *******
// gives bar chart data
exports.apiBarChart = async (req, res) => {
    try {
        const monthNo = parseInt(req.query.month);

        if (isNaN(monthNo) || monthNo < 1 || monthNo > 12) {
            return res.status(400).json({ error: "Valid month (1-12) is required." });
        }

        const products = await apiData.find({ month: monthNo });
        // console.log("All products for month:", monthNo, products);

        const priceRanges = {
            "0-100": 0,
            "101-200": 0,
            "201-300": 0,
            "301-400": 0,
            "401-500": 0,
            "501-600": 0,
            "601-700": 0,
            "701-800": 0,
            "801-900": 0,
            "901-above": 0
        };

        products.forEach(product => {
            const price = product.price;
            if (price >= 0 && price <= 100) {
                priceRanges["0-100"] += 1;
            } else if (price >= 101 && price <= 200) {
                priceRanges["101-200"] += 1;
            } else if (price >= 201 && price <= 300) {
                priceRanges["201-300"] += 1;
            } else if (price >= 301 && price <= 400) {
                priceRanges["301-400"] += 1;
            } else if (price >= 401 && price <= 500) {
                priceRanges["401-500"] += 1;
            } else if (price >= 501 && price <= 600) {
                priceRanges["501-600"] += 1;
            } else if (price >= 601 && price <= 700) {
                priceRanges["601-700"] += 1;
            } else if (price >= 701 && price <= 800) {
                priceRanges["701-800"] += 1;
            } else if (price >= 801 && price <= 900) {
                priceRanges["801-900"] += 1;
            } else if (price >= 901) {
                priceRanges["901-above"] += 1;
            }
        });

        res.status(200).json(priceRanges);

    } catch (error) {
        console.error("Error generating bar chart data:", error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// *******  05  *******
// gives pie chart data
exports.apiPieChart = async (req, res) => {
    try {
        const month = parseInt(req.query.month) || 3;

        if (isNaN(month) || month < 1 || month > 12) {
            return res.status(400).json({ error: "Invalid month provided" });
        }
        const result = await apiData.aggregate([
            {
                $group: {
                    _id: "$category",
                    count: { $sum: 1 },
                },
            },
        ]);

        const totalCount = result.reduce((acc, item) => acc + item.count, 0);

        const categoriesWithPercentage = result.map(item => ({
            category: item._id,
            percentage: totalCount > 0 ? ((item.count / totalCount) * 100).toFixed(2) : 0 // Calculate percentage
        }));
        res.status(200).json({ categories: categoriesWithPercentage });
    } catch (error) {
        console.error('Error fetching pie chart data:', error);
        res.status(500).json({ error: "Internal server error" });
    }
};

// *******  06  *******
// single api to get all
exports.getAllData = async (req, res) => {
    try {
        const apiData = await apiDataController.getAPIData(req, res);
        const seedData = await apiDataController.initializeSeedData(req, res);
        const searchData = await apiDataController.apiDataAll(req, res);
        const salesData = await apiDataController.apiSales(req, res);
        const barChartData = await apiDataController.apiBarChart(req, res);
        const pieChartData = await apiDataController.apiPieChart(req, res);

        res.json({
            apiData,
            seedData,
            searchData,
            salesData,
            barChartData,
            pieChartData,
        });
    } catch (error) {
        console.error("Error fetching data:", error);
        res.status(500).json({ error: "Failed to fetch all data" });
    }
},

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

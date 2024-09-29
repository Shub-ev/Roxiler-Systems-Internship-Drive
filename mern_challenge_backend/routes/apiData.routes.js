const express = require('express');
const apiDataController = require('../controllers/apiData.controller');


// here i define the end points and the services at those endpoint


const router = express.Router();

router
    .route('/apiData')
    .get(apiDataController.getAPIData)

router
    .route('/initializeSeed')
    .get(apiDataController.initializeSeedData)

router
    .route('/getSearchData')
    .get(apiDataController.apiDataAll)

router
    .route('/apiSales')
    .get(apiDataController.apiSales)

module.exports = router;
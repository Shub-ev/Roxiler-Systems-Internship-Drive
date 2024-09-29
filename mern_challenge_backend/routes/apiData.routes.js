const express = require('express');
const apiDataController = require('../controllers/apiData.controller');


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

router
    .route('/apiBarChart')
    .get(apiDataController.apiBarChart)

router
    .route('/apiPieChart')
    .get(apiDataController.apiPieChart)

router
    .route('/getAllData')
    .get(apiDataController.getAllData)

module.exports = router;
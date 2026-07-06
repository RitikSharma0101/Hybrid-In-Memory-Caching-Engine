// requirements
const express = require('express');
const router = express.Router();

// Importing controller and middleware components
const dataController = require('../controllers/DataController');
const validateInput = require('../middleware/Validate');

// Route 1: Data Setup (Form Submission)
// Path: POST /api/set
// Here, the 'validateInput' middleware will first sanitize the data
// The 'setData' controller will run only if it passes
router.post("/set",dataController.setData);

// Route 2: Live Cache Dashboard List (Live RAM Table)
// Path: GET /api/keys
// On this route, the frontend will fetch the live list by polling every second
router.get('/keys',dataController.getActiveKeys);

// Route 3: Cache Hit/Miss Search Bar (Search Bar)
// Path: GET /api/search/:id
// Here :id is a dynamic parameter. As soon as the search button is pressed, the middleware will first check
// the ID is just a number or not ,then the 'searchData' logic will be triggered
router.get('/search/:id',validateInput,dataController.searchData);

// Exporting the router for use in the app
module.exports = router;
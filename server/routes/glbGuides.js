const express = require('express');
const router = express.Router();
const glbGuideController = require('../controllers/glbGuideController');

// Get all countries (basic info only)
router.get('/countries', glbGuideController.getAllCountries);

// Get details for a specific country
router.get('/country/:countryCode', glbGuideController.getCountryDetails);

// Add a new country (requires password)
router.post('/country', glbGuideController.addCountry);

// Add content to a specific country and section
router.post('/content', glbGuideController.addContent);

// Delete content from a country
router.delete('/content', glbGuideController.deleteContent);

// Update content for a country
router.put('/content', glbGuideController.updateContent);

module.exports = router;
const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/auth');
const loveDiaryController = require('../controllers/loveDiaryController');

// Configure multer for memory storage
const upload = multer({ 
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  }
});

// Get all entries
router.get('/', auth, loveDiaryController.getAllEntries);

// Create new entry
router.post('/', auth, upload.single('image'), loveDiaryController.createEntry);

// Update entry
router.put('/:id', auth, upload.single('image'), loveDiaryController.updateEntry);

// Delete entry
router.delete('/:id', auth, loveDiaryController.deleteEntry);

module.exports = router;
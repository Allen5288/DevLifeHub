const LoveDiary = require('../models/LoveDiary');
const sharp = require('sharp');

// Get all entries with pagination support
exports.getAllEntries = async (req, res) => {
  try {
    const entries = await LoveDiary.find({ userId: req.user._id })
      .sort({ date: -1 });
    res.json(entries);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Create new entry with optimized image compression
exports.createEntry = async (req, res) => {
  try {
    const { title, summary, date, type } = req.body;
    let imageUrl = null;

    if (req.file) {
      try {
        // Enhanced image compression
        const compressedImage = await sharp(req.file.buffer)
          .resize(800, 800, { // max dimensions
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({ 
            quality: 70,
            progressive: true,
            chromaSubsampling: '4:2:0'
          })
          .toBuffer();

        imageUrl = `data:image/jpeg;base64,${compressedImage.toString('base64')}`;
      } catch (imgError) {
        console.error('Image processing error:', imgError);
        return res.status(400).json({ message: 'Error processing image' });
      }
    }

    const entry = new LoveDiary({
      title,
      summary,
      date: date || new Date(),
      image: imageUrl,
      userId: req.user._id,
      type: type || 'regular',
    });

    const savedEntry = await entry.save();
    res.status(201).json(savedEntry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Update entry with image handling
exports.updateEntry = async (req, res) => {
  try {
    const { title, summary, date, type } = req.body;
    const updateData = { title, summary, date, type };

    if (req.file) {
      try {
        const compressedImage = await sharp(req.file.buffer)
          .resize(800, 800, {
            fit: 'inside',
            withoutEnlargement: true
          })
          .jpeg({
            quality: 70,
            progressive: true,
            chromaSubsampling: '4:2:0'
          })
          .toBuffer();

        updateData.image = `data:image/jpeg;base64,${compressedImage.toString('base64')}`;
      } catch (imgError) {
        console.error('Image processing error:', imgError);
        return res.status(400).json({ message: 'Error processing image' });
      }
    }

    const entry = await LoveDiary.findOneAndUpdate(
      { _id: req.params.id, userId: req.user._id },
      updateData,
      { new: true }
    );

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json(entry);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete entry
exports.deleteEntry = async (req, res) => {
  try {
    const entry = await LoveDiary.findOneAndDelete({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!entry) {
      return res.status(404).json({ message: 'Entry not found' });
    }

    res.json({ message: 'Entry deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
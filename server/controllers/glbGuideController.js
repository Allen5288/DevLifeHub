const GlbGuide = require('../models/GlbGuide');
require('dotenv').config();

// Check if password is valid
const isPasswordValid = (password) => {
  return password === process.env.GLB_GUIDES_PASSWORD || password === process.env.REACT_APP_GLBGUIDE_PASSWORDS;
};

// Get all countries
const getAllCountries = async (req, res) => {
  try {
    const countries = await GlbGuide.find({}, 'country countryCode');
    res.status(200).json(countries);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch countries', error: error.message });
  }
};

// Get country details
const getCountryDetails = async (req, res) => {
  try {
    const { countryCode } = req.params;
    const country = await GlbGuide.findOne({ countryCode });

    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    res.status(200).json(country);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch country details', error: error.message });
  }
};

// Add new country (requires password)
const addCountry = async (req, res) => {
  try {
    const { country, countryCode, password } = req.body;

    if (!isPasswordValid(password)) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    // Check if country already exists
    const existingCountry = await GlbGuide.findOne({ countryCode });
    if (existingCountry) {
      return res.status(409).json({ message: 'Country already exists' });
    }

    const newCountry = new GlbGuide({
      country,
      countryCode,
      bigEvents: [],
      localGuides: []
    });

    await newCountry.save();
    res.status(201).json({ message: 'Country added successfully', country: newCountry });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add country', error: error.message });
  }
};

// Add content to big events or local guides (requires password)
const addContent = async (req, res) => {
  try {
    const { countryCode, section, title, contentType, content, password } = req.body;

    if (!isPasswordValid(password)) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    if (!['bigEvents', 'localGuides'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section. Must be either "bigEvents" or "localGuides"' });
    }

    if (!['markdown', 'link'].includes(contentType)) {
      return res.status(400).json({ message: 'Invalid content type. Must be either "markdown" or "link"' });
    }

    const country = await GlbGuide.findOne({ countryCode });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    const newContent = {
      title,
      contentType,
      content,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    country[section].push(newContent);
    country.updatedAt = new Date();
    await country.save();

    res.status(201).json({ message: 'Content added successfully', content: newContent });
  } catch (error) {
    res.status(500).json({ message: 'Failed to add content', error: error.message });
  }
};

// Delete content from big events or local guides (requires password)
const deleteContent = async (req, res) => {
  try {
    const { countryCode, section, contentId, password } = req.body;

    if (!isPasswordValid(password)) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    if (!['bigEvents', 'localGuides'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section. Must be either "bigEvents" or "localGuides"' });
    }

    const country = await GlbGuide.findOne({ countryCode });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    const contentIndex = country[section].findIndex(item => item._id.toString() === contentId);
    if (contentIndex === -1) {
      return res.status(404).json({ message: 'Content not found' });
    }

    country[section].splice(contentIndex, 1);
    country.updatedAt = new Date();
    await country.save();

    res.status(200).json({ message: 'Content deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete content', error: error.message });
  }
};

// Update content in big events or local guides (requires password)
const updateContent = async (req, res) => {
  try {
    const { countryCode, section, contentId, title, content, password } = req.body;

    if (!isPasswordValid(password)) {
      return res.status(403).json({ message: 'Invalid password' });
    }

    if (!['bigEvents', 'localGuides'].includes(section)) {
      return res.status(400).json({ message: 'Invalid section. Must be either "bigEvents" or "localGuides"' });
    }

    const country = await GlbGuide.findOne({ countryCode });
    if (!country) {
      return res.status(404).json({ message: 'Country not found' });
    }

    const contentItem = country[section].id(contentId);
    if (!contentItem) {
      return res.status(404).json({ message: 'Content not found' });
    }

    contentItem.title = title || contentItem.title;
    contentItem.content = content || contentItem.content;
    contentItem.updatedAt = new Date();
    country.updatedAt = new Date();
    
    await country.save();

    res.status(200).json({ message: 'Content updated successfully', content: contentItem });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update content', error: error.message });
  }
};

module.exports = {
  getAllCountries,
  getCountryDetails,
  addCountry,
  addContent,
  deleteContent,
  updateContent
};
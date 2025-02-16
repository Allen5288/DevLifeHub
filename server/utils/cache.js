const NodeCache = require('node-cache');

// Create a cache instance with a default TTL of 5 minutes
const cache = new NodeCache({ stdTTL: 300 });

module.exports = cache;

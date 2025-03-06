import axios from 'axios';

/**
 * Makes an API request with automatic retry logic for rate limiting (429 status)
 * 
 * @param {Function} requestFn - Function that returns a promise for the API call
 * @param {Object} options - Configuration options
 * @param {number} [options.maxRetries=3] - Maximum number of retry attempts
 * @param {number} [options.initialDelay=1000] - Initial delay in milliseconds before first retry
 * @param {Function} [options.onRetry] - Called on each retry with retry count and delay
 * @returns {Promise} - The result of the API call
 */
export const withRateLimitRetry = async (requestFn, options = {}) => {
  const { 
    maxRetries = 3, 
    initialDelay = 1000,
    onRetry = null
  } = options;
  
  let retries = 0;
  let delay = initialDelay;
  
  while (retries <= maxRetries) {
    try {
      return await requestFn();
    } catch (error) {
      if (error.response && error.response.status === 429 && retries < maxRetries) {
        // Get retry-after header if available
        const retryAfter = error.response.headers['retry-after'];
        const retryDelay = retryAfter ? parseInt(retryAfter) * 1000 : delay;
        
        retries++;
        
        if (onRetry) {
          onRetry(retries, retryDelay);
        }
        
        // Wait for the specified delay
        await new Promise(resolve => setTimeout(resolve, retryDelay));
        
        // Exponential backoff with jitter for next retry if needed
        const jitter = Math.random() * 0.3 + 0.85; // Random factor between 0.85-1.15
        delay = delay * 2 * jitter;
      } else {
        throw error;
      }
    }
  }
};

/**
 * Creates an axios instance with interceptors for handling common API responses
 * including rate limiting
 */
export const createApiClient = () => {
  const client = axios.create();
  
  // Response interceptor
  client.interceptors.response.use(
    response => response,
    error => {
      // You can add global error handling here
      if (error.response) {
        // Handle specific status codes
        if (error.response.status === 429) {
          console.warn('Rate limit hit');
        } else if (error.response.status === 401) {
          console.warn('Unauthorized request');
        }
      }
      
      return Promise.reject(error);
    }
  );
  
  return client;
};

export default {
  withRateLimitRetry,
  createApiClient
};

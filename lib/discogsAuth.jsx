/* 
 * Discogs authentication implementation.
 * This module handles direct interaction with Discogs API using OAuth 1.0a.
 */

import axios from 'axios';
import crypto from 'crypto';

// Discogs API endpoints
const DISCOGS_REQUEST_TOKEN_URL = 'https://api.discogs.com/oauth/request_token';
const DISCOGS_AUTHORIZE_URL = 'https://www.discogs.com/oauth/authorize';
const DISCOGS_ACCESS_TOKEN_URL = 'https://api.discogs.com/oauth/access_token';
const DISCOGS_API_BASE_URL = 'https://api.discogs.com';

// Generate a random nonce for OAuth 1.0a
const generateNonce = (length = 32) => {
  return crypto.randomBytes(length).toString('hex');
};

// Generate OAuth 1.0a signature
const generateOAuthSignature = (method, url, params, consumerSecret, tokenSecret = '') => {
  // Sort parameters alphabetically
  const sortedParams = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');
  
  // Create signature base string
  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(sortedParams)}`;
  
  // Create signing key
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  
  // Generate HMAC-SHA1 signature
  const signature = crypto
    .createHmac('sha1', signingKey)
    .update(baseString)
    .digest('base64');
  
  return signature;
};

// Get request token for initiating authentication
export const getRequestToken = async (callbackUrl) => {
  const consumerKey = process.env.NEXT_PUBLIC_DISC_ID || process.env.DISCOGS_CONSUMER_KEY;
  const consumerSecret = process.env.NEXT_PUBLIC_DISC_SECRET || process.env.DISCOGS_CONSUMER_SECRET;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateNonce();
  
  const params = {
    oauth_consumer_key: consumerKey,
    oauth_nonce: nonce,
    oauth_timestamp: timestamp,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_callback: callbackUrl,
    oauth_version: '1.0',
  };
  
  const signature = generateOAuthSignature('POST', DISCOGS_REQUEST_TOKEN_URL, params, consumerSecret);
  params.oauth_signature = signature;
  
  try {
    const response = await axios.post(
      DISCOGS_REQUEST_TOKEN_URL,
      new URLSearchParams(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    const responseData = new URLSearchParams(response.data);
    return {
      requestToken: responseData.get('oauth_token'),
      requestTokenSecret: responseData.get('oauth_token_secret'),
      authorizeUrl: `${DISCOGS_AUTHORIZE_URL}?oauth_token=${responseData.get('oauth_token')}`,
    };
  } catch (error) {
    console.error('Error getting Discogs request token:', error);
    throw error;
  }
};

// Get login URL for Discogs authorization along with request token details
export const getLoginUrl = async (callbackUrl) => {
  try {
    const { authorizeUrl, requestToken, requestTokenSecret } = await getRequestToken(callbackUrl);
    return { authorizeUrl, requestToken, requestTokenSecret };
  } catch (error) {
    console.error('Error generating Discogs login URL:', error);
    throw error;
  }
};

// Exchange request token for access token
export const getAccessToken = async (requestToken, requestTokenSecret, verifier) => {
  const consumerKey = process.env.NEXT_PUBLIC_DISC_ID || process.env.DISCOGS_CONSUMER_KEY;
  const consumerSecret = process.env.NEXT_PUBLIC_DISC_SECRET || process.env.DISCOGS_CONSUMER_SECRET;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateNonce();
  
  const params = {
    oauth_consumer_key: consumerKey,
    oauth_token: requestToken,
    oauth_nonce: nonce,
    oauth_timestamp: timestamp,
    oauth_verifier: verifier,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
  };
  
  const signature = generateOAuthSignature('POST', DISCOGS_ACCESS_TOKEN_URL, params, consumerSecret, requestTokenSecret);
  params.oauth_signature = signature;
  
  try {
    const response = await axios.post(
      DISCOGS_ACCESS_TOKEN_URL,
      new URLSearchParams(params),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    
    const responseData = new URLSearchParams(response.data);
    return {
      accessToken: responseData.get('oauth_token'),
      accessTokenSecret: responseData.get('oauth_token_secret'),
    };
  } catch (error) {
    console.error('Error exchanging request token for access token:', error);
    throw error;
  }
};

// Check if the stored Discogs tokens are valid by making an API call
export const checkAuthStatus = async () => {
  if (typeof window === 'undefined') {
    // This function should only run on the client side
    return false;
  }
  
  const tokensStr = localStorage.getItem('discogs_tokens');
  if (!tokensStr) {
    return false;
  }
  
  try {
    const tokens = JSON.parse(tokensStr);
    if (!tokens.accessToken || !tokens.accessTokenSecret) {
      return false;
    }
    
    // Attempt to fetch user identity as a simple auth check
    const response = await makeDiscogsRequest('oauth/identity', tokens.accessToken, tokens.accessTokenSecret);
    return !!response.username; // If we get a username, tokens are valid
  } catch (error) {
    console.error('Error checking Discogs auth status:', error);
    // If it's an auth error (401 or similar), tokens are invalid
    if (error.response && error.response.status === 401) {
      localStorage.removeItem('discogs_tokens');
      return false;
    }
    // For other errors (network, etc.), don't clear tokens, assume still logged in
    return true;
  }
};

// Make a request to Discogs API with the access token
export const makeDiscogsRequest = async (endpoint, accessToken, accessTokenSecret, method = 'GET', data = null) => {
  const consumerKey = process.env.NEXT_PUBLIC_DISC_ID;
  const consumerSecret = process.env.NEXT_PUBLIC_DISC_SECRET;
  const timestamp = Math.floor(Date.now() / 1000).toString();
  const nonce = generateNonce();
  
  const params = {
    oauth_consumer_key: consumerKey,
    oauth_token: accessToken,
    oauth_nonce: nonce,
    oauth_timestamp: timestamp,
    oauth_signature_method: 'HMAC-SHA1',
    oauth_version: '1.0',
  };
  
  const url = `${DISCOGS_API_BASE_URL}/${endpoint}`;
  const signature = generateOAuthSignature(method, url, params, consumerSecret, accessTokenSecret);
  params.oauth_signature = signature;
  
  const authHeader = `OAuth ${Object.entries(params)
    .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
    .join(', ')}`;
  
  try {
    const config = {
      method,
      url,
      headers: {
        'Authorization': authHeader,
        'Content-Type': 'application/json',
      },
    };
    if (data) {
      config.data = data;
    }
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error making Discogs API request to ${endpoint}:`, error);
    throw error;
  }
};

// Get user information from Discogs
export const getUserInfo = async (accessToken, accessTokenSecret) => {
  try {
    const userInfo = await makeDiscogsRequest('oauth/identity', accessToken, accessTokenSecret);
    return userInfo;
  } catch (error) {
    console.error('Error getting user info from Discogs:', error);
    throw error;
  }
};

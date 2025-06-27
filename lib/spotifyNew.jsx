/* 
 * New Spotify integration implementation.
 * This module handles direct interaction with Spotify API using OAuth 2.0.
 */

import axios from 'axios';

// Spotify API endpoints
const SPOTIFY_AUTH_URL = 'https://accounts.spotify.com/authorize';
const SPOTIFY_TOKEN_URL = 'https://accounts.spotify.com/api/token';
const SPOTIFY_API_BASE_URL = 'https://api.spotify.com/v1';

// Scopes for Spotify API access
const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-top-read',
  'user-follow-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'streaming'
].join(' ');

// Generate the login URL for Spotify authorization
export const getLoginUrl = (redirectUri) => {
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
    scope: scopes,
    redirect_uri: redirectUri,
  });
  return `${SPOTIFY_AUTH_URL}?${params.toString()}`;
};

// Exchange authorization code for access and refresh tokens
export const getTokens = async (code, redirectUri, codeVerifier) => {
  try {
    const params = new URLSearchParams({
      grant_type: 'authorization_code',
      code: code,
      redirect_uri: redirectUri,
      client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
      client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
    });
    if (codeVerifier) {
      params.append('code_verifier', codeVerifier);
    }
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      params,
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error exchanging code for tokens:', error);
    throw error;
  }
};

// Refresh access token using refresh token
export const refreshToken = async (refreshToken) => {
  try {
    const response = await axios.post(
      SPOTIFY_TOKEN_URL,
      new URLSearchParams({
        grant_type: 'refresh_token',
        refresh_token: refreshToken,
        client_id: process.env.NEXT_PUBLIC_CLIENT_ID,
        client_secret: process.env.NEXT_PUBLIC_CLIENT_SECRET,
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

// Make a request to Spotify API with the access token
export const makeSpotifyRequest = async (endpoint, accessToken, method = 'GET', data = null) => {
  try {
    const url = `${SPOTIFY_API_BASE_URL}/${endpoint}`;
    const config = {
      method,
      url,
      headers: {
        'Authorization': `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
    };
    if (data) {
      config.data = data;
    }
    const response = await axios(config);
    return response.data;
  } catch (error) {
    console.error(`Error making Spotify API request to ${endpoint}:`, error);
    throw error;
  }
};

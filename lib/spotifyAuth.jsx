/**
 * Utility functions for Spotify authentication using PKCE (Proof Key for Code Exchange)
 */

/**
 * Redirects the user to Spotify's authorization endpoint with PKCE parameters
 * @param {string} clientId - Spotify Client ID
 */
export const redirectToAuthCodeFlow = async (clientId) => {
  const verifier = generateCodeVerifier(128);
  const challenge = await generateCodeChallenge(verifier);

  // Include the verifier in the state parameter to pass it through the callback URL
  const state = verifier;

  const params = new URLSearchParams();
  params.append("client_id", clientId);
  params.append("response_type", "code");
  params.append("redirect_uri", "http://127.0.0.1:3002/callback");
  params.append("scope", "user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read user-follow-read user-read-playback-state user-modify-playback-state streaming");
  params.append("code_challenge_method", "S256");
  params.append("code_challenge", challenge);
  params.append("state", state);

  document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
};

/**
 * Generates a random string to be used as a code verifier for PKCE
 * @param {number} length - Length of the random string
 * @returns {string} - Random string
 */
export const generateCodeVerifier = (length) => {
  let text = '';
  let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
};

/**
 * Generates a code challenge from the code verifier using SHA-256
 * @param {string} codeVerifier - The code verifier string
 * @returns {Promise<string>} - Base64 URL-encoded SHA-256 hash of the verifier
 */
export const generateCodeChallenge = async (codeVerifier) => {
  const data = new TextEncoder().encode(codeVerifier);
  const digest = await window.crypto.subtle.digest('SHA-256', data);
  return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '');
};

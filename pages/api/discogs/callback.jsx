import { getAccessToken } from '../../../lib/discogsAuth';
import { getRequestTokenSecret, clearRequestTokenSecret } from './tokenStore';

export default async function handler(req, res) {
  const { oauth_token, oauth_verifier } = req.query;

  if (!oauth_token || !oauth_verifier) {
    return res.status(400).json({ error: 'Missing required parameters (oauth_token or oauth_verifier)' });
  }

  // Retrieve the request token secret from the server-side token store
  const requestTokenSecret = getRequestTokenSecret(oauth_token);
  if (!requestTokenSecret) {
    console.warn('Request token secret not found in token store, token exchange will fail');
    return res.status(400).json({ error: 'Missing request token secret, required for token exchange. It may have expired or not been set.' });
  }

  try {
    const tokens = await getAccessToken(oauth_token, requestTokenSecret, oauth_verifier);
    // Clear the token secret from store after successful token exchange
    clearRequestTokenSecret(oauth_token);
    // Redirect to client-side callback page with tokens as query parameters
    const redirectUrl = `/discogsCallback?access_token=${encodeURIComponent(tokens.accessToken)}&access_token_secret=${encodeURIComponent(tokens.accessTokenSecret)}`;
    res.writeHead(302, { Location: redirectUrl });
    res.end();
  } catch (error) {
    console.error('Error in Discogs callback:', error);
    return res.status(500).json({ 
      error: 'Failed to exchange request token for access token', 
      details: error.message || 'Unknown error during token exchange' 
    });
  }
}

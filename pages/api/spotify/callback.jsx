import { getTokens } from '../../../lib/spotifyNew';

export default async function handler(req, res) {
  const { code, code_verifier } = req.query;
  const host = req.headers.host || '127.0.0.1:3000';
  const redirectUri = `http://${host}/api/spotify/callback`;

  if (!code) {
    return res.status(400).json({ error: 'Authorization code is required' });
  }

  console.log('Received code_verifier:', code_verifier);
  if (!code_verifier) {
    console.error('Code verifier is missing in the callback request');
    return res.status(400).json({ error: 'Code verifier is required for PKCE' });
  }

  try {
    const tokens = await getTokens(code, redirectUri, code_verifier);
    // Return tokens as JSON response
    return res.status(200).json({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      expires_in: tokens.expires_in
    });
  } catch (error) {
    console.error('Error in Spotify callback:', error);
    return res.status(500).json({ error: 'Failed to exchange authorization code for tokens' });
  }
}

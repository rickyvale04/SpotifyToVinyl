import { getLoginUrl } from '../../../lib/discogsAuth';
import { storeRequestTokenSecret } from './tokenStore';

export default async function handler(req, res) {
  const redirectUri = 'http://127.0.0.1:3002/api/discogs/callback';
  
  try {
    const { authorizeUrl, requestToken, requestTokenSecret } = await getLoginUrl(redirectUri);
    // Attempt to store the requestTokenSecret in server-side token store
    const stored = storeRequestTokenSecret(requestToken, requestTokenSecret);
    if (!stored) {
      console.warn('Failed to store request token secret on server, proceeding anyway');
    }
    // Return the authorization URL and token details to the client
    res.status(200).json({
      authorizeUrl,
      requestToken,
      requestTokenSecret
    });
  } catch (error) {
    console.error('Error generating Discogs login URL:', error);
    res.status(500).json({ error: 'Failed to generate login URL', details: error.message });
  }
}

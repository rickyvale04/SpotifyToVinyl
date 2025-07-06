import { getUserInfo } from '../../../lib/discogsAuth';

export default async function handler(req, res) {
  try {
    const { access_token, access_token_secret } = req.query;
    
    if (!access_token || !access_token_secret) {
      return res.status(400).json({ error: 'Missing access token credentials' });
    }
    
    const userInfo = await getUserInfo(access_token, access_token_secret);
    res.status(200).json(userInfo);
  } catch (error) {
    console.error('Error getting Discogs user info:', error);
    res.status(500).json({ error: 'Failed to get user info', details: error.message });
  }
}

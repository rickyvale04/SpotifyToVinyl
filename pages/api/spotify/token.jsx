import getClientCredentialsToken from '../../../lib/spotifyClientCredentials';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { access_token, expires_in } = await getClientCredentialsToken();
    return res.status(200).json({ access_token, expires_in });
  } catch (error) {
    return res.status(500).json({ error: 'Failed to obtain client credentials token', details: error.message });
  }
}

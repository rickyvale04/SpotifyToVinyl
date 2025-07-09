import { createHmac } from 'crypto';

const DISCOGS_API_BASE = 'https://api.discogs.com';
const CONSUMER_KEY = process.env.NEXT_PUBLIC_DISC_ID;
const CONSUMER_SECRET = process.env.NEXT_PUBLIC_DISC_SECRET;

function generateOAuthSignature(method, url, params, consumerSecret, tokenSecret) {
  const paramString = Object.keys(params)
    .sort()
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
    .join('&');

  const baseString = `${method.toUpperCase()}&${encodeURIComponent(url)}&${encodeURIComponent(paramString)}`;
  const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(tokenSecret)}`;
  
  return createHmac('sha1', signingKey).update(baseString).digest('base64');
}

export default async function handler(req, res) {
  console.log('=== DISCOGS WANTLIST API CALLED ===');
  console.log('Method:', req.method);
  console.log('Body:', req.body);
  
  if (req.method === 'POST') {
    // Add to wantlist
    try {
      const { releaseId, tokens, username } = req.body;

      console.log('Release ID:', releaseId);
      console.log('Username:', username);
      console.log('Tokens present:', !!tokens);

      if (!releaseId || !tokens || !username) {
        return res.status(400).json({ message: 'Missing required parameters' });
      }

      if (!tokens.access_token || !tokens.access_token_secret) {
        return res.status(401).json({ message: 'Invalid authentication tokens' });
      }

      if (!CONSUMER_KEY || !CONSUMER_SECRET) {
        console.error('Missing environment variables:', { CONSUMER_KEY: !!CONSUMER_KEY, CONSUMER_SECRET: !!CONSUMER_SECRET });
        return res.status(500).json({ message: 'Server configuration error: Missing Discogs API credentials' });
      }

      const url = `${DISCOGS_API_BASE}/users/${username}/wants/${releaseId}`;
      const method = 'PUT';
      
      const oauthParams = {
        oauth_consumer_key: CONSUMER_KEY,
        oauth_token: tokens.access_token,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_nonce: Math.random().toString(36).substring(2),
        oauth_version: '1.0',
      };

      const signature = generateOAuthSignature(method, url, oauthParams, CONSUMER_SECRET, tokens.access_token_secret);
      oauthParams.oauth_signature = signature;

      const authHeader = 'OAuth ' + Object.keys(oauthParams)
        .map(key => `${key}="${encodeURIComponent(oauthParams[key])}"`)
        .join(', ');

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': authHeader,
          'Content-Type': 'application/json',
          'User-Agent': 'SpotifyToVinyl/1.0',
        },
      });

      if (response.ok) {
        const result = await response.json();
        res.status(200).json({ success: true, data: result });
      } else {
        const errorText = await response.text();
        console.error('Discogs API error:', errorText);
        res.status(response.status).json({ 
          message: `Failed to add to wantlist: ${response.status} ${response.statusText}`,
          error: errorText 
        });
      }
    } catch (error) {
      console.error('Error adding to wantlist:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else if (req.method === 'DELETE') {
    // Remove from wantlist
    try {
      const { releaseId, tokens } = req.body;

      if (!releaseId || !tokens) {
        return res.status(400).json({ message: 'Missing required parameters' });
      }

      if (!tokens.access_token || !tokens.access_token_secret || !tokens.username) {
        return res.status(401).json({ message: 'Invalid authentication tokens' });
      }

      const url = `${DISCOGS_API_BASE}/users/${tokens.username}/wants/${releaseId}`;
      const method = 'DELETE';
      
      const oauthParams = {
        oauth_consumer_key: CONSUMER_KEY,
        oauth_token: tokens.access_token,
        oauth_signature_method: 'HMAC-SHA1',
        oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
        oauth_nonce: Math.random().toString(36).substring(2),
        oauth_version: '1.0',
      };

      const signature = generateOAuthSignature(method, url, oauthParams, CONSUMER_SECRET, tokens.access_token_secret);
      oauthParams.oauth_signature = signature;

      const authHeader = 'OAuth ' + Object.keys(oauthParams)
        .map(key => `${key}="${encodeURIComponent(oauthParams[key])}"`)
        .join(', ');

      const response = await fetch(url, {
        method: method,
        headers: {
          'Authorization': authHeader,
          'User-Agent': 'SpotifyToVinyl/1.0',
        },
      });

      if (response.ok) {
        res.status(200).json({ success: true });
      } else {
        const errorText = await response.text();
        console.error('Discogs API error:', errorText);
        res.status(response.status).json({ 
          message: `Failed to remove from wantlist: ${response.status} ${response.statusText}`,
          error: errorText 
        });
      }
    } catch (error) {
      console.error('Error removing from wantlist:', error);
      res.status(500).json({ message: 'Internal server error', error: error.message });
    }
  } else {
    res.setHeader('Allow', ['POST', 'DELETE']);
    res.status(405).json({ message: 'Method not allowed' });
  }
}

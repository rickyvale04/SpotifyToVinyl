// Add/Remove item to/from Discogs wantlist
export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { releaseId, tokens, username } = req.body;
    
    console.log('=== DISCOGS WANTLIST DEBUG ===');
    console.log('Method:', req.method);
    console.log('Release ID:', releaseId);
    console.log('Username:', username);
    console.log('Tokens present:', !!tokens.access_token, !!tokens.access_token_secret);

    if (!releaseId || !tokens) {
      return res.status(400).json({ message: 'Missing releaseId or tokens' });
    }

    const { access_token, access_token_secret } = tokens;

    if (!access_token || !access_token_secret) {
      return res.status(400).json({ message: 'Invalid tokens' });
    }
    
    if (!username) {
      return res.status(400).json({ message: 'Username is required' });
    }

    // Discogs API endpoint for wantlist operations (use username, not 'me')
    const discogsUrl = `https://api.discogs.com/users/${username}/wants/${releaseId}`;
    
    console.log('Discogs URL:', discogsUrl);
    
    // --- Custom OAuth 1.0a signature logic (copied from makeDiscogsRequest) ---
    const consumerKey = process.env.NEXT_PUBLIC_DISC_ID || process.env.DISCOGS_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_DISC_SECRET || process.env.DISCOGS_CONSUMER_SECRET;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = Math.random().toString(36).substring(2, 15);
    const method = req.method === 'POST' ? 'PUT' : 'DELETE';
    const params = {
      oauth_consumer_key: consumerKey,
      oauth_token: access_token,
      oauth_nonce: nonce,
      oauth_timestamp: timestamp,
      oauth_signature_method: 'HMAC-SHA1',
      oauth_version: '1.0',
    };
    // Sort params and build base string
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`)
      .join('&');
    const baseString = `${method.toUpperCase()}&${encodeURIComponent(discogsUrl)}&${encodeURIComponent(sortedParams)}`;
    const signingKey = `${encodeURIComponent(consumerSecret)}&${encodeURIComponent(access_token_secret)}`;
    const crypto = require('crypto');
    const signature = crypto.createHmac('sha1', signingKey).update(baseString).digest('base64');
    params.oauth_signature = signature;
    const authHeader = `OAuth ${Object.entries(params)
      .map(([key, value]) => `${key}="${encodeURIComponent(value)}"`)
      .join(', ')}`;
    // --- END custom OAuth logic ---
    
    console.log('Auth Header:', authHeader);
    console.log('Making request to Discogs...');

    const response = await fetch(discogsUrl, {
      method: method,
      headers: {
        'Authorization': authHeader,
        'User-Agent': 'SpotifyToVinyl/1.0 +https://github.com/your-username/spotify-to-vinyl',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (req.method === 'POST') {
      // Adding to wantlist
      if (response.status === 201) {
        return res.status(200).json({ 
          success: true, 
          message: 'Item added to wantlist successfully' 
        });
      } else if (response.status === 204) {
        return res.status(200).json({ 
          success: true, 
          message: 'Item already in wantlist' 
        });
      }
    } else {
      // Removing from wantlist
      if (response.status === 204) {
        return res.status(200).json({ 
          success: true, 
          message: 'Item removed from wantlist successfully' 
        });
      }
    }

    const errorData = await response.text();
    console.error('Discogs API error:', errorData);
    return res.status(response.status).json({ 
      success: false, 
      message: `Failed to ${req.method === 'POST' ? 'add to' : 'remove from'} wantlist`,
      error: errorData 
    });

  } catch (error) {
    console.error('Error with wantlist operation:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}

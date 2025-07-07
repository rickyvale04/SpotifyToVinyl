// Check if item is in Discogs wantlist
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { releaseId, tokens, username } = req.query;
    
    console.log('=== DISCOGS WANTLIST CHECK DEBUG ===');
    console.log('Release ID:', releaseId);
    console.log('Username:', username);
    console.log('Tokens present:', !!tokens);

    if (!releaseId || !tokens || !username) {
      return res.status(400).json({ message: 'Missing releaseId, tokens, or username' });
    }

    const parsedTokens = JSON.parse(tokens);
    const { access_token, access_token_secret } = parsedTokens;

    if (!access_token || !access_token_secret) {
      return res.status(400).json({ message: 'Invalid tokens' });
    }

    // Discogs API endpoint to get user's wantlist
    const discogsUrl = `https://api.discogs.com/users/${username}/wants/${releaseId}`;
    
    console.log('Checking wantlist URL:', discogsUrl);
    
    // --- Custom OAuth 1.0a signature logic ---
    const consumerKey = process.env.NEXT_PUBLIC_DISC_ID || process.env.DISCOGS_CONSUMER_KEY;
    const consumerSecret = process.env.NEXT_PUBLIC_DISC_SECRET || process.env.DISCOGS_CONSUMER_SECRET;
    const timestamp = Math.floor(Date.now() / 1000).toString();
    const nonce = Math.random().toString(36).substring(2, 15);
    const method = 'GET';
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
    
    console.log('Making GET request to check wantlist...');

    const response = await fetch(discogsUrl, {
      method: 'GET',
      headers: {
        'Authorization': authHeader,
        'User-Agent': 'SpotifyToVinyl/1.0 +https://github.com/your-username/spotify-to-vinyl',
        'Content-Type': 'application/json',
      },
    });
    
    console.log('Wantlist check response status:', response.status);

    if (response.status === 200) {
      // Item is in wantlist
      return res.status(200).json({ 
        inWantlist: true,
        message: 'Item is in wantlist'
      });
    } else if (response.status === 404) {
      // Item is not in wantlist
      return res.status(200).json({ 
        inWantlist: false,
        message: 'Item is not in wantlist'
      });
    } else {
      const errorData = await response.text();
      console.error('Discogs API error:', errorData);
      return res.status(response.status).json({ 
        success: false, 
        message: 'Failed to check wantlist status',
        error: errorData 
      });
    }

  } catch (error) {
    console.error('Error checking wantlist:', error);
    return res.status(500).json({ 
      success: false, 
      message: 'Internal server error',
      error: error.message 
    });
  }
}

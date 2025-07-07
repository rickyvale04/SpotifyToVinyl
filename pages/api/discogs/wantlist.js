// Add/Remove item to/from Discogs wantlist
export default async function handler(req, res) {
  if (req.method !== 'POST' && req.method !== 'DELETE') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    const { releaseId, tokens } = req.body;

    if (!releaseId || !tokens) {
      return res.status(400).json({ message: 'Missing releaseId or tokens' });
    }

    const { access_token, access_token_secret } = tokens;

    if (!access_token || !access_token_secret) {
      return res.status(400).json({ message: 'Invalid tokens' });
    }

    // Discogs API endpoint for wantlist operations
    const discogsUrl = `https://api.discogs.com/users/me/wants/${releaseId}`;
    
    // OAuth 1.0a signature generation for Discogs
    const crypto = require('crypto');
    const OAuth = require('oauth-1.0a');
    
    const oauth = OAuth({
      consumer: {
        key: process.env.DISCOGS_CONSUMER_KEY,
        secret: process.env.DISCOGS_CONSUMER_SECRET,
      },
      signature_method: 'HMAC-SHA1',
      hash_function(base_string, key) {
        return crypto
          .createHmac('sha1', key)
          .update(base_string)
          .digest('base64');
      },
    });

    const method = req.method === 'POST' ? 'PUT' : 'DELETE';
    const requestData = {
      url: discogsUrl,
      method: method,
    };

    const token = {
      key: access_token,
      secret: access_token_secret,
    };

    const authHeader = oauth.toHeader(oauth.authorize(requestData, token));

    const response = await fetch(discogsUrl, {
      method: method,
      headers: {
        'Authorization': authHeader['Authorization'],
        'User-Agent': 'SpotifyToVinyl/1.0 +https://github.com/your-username/spotify-to-vinyl',
        'Content-Type': 'application/json',
      },
    });

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

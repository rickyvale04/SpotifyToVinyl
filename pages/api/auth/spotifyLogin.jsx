import { getLoginUrl } from '../../../lib/spotifyNew';

export default function handler(req, res) {
  const redirectUri = 'http://127.0.0.1:3001/api/auth/spotify/callback';
  
  const loginUrl = getLoginUrl(redirectUri);
  res.writeHead(302, { Location: loginUrl });
  res.end();
}

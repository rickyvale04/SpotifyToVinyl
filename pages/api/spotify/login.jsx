import { getLoginUrl } from '../../../lib/spotifyNew';

export default function handler(req, res) {
  const host = req.headers.host || '127.0.0.1:3000';
  const redirectUri = `http://${host}/api/spotify/callback`;
  
  const loginUrl = getLoginUrl(redirectUri);
  res.writeHead(302, { Location: loginUrl });
  res.end();
}

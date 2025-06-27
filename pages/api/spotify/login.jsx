import { getLoginUrl } from '../../../lib/spotifyNew';

export default function handler(req, res) {
  const host = req.headers.host || '127.0.0.1:3002';
  const redirectUri = `http://${host}/callback`;
  
  const loginUrl = getLoginUrl(redirectUri);
  res.writeHead(302, { Location: loginUrl });
  res.end();
}

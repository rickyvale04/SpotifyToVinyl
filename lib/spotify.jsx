import SpotifyWebApi from 'spotify-web-api-node';

const scopes = [
  'user-read-private',
  'user-read-email',
  'playlist-read-private',
  'playlist-read-collaborative',
  'user-library-read',
  'user-top-read',
  'user-follow-read',
  'user-read-playback-state',
  'user-modify-playback-state',
  'streaming'
].join(',');

const params = {
  scope: scopes,
};

const queryParamString = new URLSearchParams(params);

const LOGIN_URL = `https://accounts.spotify.com/authorize?${queryParamString.toString()}`;

const spotifyAPI = new SpotifyWebApi({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
  redirectUri: 'http://127.0.0.1:3002/api/auth/callback/spotify'
});

export default spotifyAPI;
export { LOGIN_URL };

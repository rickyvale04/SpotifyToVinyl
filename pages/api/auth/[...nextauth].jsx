import NextAuth from 'next-auth';
import SpotifyProvider from 'next-auth/providers/spotify';
import spotifyAPI, { LOGIN_URL } from '../../../lib/spotify';

const refreshAccessToken = async (token) => {
  try {
    spotifyAPI.setAccessToken(token.accessToken);
    spotifyAPI.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyAPI.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshToken: refreshedToken.refresh_token ?? token.refreshToken
    };
  } catch (error) {
    console.error('Error refreshing access token:', error);
    return {
      ...token,
      error: "RefreshAccessTokenError"
    };
  }
};

export default NextAuth({
    providers: [
      SpotifyProvider({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        authorization: {
          params: {
            scope: 'user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read user-follow-read user-read-playback-state user-modify-playback-state streaming',
          },
        },
      }),
      {
        name: 'Discogs',
        id: 'discogs',
        type: 'oauth',
        version: '1.0a',
        clientId: process.env.DISCOGS_CONSUMER_KEY,
        clientSecret: process.env.DISCOGS_CONSUMER_SECRET,
        authorization: {
          url: 'https://www.discogs.com/oauth/authorize',
          params: { oauth_callback: 'http://127.0.0.1:3002/api/discogs/callback' },
        },
        requestTokenUrl: 'https://api.discogs.com/oauth/request_token',
        accessTokenUrl: 'https://api.discogs.com/oauth/access_token',
        userinfo: {
          url: 'https://api.discogs.com/oauth/identity',
          method: 'GET',
        },
        profile(profile) {
          return {
            id: profile.id,
            name: profile.username,
            email: profile.email,
            image: profile.avatar_url,
          };
        },
      },
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login"
    },
    callbacks: {
      async jwt({token, account, user}) {
        // Initial sign in
        if (account && user) {
          return {
            accessToken: account.access_token,
            refreshToken: account.refresh_token,
            username: account.providerAccountId,
            accessTokenExpires: account.expires_at * 1000,
          };
        }
        
        // Return previous token if the access token has not expired yet
        if (Date.now() < token.accessTokenExpires) {
          return token;
        }

        // Access token has expired, try to update it
        return await refreshAccessToken(token);
      },
      async session({session, token}) {
        session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;
        
        return session;
      },
    },
  });

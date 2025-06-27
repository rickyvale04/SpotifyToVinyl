import NextAuth from 'next-auth';
/* 
 * Spotify integration has been removed as per request.
 * The SpotifyProvider and related authentication logic have been commented out.
 * A new implementation will be added separately.
 */
// import SpotifyProvider from 'next-auth/providers/spotify'
// import spotifyAPI, { LOGIN_URL } from '../../../lib/spotify';

/* 
const refreshAccessToken = async (token) => {
  try {
    spotifyAPI.setAccessToken(token.accessToken);
    spotifyAPI.setRefreshToken(token.refreshToken);

    const { body: refreshedToken } = await spotifyAPI.refreshAccessToken();

    return {
      ...token,
      accessToken: refreshedToken.access_token,
      accessTokenExpires: Date.now() + refreshedToken.expires_in * 1000,
      refreshedToken: refreshedToken.refresh_token ?? token.refreshToken
      //replaces refresh token or else falls back to old refresh token
    }

  }
  catch (error) {
    console.error(error)
    return {
      ...token,
      error: "RefreshAccessTokenError"
    }
  }
}
*/

export default NextAuth({
    providers: [
      /* SpotifyProvider({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        authorizationURL: LOGIN_URL,
        callbackURL: `${process.env.NEXTAUTH_URL}/api/auth/spotify/callback`,
      }), */
    ],
    secret: process.env.NEXTAUTH_SECRET,
    pages: {
      signIn: "/login"
    },
    // Custom handler to bypass NextAuth for Spotify callback
    callbacks: {
      async handler(req, res) {
        if (req.url.includes('/api/auth/spotify/callback')) {
          // Do not handle this route with NextAuth
          return { status: 404 };
        }
        // Handle other routes with NextAuth
        return await NextAuth.handler(req, res);
      }
    },
    callbacks: {
      async jwt({token, account, user}) {
        // initial sign in
        if (account && user) {
          return {
            /* accessToken: account.access_token,
            refreshToken: account.refresh_token,
            username: account.providerAccountId,
            accessTokenExpires: account.expires_at * 1000, */
            // Placeholder for new authentication logic
          };
        }
        //returns access token if access token did not expire
        /* if (Date.now() < token.accessTokenExpires) {
          return token;
        }

        //if access token expires
        return await refreshAccessToken(token) */
        return token;
      },
      async session({session, token}) {
        /* session.user.accessToken = token.accessToken;
        session.user.refreshToken = token.refreshToken;
        session.user.username = token.username;
        session.user.image = token.picture; */
        
        return session;
      },
    },
  });

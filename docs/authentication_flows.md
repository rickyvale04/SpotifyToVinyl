# Authentication Flows for Crate Digger

This document provides a detailed explanation of the authentication flows for Spotify and Discogs in the Crate Digger application. It serves as a reference for understanding how these integrations work and for troubleshooting any issues that may arise in the future.

## Spotify Authentication Flow

### Overview
The Crate Digger application uses the **PKCE (Proof Key for Code Exchange)** method for Spotify authentication. This is a secure authorization flow suitable for client-side applications, ensuring that the authorization code cannot be intercepted and used by malicious entities.

### Process
1. **Redirection to Spotify Authorization Endpoint**:
   - The application redirects the user to Spotify's authorization page using the function `redirectToAuthCodeFlow` located in `lib/spotifyAuth.jsx`.
   - Parameters included in the request:
     - `client_id`: The Spotify Client ID for the application.
     - `response_type`: Set to `code` to request an authorization code.
     - `redirect_uri`: Set to `http://127.0.0.1:3002/callback`, where the user is redirected after authorization.
     - `scope`: A space-separated list of permissions requested, such as `user-read-private`, `user-read-email`, `playlist-read-private`, and others for accessing user data and controlling playback.
     - `code_challenge_method`: Set to `S256` for SHA-256 hashing.
     - `code_challenge`: A base64 URL-encoded SHA-256 hash of the code verifier, ensuring the integrity of the authorization request.
     - `state`: Contains the code verifier to pass it through the callback for later use.

2. **Code Verifier and Challenge Generation**:
   - A random string called the `codeVerifier` is generated using `generateCodeVerifier` function (128 characters long).
   - This verifier is hashed using SHA-256 and encoded to create the `codeChallenge` with the `generateCodeChallenge` function, which is sent in the authorization request.

3. **Callback Handling**:
   - After user consent, Spotify redirects to the specified `redirect_uri` (`/callback`) with an authorization code in the query parameters.
   - The application likely exchanges this code for access and refresh tokens, though the exact implementation for token exchange is not detailed in `lib/spotifyAuth.jsx`. This step typically occurs in API routes like `pages/api/spotify/callback.jsx`.

4. **Token Storage**:
   - Tokens are presumably stored in a secure manner (e.g., local storage or cookies) for session persistence, allowing subsequent API calls without re-authentication.

### Key Files
- `lib/spotifyAuth.jsx`: Contains utility functions for initiating the PKCE flow.
- `pages/api/spotify/callback.jsx` and related API routes: Likely handle the token exchange and storage.
- `pages/callback.jsx`: The frontend page that processes the redirect from Spotify.

### Troubleshooting Tips
- **Token Expiry**: Spotify access tokens have a limited lifespan (typically 1 hour). Ensure refresh tokens are used to obtain new access tokens without user intervention.
- **Invalid Client ID**: Verify that the Client ID in environment variables (likely in `.env.local`) matches the one registered in the Spotify Developer Dashboard.
- **Redirect URI Mismatch**: Ensure the `redirect_uri` in the code matches the one registered in Spotify's dashboard.
- **Scope Issues**: If certain API calls fail, check if the required scopes are included in the authorization request.

## Discogs Authentication Flow

### Overview
The Crate Digger application uses **OAuth 1.0a** for Discogs authentication. This protocol involves a series of steps to obtain user authorization and access tokens for API interactions, ensuring secure communication with the Discogs API.

### Process
1. **Request Token Acquisition**:
   - The application requests a temporary request token from Discogs using the `getRequestToken` function in `lib/discogsAuth.jsx`.
   - Parameters include:
     - `oauth_consumer_key`: The Discogs API key (Consumer Key).
     - `oauth_nonce`: A random string to prevent replay attacks.
     - `oauth_timestamp`: Current timestamp for request validity.
     - `oauth_callback`: The URL where Discogs redirects after user authorization (`callbackUrl`).
     - `oauth_signature`: An HMAC-SHA1 signature of the request parameters, generated using `generateOAuthSignature`.
   - Discogs responds with a `requestToken`, `requestTokenSecret`, and an `authorizeUrl` for user authorization.

2. **User Authorization**:
   - The `getLoginUrl` function constructs the login URL (`authorizeUrl`) and returns it along with the request token details.
   - The user is redirected to this URL (e.g., via `pages/api/discogs/login.jsx`), where they authorize the application on Discogs' website.
   - After authorization, Discogs redirects to the callback URL with a `verifier` parameter.

3. **Access Token Exchange**:
   - Using the `getAccessToken` function, the application exchanges the request token and verifier for an access token and secret.
   - Parameters mirror the request token step, with the addition of `oauth_verifier` from the callback.
   - The response includes `accessToken` and `accessTokenSecret`, which are used for subsequent API calls.

4. **Token Storage and Validation**:
   - Tokens are stored in `localStorage` under the key `discogs_tokens` as a JSON object.
   - The `checkAuthStatus` function validates stored tokens by attempting to fetch user identity from `oauth/identity` endpoint. If the request fails with a 401 status, tokens are cleared.

5. **API Requests**:
   - The `makeDiscogsRequest` function constructs authenticated requests to Discogs API endpoints using the access token and secret.
   - Each request includes an OAuth header with signed parameters to authenticate the request.

### Key Files
- `lib/discogsAuth.jsx`: Core functions for OAuth 1.0a flow, token management, and API requests.
- `pages/api/discogs/login.jsx`: Initiates the authentication by redirecting to Discogs.
- `pages/api/discogs/callback.jsx`: Handles the callback, likely calling `getAccessToken`.
- `pages/discogsCallback.jsx`: Frontend page for processing Discogs callback.
- `pages/api/discogs/tokenStore.js`: May be involved in token storage or retrieval logic.

### Troubleshooting Tips
- **Token Expiry**: Unlike Spotify, Discogs access tokens do not expire unless revoked. If API calls fail, check for token revocation or API key issues.
- **Signature Errors**: Ensure the `generateOAuthSignature` function correctly signs requests. Mismatched signatures result in 401 errors.
- **Callback URL Issues**: Verify the callback URL in the code matches the one registered in Discogs API settings.
- **Rate Limits**: Discogs imposes rate limits (60 requests per minute for authenticated users). Implement retry logic or backoff strategies if limits are hit.
- **Token Storage**: If `localStorage` is cleared or corrupted, users will need to re-authenticate. Ensure error handling for missing or invalid tokens.

## General Notes
- **Environment Variables**: Both Spotify and Discogs rely on environment variables for API keys and secrets (e.g., `NEXT_PUBLIC_DISC_ID`, `NEXT_PUBLIC_DISC_SECRET`). Ensure these are correctly set in `.env.local` or deployment environments like Vercel.
- **Security**: Avoid logging sensitive data like tokens or secrets in console outputs or public repositories.
- **Future Debugging**: If authentication breaks, start by checking console errors for HTTP status codes (401 for unauthorized, 403 for forbidden) and review API documentation for any changes in endpoints or requirements.

This documentation was created on June 27, 2025, to assist in maintaining the authentication functionality of Crate Digger. For any updates or changes in API behavior, refer to the official Spotify and Discogs developer documentation.

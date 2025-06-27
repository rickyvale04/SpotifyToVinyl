# Spotify Authentication Process in Crate Digger

This document outlines the current implementation of the Spotify authentication flow in the Crate Digger application as of June 2025. It is intended to serve as a reference for troubleshooting or future modifications to the authentication process.

## Overview

The application uses the **Authorization Code Flow with Proof Key for Code Exchange (PKCE)** to authenticate users with Spotify. This flow is suitable for client-side applications and ensures secure token exchange without exposing client secrets in the browser.

## Key Components

### 1. Environment Variables
- **Client ID and Client Secret**: Stored in `.env.local` as `NEXT_PUBLIC_CLIENT_ID` and `NEXT_PUBLIC_CLIENT_SECRET`. These are used to identify the application to Spotify's API.
- **Redirect URI**: Configured dynamically based on the server's host and port, currently set to `http://127.0.0.1:3002/callback` to match the development server running on port 3002.

### 2. Authentication Flow Steps

#### Step 1: Login Request Initiation
- **File**: `pages/api/spotify/login.jsx`
- **Functionality**: When a user clicks "Login with Spotify," the application directs them to Spotify's authorization endpoint. The `handler` function constructs a redirect URI dynamically using the request's host (or defaults to `127.0.0.1:3002`) and sets it to `http://<host>/callback`. It then calls `getLoginUrl(redirectUri)` from `lib/spotifyNew.jsx` to generate the authorization URL with the necessary parameters:
  - `response_type`: `code` (indicating Authorization Code Flow)
  - `client_id`: Retrieved from environment variables
  - `scope`: A list of permissions the app requests (e.g., `user-read-private`, `playlist-read-private`, etc.)
  - `redirect_uri`: The dynamically constructed URI where Spotify will send the authorization code
- The user is redirected to Spotify's login page via a 302 redirect.

#### Step 2: User Authorization
- **Location**: Spotify's Authorization Server (`https://accounts.spotify.com/authorize`)
- **Functionality**: The user logs into Spotify and consents to the requested permissions. Upon approval, Spotify redirects the user back to the specified `redirect_uri` with an authorization `code` as a query parameter.

#### Step 3: Token Exchange
- **File**: `pages/api/spotify/callback.jsx`
- **Functionality**: After redirection, this endpoint handles the callback from Spotify. It extracts the `code` and `code_verifier` (for PKCE) from the query parameters. The `redirectUri` is again dynamically set to `http://<host>/callback` (matching the one used in the login request). It then calls `getTokens(code, redirectUri, code_verifier)` from `lib/spotifyNew.jsx` to exchange the authorization code for access and refresh tokens:
  - A POST request is made to `https://accounts.spotify.com/api/token` with parameters including `grant_type=authorization_code`, the received `code`, the `redirect_uri`, `client_id`, `client_secret`, and `code_verifier`.
  - If successful, Spotify returns an `access_token`, `refresh_token`, and `expires_in` duration, which are sent back to the client as a JSON response.

#### Step 4: Token Usage and Refresh
- **File**: `lib/spotifyNew.jsx`
- **Functionality**:
  - `makeSpotifyRequest(endpoint, accessToken, method, data)`: Used to make API calls to Spotify endpoints with the obtained `access_token` for fetching user data, playlists, etc.
  - `refreshToken(refreshToken)`: When the `access_token` expires, this function uses the `refresh_token` to obtain a new `access_token` without user intervention, sending a POST request to Spotify's token endpoint with `grant_type=refresh_token`.

### 3. Integration Points
- **Login Button**: Likely in a component like `pages/login.jsx` or similar, which triggers the redirect to `/api/spotify/login`.
- **Callback Handling**: The `/callback` page (likely `pages/callback.jsx`) processes the token response from the API endpoint and stores or uses the tokens for subsequent API calls.
- **State Management**: Tokens might be stored in a state management solution like Recoil or React Context for use across components.

## Key Configuration Notes
- **Development Server Port**: The server is configured to run on a fixed port (currently 3002) in `package.json` (`"dev": "next dev -p 3002"`) to ensure the redirect URI remains consistent with what is registered in Spotify's dashboard.
- **Spotify Dashboard Configuration**: The redirect URI `http://127.0.0.1:3002/callback` must be registered in the Spotify for Developers dashboard under the application's settings to avoid "Invalid redirect URI" errors.

## Troubleshooting Tips
- **Redirect URI Mismatch**: Ensure the `redirectUri` in both `login.jsx` and `callback.jsx` matches exactly with one of the URIs listed in Spotify's dashboard. If the server port changes, update the code or dashboard accordingly.
- **Token Exchange Failure**: Check logs for errors in `callback.jsx`. Common issues include incorrect `client_id`, `client_secret`, or an unregistered `redirect_uri`.
- **PKCE Errors**: Verify that the `code_verifier` is correctly passed and matches the `code_challenge` sent during the initial authorization request (if PKCE is fully implemented in the frontend).
- **Server Port Conflicts**: If port 3002 is in use, ensure no other processes are occupying it, or update the port in `package.json` and corresponding redirect URIs.

## Future Considerations
- **Dynamic Port Handling**: If the development environment frequently changes ports, consider a more robust way to dynamically update and register redirect URIs, though this is complex due to Spotify's static configuration requirements.
- **PKCE Full Implementation**: Ensure the frontend generates and stores a `code_verifier` and sends a `code_challenge` during the authorization request if not already implemented.

This documentation reflects the state of the authentication flow after recent updates to resolve redirect URI issues. If further changes are made, update this file accordingly.

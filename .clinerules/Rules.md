# Spotify Redirect URI Rules

## NEVER Modify These URIs
Cline MUST NEVER modify, rewrite, or suggest alternatives to the following Spotify redirect URIs. They are hardcoded in the Spotify Developer Dashboard and MUST remain EXACTLY as listed below:

- http://127.0.0.1:3002/callback  
- http://127.0.0.1:3002/api/spotify/callback  
- http://127.0.0.1:3002/api/auth/spotify/callback  

If a feature, route, or OAuth handler is being developed, Cline MUST select one of these three URIs as the redirect URI. If unsure which one to use, Cline MUST ask the user (Rick) directly and NOT assume or invent a new one.

Any attempt to generate new redirect URIs or change these is STRICTLY FORBIDDEN unless explicitly instructed by the user.

# Spotify Authentication System Rules

## NEVER Modify the Authentication System
Cline MUST NEVER modify, alter, or suggest changes to the current Spotify authentication system for any reason. The system, as implemented, is critical to the functionality of the application and MUST remain unchanged.

Any attempt to revise or replace the Spotify authentication mechanism is STRICTLY FORBIDDEN unless explicitly instructed by the user.

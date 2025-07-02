# Technical Context

This document provides an overview of the technical stack, tools, frameworks, and integrations used in the SpotifyToVinyl project, along with their purpose and configuration details.

## Technology Stack
- **Frontend Framework**: Next.js (React-based) - Used for server-side rendering, routing, and building a performant web application. Configured in `next.config.js`.
- **State Management**: Recoil - Manages complex state across components for user data, playlists, and vinyl collections. Defined in `atoms/` (e.g., `playlistAtom.jsx`, `playlistId.jsx`).
- **Styling**: Tailwind CSS - Provides utility-first CSS for responsive and consistent design across the application. Configured in `tailwind.config.js` and `postcss.config.js`.
- **Backend**: Node.js with Next.js API Routes - Backend logic is handled via API routes in `pages/api/` for Spotify authentication, data retrieval, and database interactions.
- **Database**: MongoDB - Used to store user-specific vinyl data for historical tracking. Connection and helpers are in `lib/mongo/`.
- **Authentication**: NextAuth.js - Handles session management and integrates with Spotify OAuth. Configured in `pages/api/auth/[...nextauth].jsx`.

## Key Integrations
- **Spotify API**: 
  - **Purpose**: Authentication, playlist retrieval, track data, and user information.
  - **Implementation**: Multiple libraries handle Spotify interactions:
    - `lib/spotify.jsx` - General Spotify API interactions.
    - `lib/spotifyAuth.jsx` - Authentication flow with PKCE.
    - `lib/spotifyNew.jsx` - Token exchange and API requests.
    - `lib/spotifyClientCredentials.jsx` - Server-side credential flow if needed.
  - **Configuration**: Uses environment variables `SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `NEXT_PUBLIC_CLIENT_ID`, and `NEXT_PUBLIC_CLIENT_SECRET` from `.env.local`.
  - **Scopes**: Includes user data access, playlist reading, playback control, and streaming as defined in authentication files.
- **Discogs API**:
  - **Purpose**: Potentially used for vinyl metadata or imagery (if integrated).
  - **Implementation**: Handled in `lib/discogs.jsx` and `lib/discogsAuth.jsx`.
  - **Configuration**: Likely uses separate credentials (not detailed in visible files).
- **MongoDB Database**:
  - **Purpose**: Stores user vinyl collections for persistence.
  - **Implementation**: Connection logic in `lib/mongo/index.jsx` with helpers in `lib/mongo/helpers.jsx`.
  - **Configuration**: Connection string stored in `MONGODB_URI` environment variable in `.env.local`.

## Project Structure
- **Root Files**: Configuration files like `package.json`, `next.config.js`, and `.env.local` for project setup and environment variables.
- **Pages**: Next.js pages in `pages/` for routing (`index.jsx`, `login.jsx`, `callback.jsx`, dynamic routes like `album/[id].jsx`).
- **API Routes**: Backend endpoints in `pages/api/` for handling Spotify authentication (`spotify/`), Discogs (`discogs/`), and other data operations.
- **Components**: Reusable UI elements in `components/` organized by feature (`main/`, `song/`, `ui/`).
- **Libraries**: Utility functions in `lib/` for API interactions, authentication, and database operations.
- **Styles**: Global styles in `styles/globals.css` with Tailwind CSS for component-specific styling.
- **Public Assets**: Images and icons in `public/` for UI elements (e.g., `recordImage.png`).

## Development Tools
- **Package Manager**: npm - Manages dependencies as seen in `package.json` and `package-lock.json`.
- **Code Editor**: VSCode - Indicated by `crate_digger.code-workspace` file for project-specific settings.
- **Version Control**: Git - Evident from `.gitignore` file for managing source code.

## Environment Configuration
- **Environment Variables**: Stored in `.env.local` for sensitive data:
  - `MONGODB_URI` for database connection.
  - `NEXTAUTH_URL` and `NEXTAUTH_SECRET` for authentication.
  - Spotify credentials (`SPOTIFY_CLIENT_ID`, `SPOTIFY_CLIENT_SECRET`, `NEXT_PUBLIC_CLIENT_ID`, `NEXT_PUBLIC_CLIENT_SECRET`).
- **Port Configuration**: Development server runs on port 3002 as seen in terminal commands and environment settings.

## Key Dependencies (from `package.json` context)
- **Next.js**: Core framework for rendering and routing.
- **React & React-DOM**: For building UI components.
- **Axios**: For making HTTP requests to Spotify and other APIs.
- **Recoil**: For state management.
- **Tailwind CSS & related packages**: For styling.
- **NextAuth.js**: For authentication.
- **MongoDB**: Node.js driver for database interactions (assumed from file structure).

## Build & Deployment
- **Build Tool**: Next.js build system for creating optimized production builds.
- **Deployment Platform**: Likely Vercel, given Next.js structure and assets like `vercel.svg` in `public/`.
- **Development Server**: `npm run dev` command runs the app locally on port 3002 for testing.

## Technical Challenges
- **Spotify Authentication**: Handling OAuth 2.0 with PKCE requires careful management of code verifiers and challenges, as seen in `spotifyAuth.jsx` and `spotifyNew.jsx`. Recent issues with `client_secret` being undefined were resolved by updating environment variables.
- **Database Integration**: Ensuring MongoDB connection stability and proper schema design for vinyl data storage in `models/vinyls.js`.
- **State Synchronization**: Managing state with Recoil across multiple components to reflect user actions (e.g., saving a vinyl) without performance issues.
- **API Rate Limits**: Handling Spotify API rate limits and token expiration with refresh mechanisms in `spotifyNew.jsx`.

## Future Considerations
- **Testing**: No visible test setup; adding Jest for unit tests and Cypress for end-to-end tests could improve reliability.
- **Performance Optimization**: Implementing React.memo or useMemo in components for better rendering performance as data grows.
- **Scalability**: Planning for increased database load as user vinyl collections expand, potentially using MongoDB sharding or indexing.

This technical context provides a comprehensive view of the SpotifyToVinyl project's foundation, guiding development decisions and troubleshooting efforts.

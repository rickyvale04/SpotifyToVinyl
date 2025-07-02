# System Patterns

This document describes the architectural patterns, design principles, and recurring solutions used in the SpotifyToVinyl project to ensure maintainability, scalability, and consistency.

## Architectural Patterns
- **Client-Server Architecture**: The application follows a client-server model where the frontend is built with Next.js and React, communicating with backend APIs for data handling. This separation allows for independent scaling of frontend and backend components.
- **API-First Design**: All major functionalities (Spotify authentication, data retrieval, vinyl saving) are exposed through RESTful API endpoints, ensuring that the frontend is decoupled from backend logic.
- **State Management with Recoil**: Recoil is used for state management to handle complex UI states like user data, playlists, and vinyl collections efficiently across components.

## Design Patterns
- **Component-Based UI**: The UI is broken down into reusable React components (e.g., `VinylItem`, `PlaylistItem`, `SongTable`) following a modular design to enhance reusability and testability.
- **Hooks for Logic Encapsulation**: Custom React hooks (e.g., `useSpotify`) encapsulate API interactions and state logic, keeping components clean and focused on rendering.
- **Middleware Pattern**: Next.js middleware (`_middleware.jsx`) is used for handling authentication checks or redirects before rendering pages, ensuring secure access to protected routes.

## Authentication Patterns
- **OAuth 2.0 with PKCE**: Spotify authentication uses OAuth 2.0 with Proof Key for Code Exchange (PKCE) to securely handle authorization codes and token exchanges without exposing client secrets in the browser.
- **NextAuth.js Integration**: NextAuth.js is utilized for session management, providing a standardized way to handle authentication state and token storage across the application.

## Data Management Patterns
- **Database per Feature**: MongoDB is used specifically for storing user vinyl data, separating it from transient session data or Spotify API responses to ensure data persistence.
- **API Layer Abstraction**: Libraries like `spotify.jsx`, `spotifyNew.jsx`, and `mongo/index.jsx` abstract API and database interactions, providing a clean interface for the rest of the application to interact with external services.
- **Caching**: LocalStorage is used to cache Spotify tokens (`access_token`, `refresh_token`) to minimize repeated API calls for authentication during a user session.

## Error Handling Patterns
- **Centralized Error Logging**: Errors during API calls or token exchanges are logged to the console with detailed messages (e.g., in `spotifyAuth.jsx`, `spotifyNew.jsx`) to aid debugging without exposing sensitive information to users.
- **User-Friendly Feedback**: UI components display simplified error messages or loading states (e.g., in `callback.jsx`) to inform users of issues without technical jargon.

## UI/UX Patterns
- **Responsive Layouts**: Tailwind CSS is used for responsive design, ensuring the application works across devices with consistent styling defined in `tailwind.config.js`.
- **Consistent Navigation**: A `Layout.jsx` component provides a consistent structure with sidebar and header elements across pages for intuitive navigation.
- **Visual Feedback for Actions**: UI elements like buttons (`Button.jsx`, `PageButton.jsx`) and search bars (`SearchBar.jsx`) provide visual cues (e.g., hover states, loading indicators) to confirm user actions.

## Code Organization Patterns
- **Feature-Based Directory Structure**: Code is organized by feature (e.g., `components/main/`, `components/song/`, `pages/api/spotify/`) to keep related files together and improve discoverability.
- **Separation of Concerns**: API logic is separated into `lib/` folder files, UI components into `components/`, and page routing into `pages/`, ensuring each part of the codebase has a single responsibility.

## Testing Patterns
- **(Placeholder for Future Implementation)**: Currently, no explicit testing framework is visible in the project structure. Future patterns may include unit tests for API utilities with Jest and integration tests for user flows with Cypress.

## Deployment Patterns
- **Vercel Compatibility**: The project structure and `next.config.js` suggest compatibility with Vercel for deployment, leveraging its automatic scaling and CDN capabilities for Next.js applications.

## Recurring Solutions
- **Environment Variable Usage**: Sensitive data like API keys and secrets are stored in `.env.local` and accessed via `process.env` to prevent hardcoding credentials in source code.
- **Dynamic Routing**: Next.js dynamic routes (e.g., `pages/album/[id].jsx`) are used to handle specific content pages, reducing code duplication for similar page structures.
- **Reusable Utility Functions**: Functions for time formatting (`time.jsx`) or API interactions (`discogs.jsx`, `spotify.jsx`) are reused across different parts of the application to avoid redundant code.

These patterns collectively ensure that SpotifyToVinyl is built on a solid foundation, balancing functionality with maintainability and user experience. As the project evolves, these patterns will be revisited and refined to address new challenges or requirements.

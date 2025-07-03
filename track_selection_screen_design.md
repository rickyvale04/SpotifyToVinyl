# Track Selection Screen Design Specification

This document outlines the user interface (UI) and user experience (UX) design for the track selection screen of the application.

## 1. Core User Flow

The primary user flow for selecting a track is as follows:

1.  **Initiation**: From a primary screen (e.g., a playlist editor, a video timeline, or a project view), the user taps a button labeled "Add Track" or a "+" icon.
2.  **Screen Presentation**: A dedicated "Track Browser" screen animates into view, sliding up from the bottom to cover the full screen.
3.  **Browsing and Filtering**: The user browses, searches, and/or filters the list to find their desired track.
4.  **Preview**: The user can preview tracks directly from the list by tapping a play icon.
5.  **Selection**: Upon tapping a track, it becomes highlighted, and a confirmation button ("Add" or "Done") is enabled.
6.  **Confirmation**: The user taps the "Add" or "Done" button. The Track Browser screen is dismissed, and the selected track is added to the original context (e.g., the playlist, timeline, etc.).

## 2. UI Components and Functionality: "Track Browser" Screen

### 2.1. Header

The header is positioned at the top of the screen and contains the following elements:

*   **Title**: A centrally aligned title, e.g., "Select a Track".
*   **Cancel/Close Button**: Located on the top-left. This can be an "X" icon or a "Cancel" text button. Tapping it dismisses the screen without making a selection.
*   **Add Button**: Located on the top-right. This button is disabled by default. It becomes enabled only after a user has selected a track from the list. The label should be "Add" or "Done".

```mermaid
graph TD
    subgraph Header
        A[Cancel/X Button] --> B{Dismiss Screen};
        C[Screen Title: "Select a Track"]
        D[Add Button (disabled)] -- Track Selected --> E[Add Button (enabled)];
        E --> F{Add Track & Dismiss};
    end
```

### 2.2. Search and Filter Bar

This bar is located directly below the header to provide easy access to search and filtering tools.

*   **Search Field**: A prominent text input field with placeholder text like "Search your library...". The list of tracks updates in real-time as the user types.
*   **Sort Icon**: A tappable icon that opens a menu with sorting options:
    *   Sort by Title (A-Z)
    *   Sort by Artist
    *   Sort by Album
    *   Sort by Date Added
*   **Filter Icon**: A tappable icon that allows users to filter the track list by source:
    *   My Library
    *   Playlists
    *   Imported Files

### 2.3. Track List

The main content area of the screen, displaying the list of available tracks.

*   **Performance**: The list must be implemented with performance in mind, using techniques like lazy loading or list virtualization to ensure smooth scrolling even with thousands of tracks.
*   **List Item Layout**: Each item in the list represents one track and has three main parts:
    *   **Left**: Album art thumbnail.
    *   **Center**:
        *   Track Title (Bold, primary font)
        *   Artist Name & Album Title (Smaller, secondary font)
    *   **Right**:
        *   Track Duration (e.g., "3:45")
        *   Play/Preview Icon

```mermaid
graph TD
    subgraph Track List Item
        direction LR
        AlbumArt[Album Art Thumbnail] --> TrackInfo;
        subgraph TrackInfo
            direction TB
            Title[Track Title (Bold)]
            ArtistAlbum[Artist Name - Album]
        end
        TrackInfo --> DurationAndPreview;
        subgraph DurationAndPreview
            direction TB
            Duration[Duration: "3:45"]
            Preview[Play Icon]
        end
    end
```

## 3. Interaction and States

### 3.1. Previewing a Track

*   **Action**: User taps the "play" icon on a track item.
*   **Feedback**:
    *   Audio playback for the selected track begins.
    *   The "play" icon changes to a "pause" icon.
    *   If another track is already being previewed, its playback stops, and its icon reverts to "play".
    *   Tapping the "pause" icon stops the preview and reverts the icon to "play".

### 3.2. Selecting a Track

*   **Action**: User taps anywhere on the list item area, *except* for the preview icon.
*   **Feedback**:
    *   The track item is visually highlighted (e.g., with a colored background).
    *   A checkmark icon appears on the right side of the item.
    *   The "Add" button in the header becomes enabled.
    *   If another track was previously selected, it is deselected (its highlight and checkmark are removed). Only one track can be selected at a time.

### 3.3. Empty/No Results State

*   **Trigger**: A user's search query returns no matching tracks.
*   **Feedback**: The track list area is replaced with a user-friendly message, such as:
    *   **Title**: "No tracks found"
    *   **Suggestion**: "Try a different search term."

## 4. Animation and Transitions

*   **Screen Entry**: The "Track Browser" screen should slide up from the bottom of the screen, covering the previous view completely. The animation should be smooth and quick (e.g., 300ms).
*   **Screen Exit**:
    *   Upon tapping "Cancel" or "Add", the screen slides down to reveal the previous screen.
    *   The transition should be consistent with the entry animation.
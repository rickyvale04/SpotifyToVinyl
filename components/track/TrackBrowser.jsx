import React, { useState } from 'react';
import { XIcon } from '@heroicons/react/outline';
import TrackListItem from './TrackListItem';

const mockTracks = [
  { id: 1, title: 'Song 1', artist: 'Artist 1', album: 'Album 1', duration: '3:45', albumArt: 'https://via.placeholder.com/150' },
  { id: 2, title: 'Song 2', artist: 'Artist 2', album: 'Album 2', duration: '4:20', albumArt: 'https://via.placeholder.com/150' },
  { id: 3, title: 'Song 3', artist: 'Artist 3', album: 'Album 3', duration: '2:55', albumArt: 'https://via.placeholder.com/150' },
];

const TrackBrowser = ({ onClose }) => {
  const [selectedTrack, setSelectedTrack] = useState(null);
  const [playingTrack, setPlayingTrack] = useState(null);

  const handleSelectTrack = (track) => {
    if (selectedTrack?.id === track.id) {
      setSelectedTrack(null);
    } else {
      setSelectedTrack(track);
    }
  };

  const handlePreviewTrack = (track) => {
    setPlayingTrack(track);
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg h-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <XIcon className="h-6 w-6" />
          </button>
          <h2 className="text-lg font-semibold">Select a Track</h2>
          <button
            disabled={!selectedTrack}
            className="text-white bg-blue-500 hover:bg-blue-600 disabled:bg-gray-300 disabled:cursor-not-allowed font-semibold py-2 px-4 rounded-lg"
          >
            Add
          </button>
        </div>

        {/* Search and Filter Bar */}
        <div className="p-4 border-b">
          <div className="flex items-center space-x-4">
            <input
              type="text"
              placeholder="Search your library..."
              className="flex-grow p-2 border rounded-lg"
            />
            <button className="p-2 border rounded-lg">
              {/* Sort Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
              </svg>
            </button>
            <button className="p-2 border rounded-lg">
              {/* Filter Icon */}
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L16 11.414V16a1 1 0 01-.293.707l-2 2A1 1 0 0112 18v-1.586l-3.707-3.707A1 1 0 018 12V6a1 1 0 01-1-1H4a1 1 0 01-1-1V4z" />
              </svg>
            </button>
          </div>
        </div>

        {/* Track List */}
        <div className="flex-grow overflow-y-auto">
          {mockTracks.map((track) => (
            <TrackListItem
              key={track.id}
              track={track}
              onSelect={handleSelectTrack}
              onPreview={handlePreviewTrack}
              isSelected={selectedTrack?.id === track.id}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TrackBrowser;
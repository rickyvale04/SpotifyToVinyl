import { useState } from 'react';
import { XIcon, SearchIcon, CollectionIcon } from '@heroicons/react/outline';

const SelectedTracksBar = ({ selectedTracks, onClearSelection, onSearchVinyl }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!selectedTracks || selectedTracks.length === 0) {
    return null;
  }

  const totalDuration = selectedTracks.reduce((total, track) => total + (track.duration_ms || 0), 0);
  const minutes = Math.round(totalDuration / 60000);

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="bg-black border border-gray-700 shadow-2xl px-6 py-4 flex items-center space-x-6 min-w-96 max-w-2xl">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
            <CollectionIcon className="h-6 w-6 text-black" />
          </div>
          <div>
            <p className="text-sm font-medium text-white">
              {selectedTracks.length} track{selectedTracks.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-gray-400">
              {minutes} min • Ready to search for vinyl records
            </p>
          </div>
        </div>
        
        {/* Selected tracks preview */}
        <div className="flex-1 flex items-center space-x-2 overflow-hidden">
          <div className="flex -space-x-2">
            {selectedTracks.slice(0, 3).map((track, index) => (
              <div key={track.id} className="w-8 h-8 bg-gray-800 border-2 border-black overflow-hidden">
                {track.album?.images?.[0]?.url ? (
                  <img
                    src={track.album.images[0].url}
                    alt={track.album.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-800 flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
                    </svg>
                  </div>
                )}
              </div>
            ))}
            {selectedTracks.length > 3 && (
              <div className="w-8 h-8 bg-gray-800 border-2 border-black flex items-center justify-center">
                <span className="text-xs font-medium text-gray-400">+{selectedTracks.length - 3}</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onClearSelection}
            className="p-2 hover:bg-gray-800 transition-colors text-gray-400 hover:text-white"
            title="Clear selection"
          >
            <XIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onSearchVinyl(selectedTracks)}
            className="bg-white text-black px-6 py-3 text-sm font-medium hover:bg-gray-200 transition-colors flex items-center space-x-2"
          >
            <SearchIcon className="h-4 w-4" />
            <span>Search Vinyl</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default SelectedTracksBar;

import { useState } from 'react';
import { XIcon, SearchIcon } from '@heroicons/react/outline';

const SelectedTracksBar = ({ selectedTracks, onClearSelection, onSearchVinyl }) => {
  const [isVisible, setIsVisible] = useState(true);

  if (!selectedTracks || selectedTracks.length === 0) {
    return null;
  }

  return (
    <div className={`fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ${
      isVisible ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
    }`}>
      <div className="bg-black text-white px-6 py-4 rounded-lg shadow-2xl flex items-center space-x-4 min-w-96">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-white bg-opacity-20 rounded-full flex items-center justify-center">
            <span className="text-sm font-medium">{selectedTracks.length}</span>
          </div>
          <div>
            <p className="text-sm font-medium">
              {selectedTracks.length} track{selectedTracks.length !== 1 ? 's' : ''} selected
            </p>
            <p className="text-xs text-gray-300">
              Ready to search for vinyl records
            </p>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onClearSelection}
            className="p-2 hover:bg-white hover:bg-opacity-10 rounded-full transition-colors"
            title="Clear selection"
          >
            <XIcon className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onSearchVinyl(selectedTracks)}
            className="bg-white text-black px-4 py-2 rounded-full text-sm font-medium hover:bg-gray-100 transition-colors flex items-center space-x-2"
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

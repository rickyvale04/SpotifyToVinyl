import React from 'react';

const TrackListItem = ({ track, onSelect, onPreview, isSelected }) => {
  return (
    <div
      className={`flex items-center p-2 cursor-pointer ${isSelected ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
      onClick={() => onSelect(track)}
    >
      {/* Album Art */}
      <img src="https://via.placeholder.com/150" alt={track.title} className="h-12 w-12 mr-4 rounded" />

      {/* Track Info */}
      <div className="flex-grow">
        <p className="font-semibold text-gray-800">{track.title}</p>
        <p className="text-sm text-gray-500">{track.artist} - {track.album}</p>
      </div>

      {/* Duration and Preview */}
      <div className="flex items-center space-x-4">
        <p className="text-sm text-gray-500">{track.duration}</p>
        <button onClick={(e) => { e.stopPropagation(); onPreview(track); }} className="p-2">
          {/* Play Icon */}
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </button>
        {isSelected && (
          <div className="text-blue-500">
            {/* Checkmark Icon */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};

export default TrackListItem;
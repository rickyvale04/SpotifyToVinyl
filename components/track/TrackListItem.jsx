import { useState } from 'react';
import { PlayIcon, PauseIcon, PlusIcon, CheckIcon } from '@heroicons/react/outline';

const TrackListItem = ({ track, index, isSelected = false, onToggleSelect }) => {
  const [isHovered, setIsHovered] = useState(false);

  if (!track) return null;

  const handleToggleSelect = () => {
    if (onToggleSelect) {
      onToggleSelect(!isSelected);
    }
  };

  return (
    <div 
      className={`grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-50 transition-all duration-200 group relative ${
        isSelected ? 'bg-blue-50 border-l-4 border-blue-500' : ''
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Track Number / Play Button */}
      <div className="col-span-1 flex items-center">
        <div className="w-8 h-8 flex items-center justify-center">
          {isHovered ? (
            <button className="p-1 hover:bg-gray-200 rounded-full transition-colors duration-200">
              <PlayIcon className="h-4 w-4 text-black" />
            </button>
          ) : (
            <span className={`text-sm font-medium ${isSelected ? 'text-blue-600' : 'text-gray-500'}`}>
              {index}
            </span>
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="col-span-6 flex items-center space-x-4">
        <div className="w-14 h-14 bg-gray-200 flex-shrink-0 overflow-hidden shadow-sm">
          {track.album?.images?.[0]?.url ? (
            <img
              src={track.album.images[0].url}
              alt={track.album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <svg className="w-7 h-7 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className={`text-sm font-medium truncate mb-1 transition-colors ${
            isSelected ? 'text-blue-700' : 'text-black group-hover:text-gray-700'
          }`}>
            {track.name}
          </p>
          <p className="text-gray-600 text-xs truncate">
            {track.artists?.map(artist => artist.name).join(', ')}
          </p>
          {track.explicit && (
            <span className="inline-block mt-1 bg-gray-200 text-gray-600 text-xs px-2 py-0.5 font-medium">
              EXPLICIT
            </span>
          )}
        </div>
      </div>

      {/* Album */}
      <div className="col-span-3 flex items-center">
        <div className="min-w-0">
          <p className="text-gray-700 text-sm truncate font-medium">
            {track.album?.name}
          </p>
          <p className="text-gray-500 text-xs truncate">
            {track.album?.release_date ? new Date(track.album.release_date).getFullYear() : ''}
          </p>
        </div>
      </div>

      {/* Duration & Actions */}
      <div className="col-span-2 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <span className="text-gray-600 text-sm font-medium">
            {millisToMinutesAndSeconds(track.duration_ms)}
          </span>
          
          {/* Popularity indicator */}
          {track.popularity && (
            <div className="w-12 bg-gray-200 h-1 rounded-full overflow-hidden">
              <div 
                className="h-full bg-green-500 transition-all duration-300"
                style={{ width: `${track.popularity}%` }}
              />
            </div>
          )}
        </div>
        
        {/* Selection Button */}
        <button
          onClick={handleToggleSelect}
          className={`ml-3 w-7 h-7 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected 
              ? 'bg-blue-500 border-blue-500 scale-110' 
              : 'border-gray-300 hover:border-gray-400 hover:bg-gray-50'
          } ${isHovered || isSelected ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {isSelected ? (
            <CheckIcon className="h-4 w-4 text-white" />
          ) : (
            <PlusIcon className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Selection indicator line */}
      {isSelected && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500" />
      )}
    </div>
  );
};

function millisToMinutesAndSeconds(millis) {
  const minutes = Math.floor(millis / 60000);
  const seconds = ((millis % 60000) / 1000).toFixed(0);
  return seconds == 60
    ? minutes + 1 + ":00"
    : minutes + ":" + (seconds < 10 ? "0" : "") + seconds;
}

export default TrackListItem;

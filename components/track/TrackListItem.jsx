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
      className="grid grid-cols-12 gap-4 px-4 py-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 group"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Track Number / Play Button */}
      <div className="col-span-1 flex items-center">
        <div className="w-8 h-8 flex items-center justify-center">
          {isHovered ? (
            <PlayIcon className="h-4 w-4 text-black cursor-pointer hover:scale-110 transition-transform" />
          ) : (
            <span className="text-sm text-gray-500 font-medium">{index}</span>
          )}
        </div>
      </div>

      {/* Track Info */}
      <div className="col-span-6 flex items-center space-x-3">
        <div className="w-12 h-12 bg-gray-200 flex-shrink-0 overflow-hidden">
          {track.album?.images?.[0]?.url ? (
            <img
              src={track.album.images[0].url}
              alt={track.album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-black flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
              </svg>
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-black text-sm font-medium truncate group-hover:text-gray-700 transition-colors">
            {track.name}
          </p>
          <p className="text-gray-600 text-xs truncate">
            {track.artists?.map(artist => artist.name).join(', ')}
          </p>
        </div>
      </div>

      {/* Album */}
      <div className="col-span-3 flex items-center">
        <p className="text-gray-600 text-sm truncate">
          {track.album?.name}
        </p>
      </div>

      {/* Duration & Actions */}
      <div className="col-span-2 flex items-center justify-between">
        <span className="text-gray-600 text-sm">
          {millisToMinutesAndSeconds(track.duration_ms)}
        </span>
        
        {/* Selection Button */}
        <button
          onClick={handleToggleSelect}
          className={`ml-2 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-all duration-200 ${
            isSelected 
              ? 'bg-black border-black' 
              : 'border-gray-300 hover:border-black'
          } ${isHovered ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
        >
          {isSelected ? (
            <CheckIcon className="h-3 w-3 text-white" />
          ) : (
            <PlusIcon className="h-3 w-3 text-gray-600" />
          )}
        </button>
      </div>
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

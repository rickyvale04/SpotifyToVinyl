import { useEffect, useState } from 'react';
import { useRecoilValue, useRecoilState } from 'recoil';
import { selectedPlaylistState } from '../../atoms/selectedPlaylistAtom';
import { selectedTracksState } from '../../atoms/selectedTracksAtom';
import { useRouter } from 'next/router';
import { ChevronLeftIcon, SearchIcon } from '@heroicons/react/outline';
import TrackListItem from './TrackListItem';
import SelectedTracksBar from './SelectedTracksBar';
import useSpotify from '../../hooks/useSpotify';

const TrackBrowser = () => {
  const router = useRouter();
  const selectedPlaylist = useRecoilValue(selectedPlaylistState);
  const [selectedTracks, setSelectedTracks] = useRecoilState(selectedTracksState);
  const [searchTerm, setSearchTerm] = useState('');
  const [tracks, setTracks] = useState([]);
  const [loading, setLoading] = useState(false);
  const spotifyApi = useSpotify();

  // Fetch playlist tracks
  useEffect(() => {
    if (selectedPlaylist && spotifyApi && spotifyApi.getAccessToken()) {
      setLoading(true);
      spotifyApi.getPlaylistTracks(selectedPlaylist.id)
        .then((data) => {
          setTracks(data.body.items);
          setLoading(false);
        })
        .catch((error) => {
          console.error('Error fetching tracks:', error);
          setLoading(false);
        });
    }
  }, [selectedPlaylist, spotifyApi]);

  const filteredTracks = tracks?.filter((item) =>
    item.track?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.track?.artists[0]?.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.track?.album?.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTrackSelect = (track, isSelected) => {
    if (isSelected) {
      setSelectedTracks(prev => [...prev, track]);
    } else {
      setSelectedTracks(prev => prev.filter(t => t.id !== track.id));
    }
  };

  const handleClearSelection = () => {
    setSelectedTracks([]);
  };

  const handleSearchVinyl = (tracks) => {
    // Here you would navigate to the vinyl search page with selected tracks
    console.log('Searching vinyl for tracks:', tracks);
    // You could navigate to a search page or open a modal
    router.push('/search?tracks=' + tracks.map(t => t.id).join(','));
  };

  const isTrackSelected = (track) => {
    return selectedTracks.some(t => t.id === track.id);
  };

  if (!selectedPlaylist) {
    return (
      <div className="flex-grow h-screen bg-white flex items-center justify-center">
        <p className="text-gray-600">No playlist selected</p>
      </div>
    );
  }

  return (
    <div className="flex-grow h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ChevronLeftIcon className="h-4 w-4" />
              <span className="text-sm font-medium">Back</span>
            </button>
            <h1 className="text-black text-lg font-medium">Track Selection</h1>
            <div className="w-16" /> {/* Spacer */}
          </div>

          {/* Playlist Info */}
          <div className="flex items-center space-x-6 mb-6">
            <div className="w-20 h-20 bg-gray-200 flex-shrink-0 overflow-hidden">
              {selectedPlaylist.images?.[0]?.url ? (
                <img
                  src={selectedPlaylist.images[0].url}
                  alt={selectedPlaylist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
                  </svg>
                </div>
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="text-black text-2xl font-medium truncate mb-1">{selectedPlaylist.name}</h2>
              {selectedPlaylist.description && (
                <p className="text-gray-600 text-sm mb-2 line-clamp-2">
                  {selectedPlaylist.description}
                </p>
              )}
              <div className="flex items-center space-x-6 text-xs text-gray-600">
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
                  </svg>
                  <span>{selectedPlaylist.tracks?.total || tracks.length} tracks</span>
                </span>
                <span className="flex items-center space-x-1">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  <span>By {selectedPlaylist.owner?.display_name}</span>
                </span>
                {selectedPlaylist.public !== undefined && (
                  <span className="flex items-center space-x-1">
                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clipRule="evenodd"/>
                      <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
                    </svg>
                    <span>{selectedPlaylist.public ? 'Public' : 'Private'}</span>
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-50 p-4 text-center">
              <p className="text-2xl font-medium text-black">{tracks.length}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Total Tracks</p>
            </div>
            <div className="bg-gray-50 p-4 text-center">
              <p className="text-2xl font-medium text-black">{selectedTracks.length}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Selected</p>
            </div>
            <div className="bg-gray-50 p-4 text-center">
              <p className="text-2xl font-medium text-black">
                {Math.round(tracks.reduce((total, item) => total + (item.track?.duration_ms || 0), 0) / 60000)}
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Minutes</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tracks, artists, or albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 bg-white text-black text-sm placeholder-gray-500 focus:outline-none focus:ring-1 focus:ring-black focus:border-black"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <span className="text-sm text-gray-600">Loading tracks...</span>
            </div>
          </div>
        ) : (
          <>
            {/* Track List Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 border-b border-gray-200 text-xs font-medium text-gray-600 uppercase tracking-wide">
              <div className="col-span-1">#</div>
              <div className="col-span-6">Title</div>
              <div className="col-span-3">Album</div>
              <div className="col-span-2">Duration</div>
            </div>

            {/* Track List */}
            <div className="space-y-0">
              {filteredTracks?.map((item, index) => (
                <TrackListItem 
                  key={item.track?.id + '-' + index} 
                  track={item.track} 
                  index={index + 1}
                  isSelected={isTrackSelected(item.track)}
                  onToggleSelect={(isSelected) => handleTrackSelect(item.track, isSelected)}
                />
              ))}
            </div>

            {filteredTracks?.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-600">No tracks found matching your search.</p>
              </div>
            )}
          </>
        )}
      </div>

      {/* Selected Tracks Bar */}
      <SelectedTracksBar 
        selectedTracks={selectedTracks}
        onClearSelection={handleClearSelection}
        onSearchVinyl={handleSearchVinyl}
      />
    </div>
  );
};

export default TrackBrowser;

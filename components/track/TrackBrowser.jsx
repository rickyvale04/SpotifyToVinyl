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
    <div className="flex-grow min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-6">
            <button
              onClick={() => router.back()}
              className="flex items-center space-x-2 text-gray-600 hover:text-black transition-colors duration-200"
            >
              <ChevronLeftIcon className="h-5 w-5" />
              <span className="text-sm font-medium">Back to Playlists</span>
            </button>
            <div className="text-center">
              <h1 className="text-black text-xl font-medium">Track Selection</h1>
              <p className="text-gray-500 text-xs mt-1">Choose tracks to find on vinyl</p>
            </div>
            <div className="w-32" /> {/* Spacer */}
          </div>

          {/* Playlist Info */}
          <div className="flex items-start space-x-8 mb-8">
            <div className="w-32 h-32 bg-gray-200 flex-shrink-0 overflow-hidden shadow-lg">
              {selectedPlaylist.images?.[0]?.url ? (
                <img
                  src={selectedPlaylist.images[0].url}
                  alt={selectedPlaylist.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-black flex items-center justify-center">
                  <svg className="w-16 h-16 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
                  </svg>
                </div>
              )}
            </div>
            
            <div className="flex-1 min-w-0">
              <div className="mb-4">
                <p className="text-gray-500 text-xs font-medium uppercase tracking-wide mb-2">PLAYLIST</p>
                <h2 className="text-black text-3xl font-medium truncate mb-3">{selectedPlaylist.name}</h2>
                {selectedPlaylist.description && (
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2 leading-relaxed">
                    {selectedPlaylist.description}
                  </p>
                )}
              </div>
              
              <div className="flex items-center space-x-8 text-sm text-gray-600">
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd"/>
                  </svg>
                  <span>By {selectedPlaylist.owner?.display_name}</span>
                </span>
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
                  </svg>
                  <span>{selectedPlaylist.tracks?.total || tracks.length} tracks</span>
                </span>
                <span className="flex items-center space-x-2">
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd"/>
                  </svg>
                  <span>{Math.round(tracks.reduce((total, item) => total + (item.track?.duration_ms || 0), 0) / 60000)} min</span>
                </span>
                {selectedPlaylist.public !== undefined && (
                  <span className="flex items-center space-x-2">
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
          <div className="grid grid-cols-4 gap-6 mb-8">
            <div className="bg-gray-50 border border-gray-200 p-6 text-center hover:bg-gray-100 transition-colors duration-200">
              <p className="text-3xl font-medium text-black mb-1">{tracks.length}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Total Tracks</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6 text-center hover:bg-gray-100 transition-colors duration-200">
              <p className="text-3xl font-medium text-black mb-1">{selectedTracks.length}</p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Selected</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6 text-center hover:bg-gray-100 transition-colors duration-200">
              <p className="text-3xl font-medium text-black mb-1">
                {Math.round(tracks.reduce((total, item) => total + (item.track?.duration_ms || 0), 0) / 60000)}
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Minutes</p>
            </div>
            <div className="bg-gray-50 border border-gray-200 p-6 text-center hover:bg-gray-100 transition-colors duration-200">
              <p className="text-3xl font-medium text-black mb-1">
                {new Set(tracks.map(item => item.track?.artists?.[0]?.name)).size}
              </p>
              <p className="text-xs text-gray-600 uppercase tracking-wide">Artists</p>
            </div>
          </div>

          {/* Search Bar */}
          <div className="relative max-w-md">
            <SearchIcon className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search tracks, artists, or albums..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border border-gray-300 bg-white text-black text-sm placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition-all duration-200"
            />
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-6">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="flex flex-col items-center space-y-4">
              <div className="w-8 h-8 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
              <div className="text-center">
                <p className="text-sm text-gray-600">Loading tracks...</p>
                <p className="text-xs text-gray-500 mt-1">Please wait while we fetch your playlist</p>
              </div>
            </div>
          </div>
        ) : (
          <>
            {/* Results Summary */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center space-x-4">
                <h3 className="text-lg font-medium text-black">
                  {searchTerm ? `Search Results` : 'All Tracks'}
                </h3>
                <span className="bg-gray-100 text-gray-600 px-3 py-1 text-sm font-medium">
                  {filteredTracks?.length || 0} tracks
                </span>
              </div>
              
              {selectedTracks.length > 0 && (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    {selectedTracks.length} selected
                  </span>
                  <button
                    onClick={handleClearSelection}
                    className="text-sm text-gray-600 hover:text-black border border-gray-300 hover:border-black px-3 py-1 transition-colors duration-200"
                  >
                    Clear Selection
                  </button>
                </div>
              )}
            </div>

            {/* Track List */}
            <div className="bg-white border border-gray-200 overflow-hidden">
              {/* Track List Header */}
              <div className="bg-gray-50 border-b border-gray-200">
                <div className="grid grid-cols-12 gap-4 px-6 py-4 text-xs font-medium text-gray-700 uppercase tracking-wide">
                  <div className="col-span-1">#</div>
                  <div className="col-span-6">Title</div>
                  <div className="col-span-3">Album</div>
                  <div className="col-span-2">Duration</div>
                </div>
              </div>

              {/* Track Items */}
              <div className="divide-y divide-gray-100">
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
            </div>

            {/* Empty State */}
            {filteredTracks?.length === 0 && !loading && (
              <div className="text-center py-20">
                <div className="mb-4">
                  <svg className="w-16 h-16 text-gray-300 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
                  </svg>
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No tracks found' : 'No tracks available'}
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  {searchTerm 
                    ? `No tracks found matching "${searchTerm}". Try adjusting your search terms.`
                    : 'This playlist appears to be empty or tracks could not be loaded.'
                  }
                </p>
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm('')}
                    className="mt-4 text-sm text-gray-600 hover:text-black border border-gray-300 hover:border-black px-4 py-2 transition-colors duration-200"
                  >
                    Clear Search
                  </button>
                )}
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

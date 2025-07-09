import { useState, useEffect } from 'react';
import { useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { playlistIdState } from '../../atoms/playlistId';
import { selectedPlaylistState } from '../../atoms/selectedPlaylistAtom';

const PlaylistCarousel = ({ playlists = [] }) => {
  const [visiblePlaylists, setVisiblePlaylists] = useState(10);
  const [showAll, setShowAll] = useState(false);
  const [columns, setColumns] = useState(4);
  const router = useRouter();
  const setPlaylistId = useSetRecoilState(playlistIdState);
  const setSelectedPlaylist = useSetRecoilState(selectedPlaylistState);

  // Calculate optimal number of columns based on window width
  useEffect(() => {
    const calculateColumns = () => {
      const width = window.innerWidth;
      // Minimum playlist width: 180px, with padding and gaps
      const minPlaylistWidth = 180;
      const sidebarWidth = 200; // Approximate sidebar width
      const padding = 100; // Container padding
      const gapWidth = 16; // Gap between items
      
      const availableWidth = width - sidebarWidth - padding;
      const cols = Math.max(2, Math.floor((availableWidth + gapWidth) / (minPlaylistWidth + gapWidth)));
      
      // Set reasonable limits
      const maxCols = Math.min(cols, 8);
      setColumns(maxCols);
    };

    calculateColumns();
    window.addEventListener('resize', calculateColumns);
    
    return () => window.removeEventListener('resize', calculateColumns);
  }, []);

  const handlePlaylistClick = (playlist) => {
    setPlaylistId(playlist.id);
    setSelectedPlaylist(playlist);
    router.push(`/playlist/${playlist.id}`);
  };

  const displayedPlaylists = showAll ? playlists : playlists.slice(0, visiblePlaylists);

  if (playlists.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-black border border-gray-800 rounded-sm">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-800 rounded-sm flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-white text-lg mb-2 font-medium">Caricamento playlist...</p>
          <p className="text-gray-400 text-sm">Attendere mentre recuperiamo le tue playlist da Spotify</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Jump back in</h2>
        <p className="text-gray-400 text-sm">Seleziona una playlist per scoprire quali brani sono disponibili su vinile</p>
      </div>

      {/* Grid Layout - Dynamic responsive columns */}
      <div 
        className="grid gap-4 mb-8 transition-all duration-300"
        style={{
          gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
        }}
      >
        {displayedPlaylists.map((playlist, index) => (
          <div 
            key={playlist.id}
            className="group cursor-pointer transition-all duration-300 hover:bg-gray-900 p-3 rounded-lg min-w-0"
            onClick={() => handlePlaylistClick(playlist)}
          >
            {/* Playlist Image */}
            <div className="relative mb-3 aspect-square">
              <img
                src={playlist.images?.[0]?.url || '/recordImage.png'}
                alt={playlist.name}
                className="w-full h-full object-cover rounded-lg shadow-lg group-hover:shadow-xl transition-all duration-300"
                loading="lazy"
              />
              
              {/* Play Button Overlay */}
              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300 flex items-center justify-center rounded-lg">
                <div className="opacity-0 group-hover:opacity-100 transition-all duration-300 transform scale-75 group-hover:scale-100">
                  <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg">
                    <svg className="w-5 h-5 text-black ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M8 5v10l7-5-7-5z"/>
                    </svg>
                  </div>
                </div>
              </div>
            </div>

            {/* Playlist Info */}
            <div className="space-y-1">
              <h3 className="text-white font-medium text-sm leading-tight truncate group-hover:text-gray-100 transition-colors">
                {playlist.name}
              </h3>
              <div className="flex items-center space-x-2 text-xs text-gray-400">
                <span className="truncate">{playlist.owner?.display_name || 'Playlist'}</span>
                {playlist.tracks?.total && (
                  <>
                    <span>•</span>
                    <span className="whitespace-nowrap">{playlist.tracks.total} brani</span>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Show More/Less Button */}
      {playlists.length > visiblePlaylists && (
        <div className="text-center">
          <button
            onClick={() => setShowAll(!showAll)}
            className="text-gray-400 hover:text-white text-sm font-medium transition-colors duration-200 underline hover:no-underline"
          >
            {showAll ? 'Mostra meno' : `Mostra tutte le ${playlists.length} playlist`}
          </button>
        </div>
      )}
    </div>
  );
};

export default PlaylistCarousel;

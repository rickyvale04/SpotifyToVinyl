import { useState, useEffect } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/outline';
import { useSetRecoilState } from 'recoil';
import { useRouter } from 'next/router';
import { playlistIdState } from '../../atoms/playlistId';
import { selectedPlaylistState } from '../../atoms/selectedPlaylistAtom';

const PlaylistCarousel = ({ playlists = [] }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [slidesToShow, setSlidesToShow] = useState(4);
  const router = useRouter();
  const setPlaylistId = useSetRecoilState(playlistIdState);
  const setSelectedPlaylist = useSetRecoilState(selectedPlaylistState);

  // Responsive slides calculation
  useEffect(() => {
    const updateSlidesToShow = () => {
      if (window.innerWidth < 640) setSlidesToShow(1);
      else if (window.innerWidth < 768) setSlidesToShow(2);
      else if (window.innerWidth < 1024) setSlidesToShow(3);
      else setSlidesToShow(4);
    };

    updateSlidesToShow();
    window.addEventListener('resize', updateSlidesToShow);
    return () => window.removeEventListener('resize', updateSlidesToShow);
  }, []);

  const maxIndex = Math.max(0, playlists.length - slidesToShow);

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || playlists.length === 0 || maxIndex === 0) return;

    const interval = setInterval(() => {
      setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
    }, 4000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, maxIndex, playlists.length]);

  const nextSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev >= maxIndex ? 0 : prev + 1));
  };

  const prevSlide = () => {
    setIsAutoPlaying(false);
    setCurrentIndex(prev => (prev <= 0 ? maxIndex : prev - 1));
  };

  const handlePlaylistClick = (playlist) => {
    setPlaylistId(playlist.id);
    setSelectedPlaylist(playlist);
    // Navigate to playlist page
    router.push(`/playlist/${playlist.id}`);
  };

  if (playlists.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-white border border-gray-200 rounded-sm">
        <div className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 bg-black rounded-sm flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3" />
            </svg>
          </div>
          <p className="text-black text-lg mb-2 font-medium">Caricamento playlist...</p>
          <p className="text-gray-600 text-sm">Attendere mentre recuperiamo le tue playlist da Spotify</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full playlist-carousel-container">
      <div className="mb-8">
        <h2 className="text-2xl font-medium text-black mb-2">Le tue Playlist</h2>
        <p className="text-gray-600 text-sm">Seleziona una playlist per scoprire quali brani sono disponibili su vinile</p>
      </div>

      {/* Carousel Container */}
      <div className="relative overflow-hidden bg-white border border-gray-200 p-6">
        <div 
          className="flex gap-6 transition-transform duration-700 ease-in-out"
          style={{ 
            transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)`,
            width: `${Math.max(100, (playlists.length / slidesToShow) * 100)}%`
          }}
        >
          {playlists.map((playlist, index) => (
            <div 
              key={playlist.id}
              className="flex-shrink-0"
              style={{ width: `${100 / playlists.length}%` }}
            >
              <div 
                className="bg-white border border-gray-200 p-4 cursor-pointer hover:border-black transition-all duration-300"
                onClick={() => handlePlaylistClick(playlist)}
              >
                {/* Playlist Image */}
                <div className="relative mb-4 group">
                  <img
                    src={playlist.images?.[0]?.url || '/recordImage.png'}
                    alt={playlist.name}
                    className="w-full aspect-square object-cover border border-gray-200"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300 flex items-center justify-center">
                    <div className="opacity-0 group-hover:opacity-100 transition-all duration-300">
                      <div className="w-12 h-12 bg-black rounded-sm flex items-center justify-center">
                        <svg className="w-6 h-6 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M8 5v10l7-5-7-5z"/>
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Playlist Info */}
                <div>
                  <h3 className="text-black font-medium text-sm mb-1 truncate">
                    {playlist.name}
                  </h3>
                  <p className="text-gray-600 text-xs mb-1">
                    {playlist.tracks?.total || 0} brani
                  </p>
                  {playlist.description && (
                    <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">
                      {playlist.description.replace(/<[^>]*>/g, '')}
                    </p>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Navigation Arrows */}
        {playlists.length > slidesToShow && (
          <>
            <button
              onClick={prevSlide}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white p-2 transition-all duration-300"
              disabled={currentIndex === 0}
            >
              <ChevronLeftIcon className="w-5 h-5" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black hover:bg-gray-800 text-white p-2 transition-all duration-300"
              disabled={currentIndex === maxIndex}
            >
              <ChevronRightIcon className="w-5 h-5" />
            </button>
          </>
        )}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between mt-6">
        <div className="flex items-center space-x-2">
          <button
            onClick={() => setIsAutoPlaying(!isAutoPlaying)}
            className={`px-3 py-1 text-xs font-medium transition-all duration-300 border ${
              isAutoPlaying 
                ? 'bg-black text-white border-black' 
                : 'bg-white text-black border-gray-300 hover:border-black'
            }`}
          >
            {isAutoPlaying ? 'Auto-scorrimento' : 'Scorrimento manuale'}
          </button>
        </div>
        <div className="text-gray-600 text-xs">
          {playlists.length} playlist • {playlists.reduce((acc, playlist) => acc + (playlist.tracks?.total || 0), 0)} brani
        </div>
      </div>

      {/* Dots Indicator */}
      {playlists.length > slidesToShow && maxIndex > 0 && (
        <div className="flex justify-center mt-4 space-x-2">
          {Array.from({ length: maxIndex + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsAutoPlaying(false);
                setCurrentIndex(index);
              }}
              className={`h-2 transition-all duration-200 ${
                currentIndex === index 
                  ? 'bg-black w-6' 
                  : 'bg-gray-400 hover:bg-gray-600 w-2'
              }`}
            />
          ))}
        </div>
      )}

      {/* Progress bar for auto-play */}
      {isAutoPlaying && maxIndex > 0 && (
        <div className="mt-3">
          <div className="w-full bg-gray-200 h-1">
            <div 
              className="bg-black h-1 transition-all duration-100"
              style={{ width: `${((currentIndex + 1) / (maxIndex + 1)) * 100}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PlaylistCarousel;

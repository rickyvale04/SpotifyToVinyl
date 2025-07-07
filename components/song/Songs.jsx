import React, { useState } from 'react';
import { playlistState } from '../../atoms/playlistAtom';
import { useRecoilValue } from 'recoil';
import Song from './Song';
import PageButton from '../ui/buttons/PageButton';

const Songs = ({ tracks = [] }) => {

  // Pagination
  const itemsPerPage = 10;
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = Math.ceil((tracks?.length || 0) / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const getCurrentTracks = () => {
    if (!tracks) return [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return tracks.slice(startIndex, endIndex);
  };

  return (
    <div className='flex flex-col space-y-1 pb-12 text-white bg-gray-900'>
      <div className="bg-gray-800 border-b border-gray-700 px-6 py-4">
        <div className="grid grid-cols-12 gap-4 text-xs font-medium text-gray-400 uppercase tracking-wide">
          <div className="col-span-1">#</div>
          <div className="col-span-6">Title</div>
          <div className="col-span-3">Album</div>
          <div className="col-span-2">Actions</div>
        </div>
      </div>
      
      <div className="divide-y divide-gray-800">
        {getCurrentTracks().length > 0 ? (
          getCurrentTracks().map((track, i) => (
            <Song key={track.track.id} order={i + 1 + (currentPage - 1) * itemsPerPage} track={track.track} />
          ))
        ) : (
          <div className="px-6 py-20 text-center">
            <svg className="w-16 h-16 text-gray-600 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
            </svg>
            <p className="text-gray-400">No tracks available in this playlist.</p>
          </div>
        )}
      </div>
      
      {totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-800 border-t border-gray-700">
          <PageButton
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={handlePageChange}
          />
        </div>
      )}
    </div>
  );
};

export default Songs;

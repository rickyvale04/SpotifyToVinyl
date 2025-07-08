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
    <div className='flex flex-col space-y-2 pb-12 text-[var(--primary-text)]'>
        {getCurrentTracks().length > 0 ? (
          getCurrentTracks().map((track, i) => (
            <Song key={track.track.id} order={i + 1 + (currentPage - 1) * itemsPerPage} track={track.track} />
          ))
        ) : (
          <p className="text-[var(--primary-text)] opacity-70">No tracks available in this playlist.</p>
        )}
      <div className="mt-4">
        <PageButton
          currentPage={currentPage}
          totalPages={totalPages}
          setCurrentPage={handlePageChange}
        />
      </div>
    </div>
  );
};

export default Songs;

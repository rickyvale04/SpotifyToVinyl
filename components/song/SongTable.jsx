import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistState } from "../../atoms/playlistAtom";
import useSpotify from "../../hooks/useSpotify";
import Song from "./Song";

const SongTable = ({ playlistID }) => {
  const [error, setError] = useState(""); // State to hold error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  // Get Spotify API instance
  const spotifyAPI = useSpotify();
  // Get and set current playlist using Recoil
  const [currentPlaylist, setCurrentPlaylist] = useRecoilState(playlistState);

  // Fetch playlist when component mounts or playlistID changes
  useEffect(() => {
    // Only set loading state after component mounts on client side
    if (typeof window !== 'undefined' && spotifyAPI && spotifyAPI.getAccessToken && spotifyAPI.getAccessToken() && playlistID) {
      setIsLoading(true);
      spotifyAPI
        .getPlaylist(playlistID)
        .then((data) => {
          setCurrentPlaylist(data.body);
          setIsLoading(false);
        })
        .catch((err) => {
          console.error("Playlist failed to load.", err);
          setError("Failed to load playlist. Please try again.");
          setIsLoading(false);
        });
    } else if (spotifyAPI === null || !playlistID) {
      setIsLoading(false);
    }
  }, [spotifyAPI, playlistID, setCurrentPlaylist]);

  // Pagination state and logic
  const itemsPerPage = 10;
  const totalPages = Math.ceil(
    (currentPlaylist?.tracks?.items?.length ?? 0) / itemsPerPage
  );
  const [currentPage, setCurrentPage] = useState(1);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  // Get current paginated playlist tracks
  const getCurrentPlaylist = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return currentPlaylist?.tracks?.items?.slice(startIndex, endIndex) || [];
  };

  // Determine visible page numbers for pagination
  const getVisiblePages = () => {
    const maxVisiblePages = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    if (endPage - startPage < maxVisiblePages - 1) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    return Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);
  };

  return (
    <>
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
          <button
            onClick={() => {
              setError("");
              if (playlistID) {
                setIsLoading(true);
                spotifyAPI.getPlaylist(playlistID)
                  .then((data) => {
                    setCurrentPlaylist(data.body);
                    setIsLoading(false);
                  })
                  .catch((err) => {
                    console.error("Retry failed:", err);
                    setError("Failed to load playlist. Please try again.");
                    setIsLoading(false);
                  });
              }
            }}
            className="ml-2 text-sm underline hover:text-red-900"
          >
            Retry
          </button>
        </div>
      )}
      {isLoading ? (
        <div className="flex justify-center items-center h-32 mt-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[var(--accent)]"></div>
        </div>
      ) : currentPlaylist?.tracks?.items?.length === 0 ? (
        <p className="text-gray-500 mt-4">No songs found in this playlist.</p>
      ) : (
        <>
          <div className="overflow-x-auto mt-4">
            <table className="table w-full border-collapse">
              <thead>
                <tr className="bg-[var(--secondary-bg)]">
                  <th className="p-3 text-left text-[var(--primary-text)] font-semibold">Song Name / Artist</th>
                  <th className="p-3 text-left text-[var(--primary-text)] font-semibold">Album</th>
                  <th className="p-3 text-center text-[var(--primary-text)] font-semibold">On Vinyl?</th>
                  <th className="p-3"></th>
                  <th className="p-3 text-center text-[var(--primary-text)] font-semibold">Spotify Link</th>
                </tr>
              </thead>
              <tbody>
                {getCurrentPlaylist().map((track, index) => (
                  <Song key={track.track.id} track={track.track} className={index % 2 === 0 ? "bg-[var(--background)]" : "bg-[var(--secondary-bg)]"} />
                ))}
              </tbody>
            </table>
          </div>
          <div className="pagination flex justify-center items-center mt-4 space-x-2">
            <button
              onClick={handlePrevPage}
              className="btn px-3 py-1 border border-[var(--border)] text-[var(--primary-text)] hover:bg-[var(--secondary-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {getVisiblePages().map((page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`btn px-3 py-1 border border-[var(--border)] text-[var(--primary-text)] hover:bg-[var(--secondary-bg)] ${page === currentPage ? "bg-[var(--accent)] text-white" : ""}`}
              >
                {page}
              </button>
            ))}
            <button
              onClick={handleNextPage}
              className="btn px-3 py-1 border border-[var(--border)] text-[var(--primary-text)] hover:bg-[var(--secondary-bg)] disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default SongTable;

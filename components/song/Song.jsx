import useSpotify from "../../hooks/useSpotify";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import VinylItem from "../main/VinylItem";
import defaultRecord from "../../public/recordImage.png";

const Song = ({ track, order }) => {
  const spotifyAPI = useSpotify();
  const itemsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const [vinyls, setVinyls] = useState([]);
  const [showVinyls, setShowVinyls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const vinylsRef = useRef(null);

  const totalPages = Math.ceil(vinyls.length / itemsPerPage);

  const getCurrentVinyls = () => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    return vinyls.slice(startIndex, endIndex);
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  function songHasVinyl(track) {
    const artist = track.artists[0].name;
    const trackName = track.name;
    const albumName = track.album;
    const cacheKey = `${artist}_${trackName}`;
    const cachedResponse = localStorage.getItem(cacheKey);

    if (cachedResponse) {
      const parsedResponse = JSON.parse(cachedResponse);
      setVinyls(parsedResponse.results);
    } else {
      const makeApiCall = () => {
        axios
          .get(`/api/discogsSearch`, {
            params: {
              q: artist,
              track: trackName,
              key: process.env.NEXT_PUBLIC_DISC_ID,
              secret: process.env.NEXT_PUBLIC_DISC_SECRET,
            },
          })
          .then((response) => {
            setVinyls(response.data.results);
            localStorage.setItem(cacheKey, JSON.stringify(response.data));
          })
          .catch((error) => {
            if (error.response && error.response.status === 404) {
              console.log("No vinyls found");
            } else {
              console.log("Failed to get Vinyls", error);
            }
          });
      };

      // Check if the current minute's API call count exceeds the limit
      const currentTime = new Date();
      const currentMinute = currentTime.getMinutes();
      const lastApiCallMinute = parseInt(
        localStorage.getItem("lastApiCallMinute"),
        10
      );

      if (!lastApiCallMinute || lastApiCallMinute !== currentMinute) {
        localStorage.setItem("lastApiCallMinute", currentMinute);
        localStorage.setItem("apiCallCount", "1");
        makeApiCall();
      } else {
        const apiCallCount =
          parseInt(localStorage.getItem("apiCallCount"), 10) || 0;

        if (apiCallCount >= 60) {
          setIsLoading(true);
          axios
            .get(`/api/discogsSearch`, {
              params: {
                q: artist,
                track: trackName,
                key: process.env.NEXT_PUBLIC_DISC_ID,
                secret: process.env.NEXT_PUBLIC_DISC_SECRET,
              },
            })
            .then((response) => {
              setIsLoading(false);
              if (response.status === 200) {
                setVinyls(response.data.results);
                localStorage.setItem(cacheKey, JSON.stringify(response.data));
              }
            })
            .catch((error) => {
              setIsLoading(false);
              if (error.response && error.response.status === 404) {
                console.log("No vinyls found");
              } else {
                console.log("Failed to get Vinyls", error);
              }
            });
        } else {
          localStorage.setItem("apiCallCount", (apiCallCount + 1).toString());
          makeApiCall();
        }
      }
    }
  }

  useEffect(() => {
    songHasVinyl(track);
  }, [track]);

  return (
    <tr key={track.id} className="border-b border-[var(--border)] hover:bg-[var(--secondary-bg)]">
      <td className="py-3 px-2" colSpan="5">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-center">
          <div className="flex items-center gap-3 col-span-1 md:col-span-2">
            <div className="w-6 text-center text-[var(--primary-text)] opacity-70">
              {order}
            </div>
            <div className="avatar">
              <div className="w-10 h-10 border border-[var(--border)]">
                <img
                  src={
                    track.album.images?.[0]?.url || defaultRecord
                  }
                  alt="Track Artwork"
                />
              </div>
            </div>
            <div>
              <div className="font-bold text-[var(--primary-text)]">{track.name}</div>
              <div className="text-sm text-[var(--primary-text)] opacity-70">{track.artists[0].name}</div>
            </div>
          </div>
          <div className="col-span-1 md:col-span-1">
            <div className="text-[var(--primary-text)]">{track.album.name}</div>
            <div className="text-xs text-[var(--primary-text)] opacity-70 mt-1">
              Release Date: {track.album.release_date}
            </div>
          </div>
          <div className="flex justify-center col-span-1 md:col-span-1">
            {vinyls.length > 0 ? (
              <CheckIcon
                className="w-6 h-6 text-[var(--accent)] cursor-pointer"
                onClick={() => setShowVinyls(!showVinyls)}
              />
            ) : (
              <XIcon className="w-6 h-6 text-[var(--primary-text)] opacity-50" />
            )}
          </div>
          <div className="flex justify-center col-span-1 md:col-span-1">
            <button
              className="text-[var(--primary-text)] hover:text-[var(--accent)] text-sm font-bold border border-[var(--border)] px-3 py-1 rounded"
              onClick={() =>
                document.getElementById(`my_modal_${track.id}`).showModal()
              }
            >
              Vinyl Details
            </button>
          </div>
          {/* Removed Spotify Logo for better visibility */}
        </div>
      </td>
      <td style={{ display: 'none' }}>
        <dialog id={`my_modal_${track.id}`} className="modal">
          <div className="modal-box w-full bg-[var(--background)] text-[var(--primary-text)]">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-[var(--border)]">
                  <th className="text-[var(--primary-text)]">Album</th>
                  <th className="text-[var(--primary-text)]">Country</th>
                  <th className="text-[var(--primary-text)]">Year</th>
                  <th className="text-[var(--primary-text)]">Label</th>
                  <th className="text-[var(--primary-text)]">Format</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vinyls.length === 0 ? (
                  <tr className="border-b border-[var(--border)]">
                    <td colSpan="5" className="text-[var(--primary-text)] opacity-70">No Vinyl Details</td>
                  </tr>
                ) : (
                  getCurrentVinyls().map((vinyl, index) => (
                    <VinylItem key={vinyl.id} vinyl={vinyl} index={index + 1} />
                  ))
                )}
              </tbody>
            </table>
            {vinyls.length > 0 && (
              <div className="pagination flex justify-center mt-4 gap-2">
                {Array.from({ length: totalPages }, (_, index) => (
                  <button
                    key={index}
                    className={`px-3 py-1 border border-[var(--border)] text-[var(--primary-text)] hover:text-[var(--accent)] hover:border-[var(--accent)] rounded ${
                      currentPage === index + 1 ? "bg-[var(--secondary-bg)]" : ""
                    }`}
                    onClick={() => handlePageChange(index + 1)}
                  >
                    {index + 1}
                  </button>
                ))}
              </div>
            )}
            <div className="modal-action">
              <form method="dialog">
                <button className="text-[var(--primary-text)] hover:text-[var(--accent)] border border-[var(--border)] px-3 py-1 rounded">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </td>
      {/* Removed Spotify Logo link for better visibility */}
    </tr>
  );
};

export default Song;

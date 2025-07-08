import useSpotify from "../../hooks/useSpotify";
import { CheckIcon, XIcon } from "@heroicons/react/outline";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import VinylItem from "../main/VinylItem";
import { useDiscogsWantlist } from "../../hooks/useDiscogsWantlist";
import defaultRecord from "../../public/recordImage.png";

const Song = ({ track, order }) => {
  const spotifyAPI = useSpotify();
  const { addToWantlist, checkWantlistStatus, loading: wantlistLoading, isLoggedIn } = useDiscogsWantlist();
  const itemsPerPage = 5;

  const [currentPage, setCurrentPage] = useState(1);
  const [vinyls, setVinyls] = useState([]);
  const [showVinyls, setShowVinyls] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [addingToWantlist, setAddingToWantlist] = useState(false);
  const [wantlistStatus, setWantlistStatus] = useState(null); // null = not checked, true = in wantlist, false = not in wantlist
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

  const handleAddToWantlist = async () => {
    if (!isLoggedIn) {
      alert("Please log in to Discogs to add items to your wantlist.");
      return;
    }

    if (vinyls.length === 0) {
      alert("No vinyl records found for this track.");
      return;
    }

    const firstVinyl = vinyls[0];
    if (!firstVinyl.id) {
      alert("Unable to add this item - missing release ID.");
      return;
    }

    setAddingToWantlist(true);
    try {
      // Only check wantlist status when button is pressed
      const inWantlist = await checkWantlistStatus(firstVinyl.id);
      
      if (inWantlist) {
        setWantlistStatus(true);
        // Show already in wantlist message
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded shadow-lg z-50';
        message.textContent = 'This item is already in your wantlist!';
        document.body.appendChild(message);
        
        setTimeout(() => {
          if (document.body.contains(message)) {
            document.body.removeChild(message);
          }
        }, 3000);
        return;
      }

      // If not in wantlist, add it
      await addToWantlist(firstVinyl.id);
      setWantlistStatus(true);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      successMessage.textContent = 'Added to Discogs wantlist!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error with wantlist operation:', error);
      alert(`Failed to process wantlist request: ${error.message}`);
    } finally {
      setAddingToWantlist(false);
    }
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
    <div className="grid grid-cols-12 gap-4 px-6 py-4 hover:bg-gray-800 transition-colors duration-200 group">
      <div className="col-span-1 flex items-center">
        <span className="text-sm text-gray-400 group-hover:text-gray-300">
          {order}
        </span>
      </div>
      
      <div className="col-span-6 flex items-center space-x-4 min-w-0">
        <div className="w-12 h-12 bg-gray-800 flex-shrink-0 overflow-hidden border border-gray-700 group-hover:border-gray-600 transition-colors duration-200">
          {track.album?.images?.[0]?.url ? (
            <img
              src={track.album.images[0].url}
              alt={track.album.name}
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full bg-gray-800 flex items-center justify-center">
              <svg className="w-5 h-5 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
              </svg>
            </div>
          )}
        </div>
        
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-white truncate group-hover:text-gray-100 transition-colors duration-200">
            {track.name}
          </p>
          <p className="text-xs text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-200">
            {track.artists?.map(artist => artist.name).join(', ')}
          </p>
        </div>
      </div>
      
      <div className="col-span-3 flex items-center">
        <div className="min-w-0 flex-1">
          <p className="text-sm text-gray-400 truncate group-hover:text-gray-300 transition-colors duration-200">
            {track.album?.name}
          </p>
          <p className="text-xs text-gray-500 truncate">
            {track.album?.release_date}
          </p>
        </div>
      </div>
      
      <div className="col-span-2 flex items-center justify-end space-x-2">
        {vinyls.length > 0 ? (
          <div className="flex items-center space-x-2">
            <CheckIcon className="w-5 h-5 text-green-400" />
            <span className="text-xs text-green-400">Available</span>
          </div>
        ) : (
          <div className="flex items-center space-x-2">
            <XIcon className="w-5 h-5 text-gray-500" />
            <span className="text-xs text-gray-500">Not found</span>
          </div>
        )}
        
        {vinyls.length > 0 && (
          <button
            onClick={handleAddToWantlist}
            disabled={addingToWantlist || !isLoggedIn || wantlistStatus === true}
            className={`text-xs px-3 py-1 transition-colors duration-200 ${
              wantlistStatus === true
                ? 'text-green-400 border border-green-400 cursor-not-allowed'
                : addingToWantlist
                ? 'text-gray-500 border border-gray-500 cursor-not-allowed'
                : isLoggedIn
                ? 'text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400'
                : 'text-gray-600 border border-gray-700 cursor-not-allowed'
            }`}
          >
            {wantlistStatus === true ? (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                In Wantlist
              </span>
            ) : addingToWantlist ? (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : (
              'Add to Wantlist'
            )}
          </button>
        )}
        
        <button
          className="text-xs text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1 transition-colors duration-200"
          onClick={() => document.getElementById(`my_modal_${track.id}`).showModal()}
        >
          Details
        </button>
      </div>

      {/* Modal */}
      <dialog id={`my_modal_${track.id}`} className="modal">
        <div className="modal-box w-full max-w-4xl bg-gray-900 border border-gray-700 text-white">
          <div className="mb-4">
            <h3 className="text-lg font-medium text-white mb-2">Vinyl Details for "{track.name}"</h3>
            <p className="text-sm text-gray-400">by {track.artists?.map(artist => artist.name).join(', ')}</p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-gray-300">Album</th>
                  <th className="text-gray-300">Country</th>
                  <th className="text-gray-300">Year</th>
                  <th className="text-gray-300">Label</th>
                  <th className="text-gray-300">Format</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {vinyls.length === 0 ? (
                  <tr className="border-b border-gray-800">
                    <td colSpan="6" className="text-center py-8">
                      <div className="text-gray-400">
                        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
                        </svg>
                        <p>No vinyl records found</p>
                      </div>
                    </td>
                  </tr>
                ) : (
                  getCurrentVinyls().map((vinyl, index) => (
                    <VinylItem key={vinyl.id} vinyl={vinyl} index={index + 1} />
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          {vinyls.length > 0 && totalPages > 1 && (
            <div className="flex justify-center mt-4 gap-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index}
                  className={`px-3 py-1 text-sm border transition-colors duration-200 ${
                    currentPage === index + 1 
                      ? "bg-gray-700 border-gray-600 text-white" 
                      : "border-gray-600 text-gray-400 hover:text-white hover:border-gray-400"
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
              <button className="text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-4 py-2 transition-colors duration-200">
                Close
              </button>
            </form>
          </div>
        </div>
      </dialog>
    </div>
  );
};

export default Song;

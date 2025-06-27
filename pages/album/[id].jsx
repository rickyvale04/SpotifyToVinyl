import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useRecoilState } from "recoil";
import { playlistState } from "../../atoms/playlistAtom";
import useSpotify from "../../hooks/useSpotify";
import Songs from "../../components/song/Songs";

const AlbumPage = () => {
  const router = useRouter();
  const { id } = router.query;
  const defaultImage = "/recordImage.png";

  // get spotify api
  const spotifyAPI = useSpotify();
  // get playlist from recoil
  const [currentPlaylist, setCurrentPlaylist] = useRecoilState(playlistState);

  // get playlist on load
  useEffect(() => {
    if (spotifyAPI.getAccessToken() && id) {
      spotifyAPI
        .getPlaylist(id)
        .then((data) => setCurrentPlaylist(data.body))
        .catch((err) => console.log("Playlist failed to load.", err));
    }
  }, [spotifyAPI, id]);

  return (
    <div className="bg-[var(--background)] text-[var(--primary-text)]">
      <div className="p-6 md:p-8">
        <div className="flex flex-col md:flex-row items-center md:items-end gap-6 md:gap-8 mb-8">
          <img
            className="h-48 w-48 md:h-64 md:w-64 border border-[var(--border)] object-cover"
            src={currentPlaylist?.images?.[0]?.url || defaultImage}
            alt={currentPlaylist?.name || "Playlist Cover"}
          />
          <div>
            <h1 className="text-2xl md:text-4xl font-bold mb-2">{currentPlaylist?.name}</h1>
            <p className="text-base text-[var(--primary-text)] opacity-80">{currentPlaylist?.description || "No description available"}</p>
            <p className="text-sm mt-2">Owner: {currentPlaylist?.owner?.display_name || "Unknown"}</p>
            <p className="text-sm">Tracks: {currentPlaylist?.tracks?.total || "0"}</p>
          </div>
        </div>

        <div className="border-t border-[var(--border)] pt-6">
          <h2 className="text-xl font-bold mb-4">Tracks</h2>
          <Songs />
        </div>
      </div>
    </div>
  );
};

export default AlbumPage;

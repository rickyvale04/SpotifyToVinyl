import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";
import PlaylistGroup from "../ui/playlist/PlaylistGroup";
import { useRecoilState } from "recoil";
import { playlistState } from "../../atoms/playlistAtom";
import Center from "./Center"; // Import Center component

const Dashboard = () => {
  const spotifyAPI = useSpotify();
  const { data: session, status } = useSession();

  const [localPlaylists, setLocalPlaylists] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [playlistRecoil, setPlaylistRecoil] = useRecoilState(playlistState);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !spotifyAPI) {
      setIsLoading(false);
      return;
    }

    if (spotifyAPI && spotifyAPI.getAccessToken && spotifyAPI.getAccessToken()) {
      setIsLoading(true);
      
      try {
        const localPlaylists = localStorage.getItem("playlists");

        if (localPlaylists) {
          const parsedPlaylists = JSON.parse(localPlaylists);
          setLocalPlaylists(parsedPlaylists);
          setPlaylistRecoil(parsedPlaylists);
          setIsLoading(false);
        } else {
          spotifyAPI.getUserPlaylists().then((data) => {
            setLocalPlaylists(data.body.items);
            localStorage.setItem("playlists", JSON.stringify(data.body.items));
            setPlaylistRecoil(data.body.items);
            setIsLoading(false);
          }).catch((err) => {
            console.error("Failed to fetch playlists:", err);
            setIsLoading(false);
          });
        }
      } catch (error) {
        console.error("Error accessing localStorage:", error);
        setIsLoading(false);
      }
    } else {
      setIsLoading(false);
    }
  }, [session, spotifyAPI, isClient, setPlaylistRecoil]);

  return (
    <div className="py-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="">Your Playlists</h1>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[var(--accent)]"></div>
        </div>
      ) : (
        <div className="flex">
          <div className="w-1/2">
            <PlaylistGroup playlists={localPlaylists} />
          </div>
          <div className="w-1/2">
            <Center />
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;

import { HomeIcon, LibraryIcon, HeartIcon } from "@heroicons/react/outline";
import UserInfo from "./UserInfo";
import { useRouter } from "next/router";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useRecoilState } from "recoil";
import { playlistState, userState } from "../../atoms/playlistAtom";
import { useSession } from "next-auth/react";
import useSpotify from "../../hooks/useSpotify";

function Sidebar() {
  const spotifyAPI = useSpotify();
  const { data: session } = useSession();
  const [localPlaylists, setLocalPlaylists] = useRecoilState(playlistState);
  const [localUser, setLocalUser] = useRecoilState(userState);
  const router = useRouter();
  const [isDiscogsLoggedIn, setIsDiscogsLoggedIn] = useState(false);
  const [isSpotifyLoggedIn, setIsSpotifyLoggedIn] = useState(false);

  useEffect(() => {
    if (!session) return;
    const fetchUserData = async () => {
      const userFromStorage = localStorage.getItem("user");
      const user = userFromStorage
        ? JSON.parse(userFromStorage)
        : await spotifyAPI.getMe().then((data) => data.body);
      setLocalUser(user);
      localStorage.setItem("user", JSON.stringify(user));

      const playlistsFromStorage = localStorage.getItem("playlists");
      const playlists = playlistsFromStorage
        ? JSON.parse(playlistsFromStorage)
        : await spotifyAPI.getUserPlaylists().then((data) => data.body.items);
      setLocalPlaylists(playlists);
      localStorage.setItem("playlists", JSON.stringify(playlists));
    };

    fetchUserData();
  }, [session, spotifyAPI, setLocalPlaylists, setLocalUser]);

  useEffect(() => {
    // Check for login status after component mounts (client-side only)
    if (typeof window !== 'undefined') {
      const discogsTokens = localStorage.getItem("discogs_tokens");
      setIsDiscogsLoggedIn(!!discogsTokens);
      
      const spotifyUser = localStorage.getItem("user");
      const spotifyToken = localStorage.getItem("access_token");
      setIsSpotifyLoggedIn(!!spotifyUser || !!spotifyToken);
    }
  }, []);

  const handleSpotifyLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    localStorage.removeItem("playlists");
    setIsSpotifyLoggedIn(false);
    // Optionally, redirect to home or login page
    router.push("/");
  };

  const handleDiscogsLogout = () => {
    localStorage.removeItem("discogs_tokens");
    setIsDiscogsLoggedIn(false);
    // Optionally, redirect to home or login page
    router.push("/");
  };

  return (
    <div className="p-6 text-[var(--primary-text)] text-sm md:text-base h-full overflow-y-auto">
      <UserInfo user={localUser} />
      <div className="mt-6 space-y-4">
        {isSpotifyLoggedIn ? (
          <button
            onClick={handleSpotifyLogout}
            className="w-full text-center px-4 py-3 text-[var(--primary-text)] hover:text-[var(--accent)] border border-[var(--border)] text-base font-bold bg-[var(--secondary-bg)] rounded"
          >
            Logout from Spotify
          </button>
        ) : (
          <button
            onClick={() => {
              const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
              if (clientId) {
                const { redirectToAuthCodeFlow } = require("../../lib/spotifyAuth");
                redirectToAuthCodeFlow(clientId);
              } else {
                console.error("Spotify Client ID is not defined. Please set NEXT_PUBLIC_CLIENT_ID in your environment variables.");
                alert("Spotify authentication is not configured properly. Please contact support.");
              }
            }}
            className="w-full text-center px-4 py-3 text-[var(--primary-text)] hover:text-[var(--accent)] border border-[var(--border)] text-base font-bold bg-[var(--secondary-bg)] rounded"
          >
            Login with Spotify
          </button>
        )}
        {isDiscogsLoggedIn ? (
          <button
            onClick={handleDiscogsLogout}
            className="w-full text-center px-4 py-3 text-[var(--primary-text)] hover:text-[var(--accent)] border border-[var(--border)] text-base font-bold bg-[var(--secondary-bg)] rounded"
          >
            Logout from Discogs
          </button>
        ) : (
          <button
            onClick={async () => {
              try {
                const response = await fetch("/api/discogs/login");
                const data = await response.json();
                if (data.authorizeUrl) {
                  // Redirect to Discogs authorization page
                  window.location.href = data.authorizeUrl;
                } else {
                  console.error("Failed to get Discogs login URL", data.error);
                  alert("Failed to initiate Discogs login. Please try again.");
                }
              } catch (error) {
                console.error("Error initiating Discogs login:", error);
                alert("Error initiating Discogs login. Please try again.");
              }
            }}
            className="w-full text-center px-4 py-3 text-[var(--primary-text)] hover:text-[var(--accent)] border border-[var(--border)] text-base font-bold bg-[var(--secondary-bg)] rounded"
          >
            Login with Discogs
          </button>
        )}
      </div>
      <hr className="border-b border-[var(--border)] my-6" />

      <div>
        <Link href="/" className="hover:text-[var(--accent)] block mb-3">
          <div className="flex items-center gap-2 px-2 py-1">
            <HomeIcon className="h-5 w-5" />
            <p className="font-bold text-sm">Home</p>
          </div>
        </Link>

        <div className="mb-3">
          <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:text-[var(--accent)]">
            <LibraryIcon className="h-5 w-5" />
            <p className="font-bold text-sm">Your Playlists</p>
          </div>
          <div className="mt-2 text-xs pl-6">
            {localPlaylists && localPlaylists.length > 0 ? (
              localPlaylists.map((playlist) => (
                <div key={playlist.id} className="mb-1">
                  <Link
                    href={`/album/${playlist.id}`}
                    className="block hover:text-[var(--accent)] truncate"
                  >
                    {playlist.name}
                  </Link>
                  <hr className="border-b border-[var(--border)] w-full mt-1" />
                </div>
              ))
            ) : (
              <p>No playlists found.</p>
            )}
          </div>
        </div>

        <div className="mb-3">
          <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:text-[var(--accent)]">
            <HeartIcon className="h-5 w-5" />
            <p className="font-bold text-sm">Saved Vinyls</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

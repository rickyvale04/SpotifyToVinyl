import { HomeIcon, LibraryIcon, SearchIcon } from "@heroicons/react/outline";
import { useEffect, useState } from "react";
import { useRecoilState, useSetRecoilState } from "recoil";
import { playlistState } from "../../atoms/playlistAtom";
import { playlistIdState } from "../../atoms/playlistId";
import { selectedPlaylistState } from "../../atoms/selectedPlaylistAtom";
import { userState } from "../../atoms/userAtom";
import { discogsUserState, discogsTokenState } from "../../atoms/discogsAtom";
import { useSession, signOut, signIn } from "next-auth/react";
import { useRouter } from "next/router";
import useSpotify from "../../hooks/useSpotify";

function Sidebar() {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const router = useRouter();
  const [playlists, setPlaylists] = useRecoilState(playlistState);
  const setPlaylistId = useSetRecoilState(playlistIdState);
  const setSelectedPlaylist = useSetRecoilState(selectedPlaylistState);
  const setUser = useRecoilState(userState)[1];
  const [discogsUser, setDiscogsUser] = useRecoilState(discogsUserState);
  const [discogsToken, setDiscogsToken] = useRecoilState(discogsTokenState);
  const [isConnectingDiscogs, setIsConnectingDiscogs] = useState(false);
  const [isConnectingSpotify, setIsConnectingSpotify] = useState(false);

  useEffect(() => {
    if (spotifyApi && spotifyApi.getAccessToken()) {
      spotifyApi.getMe().then(data => setUser(data.body));
    }
  }, [session, spotifyApi, setUser]);

  useEffect(() => {
    if (spotifyApi && spotifyApi.getAccessToken()) {
      spotifyApi.getUserPlaylists().then((data) => {
        setPlaylists(data.body.items);
      });
    }
  }, [session, spotifyApi, setPlaylists]);

  // Check for Discogs authentication on mount
  useEffect(() => {
    const checkDiscogsAuth = async () => {
      try {
        const storedTokens = localStorage.getItem('discogs_tokens');
        if (storedTokens) {
          const tokens = JSON.parse(storedTokens);
          setDiscogsToken(tokens);
          
          // Try to fetch user info if we don't have it
          if (!discogsUser && tokens.access_token && tokens.access_token_secret) {
            try {
              const userResponse = await fetch(`/api/discogs/user?access_token=${tokens.access_token}&access_token_secret=${tokens.access_token_secret}`);
              if (userResponse.ok) {
                const userData = await userResponse.json();
                setDiscogsUser(userData);
              }
            } catch (userError) {
              console.error('Error fetching Discogs user info:', userError);
            }
          }
        }
      } catch (error) {
        console.error('Error checking Discogs authentication:', error);
      }
    };
    
    checkDiscogsAuth();
  }, [setDiscogsToken, setDiscogsUser, discogsUser]);

  // Handle Spotify login
  const handleSpotifyLogin = async () => {
    setIsConnectingSpotify(true);
    try {
      await signIn('spotify', { callbackUrl: '/' });
    } catch (error) {
      console.error('Spotify login error:', error);
    } finally {
      setIsConnectingSpotify(false);
    }
  };

  // Handle Spotify logout
  const handleSpotifyLogout = async () => {
    setIsConnectingSpotify(true);
    try {
      await signOut({ callbackUrl: '/login' });
      setUser(null);
      setPlaylists([]);
      setPlaylistId('');
      setSelectedPlaylist(null);
    } catch (error) {
      console.error('Spotify logout error:', error);
    } finally {
      setIsConnectingSpotify(false);
    }
  };

  // Handle playlist click
  const handlePlaylistClick = (playlist) => {
    setPlaylistId(playlist.id);
    setSelectedPlaylist(playlist);
    router.push(`/playlist/${playlist.id}`);
  };

  // Handle Discogs login
  const handleDiscogsLogin = async () => {
    setIsConnectingDiscogs(true);
    try {
      const response = await fetch('/api/discogs/login');
      const data = await response.json();
      
      if (data.authorizeUrl) {
        // Store request token secret in localStorage for callback
        localStorage.setItem('discogs_request_token_secret', data.requestTokenSecret);
        // Redirect to Discogs authorization
        window.location.href = data.authorizeUrl;
      } else {
        throw new Error('Failed to get authorization URL');
      }
    } catch (error) {
      console.error('Discogs login error:', error);
      setIsConnectingDiscogs(false);
    }
  };

  // Handle Discogs logout
  const handleDiscogsLogout = () => {
    try {
      localStorage.removeItem('discogs_tokens');
      localStorage.removeItem('discogs_request_token_secret');
      setDiscogsToken(null);
      setDiscogsUser(null);
    } catch (error) {
      console.error('Discogs logout error:', error);
    }
  };

  // Check authentication states
  const isSpotifyConnected = Boolean(session?.user);
  const isDiscogsConnected = Boolean(discogsToken);

  return (
    <div className="bg-white w-1/6 flex-shrink-0 hidden md:flex flex-col h-screen border-r border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-3 mb-6">
          <div className="w-10 h-10 bg-black flex items-center justify-center">
            <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v6.114a4 4 0 100 1.772V5.82l8-1.6v5.894a4 4 0 100 1.772V3z"/>
            </svg>
          </div>
          <div>
            <h1 className="text-black font-medium text-sm">DigitalToVinyl</h1>
            <p className="text-gray-600 text-xs">Record Store</p>
          </div>
        </div>
        
        {/* Navigation */}
        <div className="space-y-1">
          <button 
            className="w-full flex items-center space-x-3 px-3 py-2 text-black hover:bg-gray-100 transition-all duration-200"
            onClick={() => {
              setPlaylistId('');
              setSelectedPlaylist(null);
              router.push('/');
            }}
          >
            <HomeIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Home</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-all duration-200">
            <SearchIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Search</span>
          </button>
          
          <button className="w-full flex items-center space-x-3 px-3 py-2 text-gray-600 hover:text-black hover:bg-gray-100 transition-all duration-200">
            <LibraryIcon className="h-4 w-4" />
            <span className="text-xs font-medium">Library</span>
          </button>
        </div>
      </div>

      {/* Playlists Section */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
        <div className="p-4">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-gray-600 text-xs font-medium uppercase tracking-wide">Playlists</h2>
            <span className="text-black text-xs font-medium">{playlists.length}</span>
          </div>
          
          <div className="space-y-1">
            {playlists.map((playlist) => (
              <div
                key={playlist.id}
                onClick={() => handlePlaylistClick(playlist)}
                className="group cursor-pointer p-2 hover:bg-gray-50 transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-gray-200 flex-shrink-0 overflow-hidden">
                    {playlist.images?.[0]?.url ? (
                      <img
                        src={playlist.images[0].url}
                        alt={playlist.name}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full bg-black flex items-center justify-center">
                        <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3"/>
                        </svg>
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-black text-xs font-medium truncate group-hover:text-gray-600 transition-colors duration-200" title={playlist.name}>
                      {playlist.name}
                    </p>
                    <p className="text-gray-500 text-xs">
                      {playlist.tracks?.total || 0} tracks
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Authentication Section */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        {/* Spotify Authentication */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Spotify</span>
            <div className={`connection-status w-2 h-2 rounded-full ${isSpotifyConnected ? 'bg-green-500 connected' : 'bg-gray-300'}`}></div>
          </div>
          
          {isSpotifyConnected ? (
            <button 
              onClick={handleSpotifyLogout}
              disabled={isConnectingSpotify}
              className="auth-button w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-white bg-black hover:bg-gray-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnectingSpotify ? (
                <div className="w-3 h-3 border border-white border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
                  </svg>
                  <span>Disconnect</span>
                </>
              )}
            </button>
          ) : (
            <button 
              onClick={handleSpotifyLogin}
              disabled={isConnectingSpotify}
              className="auth-button w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-black bg-white border border-black hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnectingSpotify ? (
                <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm4.586 14.424c-.18.295-.563.387-.857.207-2.348-1.435-5.304-1.76-8.785-.964-.335.077-.67-.133-.746-.47-.077-.334.132-.67.47-.746 3.809-.871 7.077-.496 9.713 1.115.294.18.386.563.206.858zm1.223-2.723c-.226.367-.706.482-1.073.257-2.687-1.652-6.785-2.131-9.965-1.166-.413.125-.849-.106-.973-.52-.125-.413.106-.849.52-.974 3.632-1.102 8.147-.568 11.234 1.328.366.226.482.707.257 1.075zm.105-2.835C14.692 8.95 9.375 8.775 6.297 9.71c-.493.15-1.016-.128-1.166-.62-.149-.493.129-1.016.621-1.166 3.532-1.073 9.404-.865 13.115 1.338.445.264.590.837.327 1.282-.264.444-.838.590-1.282.327z"/>
                  </svg>
                  <span>Connect</span>
                </>
              )}
            </button>
          )}
        </div>

        {/* Discogs Authentication */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-medium text-gray-600 uppercase tracking-wide">Discogs</span>
              {isDiscogsConnected && discogsUser && (
                <span className="text-xs text-gray-500">@{discogsUser.username}</span>
              )}
            </div>
            <div className={`connection-status w-2 h-2 rounded-full ${isDiscogsConnected ? 'bg-green-500 connected' : 'bg-gray-300'}`}></div>
          </div>
          
          {isDiscogsConnected ? (
            <button 
              onClick={handleDiscogsLogout}
              className="auth-button w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-white bg-black hover:bg-gray-800 transition-all duration-200"
            >
              <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"/>
              </svg>
              <span>Disconnect</span>
            </button>
          ) : (
            <button 
              onClick={handleDiscogsLogin}
              disabled={isConnectingDiscogs}
              className="auth-button w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-medium text-black bg-white border border-black hover:bg-gray-50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isConnectingDiscogs ? (
                <div className="w-3 h-3 border border-black border-t-transparent rounded-full animate-spin"></div>
              ) : (
                <>
                  <svg className="h-3 w-3" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2zm0 18c-4.418 0-8-3.582-8-8s3.582-8 8-8 8 3.582 8 8-3.582 8-8 8zm-1-5.5c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h2c.276 0 .5.224.5.5s-.224.5-.5.5h-2zm0-3c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h2c.276 0 .5.224.5.5s-.224.5-.5.5h-2zm0-3c-.276 0-.5-.224-.5-.5s.224-.5.5-.5h2c.276 0 .5.224.5.5s-.224.5-.5.5h-2z"/>
                  </svg>
                  <span>Connect</span>
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Sidebar;

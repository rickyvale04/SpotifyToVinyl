import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { shuffle } from 'lodash';
import useSpotify from "../../hooks/useSpotify";
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { playlistIdState } from "../../atoms/playlistId";
import { selectedPlaylistState } from '../../atoms/selectedPlaylistAtom';
import { playlistState } from '../../atoms/playlistAtom';
import Songs from '../song/Songs';
import PlaylistCarousel from '../ui/PlaylistCarousel';
import { useRouter } from 'next/router';

const colors = [
  'from-red-500',
  'from-blue-500',
  'from-green-500',
  'from-yellow-500',
  'from-indigo-500',
  'from-purple-500',
  'from-pink-500',
  'from-orange-500',
  'from-teal-500',
  'from-cyan-500',
];

const Center = () => {
  const spotifyApi = useSpotify();
  const { data: session } = useSession();
  const router = useRouter();
  const [color, setColor] = useState(null);
  const playlistId = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(selectedPlaylistState);
  const [playlists] = useRecoilState(playlistState);
  const setPlaylistId = useSetRecoilState(playlistIdState);
  const setSelectedPlaylist = useSetRecoilState(selectedPlaylistState);

  useEffect(() => {
    setColor(shuffle(colors).pop());
  }, [playlistId]);

  useEffect(() => {
    if (spotifyApi && spotifyApi.getAccessToken() && playlistId) {
      console.log("Fetching playlist with ID:", playlistId);
      spotifyApi.getPlaylist(playlistId).then((data) => {
        setPlaylist(data.body);
      }).catch(error => console.log("Something went wrong!", JSON.stringify(error, null, 2)));
    }
  }, [spotifyApi, playlistId, session, setPlaylist]);

  const handleSelectTracks = () => {
    router.push(`/playlist/${playlistId}`);
  };

  return (
    <div className='flex-grow h-screen overflow-y-scroll scrollbar-hide'>
      <header className='absolute top-5 right-8 z-10'>
        <div className="flex items-center space-x-4">
          {playlistId && (
            <button
              onClick={() => {
                setPlaylistId('');
                setSelectedPlaylist(null);
              }}
              className="bg-black hover:bg-gray-800 text-white px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              <span>Home</span>
            </button>
          )}
          {session ? (
            <div
              className='flex items-center bg-white border border-gray-200 space-x-3 hover:bg-gray-50 cursor-pointer p-1 pr-2 text-black'
              onClick={() => signOut({ callbackUrl: '/login' })}
            >
              <img
                className='w-10 h-10'
                src={session?.user.image}
                alt=''
              />
              <h2 className="text-sm font-medium">{session?.user.name}</h2>
            </div>
          ) : (
            <button
              onClick={() => router.push('/login')}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 text-sm font-medium transition-all duration-200 flex items-center space-x-2"
            >
              <span>Login</span>
            </button>
          )}
        </div>
      </header>

      {!playlistId ? (
        // Welcome screen with Hardwax-inspired design
        <div className="min-h-screen bg-white relative overflow-hidden">
          {/* Header Section */}
          <div className="relative z-10 pt-20 pb-16 px-8">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-16">
                <div className="inline-flex items-center justify-center w-20 h-20 bg-black mb-6">
                  <svg className="w-10 h-10 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v6.114a4 4 0 100 1.772V5.82l8-1.6v5.894a4 4 0 100 1.772V3z"/>
                  </svg>
                </div>
                <h1 className="text-5xl md:text-7xl font-normal text-black mb-6">
                  DigitalToVinyl
                </h1>
                <p className="text-lg md:text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
                  Trasforma le tue playlist Spotify in collezioni di vinili. 
                  Scopri quali dei tuoi brani preferiti sono disponibili su vinile.
                </p>
              </div>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
                <div className="bg-white border border-gray-200 p-8 text-center">
                  <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19V6l12-3v13M9 19c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zm12-3c0 1.105-1.895 2-4 2s-4-.895-4-2 1.895-2 4-2 4 .895 4 2zM9 10l12-3" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-medium text-black mb-2">
                    {playlists.length}
                  </h3>
                  <p className="text-gray-600 text-sm">Playlist Trovate</p>
                </div>
                <div className="bg-white border border-gray-200 p-8 text-center">
                  <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9l10.5-3m0 6.553v3.75a2.25 2.25 0 01-1.632 2.163l-1.32.377a1.803 1.803 0 11-.99-3.467l2.31-.66a2.25 2.25 0 001.632-2.163zm0 0V2.25L9 5.25v8.25m0 0l10.5 3m-10.5-3a2.25 2.25 0 01-1.632-2.163L6.248 6.632a1.803 1.803 0 10-.99 3.467L7.5 9.75a2.25 2.25 0 001.632 2.163z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-medium text-black mb-2">
                    {playlists.reduce((acc, playlist) => acc + (playlist.tracks?.total || 0), 0)}
                  </h3>
                  <p className="text-gray-600 text-sm">Brani Totali</p>
                </div>
                <div className="bg-white border border-gray-200 p-8 text-center">
                  <div className="w-12 h-12 bg-black flex items-center justify-center mx-auto mb-4">
                    <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-medium text-black mb-2">
                    Pronto
                  </h3>
                  <p className="text-gray-600 text-sm">Per Iniziare</p>
                </div>
              </div>
            </div>
          </div>

          {/* Playlist Carousel Section */}
          <div className="relative z-10 px-8 pb-16">
            <div className="max-w-6xl mx-auto">
              <PlaylistCarousel playlists={playlists} />
            </div>
          </div>

          {/* Call to Action */}
          <div className="relative z-10 text-center pb-16">
            <div className="inline-flex items-center space-x-4 bg-black px-8 py-4">
              <div className="w-2 h-2 bg-white animate-pulse"></div>
              <span className="text-white font-medium text-sm">Clicca su una playlist per iniziare</span>
              <div className="w-2 h-2 bg-white animate-pulse"></div>
            </div>
          </div>
        </div>
      ) : (
        // Selected playlist view
        <>
          <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 text-white p-8`}>
            {playlist && (
              <img className='h-44 w-44 shadow-2xl' src={playlist?.images?.[0]?.url} alt='' />
            )}
            <div>
              <p>PLAYLIST</p>
              <h1 className='text-2xl md:text-3xl xl:text-5xl font-bold'>{playlist?.name}</h1>
              {playlistId && (
                <button
                  onClick={handleSelectTracks}
                  className="mt-4 bg-green-500 text-white py-2 px-4 rounded-full hover:bg-green-600 transition duration-300"
                >
                  Select Tracks
                </button>
              )}
            </div>
          </section>
          <div>
            <Songs tracks={playlist?.tracks?.items || []} />
          </div>
        </>
      )}
    </div>
  );
};

export default Center;

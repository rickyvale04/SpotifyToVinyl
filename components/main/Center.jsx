import { useEffect, useState } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { shuffle } from 'lodash';
import useSpotify from "../../hooks/useSpotify";
import { useRecoilState, useRecoilValue } from 'recoil';
import { playlistState } from '../../atoms/playlistAtom';
import { playlistIdState } from "../../atoms/playlistId";
import Songs from '../song/Songs';
import Button from '../ui/buttons/Button';
import Header from '../ui/header/Header';

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
  const spotifyAPI = useSpotify();
  const { data: session } = useSession();
  
  const [color, setColor] = useState(null);
  const [user, setUser] = useState(null);
  const [isClient, setIsClient] = useState(false);
  const playlistID = useRecoilValue(playlistIdState);
  const [playlist, setPlaylist] = useRecoilState(playlistState);
  const [tracks, setTracks] = useState([]);
  
  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (!isClient || !spotifyAPI || !playlistID) {
      return;
    }

    const fetchData = async () => {
      if (spotifyAPI && spotifyAPI.getAccessToken && spotifyAPI.getAccessToken()) {
        try {
          const userResponse = await spotifyAPI.getMe();
          setUser(userResponse.body);
          
          const playlistResponse = await spotifyAPI.getPlaylist(playlistID);
          setPlaylist(playlistResponse.body);

          const tracksResponse = await spotifyAPI.getPlaylistTracks(playlistID);
          setTracks(tracksResponse.body.items);
        } catch (err) {
          console.error('Error fetching data from Spotify:', err);
        }
      }
    };

    fetchData();
  }, [session, spotifyAPI, playlistID, isClient, setPlaylist]);

  useEffect(() => {
    if (isClient && playlistID) {
      setColor(shuffle(colors).pop());
    }
  }, [playlistID, isClient]);

  if (!isClient) {
    return <div>Loading...</div>;
  }

  return (
    <div className='flex-grow h-screen w-screen overflow-y-scroll scrollbar-hide'>
      <Header user={user} onClick={() => signOut({ callbackUrl: '/login' })} />
      <section className={`flex items-end space-x-7 bg-gradient-to-b to-black ${color} h-80 p-8`}>
        <img className='h-48 w-48 shadow-xl' src={playlist?.images?.[0]?.url || ''} alt='Playlist Cover' />
        <div>
          <p>PLAYLIST</p>
          <h1 className='text-2xl md:text-3xl lg:text-5xl font-bold'>{playlist?.name}</h1>
        </div>
      </section>
      <div>
        <Songs tracks={tracks} />
      </div>
    </div>
  );
};

export default Center;

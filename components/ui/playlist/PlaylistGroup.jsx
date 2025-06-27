import { useState } from 'react';
import SongTable from "../../song/SongTable";
import PlaylistItem from "./PlaylistItem";

const PlaylistGroup = ({ playlists }) => {
  const [activePlaylistID, setActivePlaylistID] = useState(null);

  const handleClick = (playlistId) => {
    setActivePlaylistID(playlistId);
  };

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {playlists.map((playlist) => (
          <PlaylistItem
            key={playlist.id}
            playlist={playlist}
            color="bg-[var(--secondary-bg)]"
            isActive={playlist.id === activePlaylistID}
            onClick={() => handleClick(playlist.id)}
          />
        ))}
      </div>
      <SongTable playlistID={activePlaylistID} isActive={activePlaylistID} />
    </>
  );
};

export default PlaylistGroup;

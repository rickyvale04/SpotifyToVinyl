import Link from "next/link";
import { useSetRecoilState } from "recoil";
import { playlistState } from "../../../atoms/playlistAtom";

const PlaylistItem = ({ playlist, color, isActive, onClick }) => {
  const setPlaylist = useSetRecoilState(playlistState);

  const handleClick = () => {
    setPlaylist(playlist);
    if (onClick) onClick();
  };

  return (
    <div
      className={`flex flex-col cursor-pointer border border-[var(--border)] ${isActive ? 'border-[var(--accent)] border-2' : ''}`}
      onClick={handleClick}
    >
      <div className="relative group">
        <img
          src={playlist.images && playlist.images.length > 0 ? playlist.images[0].url : "/recordImage.png"}
          alt={playlist.name}
          className="w-full h-48 object-cover"
        />
        <div className={`absolute inset-0 ${color} bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-200 ease-in-out flex items-center justify-center`}>
          <p className="text-[var(--primary-text)] text-lg font-bold text-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-in-out">{playlist.name}</p>
        </div>
      </div>
      <div className="p-4">
        <h3 className="text-[var(--primary-text)] font-bold text-base group-hover:text-[var(--accent)] transition-colors duration-200">{playlist.name}</h3>
        <p className="text-[var(--primary-text)] text-sm">{playlist.description || "No description available"}</p>
        <button className="mt-2 inline-block text-[var(--primary-text)] text-sm font-bold border border-[var(--border)] px-3 py-1 hover:text-[var(--accent)] hover:border-[var(--accent)] transition-all duration-200" onClick={handleClick}>
          Select Tracks
        </button>
      </div>
    </div>
  );
};

export default PlaylistItem;

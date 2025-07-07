import Link from "next/link";

const VinylItem = ({ vinyl }) => {
  return (
    <tr className="border-b border-gray-800 hover:bg-gray-800 transition-colors duration-200">
      <td className="py-4 px-3">
        <div className="text-sm text-white truncate max-w-xs">{vinyl.title}</div>
      </td>
      <td className="py-4 px-3">
        <div className="text-sm text-gray-400">{vinyl.country}</div>
      </td>
      <td className="py-4 px-3 text-center">
        <div className="text-sm text-gray-400">{vinyl.year}</div>
      </td>
      <td className="py-4 px-3">
        <div className="text-sm text-gray-400 truncate max-w-xs">{vinyl.label?.[0]}</div>
      </td>
      <td className="py-4 px-3 text-center">
        <div className="text-sm text-gray-400">{vinyl.format?.[0]}</div>
      </td>
      <td className="py-4 px-3">
        <div className="flex gap-2 justify-center">
          <Link
            href={`https://www.discogs.com${vinyl.uri}`}
            target="_blank"
            className="text-xs text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1 transition-colors duration-200"
          >
            Buy Vinyl
          </Link>
          <button
            onClick={() => {
              const discogsTokens = localStorage.getItem("discogs_tokens");
              if (!discogsTokens) {
                alert("Please log in to Discogs to add items to your wantlist.");
                return;
              }
              alert("Adding to Wantlist... (Functionality to be fully implemented)");
            }}
            className="text-xs text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400 px-3 py-1 transition-colors duration-200"
          >
            Add to Wantlist
          </button>
        </div>
      </td>
    </tr>
  );
};

export default VinylItem;

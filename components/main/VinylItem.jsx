import Link from "next/link";

const VinylItem = ({ vinyl }) => {
  return (
    <tr>
      <td className="col-span-3 truncate">{vinyl.title}</td>
      <td>{vinyl.country}</td>
      <td className="text-center">{vinyl.year}</td>
      <td>{vinyl.label[0]}</td>
      <td className="text-center">{vinyl.format[0]}</td>
      <td className="flex gap-2 justify-center">
        <Link
          href={`https://www.discogs.com${vinyl.uri}`}
          target="_blank"
          className="flex-1 pr-1"
        >
          <p className="btn text-center btn-primary">Buy Vinyl</p>
        </Link>
        <button
          onClick={() => {
            const discogsTokens = localStorage.getItem("discogs_tokens");
            if (!discogsTokens) {
              alert("Please log in to Discogs to add items to your wantlist.");
              return;
            }
            alert("Adding to Wantlist... (Functionality to be fully implemented)");
            // Placeholder for Discogs API call to add to wantlist
            // Extract release ID from vinyl.uri or vinyl.id if available
            // Use tokens from localStorage to authenticate API request
          }}
          className="btn text-center btn-primary"
        >
          Add to Wantlist
        </button>
      </td>
    </tr>
  );
};

export default VinylItem;

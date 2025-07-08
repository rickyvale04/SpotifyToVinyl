import { useState, useEffect } from "react";
import Link from "next/link";
import { useDiscogsWantlist } from "../../hooks/useDiscogsWantlist";

const VinylItem = ({ vinyl }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [wantlistStatus, setWantlistStatus] = useState(null); // null = not checked, true = in wantlist, false = not in wantlist
  const { addToWantlist, checkWantlistStatus, loading, error, isLoggedIn } = useDiscogsWantlist();

  const handleAddToWantlist = async () => {
    console.log('handleAddToWantlist called');
    console.log('isLoggedIn:', isLoggedIn);
    
    // Check localStorage directly
    const tokensString = localStorage.getItem('discogs_tokens');
    console.log('Tokens in localStorage:', tokensString);
    
    if (!isLoggedIn) {
      alert("Please log in to Discogs to add items to your wantlist.");
      return;
    }

    if (!vinyl.id) {
      alert("Unable to add this item - missing release ID.");
      return;
    }

    setIsAdding(true);
    try {
      // First check if it's already in wantlist
      const inWantlist = await checkWantlistStatus(vinyl.id);
      
      if (inWantlist) {
        setWantlistStatus(true);
        // Show already in wantlist message
        const message = document.createElement('div');
        message.className = 'fixed top-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded shadow-lg z-50';
        message.textContent = 'This item is already in your wantlist!';
        document.body.appendChild(message);
        
        setTimeout(() => {
          if (document.body.contains(message)) {
            document.body.removeChild(message);
          }
        }, 3000);
        return;
      }

      // If not in wantlist, add it
      await addToWantlist(vinyl.id);
      setWantlistStatus(true);
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-600 text-white px-4 py-2 rounded shadow-lg z-50';
      successMessage.textContent = 'Added to Discogs wantlist!';
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        if (document.body.contains(successMessage)) {
          document.body.removeChild(successMessage);
        }
      }, 3000);
      
    } catch (error) {
      console.error('Error with wantlist operation:', error);
      alert(`Failed to process wantlist request: ${error.message}`);
    } finally {
      setIsAdding(false);
    }
  };

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
            onClick={handleAddToWantlist}
            disabled={isAdding || wantlistStatus === true}
            className={`text-xs px-3 py-1 transition-colors duration-200 ${
              wantlistStatus === true
                ? 'text-green-400 border border-green-400 cursor-not-allowed'
                : isAdding
                ? 'text-gray-500 border border-gray-500 cursor-not-allowed'
                : 'text-gray-400 hover:text-white border border-gray-600 hover:border-gray-400'
            }`}
          >
            {isAdding ? (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Adding...
              </span>
            ) : wantlistStatus === true ? (
              <span className="flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                In Wantlist
              </span>
            ) : (
              'Add to Wantlist'
            )}
          </button>
        </div>
      </td>
    </tr>
  );
};

export default VinylItem;

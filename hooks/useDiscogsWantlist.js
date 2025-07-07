import { useState } from 'react';
import { useRecoilValue } from 'recoil';
import { discogsUserState } from '../atoms/discogsAtom';

export const useDiscogsWantlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const discogsUser = useRecoilValue(discogsUserState);

  const addToWantlist = async (releaseId) => {
    setLoading(true);
    setError(null);

    try {
      // Get tokens from localStorage
      const tokens = JSON.parse(localStorage.getItem('discogs_tokens') || '{}');
      
      if (!tokens.access_token || !tokens.access_token_secret) {
        throw new Error('Please log in to Discogs first');
      }

      const response = await fetch('/api/discogs/wantlist', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          releaseId,
          tokens,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to add to wantlist');
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const removeFromWantlist = async (releaseId) => {
    setLoading(true);
    setError(null);

    try {
      // Get tokens from localStorage
      const tokens = JSON.parse(localStorage.getItem('discogs_tokens') || '{}');
      
      if (!tokens.access_token || !tokens.access_token_secret) {
        throw new Error('Please log in to Discogs first');
      }

      const response = await fetch('/api/discogs/wantlist', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          releaseId,
          tokens,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || 'Failed to remove from wantlist');
      }

      return result;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    addToWantlist,
    removeFromWantlist,
    loading,
    error,
    isLoggedIn: !!discogsUser,
  };
};

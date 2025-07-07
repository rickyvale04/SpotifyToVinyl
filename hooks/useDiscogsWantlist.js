import { useState, useEffect } from 'react';

export const useDiscogsWantlist = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Check if user is logged in by checking localStorage
  useEffect(() => {
    const checkLoginStatus = () => {
      try {
        const tokens = JSON.parse(localStorage.getItem('discogs_tokens') || '{}');
        setIsLoggedIn(!!tokens.access_token && !!tokens.access_token_secret);
      } catch (error) {
        console.error('Error checking login status:', error);
        setIsLoggedIn(false);
      }
    };

    checkLoginStatus();
    
    // Check periodically in case tokens change
    const interval = setInterval(checkLoginStatus, 1000);
    
    return () => clearInterval(interval);
  }, []);

  const addToWantlist = async (releaseId) => {
    setLoading(true);
    setError(null);

    try {
      // Get tokens from localStorage with debugging
      const tokensString = localStorage.getItem('discogs_tokens');
      console.log('Raw tokens from localStorage:', tokensString);
      
      const tokens = JSON.parse(tokensString || '{}');
      console.log('Parsed tokens:', tokens);
      
      if (!tokens.access_token || !tokens.access_token_secret) {
        console.log('Missing tokens - access_token:', !!tokens.access_token, 'access_token_secret:', !!tokens.access_token_secret);
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
    isLoggedIn,
  };
};

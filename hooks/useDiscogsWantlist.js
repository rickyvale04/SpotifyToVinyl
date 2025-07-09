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
      

      if (!tokens.access_token || !tokens.access_token_secret || !tokens.username) {
        console.log('Missing tokens or username - access_token:', !!tokens.access_token, 'access_token_secret:', !!tokens.access_token_secret, 'username:', !!tokens.username);
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
          username: tokens.username,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('API Error Response:', errorText);
        
        // Try to parse as JSON first, fallback to plain text
        let errorMessage;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Failed to add to wantlist';
        } catch {
          errorMessage = errorText.includes('<!DOCTYPE') 
            ? 'API endpoint returned HTML instead of JSON. Please check server configuration.'
            : errorText || 'Failed to add to wantlist';
        }
        
        throw new Error(errorMessage);
      }

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

  const checkWantlistStatus = async (releaseId) => {
    try {
      const tokens = JSON.parse(localStorage.getItem('discogs_tokens') || '{}');
      
      if (!tokens.access_token || !tokens.access_token_secret || !tokens.username) {
        return false;
      }

      const response = await fetch(`/api/discogs/wantlist-check?releaseId=${releaseId}&tokens=${encodeURIComponent(JSON.stringify(tokens))}&username=${tokens.username}`, {
        method: 'GET',
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Wantlist check error:', errorText);
        return false;
      }

      const result = await response.json();
      return result.inWantlist || false;
    } catch (error) {
      console.error('Error checking wantlist status:', error);
      return false;
    }
  };

  return {
    addToWantlist,
    removeFromWantlist,
    checkWantlistStatus,
    loading,
    error,
    isLoggedIn,
  };
};

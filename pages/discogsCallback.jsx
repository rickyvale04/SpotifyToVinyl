import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { useSetRecoilState } from "recoil";
import { discogsTokenState, discogsUserState } from "../atoms/discogsAtom";

const DiscogsCallback = () => {
  const router = useRouter();
  const { access_token, access_token_secret } = router.query;
  const [message, setMessage] = useState("Processing Discogs authentication...");
  const setDiscogsToken = useSetRecoilState(discogsTokenState);
  const setDiscogsUser = useSetRecoilState(discogsUserState);

  useEffect(() => {
    if (access_token && access_token_secret) {
      handleTokenStorage(access_token, access_token_secret);
    }
  }, [access_token, access_token_secret]);

  const handleTokenStorage = async (accessToken, accessTokenSecret) => {
    try {
      // Store Discogs tokens in localStorage for subsequent API calls
      const tokens = {
        access_token: accessToken,
        access_token_secret: accessTokenSecret
      };
      
      localStorage.setItem("discogs_tokens", JSON.stringify(tokens));
      
      // Update Recoil state
      setDiscogsToken(tokens);
      
      // Fetch user info
      try {
        const userResponse = await fetch(`/api/discogs/user?access_token=${accessToken}&access_token_secret=${accessTokenSecret}`);
        if (userResponse.ok) {
          const userData = await userResponse.json();
          setDiscogsUser(userData);
        }
      } catch (userError) {
        console.error('Error fetching user info:', userError);
        // Continue even if user info fails
      }

      setMessage("Discogs authentication successful! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error storing Discogs tokens:", error);
      setMessage(`Discogs authentication failed: ${error.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center">
      <div className="max-w-md w-full bg-white p-8 text-center">
        <div className="mb-8">
          <div className="w-16 h-16 bg-black mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-white" fill="currentColor" viewBox="0 0 20 20">
              <path d="M18 3a1 1 0 00-1.196-.98l-10 2A1 1 0 006 5v6.114a4 4 0 100 1.772V5.82l8-1.6v5.894a4 4 0 100 1.772V3z"/>
            </svg>
          </div>
          <h1 className="text-2xl font-medium text-black mb-2">DigitalToVinyl</h1>
          <p className="text-gray-600 text-sm">Discogs Authentication</p>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center justify-center space-x-2">
            <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
            <span className="text-sm text-gray-600">Processing...</span>
          </div>
          <p className="text-sm text-black">{message}</p>
        </div>
      </div>
    </div>
  );
};

export default DiscogsCallback;

import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const DiscogsCallback = () => {
  const router = useRouter();
  const { access_token, access_token_secret } = router.query;
  const [message, setMessage] = useState("Processing Discogs authentication...");

  useEffect(() => {
    if (access_token && access_token_secret) {
      handleTokenStorage(access_token, access_token_secret);
    }
  }, [access_token, access_token_secret]);

  const handleTokenStorage = (accessToken, accessTokenSecret) => {
    try {
      // Store Discogs tokens in localStorage for subsequent API calls
      localStorage.setItem("discogs_tokens", JSON.stringify({
        access_token: accessToken,
        access_token_secret: accessTokenSecret
      }));

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
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", textAlign: "center" }}>
      <h1>Discogs Authentication</h1>
      <p>{message}</p>
    </div>
  );
};

export default DiscogsCallback;

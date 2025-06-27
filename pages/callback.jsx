import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const Callback = () => {
  const router = useRouter();
  const { code } = router.query;
  const [message, setMessage] = useState("Processing authentication...");

  useEffect(() => {
    if (code) {
      handleTokenExchange(code);
    }
  }, [code]);

  const handleTokenExchange = async (code) => {
    try {
      const { state } = router.query;
      if (!state) {
        throw new Error("State parameter not found in callback URL. Please try logging in again.");
      }
      const verifier = state;

      const serverEndpoint = "http://127.0.0.1:3002/api/spotify/callback";
      const response = await fetch(`${serverEndpoint}?code=${encodeURIComponent(code)}&code_verifier=${encodeURIComponent(verifier)}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Token exchange failed: ${JSON.stringify(errorData)}`);
      }

      const data = await response.json();
      // Store tokens in localStorage for custom usage if needed
      localStorage.setItem("access_token", data.access_token);
      localStorage.setItem("refresh_token", data.refresh_token);
      localStorage.setItem("expires_in", data.expires_in);
      localStorage.setItem("token_timestamp", Date.now().toString());

      // Since we're using NextAuth.js for session management, we need to inform it about the authentication
      // This can be done by triggering a sign-in with the custom tokens
      await fetch('/api/auth/callback/spotify', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          expiresIn: data.expires_in,
        }),
      });

      setMessage("Authentication successful! Redirecting to dashboard...");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error during token exchange:", error);
      setMessage(`Authentication failed: ${error.message}`);
    }
  };

  return (
    <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh", flexDirection: "column", textAlign: "center" }}>
      <h1>Spotify Authentication</h1>
      <p>{message}</p>
    </div>
  );
};

export default Callback;

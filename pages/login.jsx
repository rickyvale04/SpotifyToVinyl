import React, { useEffect } from "react";
import Dot from "../components/ui/Dot";
import Link from "next/link";

const Login = () => {
  // Mouse Position
  const [mousePos, setMousePos] = React.useState({ x: 0, y: 0 });
  // Update mouse position on mousemove
  useEffect(() => {
    const handler = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY });
    };
    window.addEventListener("mousemove", handler);

    return () => {
      window.removeEventListener("mousemove", handler);
    }
  }, []);

  const redirectToAuthCodeFlow = async (clientId) => {
    const verifier = generateCodeVerifier(128);
    const challenge = await generateCodeChallenge(verifier);

    // Include the verifier in the state parameter to pass it through the callback URL
    const state = verifier;

    const params = new URLSearchParams();
    params.append("client_id", clientId);
    params.append("response_type", "code");
    params.append("redirect_uri", "http://127.0.0.1:3002/callback");
    params.append("scope", "user-read-private user-read-email playlist-read-private playlist-read-collaborative user-library-read user-top-read user-follow-read user-read-playback-state user-modify-playback-state streaming");
    params.append("code_challenge_method", "S256");
    params.append("code_challenge", challenge);
    params.append("state", state);

    document.location = `https://accounts.spotify.com/authorize?${params.toString()}`;
  };

  const generateCodeVerifier = (length) => {
    let text = '';
    let possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    for (let i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
  };

  const generateCodeChallenge = async (codeVerifier) => {
    const data = new TextEncoder().encode(codeVerifier);
    const digest = await window.crypto.subtle.digest('SHA-256', data);
    return btoa(String.fromCharCode.apply(null, [...new Uint8Array(digest)]))
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
  };

  return (
    <main className="overflow-hidden h-screen">

      <div className="flex flex-wrap w-[2000px] gap-24 mx-auto p-12">
      {Array.from({ length: 200 }).map((_, i) => (
        <Dot key={i} mousePos={mousePos}></Dot>
      ))}
      </div>

      <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="flex flex-col bg-black items-center bg-opacity-90 p-5 rounded-2xl w-96 text-center">
          <img src="web-logo.png" alt="Crate Digger Logo" className="mx-auto h-24 w-auto mb-4 mt-2" />

          <h1 className="text-4xl font-extrabold text-white hover:text-orange-600 transition duration-300 p-2">Crate Digger</h1>
          <h2 className="text-2xl font-semibold text-white break-normal mb-2">Discover Vinyls for Your Playlists</h2>


          <button className="bg-purple-800 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 m-2" onClick={() => {
            const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
            if (clientId) {
              redirectToAuthCodeFlow(clientId);
            } else {
              console.error("Spotify Client ID is not defined. Please set NEXT_PUBLIC_CLIENT_ID in your environment variables.");
              alert("Spotify authentication is not configured properly. Please contact support.");
            }
          }}>
            Log In with Spotify Premium
          </button>
          <p className="text-sm text-gray-500 mt-2">
            A Spotify Premium account ensures uninterrupted crate digging.
          </p>
        </div>
      </div>

      <footer className="fixed bottom-0 right-0 left-0 text-center text-xs text-gray-400">
        <p><Link href="https://www.DaveCodes.tech">DaveCodes.Tech</Link> ©2021 Crate Digger</p>
      </footer>
      
      </main>
  );
};

export default Login;

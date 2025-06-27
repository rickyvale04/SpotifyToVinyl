import React, { useEffect } from "react";
import Dot from "../components/ui/Dot";
import Link from "next/link";
import { redirectToAuthCodeFlow } from "../lib/spotifyAuth";

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

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--background)]">
      <button className="bg-[var(--secondary-bg)] hover:bg-[var(--accent-bg)] text-[var(--primary-text)] font-semibold py-2 px-6 rounded-full border border-[var(--border)] shadow-md transition duration-200 ease-in-out transform hover:scale-103 hover:shadow-xl" onClick={() => {
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
    </div>
  );
};

export default Login;

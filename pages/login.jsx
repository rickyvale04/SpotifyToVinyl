import React, { useEffect } from "react";
import { signIn, useSession } from "next-auth/react";
import { useRouter } from "next/router";

const Login = () => {
  const { data: session } = useSession();
  const router = useRouter();

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

  // Redirect if already logged in
  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session, router]);

  const handleSpotifyLogin = () => {
    signIn('spotify', { callbackUrl: '/' });
  };

  const handleDiscogsLogin = async () => {
    try {
      const response = await fetch("/api/discogs/login");
      const data = await response.json();
      if (data.authorizeUrl) {
        // Store requestToken and requestTokenSecret in localStorage if provided
        if (data.requestToken && data.requestTokenSecret) {
          localStorage.setItem('discogs_request_token', data.requestToken);
          localStorage.setItem('discogs_request_token_secret', data.requestTokenSecret);
        }
        window.location.href = data.authorizeUrl;
      } else {
        console.error("Failed to get Discogs login URL", data.error);
        alert("Failed to initiate Discogs login. Please try again.");
      }
    } catch (error) {
      console.error("Error initiating Discogs login:", error);
      alert("Error initiating Discogs login. Please try again.");
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-[var(--background)] space-y-4">
      <button 
        className="bg-[var(--secondary-bg)] hover:bg-[var(--accent-bg)] text-[var(--primary-text)] font-semibold py-2 px-6 rounded-full border border-[var(--border)] shadow-md transition duration-200 ease-in-out transform hover:scale-103 hover:shadow-xl" 
        onClick={handleSpotifyLogin}
      >
        Log In with Spotify Premium
      </button>
      <button 
        className="bg-[var(--secondary-bg)] hover:bg-[var(--accent-bg)] text-[var(--primary-text)] font-semibold py-2 px-6 rounded-full border border-[var(--border)] shadow-md transition duration-200 ease-in-out transform hover:scale-103 hover:shadow-xl" 
        onClick={handleDiscogsLogin}
      >
        Log In with Discogs
      </button>
    </div>
  );
};

export default Login;

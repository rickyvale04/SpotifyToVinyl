import { useEffect, useState } from 'react'
import { signIn, useSession } from 'next-auth/react'
import SpotifyWebApi from "spotify-web-api-node";

const useSpotify = () => {
    const { data: session } = useSession()
    const [spotifyAPI, setSpotifyAPI] = useState(null)

    useEffect(() => {
        if (typeof window !== 'undefined') {
            const api = new SpotifyWebApi({
                clientId: process.env.NEXT_PUBLIC_CLIENT_ID,
            })
            setSpotifyAPI(api)
        }
    }, [])

    useEffect(() => {
        if (spotifyAPI && session) {
            if (session.error === "RefreshAccessTokenError") {
                signIn();
            }

            spotifyAPI.setAccessToken(session.user.accessToken);
        }
    }, [session, spotifyAPI])

    return spotifyAPI;
}

export default useSpotify

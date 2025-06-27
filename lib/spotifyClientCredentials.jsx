import axios from 'axios';

const clientId = process.env.NEXT_PUBLIC_CLIENT_ID;
const clientSecret = process.env.NEXT_PUBLIC_CLIENT_SECRET;

const getClientCredentialsToken = async () => {
  try {
    const response = await axios.post(
      'https://accounts.spotify.com/api/token',
      new URLSearchParams({
        grant_type: 'client_credentials'
      }),
      {
        headers: {
          'Authorization': 'Basic ' + Buffer.from(`${clientId}:${clientSecret}`).toString('base64'),
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      }
    );

    if (response.status === 200) {
      const { access_token, expires_in } = response.data;
      return { access_token, expires_in };
    } else {
      throw new Error('Failed to obtain client credentials token');
    }
  } catch (error) {
    console.error('Error obtaining client credentials token:', error);
    throw error;
  }
};

export default getClientCredentialsToken;

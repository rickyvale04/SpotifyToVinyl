import axios from 'axios';


export default async function handler(req, res) {
  console.log('discogsSearch req.query:', req.query);
  const { q, track, key, secret } = req.query;
  const targetUrl = `https://api.discogs.com/database/search?q=${q}&track=${track}&format=vinyl&key=${key}&secret=${secret}`;

  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
    'Access-Control-Allow-Headers': 'Authorization',
  };

  try {
    const response = await axios.get(targetUrl, {
      headers,
      responseType: 'stream',
    });

    res.statusCode = response.status;
    Object.entries(response.headers).forEach(([key, value]) => {
      res.setHeader(key, value);
    });
    response.data.pipe(res);
  } catch (error) {
    console.error('Proxy Error:', error);
    res.status(500).end();
  }
}
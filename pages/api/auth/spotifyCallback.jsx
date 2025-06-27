export default async function handler(req, res) {
  return res.status(410).json({ error: 'This endpoint is deprecated. Use the callback endpoint on port 3002 instead.' });
}

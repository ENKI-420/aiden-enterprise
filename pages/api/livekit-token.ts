import { AccessToken } from 'livekit-server-sdk';
import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const {
    query: { identity = 'anonymous', room = 'default' },
  } = req;

  const apiKey = process.env.LIVEKIT_API_KEY;
  const apiSecret = process.env.LIVEKIT_API_SECRET;
  const livekitUrl = process.env.NEXT_PUBLIC_LIVEKIT_URL;

  if (!apiKey || !apiSecret) {
    return res.status(500).json({ error: 'LIVEKIT_API_KEY or LIVEKIT_API_SECRET not set in environment' });
  }

  try {
    const at = new AccessToken(apiKey, apiSecret, { identity: String(identity) });
    at.addGrant({
      roomJoin: true,
      room: String(room),
      canPublish: true,
      canSubscribe: true,
    });
    const token = at.toJwt();

    res.status(200).json({ token, url: livekitUrl });
  } catch (error) {
    console.error('Token generation failed', error);
    res.status(500).json({ error: 'Token generation failed' });
  }
}
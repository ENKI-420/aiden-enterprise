import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }
  const { text, target } = req.body;
  // Mock translation logic
  res.status(200).json({ translated: `${text} (translated to ${target})` });
}
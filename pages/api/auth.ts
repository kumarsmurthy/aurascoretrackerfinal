import type { NextApiRequest, NextApiResponse } from 'next';
import { createUser, verifyPassword } from '../../lib/kv';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const { email, password, action } = req.body;

    if (action === 'signup') {
      try {
        await createUser(email, password);
        res.status(200).json({ message: 'User created successfully' });
      } catch (error) {
        res.status(500).json({ message: 'Error creating user' });
      }
    } else if (action === 'login') {
      try {
        const isValid = await verifyPassword(email, password);
        if (isValid) {
          res.status(200).json({ message: 'Login successful' });
        } else {
          res.status(401).json({ message: 'Invalid credentials' });
        }
      } catch (error) {
        res.status(500).json({ message: 'Error during login' });
      }
    } else {
      res.status(400).json({ message: 'Invalid action' });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}

// frontend/pages/api/todos.ts
import { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const apiUrl = 'http://backend:8080/todos'; // 修正ポイント

  try {
    const response = await fetch(apiUrl, {
      method: req.method,
      headers: { 'Content-Type': 'application/json' },
      body: req.method === 'POST' || req.method === 'PUT' ? JSON.stringify(req.body) : undefined,
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('Error from backend:', errorData);
      res.status(response.status).json({ error: 'Failed to fetch data from the backend', details: errorData });
      return;
    }

    const data = await response.json();
    res.status(response.status).json(data);
  } catch (error) {
    console.error('Failed to fetch data from the backend:', error);
    res.status(500).json({ error: 'Failed to fetch data from the backend' });
  }
}

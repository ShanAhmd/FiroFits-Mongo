import clientPromise from './mongodb.js';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('users');

  if (req.method === 'GET') {
    const users = await collection.find().toArray();
    return res.status(200).json(users);
  }

  if (req.method === 'POST') {
    const { name, email, password } = req.body;
    if (!name || !email || !password) return res.status(400).json({error: 'Missing required fields'});
    const result = await collection.insertOne({ name, email, password });
    return res.status(201).json({ insertedId: result.insertedId });
  }

  return res.status(405).json({error: 'Method not allowed'});
}

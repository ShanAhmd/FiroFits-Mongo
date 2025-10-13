import clientPromise from './mongodb.js';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('orders');

  if (req.method === 'GET') {
    const orders = await collection.find().toArray();
    return res.status(200).json(orders);
  }

  if (req.method === 'POST') {
    const { userId, productId, quantity, status } = req.body;
    if (!userId || !productId || !quantity) return res.status(400).json({error: 'Missing required fields'});
    const result = await collection.insertOne({ userId, productId, quantity, status });
    return res.status(201).json({ insertedId: result.insertedId });
  }

  return res.status(405).json({error: 'Method not allowed'});
}

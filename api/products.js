import clientPromise from './mongodb.js';

export default async function handler(req, res) {
  const client = await clientPromise;
  const db = client.db();
  const collection = db.collection('products');

  if (req.method === 'GET') {
    const products = await collection.find().toArray();
    return res.status(200).json(products);
  }

  if (req.method === 'POST') {
    const { name, description, price, imageUrl } = req.body;
    if (!name || !price) return res.status(400).json({error: 'Missing required fields'});
    const result = await collection.insertOne({ name, description, price, imageUrl });
    return res.status(201).json({ insertedId: result.insertedId });
  }

  return res.status(405).json({error: 'Method not allowed'});
}

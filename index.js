const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.dsizbq5.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get('/', (req, res) => {
  res.send('KrishiLink Server is Running');
});

async function run() {
  try {
    await client.connect();
    console.log("✅ MongoDB connected successfully!");

    const db = client.db("krishilink_db");
    const cropsCollection = db.collection("crops");
    const interestsCollection = db.collection("interests");
    const usersCollection = db.collection("users");

    // Latest crops
   

    // Add Crop
    app.post('/crops', async (req, res) => {
      try {
        const newCrop = req.body;
        newCrop.created_at = new Date();
        const result = await cropsCollection.insertOne(newCrop);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to add crop" });
      }
    });

    // Get all crops or by user email
    app.get('/crops', async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) query = { "owner.ownerEmail": email };

      const cursor = cropsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });





app.get('/crops/:id', async (req, res) => {
  const { id } = req.params;

  let query;
  // Accept both ObjectId and string IDs
  if (ObjectId.isValid(id) && id.length === 24) {
    query = { _id: new ObjectId(id) };
  } else {
    query = { _id: id }; // fallback for string IDs like "02"
  }

  try {
    const crop = await cropsCollection.findOne(query);
    if (!crop) return res.status(404).json({ message: 'Crop not found' });
    res.json(crop);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
});

     // Get crop by ID
    app.get('/crops/:id', async (req, res) => {
      const { id } = req.params;

      let query;
      if (ObjectId.isValid(id) && id.length === 24) {
        query = { _id: new ObjectId(id) };
      } else {
        return res.status(400).json({ message: 'Invalid crop ID' });
      }

      try {
        const crop = await cropsCollection.findOne(query);
        if (!crop) return res.status(404).json({ message: 'Crop not found' });
        res.json(crop);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Internal Server Error' });
      }
    });

    // Update crop
    app.patch('/crops/:id', async (req, res) => {
      const { id } = req.params;
      const updateCrops = req.body;

      if (!ObjectId.isValid(id) || id.length !== 24) {
        return res.status(400).json({ message: "Invalid crop ID" });
      }

      const query = { _id: new ObjectId(id) };
      const update = { $set: { name: updateCrops.name, price: updateCrops.price } };

      try {
        const result = await cropsCollection.updateOne(query, update);
        res.send(result);
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Failed to update crop" });
      }
    });

    // Submit interest
    
    // Search crops
   

    // Delete crop
    app.delete('/crops/:id', async (req, res) => {
      const { id } = req.params;

      if (!ObjectId.isValid(id) || id.length !== 24) {
        return res.status(400).json({ message: "Invalid crop ID" });
      }

      try {
        const query = { _id: new ObjectId(id) };
        const result = await cropsCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete crop" });
      }
    });

    await db.command({ ping: 1 });
    console.log("✅ Pinged MongoDB successfully!");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }
}

run().catch(console.dir);

app.listen(port, () => {
  console.log(`🚀 KrishiLink Server is Running on port ${port}`);
});
































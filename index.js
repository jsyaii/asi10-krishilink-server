const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const app = express();
const port = process.env.PORT || 3000;

// middleware
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
    // Connect to MongoDB
    await client.connect();
    console.log(" MongoDB connected successfully!");

    const db = client.db("krishilink_db");
    const cropsCollection = db.collection("crops");
    const interestsCollection = db.collection("interests");
    const usersCollection = db.collection("users");





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

app.get('/crops/:id', async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await cropsCollection.findOne(query);
      res.send(result);
    });


app.get('/crops', async (req, res) => {
    // const projectFields = { name: 1, price: 1, image: 1 };
    //   const cursor = productsCollection.find().sort({ _id: -1 }).limit(5).project(projectFields);
   console.log(req.query)
   const email = req.query.email;
   let query = {};
   if(email){
    query = {email: email}
   }
   
    const cursor = cropsCollection.find(query); 
    const result = await cursor.toArray();
      res.send(result);
    });


app.patch('/crops/:id', async (req, res) => {
      const id = req.params.id;
      const updateCrops = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updateCrops.name,
          price: updateCrops.price,
 }
      }
      const result = await cropsCollection.updateOne(query, update)
      res.send(result)
    });


// Search Crops
app.get('/search-crops', async (req, res) => {
  try {
    const search = req.query.q || "";
    const query = {
      name: { $regex: search, $options: "i" } 
    };
    const result = await cropsCollection.find(query).toArray();
    res.send(result);
  } catch (error) {
    console.error("Error searching crops:", error);
    res.status(500).send({ message: "Search failed" });
  }
});




    // Delete Crop
    app.delete('/crops/:id', async (req, res) => {
      try {
        const id = req.params.id;
        const query = { _id: new ObjectId(id) };
        const result = await cropsCollection.deleteOne(query);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to delete crop" });
      }
    });

    // Ping MongoDB to confirm connection
    await db.command({ ping: 1 });
    console.log("✅ Pinged MongoDB successfully!");
    
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }
  // ⚠️ Don't close the client here
  // Keep the connection open for route operations
}

run().catch(console.dir);

// Start server
app.listen(port, () => {
  console.log(`🚀 KrishiLink Server is Running on port ${port}`);
});






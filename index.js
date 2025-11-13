
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

//     // ---------------- INTEREST ROUTES ----------------
// // POST /interests
// app.post('/interests', async (req, res) => {
//   try {
//     const { cropId, userEmail, userName, quantity, message } = req.body;

//     if (!cropId || !userEmail || !userName || !quantity) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Find the crop
//     const crop = await cropsCollection.findOne({ _id: new ObjectId(cropId) });
//     if (!crop) return res.status(404).json({ message: 'Crop not found' });

//     // Prevent owner from submitting interest
//     if (crop.owner.ownerEmail === userEmail) {
//       return res.status(403).json({ message: 'Owners cannot submit interest on their own crop' });
//     }

//     // Check if user already submitted interest for this crop
//     const alreadyInterested = (crop.interests || []).some(
//       (i) => i.userEmail === userEmail
//     );
//     if (alreadyInterested) {
//       return res.status(400).json({ message: 'You’ve already sent an interest for this crop' });
//     }

//     // Create new interest object with ObjectId
//     const interestId = new ObjectId();
//     const newInterest = {
//       _id: interestId,
//       cropId,
//       userEmail,
//       userName,
//       quantity,
//       message: message || `Interested in ${quantity}kg`,
//       status: 'pending',
//     };

//     // Push the interest into the crop's interests array
//     await cropsCollection.updateOne(
//       { _id: new ObjectId(cropId) },
//       { $push: { interests: newInterest } }
//     );

//     res.status(201).json({ message: 'Interest submitted successfully', interest: newInterest });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });

// // GET /interests?userEmail=...
// app.get('/interests', async (req, res) => {
//   try {
//     const { userEmail } = req.query;
//     if (!userEmail) return res.status(400).json({ message: 'Missing userEmail' });

//     // Find all crops where the interests array contains this userEmail
//     const crops = await cropsCollection.find({ 'interests.userEmail': userEmail }).toArray();

//     // Map to only return the interests of this user with crop info
//     const userInterests = [];
//     crops.forEach(crop => {
//       (crop.interests || []).forEach(interest => {
//         if (interest.userEmail === userEmail) {
//           userInterests.push({
//             _id: interest._id,
//             cropId: crop._id,
//             cropName: crop.name || crop.title,
//             ownerName: crop.owner.ownerName,
//             quantity: interest.quantity,
//             message: interest.message,
//             status: interest.status
//           });
//         }
//       });
//     });

//     res.json(userInterests);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });



// // PATCH /interests/:id
// app.patch('/interests/:id', async (req, res) => {
//   try {
//     const interestId = req.params.id;
//     const { status } = req.body;
//     if (!['accepted', 'rejected'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     // Update the interest inside the crop
//     const result = await cropsCollection.updateOne(
//       { 'interests._id': new ObjectId(interestId) },
//       { $set: { 'interests.$.status': status } }
//     );

//     if (result.modifiedCount === 0) return res.status(404).json({ message: 'Interest not found' });

//     res.json({ message: 'Interest status updated successfully' });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });



    // ---------------- CROP ROUTES ----------------
// app.post('/interests', async (req, res) => {
//   try {
//     const { cropId, userEmail, userName, quantity, message } = req.body;

//     if (!cropId || !userEmail || !userName || !quantity) {
//       return res.status(400).json({ message: 'Missing required fields' });
//     }

//     // Make sure cropId is valid ObjectId
//     let cropObjectId;
//     try {
//       cropObjectId = new ObjectId(cropId);
//     } catch {
//       return res.status(400).json({ message: 'Invalid cropId' });
//     }

//     // Find the crop
//     const crop = await cropsCollection.findOne({ _id: cropObjectId });
//     if (!crop) return res.status(404).json({ message: 'Crop not found' });

//     // Prevent owner from submitting interest
//     if (crop.owner?.ownerEmail === userEmail) {
//       return res.status(403).json({ message: 'Owners cannot submit interest on their own crop' });
//     }

//     // Initialize interests array if not present
//     if (!Array.isArray(crop.interests)) crop.interests = [];

//     // Check if user already submitted interest
//     const alreadyInterested = crop.interests.some(i => i.userEmail === userEmail);
//     if (alreadyInterested) {
//       return res.status(400).json({ message: 'You’ve already sent an interest for this crop' });
//     }

//     const newInterest = {
//       _id: new ObjectId(),
//       cropId,
//       userEmail,
//       userName,
//       quantity,
//       message: message || `Interested in ${quantity}kg`,
//       status: 'pending',
//     };

//     // Push the interest
//     await cropsCollection.updateOne(
//       { _id: cropObjectId },
//       { $push: { interests: newInterest } }
//     );

//     res.status(201).json({ message: 'Interest submitted successfully', interest: newInterest });
//   } catch (err) {
//     console.error('POST /interests error:', err);
//     res.status(500).json({ message: 'Server error', error: err.message });
//   }
// });
// commit thak





// ---------------- INTEREST ROUTES ----------------
app.post("/interests", async (req, res) => {
  try {


    
    const { cropId, userEmail, userName, quantity, message } = req.body;
    if (!cropId || !userEmail || !userName || !quantity) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Ensure cropId is ObjectId
    const cropObjectId = ObjectId.isValid(cropId) ? new ObjectId(cropId) : null;
    if (!cropObjectId) return res.status(400).json({ message: "Invalid cropId" });

    const crop = await cropsCollection.findOne({ _id: cropObjectId });
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    // Prevent owner from sending interest
    if (crop.owner?.ownerEmail === userEmail) {
      return res.status(403).json({ message: "Owners cannot submit interest on their own crop" });
    }




    // Check if already interested
    if ((crop.interests || []).some(i => i.userEmail === userEmail)) {
      return res.status(400).json({ message: "Already submitted interest" });
    }

    const newInterest = {
      _id: new ObjectId(),
      cropId: cropObjectId,
      cropName: crop.title || crop.name,
      cropOwner: crop.owner?.ownerName || "Unknown Owner",
      userEmail,
      userName,
      quantity,
      message: message || `Interested in ${quantity}kg`,
      status: "pending",
      created_at: new Date(),
    };

    await cropsCollection.updateOne(
      { _id: cropObjectId },
      { $push: { interests: newInterest } }
    );

    res.status(201).json({ message: "Interest submitted successfully", interest: newInterest });
  } catch (err) {
    console.error("POST /interests error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


   app.get("/interests", async (req, res) => {
  try {
    const { userEmail } = req.query;
    if (!userEmail) return res.status(400).json({ message: "Missing userEmail" });

    const crops = await cropsCollection.find({ "interests.userEmail": userEmail }).toArray();

    const userInterests = [];
    crops.forEach(crop => {
      (crop.interests || []).forEach(i => {
        if (i.userEmail === userEmail) {
          userInterests.push({
            _id: i._id,
            cropId: crop._id,
            cropName: crop.title || crop.name,
            ownerName: crop.owner?.ownerName || "Unknown",
            quantity: i.quantity,
            message: i.message,
            status: i.status
          });
        }
      });
    });

    res.json(userInterests);
  } catch (err) {
    console.error("GET /interests error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});

app.patch("/interests/:id", async (req, res) => {
  const { id } = req.params;
  const { status, cropId } = req.body;

  if (!["accepted", "rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    // Update interest status
    const result = await cropsCollection.updateOne(
      { "interests._id": new ObjectId(id) },
      { $set: { "interests.$.status": status } }
    );

    if (result.modifiedCount === 0) return res.status(404).json({ message: "Interest not found" });

    // Optionally reduce crop quantity if accepted
    if (status === "accepted" && cropId) {
      const crop = await cropsCollection.findOne({ _id: new ObjectId(cropId) });
      const interest = crop.interests.find(i => i._id.toString() === id);
      const newQuantity = Math.max(0, crop.quantity - interest.quantity);

      await cropsCollection.updateOne(
        { _id: new ObjectId(cropId) },
        { $set: { quantity: newQuantity } }
      );
    }

    res.json({ message: "Interest updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

app.patch("/interests/:id", async (req, res) => {
  try {
    const { id } = req.params; // interestId
    const { status, cropId } = req.body;
    if (!["accepted", "rejected"].includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const interestObjectId = new ObjectId(id);

    const cropObjectId = ObjectId.isValid(cropId) ? new ObjectId(cropId) : null;
    if (!cropObjectId) return res.status(400).json({ message: "Invalid cropId" });

    const crop = await cropsCollection.findOne({ _id: cropObjectId });
    if (!crop) return res.status(404).json({ message: "Crop not found" });

    const interest = (crop.interests || []).find(i => i._id.equals(interestObjectId));
    if (!interest) return res.status(404).json({ message: "Interest not found" });

    // Update status
    await cropsCollection.updateOne(
      { _id: cropObjectId, "interests._id": interestObjectId },
      { $set: { "interests.$.status": status } }
    );

    // Reduce quantity if accepted
    if (status === "accepted") {
      const newQuantity = Math.max(0, crop.quantity - interest.quantity);
      await cropsCollection.updateOne({ _id: cropObjectId }, { $set: { quantity: newQuantity } });
    }

    res.json({ message: `Interest ${status} successfully` });
  } catch (err) {
    console.error("PATCH /interests/:id error:", err);
    res.status(500).json({ message: "Internal server error", error: err.message });
  }
});


// PATCH /interests/:id - Accept or Reject an interest
app.patch('/interests/:id', async (req, res) => {
  try {
    const { id } = req.params; // interestId
    const { status } = req.body;

    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const result = await client.db("krishilink_db").collection("crops").updateOne(
      { 'interests._id': new ObjectId(id) },
      { $set: { 'interests.$.status': status } }
    );

    if (result.modifiedCount === 0) {
      return res.status(404).json({ message: 'Interest not found' });
    }

    res.json({ message: `Interest ${status} successfully` });
  } catch (err) {
    console.error('PATCH /interests/:id error:', err);
    res.status(500).json({ message: 'Internal server error', error: err.message });
  }
});

// doneee interest
    app.get('/latest-crops', async (req, res) => {
      const cursor = cropsCollection.find().sort({ created_at: -1 }).limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

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

    app.get('/crops', async (req, res) => {
      const email = req.query.email;
      let query = {};
      if (email) query = { "owner.ownerEmail": email };

      const cursor = cropsCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    // ⚠️ Duplicate Add Crop route (same as above /crops POST)
    app.post("/crops", async (req, res) => {
      try {
        const newCrop = req.body;
        newCrop.created_at = new Date();
        newCrop.interests = [];
        const result = await cropsCollection.insertOne(newCrop);
        res.send(result);
      } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Failed to add crop" });
      }
    });

    app.delete("/crops/:cropId/interest/:interestId", async (req, res) => {
      const { cropId, interestId } = req.params;

      try {
        const result = await cropsCollection.updateOne(
          { _id: cropId },
          { $pull: { interests: { _id: interestId } } }
        );

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Interest not found" });
        }

        res.json({ success: true, message: "Interest canceled successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
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

    app.get("/crops/:id", async (req, res) => {
  const { id } = req.params;
  let query;

  // Handle both short string IDs and ObjectIds
  if (ObjectId.isValid(id) && id.length === 24) {
    query = { _id: new ObjectId(id) };
  } else {
    query = { _id: id };
  }

  try {
    const crop = await cropsCollection.findOne(query);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }
    res.json(crop);
  } catch (error) {
    console.error("Error fetching crop:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// ✅ Add interest to crop (supports both string and ObjectId IDs)
app.post("/crops/:id/interest", async (req, res) => {
  const { id } = req.params;
  const interest = req.body;

  try {
    let query;
    if (ObjectId.isValid(id) && id.length === 24) {
      query = { _id: new ObjectId(id) };
    } else {
      query = { _id: id };
    }

    const crop = await cropsCollection.findOne(query);
    if (!crop) {
      return res.status(404).json({ message: "Crop not found" });
    }

    const newInterest = {
      _id: new ObjectId(),
      ...interest,
      cropName: crop.title || crop.name || "Unknown Crop",
      cropOwner: crop.seller_name || crop.owner?.ownerName || "Unknown Owner",
      status: "pending",
      created_at: new Date(),
    };

    const updateResult = await cropsCollection.updateOne(query, {
      $push: { interests: newInterest },
    });

    if (updateResult.modifiedCount === 0) {
      return res.status(400).json({ message: "Failed to add interest" });
    }

    res.json({ success: true, interest: newInterest });
  } catch (error) {
    console.error("Error adding interest:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

    
    
    app.delete("/crops/:cropId/interest/:interestId", async (req, res) => {
      const { cropId, interestId } = req.params;

      try {
        let cropQuery;
        if (ObjectId.isValid(cropId) && cropId.length === 24) {
          cropQuery = { _id: new ObjectId(cropId) };
        } else {
          return res.status(400).json({ message: "Invalid crop ID" });
        }

        const result = await cropsCollection.updateOne(cropQuery, {
          $pull: { interests: { _id: new ObjectId(interestId) } },
        });

        if (result.modifiedCount === 0) {
          return res.status(404).json({ message: "Interest not found" });
        }

        res.json({ success: true, message: "Interest canceled successfully" });
      } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });

    app.get('/search-crops', async (req, res) => {
      try {
        const search = req.query.q || "";
        const query = { name: { $regex: search, $options: "i" } };
        const result = await cropsCollection.find(query).toArray();
        res.send(result);
      } catch (error) {
        console.error("Error searching crops:", error);
        res.status(500).send({ message: "Search failed" });
      }
    });


    app.patch("/crops/:id", async (req, res) => {
  const { id } = req.params;
  const update = req.body;

  try {
    const result = await cropsCollection.updateOne(
      { _id: new ObjectId(id) }, // convert id to ObjectId
      { $set: update }
    );

    if (result.modifiedCount === 0)
      return res.status(404).json({ message: "Crop not found" });

    res.json({ message: "Crop updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});


    // ⚠️ Duplicate /crops/:id/interest route again
    app.post("/crops/:id/interest", async (req, res) => {
      const { id } = req.params;
      const interest = req.body;

      try {
        let query;

        if (ObjectId.isValid(id) && id.length === 24) {
          query = { _id: new ObjectId(id) };
        } else {
          query = { _id: id };
        }

        const crop = await cropsCollection.findOne(query);
        if (!crop) {
          return res.status(404).json({ message: "Crop not found" });
        }

        const newInterest = {
          _id: new ObjectId(),
          ...interest,
          cropName: crop.name,
          cropOwner: crop.owner?.ownerName || "Unknown Owner",
          status: "pending",
          created_at: new Date(),
        };

        const updateResult = await cropsCollection.updateOne(
          query,
          { $push: { interests: newInterest } }
        );

        if (updateResult.modifiedCount === 0) {
          return res.status(400).json({ message: "Failed to add interest" });
        }

        res.json({ success: true, interest: newInterest });
      } catch (err) {
        console.error("Error adding interest:", err);
        res.status(500).json({ message: "Internal server error" });
      }
    });

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

    // await db.command({ ping: 1 });
    console.log("✅ Pinged MongoDB successfully!");
  } catch (err) {
    console.error("❌ Error connecting to MongoDB:", err);
  }
}

run().catch(console.dir);

const http = require('http');
const { Server } = require('socket.io');

// Create HTTP server
const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: '*', // or specify your frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE'],
  },
});

// When a client connects
io.on('connection', (socket) => {
  console.log('🟢 A user connected:', socket.id);

  // Example: listen for a custom event
  socket.on('joinRoom', (roomId) => {
    socket.join(roomId);
    console.log(`User ${socket.id} joined room ${roomId}`);
  });

  // Example: broadcast updates (optional for your interests system)
  socket.on('interestUpdated', (data) => {
    io.emit('refreshInterests', data);
  });

  socket.on('disconnect', () => {
    console.log('🔴 A user disconnected:', socket.id);
  });
});

// Run the server
server.listen(port, () => {
  console.log(`🚀 KrishiLink Server with Socket.IO running on port ${port}`);
});

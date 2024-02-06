const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());


app.get('/', (req, res) => {
    res.send("let's do voluntary for humanity")
});


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.9fxhf2q.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    const volunteerNetworks = client.db("volunteerNetwork").collection("volunteers");

    // 2.2 real a specific data
    app.get('/volunteers/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = await volunteerNetworks.findOne(query);
      res.send(result)
    })
    // 2. read all data
    app.get('/volunteers', async(req, res) => {
      const result = await volunteerNetworks.find().toArray();
      res.send(result);
    })
    // 1. create <----> post
    app.post ('/volunteers', async(req, res) => {
        const volunteer = req.body;
        // console.log(volunteer)
        const result = await volunteerNetworks.insertOne(volunteer);
        res.send(result);
    })

    // 3. update <----> put or patch
    app.patch('/volunteers/:id', async(req, res) => {
      const id = req.params.id;
      const updatedVolunteer = req.body;
      const filter = {_id: new ObjectId(id)};
      const updatedDoc = {
        $set: {
          ...updatedVolunteer
        }
      }
      const result = await volunteerNetworks.updateOne(filter, updatedDoc);
      res.send(result)

    })
    
    // 4. delete
    app.delete('/volunteers/:id', async(req, res) => {
      const id = req.params.id;
      const query = {_id: new ObjectId(id)};
      const result = volunteerNetworks.deleteOne(query);
      res.send(result)
    })

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
  }
}
run().catch(console.dir);


app.listen(port, () => {
    console.log(`volunteer network is running on port ${port}`)
})
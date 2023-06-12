const express = require('express')
const app = express()
const cors = require('cors')
const port = process.env.PORT || 5000
require('dotenv').config()

// middleware
app.use(express.json())
app.use(cors())

app.get('/', (req, res) => {
    res.send('server is running')
})

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ufcjidc.mongodb.net/?retryWrites=true&w=majority`;

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
        const userCollection = client.db('athleteAcademy').collection('users')
        const classCollection = client.db('athleteAcademy').collection('classes')
        const instructorCollection = client.db('athleteAcademy').collection('instructors')
        const cartCollection = client.db('athleteAcademy').collection('carts')
        // getting user from client
        app.post('/users', async (req, res) => {
            const newUser = req.body
            console.log(newUser);
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })
        app.get('/classes', async (req, res) => {
            const result = await classCollection.find().toArray()
            res.send(result)
        })

        // instructor
        app.get('/instructors', async (req, res) => {
            const result = await instructorCollection.find().toArray()
            res.send(result)
        })
        // handling cart related api's
        app.get('/carts', async (req, res) => {
            const email = req.query.email
            const query = { email: email }
            const result = await cartCollection.find(query).toArray()
            res.send(result)
        })
        app.post('/carts', async (req, res) => {
            const item = req.body
            const result = await cartCollection.insertOne(item)
            res.send(result)
        })
        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);



app.listen(port, () => {
    console.log(`server is running at port ${port}`);
})
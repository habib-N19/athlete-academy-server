const express = require('express')
const app = express()
const cors = require('cors')
const jwt = require('jsonwebtoken');
const port = process.env.PORT || 5000
require('dotenv').config()

// middleware
app.use(express.json())
const corsConfig = {
    origin: '*',
    credentials: true,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS']
}
app.use(cors(corsConfig))

// jwt
// const verifyJWT = (req, res, next) => {
//     const authorization = req.headers.authorization
//     if (!authorization) {
//         return res.status(401).send({ error: true, message: 'Unauthorized Access' })
//     }
//     const token = authorization.split(' ')[1]
//     jwt.verify(token, process.env.JWT_SECRET, (error, decoded) => {
//         if (error) {
//             return res.status(401).send({ error: true, message: 'Unauthorized Access!!' })
//         }
//         req.decoded = decoded
//         next()
//     })
// }

app.get('/', (req, res) => {
    res.send('server is running')
})

const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
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
        client.connect();
        const userCollection = client.db('athleteAcademy').collection('users')
        const classCollection = client.db('athleteAcademy').collection('classes')
        // const instructorCollection = client.db('athleteAcademy').collection('instructors')
        const cartCollection = client.db('athleteAcademy').collection('carts')
        // const pendingClassCollection = client.db('athleteAcademy').collection('pendingClasses')
        // getting jwt 
        // app.post('/jwt', (req, res) => {
        //     const user = req.body
        //     const token = jwt.sign(user, process.env.JWT_SECRET, {
        //         expiresIn: '24hr'
        //     })
        //     res.send(token)
        // })

        // admin verify
        // const verifyAdmin = async (req, res, next) => {
        //     const email = req.decoded.email
        //     const query = { email: email }
        //     const user = await userCollection.findOne(query)
        //     if (user?.role !== 'admin') {
        //         return res.status(403).send({ error: true, message: 'forbidden message' });
        //     }
        //     next()
        // }
        // getting user from client
        app.get('/users', async (req, res) => {
            const result = await userCollection.find().toArray();
            res.send(result);
        });
        app.get('/users/admin/:email', async (req, res) => {
            const email = req.params.email;

            // if (req.decoded.email !== email) {
            //     res.send({ admin: false })
            // }

            const query = { email: email }
            const user = await userCollection.findOne(query);
            // const result = { admin: user?.role === 'admin' }
            if (user && user.role === 'admin') {
                res.send({ admin: true });
            } else {
                res.send({ admin: false });
            }
            // res.send(result);
        })
        app.post('/users', async (req, res) => {
            const newUser = req.body
            console.log(newUser);
            const result = await userCollection.insertOne(newUser)
            res.send(result)
        })
        // sending data to show only approved classes
        app.get('/classes', async (req, res) => {
            const query = { status: 'approved' }
            const result = await classCollection.find(query).toArray()
            res.send(result)
        })
        // top class 
        app.get('/classes/top', async (req, res) => {
            const query = { status: 'approved' }
            const options = {
                limit: 6, sort: {
                    enrolled: -1
                }
            }
            const result = await classCollection.find(query, options).toArray()
            res.send(result)
        })
        // sending all class to admin
        app.get('/classes/all', async (req, res) => {
            const result = await classCollection.find().toArray()
            res.send(result)
        })
        // pending class
        app.post('/classes', async (req, res) => {
            const newClass = req.body
            console.log(newClass);
            const result = await classCollection.insertOne(newClass)
            res.send(result)
        })
        // admin

        // change pending class db
        app.patch('/classes/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    status: 'approved'
                }
            }
            const result = await classCollection.updateOne(filter, updateDoc)
            res.send(result)
        })

        app.patch('/users/admin/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    role: 'admin'
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);
        })

        // instructors
        app.get('/users/instructors', async (req, res) => {
            const query = { role: 'instructor' }
            const result = await userCollection.find(query).toArray()
            res.send(result)
        })
        // sending instructor's classes 
        app.get('/instructors/classes/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            if (user && user.role === 'instructor') {
                const query = { email: email }
                // console.log(email);
                const result = await classCollection.find(query).toArray()
                res.send(result);
            }
        })
        // checking an instructor 
        app.get('/users/instructor/:email', async (req, res) => {
            const email = req.params.email;
            const query = { email: email }
            const user = await userCollection.findOne(query);
            if (user && user.role === 'instructor') {
                res.send({ instructor: true });
            } else {
                res.send({ instructor: false });
            }

        })
        // make instructor
        app.patch('/users/instructor/:id', async (req, res) => {
            const id = req.params.id
            const filter = { _id: new ObjectId(id) }
            const updateDoc = {
                $set: {
                    role: 'instructor'
                }
            };
            const result = await userCollection.updateOne(filter, updateDoc);
            res.send(result);

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
        app.delete('/carts/:id', async (req, res) => {
            const id = req.params.id
            console.log(id);
            const query = { _id: new ObjectId(id) }
            const result = await cartCollection.deleteOne(query)
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
const express = require('express');
require('dotenv').config()
const app = express();
const cors = require('cors');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require("mongodb");
const port = process.env.PORT || 6007;


//middleware
app.use(cors());
app.use(express.json());

//xcelAdmin
//dMrq4Bu3v0I4ni4Y

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.m62xz.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {

    try {
        await client.connect();

        const database = client.db('xcel_courier');
        const serviceCollection = database.collection('services');
        const bookingCollection = database.collection('bookings');


        //SERVICE GET API
        app.get('/services', async (req, res) => {
            const data = serviceCollection.find({});
            const result = await data.toArray();
            res.send(result)
        });


        //ADD SERVICE API
        app.post('/services', async (req, res) => {
            const service = req.body;
            const result = await serviceCollection.insertOne(service);
            console.log(service);
            res.json(result);
        });

        //GET SINGLE SERVICE API
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const service = await serviceCollection.findOne(query);
            console.log(service);
            res.send(service);
        });

        //Insert Booking API
        app.post('/bookings', async (req, res) => {
            const book = req.body;
            const result = await bookingCollection.insertOne(book);
            console.log(book);
            res.json(result);
        });

        //GET ALL BOOIKINGS API
        app.get('/bookings', async (req, res) => {
            const bookings = bookingCollection.find({});
            const result = await bookings.toArray();
            console.log(result);
            res.send(result);
        });

        //GET SPECIFIC BOOKINGS BY USER
        app.get('/bookings/:email', async (req, res) => {
            const mail = req.params.email;
            const bookings = bookingCollection.find({ "email": mail });
            const result = await bookings.toArray();
            // console.log(result);
            res.send(result);
        });

        //DELETE SINGLE BOOKINGS API
        app.delete('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await bookingCollection.deleteOne(query);
            console.log(result)
            res.send(result);

        });

        app.put('/bookings/:id', async (req, res) => {
            const id = req.params.id;
            const data = req.body.status;
            const filter = { _id: ObjectId(id) };
            const updateDoc = {
                $set: {
                    status: data
                }
            };
            const result = await bookingCollection.updateOne(filter, updateDoc);
            console.log(id);
            res.send(result);
        })
    }
    finally {

    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    console.log('server started');
    res.send('Servier runnig yeaaaaay!!')
});


app.listen(port, () => {
    console.log('Server running with port', port);
});
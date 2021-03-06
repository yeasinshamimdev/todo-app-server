const express = require('express');
const cors = require('cors');
require('dotenv').config();
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;

const app = express();

// middleware
app.use(cors());
app.use(express.json());


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7qpfm.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();
        const todoCollection = client.db("todoList").collection("task");

        app.get('/todoTask', async (req, res) => {
            const task = await todoCollection.find({}).toArray();
            res.send(task);
        });

        // todo post api
        app.post('/todoTask', async (req, res) => {
            const task = req.body;
            const doc = task;
            const result = await todoCollection.insertOne(doc);
            res.send(result)
        });

        // this is delete api
        app.delete('/todoTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await todoCollection.deleteOne(query);
            res.send(result);
        });

    }
    finally { }
}
run().catch(console.dir);


app.get('/', async (req, res) => {
    res.send('Hello from todo app');
});

app.listen(port, () => {
    console.log('listening from port', port);
});
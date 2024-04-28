const exp = require('express');
//const bcryptjs = require('bcryptjs');
const app = exp.Router();
//const verifyToken = require('../middlewares/VerifyToken');
//const jwt = require('jsonwebtoken');
let listCollection;
app.use((req, res, next) => {
    listCollection = req.app.get('listCollection');
    next();
});

// Get all todos
app.get('/', async (req, res) => {
    try {
        const todo = await listCollection.find().toArray();
        res.json(todo);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Create a new todo
app.post('/save', async (req, res) => {
    let list=req.body;
    try {
        const newTodo = await listCollection.insertOne(list);
        res.send({message:"Added Successfully",payload:newTodo})
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Delete an event
// Delete an event by eventId
const { ObjectId } = require('mongodb');

app.delete('/:eventId', async (req, res) => {
    try {
        const eventId = req.params.eventId; // Retrieve eventId from request parameters
        const query = { _id: new ObjectId(eventId) }; // Create query object using new ObjectId()
        await listCollection.deleteOne(query); // Delete the event with the specified _id
        res.json({ message: 'todo deleted' });
    } catch (error) {
        console.error('Error deleting todo list', error);
        res.status(500).json({ message: error.message });
    }
});


// Update an event by ID
app.put('/:eventId', async (req, res) => {
    const eventId = req.params.eventId;
    const {text} = req.body; // Include the 'time' field

    try {
        await listCollection.findOneAndUpdate(
            { _id: new ObjectId(eventId) }, // Use new ObjectId() to create ObjectId
            { $set: {text} }, // Include 'time' in the update operation
            { returnOriginal: false}
        );
        res.send({ message: "ToDO Updated"});
    } catch (error) {
        console.error('Error updating ToDo', error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

module.exports = app;

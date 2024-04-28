const express = require('express');
const app = express();
const cors = require('cors');
const MongoClient = require('mongodb').MongoClient;
const todoRoutes = require('./routes/ToDoRoute');
const userRoutes = require('./routes/user-api');
const path = require('path');

const staticFilesPath = path.join(__dirname, '../frontend/build');
app.use(express.static(staticFilesPath));


// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
const dbUrl = 'mongodb+srv://reema:reema123@cluster0.ftk6eyv.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0';
MongoClient.connect(dbUrl)
    .then(client => {
        const db = client.db('todoList');
        const listCollection = db.collection('List');
        const usersCollection = db.collection('Users');
        app.set('listCollection', listCollection);
        app.set('usersCollection', usersCollection);
        console.log('DB connection success');
    })
    .catch(error => {
        console.error('DB connection error:', error);
        process.exit(1); // Exit the process if database connection fails
    });

// Routes
app.use('/todo', todoRoutes);
app.use('/user-api', userRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ message: 'Internal Server Error' });
});

// Start the server
const port = process.env.PORT || 4000;
app.listen(port, () => {
    console.log(`Http Server listening on port ${port}`);
});

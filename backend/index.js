// CREATING DEPENDENCY VARIABLES
const express = require('express'); // includes express into backend
const app = express(); // variable of app to us express method
const cors = require('cors'); // bring in CORS
const bodyParser = require('body-parser'); // include BodyParser 
const mongoose = require('mongoose'); // import mongoose
const bcrypt = require('bcryptjs');
const config = require('./config.json'); // get config
const Product = require('./models/products'); // get products schema
const User = require('./models/users'); // get users schema
const Comment = require('./models/comments'); // get comments schema

// SET PORT NUMBER
const port = 8080;

app.use((req, res, next) => {
    console.log(`${req.method} request ${req.url}`);
    next();
})

// PLUGGING CORS INTO EXPRESS
app.use(cors());

app.get('/', (req, res) => res.send("Hello from the backend"));// Sent to backend on req

// Setup Mongoose Connection to MongoDB
mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_DBNAME}?retryWrites=true&w=majority`, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => console.log('DB Connected'))
.catch(err => {
    console.log(`DB Connection Error: ${err.message}`);
})

app.listen(port, () => console.log(`My fullstack app is listening on port ${port}`))// sent to nodemon - checking server
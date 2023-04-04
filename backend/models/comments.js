const express = require('express'); // includes express into backend
const app = express(); // variable of app to us express method
const cors = require('cors'); // bring in CORS
const bodyParser = require('body-parser') // include BodyParser 
const mongoose = require('mongoose') // import mongoose
const bcrypt = require('bcryptjs');
const config = require('./config.json'); // get config
const Product = require('./models/products');
const User = require('./models/users');
const Comment = require('./models/comments');

const port = 8080; // set the port number for our local server

app.use((req, res, next) => {
    console.log(`${req.method} request ${req.url}`);
    next();
})

app.use(bodyParser.json()); // calling Body Parser method and urlencoded 
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors()); // calling cors method with express

app.get('/', (req, res) => res.send("Hello from the backend")); // Sent to backend on req

// Setup Mongoose Connection to MongoDB
mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_DBNAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('DB Connected'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    })

app.listen(port, () => console.log(`My fullstack app is listening on port ${port}`)) // sent to nodemon - checking server


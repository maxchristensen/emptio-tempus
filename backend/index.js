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

// Get All Products from the Database
app.get('/allProductsFromDB', (req, res) => {
    Product.find().then(result => {
        res.send(result)
    })
})

// ------ PRODUCT END POINTS START -------------
// ------ PRODUCT END POINTS END ---------------



// ------- USER END POINTS START -------------

// Register User
app.post('/registerUser', (req, res) => {
    User.findOne({
        username: req.body.username,
    }, (err, userExists) => {
        if (userExists) {
            res.send('username already taken');
        } else {
            const hash = bcrypt.hashSync(req.body.password);
            const user = new User({
                _id: new mongoose.Types.ObjectId,
                fullname: req.body.fullname,
                username: req.body.username,
                email: req.body.email,
                password: hash,
                about: req.body.about
            });
            user.save()
                .then(result => {
                    console.log(user, result);
                    res.send(result);
                }).catch(err => {
                    res.send(err)
                });
        } // end of else
    }) // end of findone
}); // end of register user

// Login User
app.post('/loginUser', (req, res) => {
    User.findOne({
        username: req.body.username
    }, (err, userResult) => {
        if (userResult) {
            if (bcrypt.compareSync(req.body.password, userResult.password)) {
                res.send(userResult);
            } else {
                res.send('not authorized');
            } // inner if
        } else {
            res.send('User not found. Please register');
        } // outer if
    }); // end of findOne
}); // end of post for login

// ------- USER END POINTS END -------------



// ------ COMMENT END POINTS START ---------
// ------ COMMENT END POINTS END -----------

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

app.get('/', (req, res) => res.send("Hello from the backend")); // Sent to backend on req

/// *** Maz added 7 April start *** ///
app.use(bodyParser.json()); // calling Body Parser method and urlencoded 
app.use(bodyParser.urlencoded({
    extended: false
}));

app.use(cors()); // calling cors method with express
/// *** Maz added 7 April end *** ///

// Setup Mongoose Connection to MongoDB
mongoose.connect(`mongodb+srv://${config.MONGO_USER}:${config.MONGO_PASSWORD}@cluster0.${config.MONGO_CLUSTER_NAME}.mongodb.net/${config.MONGO_DBNAME}?retryWrites=true&w=majority`, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }).then(() => console.log('DB Connected'))
    .catch(err => {
        console.log(`DB Connection Error: ${err.message}`);
    })

app.listen(port, () => console.log(`My fullstack app is listening on port ${port}`)) // sent to nodemon - checking server

// Get All Products from the Database 
app.get('/allProductsFromDB', (req, res) => {
    Product.find().then(result => {
        res.send(result)
    })
})

/// *** Maz added 7 April start *** ///
// ------ PRODUCT END POINTS START -------------

// Post Method to CREATE a Product Start
app.post('/addProduct', (req, res) => {
    const dbProduct = new Product({
        _id: new mongoose.Types.ObjectId,
        productName: req.body.productName,
        description: req.body.description,
        price: req.body.price,
        category: req.body.category,
        condition: req.body.condition,
        image1: req.body.image1,
        image2: req.body.image2,
        image3: req.body.image3,
        image4: req.body.image4,
        user_id: req.body.user_id
    });
    //save to the database and notify the user
    dbProduct.save().then(result => {
        res.send(result);
    }).catch(err => res.send(err));
})
// End of CREATE End Point

// Edit UPDATE using 'PATCH' http method
app.patch('/updateProduct/:id', (req, res) => {
    const idParam = req.params.id;
    Product.findById(idParam, (err, product) => {
        const updatedProduct = {
            productName: req.body.productName,
            description: req.body.description,
            price: req.body.price,
            category: req.body.category,
            condition: req.body.condition,
            image1: req.body.image1,
            image2: req.body.image2,
            image3: req.body.image3,
            image4: req.body.image4,
        }
        Product.updateOne({
            _id: idParam
        }, updatedProduct).
        then(result => {
            res.send(result);
        }).catch(err => res.send(err))
    })
})
// End of UPDATE End Point

// DELETE using 'DELETE' http Method Start 
app.delete('/deleteProduct/:id', (req, res) => {
    const idParam = req.params.id;
    Product.findOne({
        _id: idParam
    }, (err, product) => {
        if (product) {
            Product.deleteOne({
                _id: idParam
            }, err => {
                console.log('deleted on backend request');
            });
        } else {
            alert('not found');
        }
    }).catch(err => res.send(err));
});
// End of DELETE End Point
/// *** Maz added 7 April end *** ///

// get single product by id

app.get('/singleProduct/:id', (req,res) => {
    const idParam = req.params.id;
    Product.findById(idParam).then(result => {
        res.send(result)
    });
});



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

// Get all comments

app.get('/allComments', (req, res) => {
    Comment.find().then(result => {
        res.send(result);
    })
})

// ----create comment endpoint-----

app.post('/createComment', (req, res) => {
    const newComment = new Comment({
        _id: new mongoose.Types.ObjectId,
        text: req.body.text,
        time: new Date(),
        username: req.body.username,
        product_id: req.body.product_id
    }) //end of const
    newComment.save()
        .then(result => {
            Product.updateOne({
                _id: req.body.product_id
            }).then(result => {
                res.send(newComment);
            }).catch(err => {
                res.send(err);
            })
        });
}); // end of create

// --------delete comments----

app.delete('deleteComments/:id', (req, res) => {
    Comment.findOne({
        _id: req.params.id
    }, (err, comment) => {
        if (comment && comment['username'] == req.body.username) {
            Product.updateOne({
                _id: comment.product_id
            }).then(result => {
                Comment.deleteOne({
                    _id: req.params.id
                }, err => {
                    res.send('deleted');
                })
            }).catch(err => {
                res.send(err);
            })
        } // end of if
        else {
            res.send('not found/not authorised')
        }
    });
});

// ------ COMMENT END POINTS END -----------

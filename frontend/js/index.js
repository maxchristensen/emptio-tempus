/*jshint esversion: 6 */
/*jshint -W069 */

$(document).ready(function () {

    let url;

    // ON CLICKS

    // Browse on-click - To make the listing & seller tab appear when a user clicks into a listing
    $('#browse-tab').click(function () {
        getAllProducts();
    });

    // Register on-click -  To make the add button appear when a user registers
    $('#r-submit').click(function () {
        let addTab = document.getElementById('add-tab');
        addTab.style.display = "inline-block";
    });

    // Login on-click - To make the add button appear when a user registers
    $('#login-submit').click(function () {
        let addTab = document.getElementById('add-tab');
        addTab.style.display = "inline-block";
    });

    // populate account details modal with session storage details
    $('#account-details').click(function () {
        let accountModalBody = document.getElementById('accountModalBody');
        let user = sessionStorage.getItem('userName');
        let email = sessionStorage.getItem('userEmail');
        let fullName = sessionStorage.getItem('fullName');

        accountModalBody.innerHTML =
            `
    <div class="container">
    <div class="row">
        <div class="col-8">
            <!-- Account Information -->
            <div class="account-fullname">
                <h5>Full Name:</h5>
                <p>${fullName}</p>
            </div>
            <div class="account-username">
                <h5>Username:</h5>
                <p>${user}</p>
            </div>
            <div class="account-email">
                <h5>Email:</h5>
                <p>${email}</p>
            </div>
            <div class="account-about">
                <h5>About:</h5>
                <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Aut non deleniti
                    quod, repellat aliquid rem eum molestiae magnam, ducimus unde voluptatum
                    provident? Recusandae beatae tempore nesciunt aliquam officia? Architecto,
                    voluptatem.</p>
            </div>
        </div>
        <div class="col-4">
            <h5>Current Listings</h5>
            <div class="editCurrentListing">
                <h6>Product Name</h6>
                <p>Product Price</p>
                <!-- Edit Modal Btn -->
                <button type="button" class="btn btn-primary edit" data-bs-toggle="modal"
                    data-bs-target="#editModal">
                    <i class="fa-solid fa-pen"></i>
                </button>
                <button type="button" class="btn btn-secondary delete">
                    <i class="fa-solid fa-trash"></i>
                </button>
                
            </div>
        </div>
    </div>                              
    `;
    });

    // Get Config.Json and variable from it
    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success: function (configData) {
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
            getAllProducts();
        },
        error: function (error) {}
    });

    // Get All products Function
    function getAllProducts() {

        $.ajax({
            url: `http://${url}/allProductsFromDB`,
            type: 'GET',
            dataType: 'json',

            success: function (productsFromMongo) {
                let results = document.getElementById('result');
                results.innerHTML = '';
                for (let i = 0; i < productsFromMongo.length; i++) {
                    results.innerHTML +=
                        ` 
                        <!-- Product Card -->
                        <button value=${productsFromMongo[i]._id} class="btn col-4 listing my-1 readmore" type="button" name="button">
                            <div class="card cardlisting">
                                <img src="${productsFromMongo[i].image1}"
                                        class="card-img-top" img="card-img" alt="${productsFromMongo[i].productName}">
                                <div class="card-body">
                                    <div class="row">
                                        <h6  href="#listing">${productsFromMongo[i].productName}</h6>
                                        <p href="#listing">${productsFromMongo[i].price}</p>
                                    </div>
                                    
                                </div>
                                
                            </div>
                            </button>
                        <!-- Product Card Ends -->
                    `;
                    singleProduct();
                    editProducts();
                    deleteButtons();
                }
            }, // end of success

            error: function () {
                alert('unable to get products');
            }, // end of error
        }); // end of ajax function
    } // end of getAllProducts function

    //add a product form a click
    $('#addProduct').click(function (event) {
        event.preventDefault();
        // Create variables that link to each section in our form and grab the value from that
        let productName = $('#a-productName').val();
        let price = $('#a-price').val();
        let image1 = $('#a-image1').val();
        let image2 = $('#a-image2').val();
        let image3 = $('#a-image3').val();
        let image4 = $('#a-image4').val();
        let description = $('#a-description').val();
        let category = $('#a-category').val();
        let condition = $('#a-condition').val();
        let userid = sessionStorage.getItem('userID');

        // run a check to make sure the user is logged in before it validates our form
        if (!userid) {
            alert('Please login or register before trying to create a listing');
        } else {
            // once login is verified, have the javascript check if all the fields are entered before pushing to the mongo
            if (productName == '' || price == '' || image1 == '' || category == '' || condition == '') {
                alert('Please enter all the required fields');
            } else {
                $.ajax({
                    url: `http://${url}/addProduct`,
                    type: 'POST',
                    data: {
                        productName: productName,
                        price: price,
                        image1: image1,
                        image2: image2,
                        image3: image3,
                        image4: image4,
                        description: description,
                        category: category,
                        condition: condition,
                        user_id: userid
                    },
                    success: function (product) {
                        alert('product added');
                        getAllProducts();
                    },
                    error: function () {} // End of error
                }); // End of ajax
            } // End of else
        }
    }); // End of add Product Click

    // Giving our "Save Changes" button an id for each product
    function editProducts() {
        let editButtons = document.querySelectorAll('.edit');
        let buttons = Array.from(editButtons);
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                let saveChange = document.querySelector('#editProduct');
                saveChange.value = this.value;
            });
        });
    }

    // UPDATE PRODUCT from Modal Save Button
    $('#editProduct').click(function (event) {
        event.preventDefault();
        let productId = this.value;
        let productNameUpdate = $('#e-productNameUpdate').val();
        let productPrice = $('#e-productPrice').val();
        let productImage1 = $('#e-productImage1').val();
        let productImage2 = $('#e-productImage2').val();
        let productImage3 = $('#e-productImage3').val();
        let productImage4 = $('#e-productImage4').val();
        let productDescription = $('#e-productDescription').val();
        let productCategory = $('#e-productCategory').val();
        let productCondition = $('#e-productCondition').val();
        let userid = sessionStorage.getItem('userID');
        if (productId == '' || !userid) {
            alert('Please enter a product to update');
        } else {
            $.ajax({
                url: `http://${url}/updateProduct/${productId}`,
                type: 'PATCH',
                data: {
                    productName: productNameUpdate,
                    price: productPrice,
                    image1: productImage1,
                    image2: productImage2,
                    image3: productImage3,
                    image4: productImage4,
                    description: productDescription,
                    category: productCategory,
                    condition: productCondition
                },
                success: function (data) {
                    getAllProducts();
                },
                error: function () {} // End of error
            }); // End of ajax
        } // End of if
    }); // End of update click

    // DELETE PRODUCT
    function deleteButtons() {
        let deleteButtons = document.querySelectorAll('.delete');
        let buttons = Array.from(deleteButtons);
        buttons.forEach(function (button) {
            button.addEventListener('click', function (event) {
                event.preventDefault();
                let productId = this.value;
                let userid = sessionStorage.getItem('userID');
                if (productId == '' || !userid) {
                    alert('Please enter product id to delete');
                } else {
                    $.ajax({
                        url: `http://${url}/deleteProduct/${productId}`,
                        type: 'DELETE',
                        success: function () {
                            alert('Product Deleted');
                            getAllProducts();
                        },
                        error: function () {} // error
                    }); // ajax
                } // if
            });
        });
    }


    // get single product data on readmore click and populate read more modal

    function singleProduct() {
        let readmore = document.querySelectorAll('.readmore');
        let buttons = Array.from(readmore);
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                let productId = this.value;
                $.ajax({
                    url: `http://${url}/singleProduct/${productId}`,
                    type: 'GET',
                    dataType: 'json',
                    success: function (product) {
                        let singleListingBody = document.getElementById('result');
                        singleListingBody.innerHTML = `
                    <div class="content" id="listing">
                        <div class="container">
                            <div class="row">
                                <div class="col-4">
                                    <!-- Product Image Carousel -->
                                    <div id="carouselExampleIndicators" class="carousel slide">
                                        <div class="carousel-indicators">
                                            <button type="button" data-bs-target="#carouselExampleIndicators"
                                                data-bs-slide-to="0" class="active" aria-current="true"
                                                aria-label="Slide 1"></button>
                                            <button type="button" data-bs-target="#carouselExampleIndicators"
                                                data-bs-slide-to="1" aria-label="Slide 2"></button>
                                            <button type="button" data-bs-target="#carouselExampleIndicators"
                                                data-bs-slide-to="2" aria-label="Slide 3"></button>
                                            <button type="button" data-bs-target="#carouselExampleIndicators"
                                                data-bs-slide-to="3" aria-label="Slide 4"></button>
                                        </div>
                                        <div class="carousel-inner">
                                            <div class="carousel-item active">
                                                <img src="${product.image1}"
                                                    class="d-block w-100" alt="...">
                                            </div>
                                            <div class="carousel-item">
                                                <img src="${product.image2}"
                                                    class="d-block w-100" alt="...">
                                            </div>
                                            <div class="carousel-item">
                                                <img src="${product.image3}"
                                                    class="d-block w-100" alt="...">
                                            </div>
                                            <div class="carousel-item">
                                                <img src="${product.image4}"
                                                    class="d-block w-100" alt="...">
                                            </div>
                                        </div>
                                        <button class="carousel-control-prev" type="button"
                                            data-bs-target="#carouselExampleIndicators" data-bs-slide="prev">
                                            <span class="carousel-control-prev-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Previous</span>
                                        </button>
                                        <button class="carousel-control-next" type="button"
                                            data-bs-target="#carouselExampleIndicators" data-bs-slide="next">
                                            <span class="carousel-control-next-icon" aria-hidden="true"></span>
                                            <span class="visually-hidden">Next</span>
                                        </button>
                                    </div>
                                    <!-- Product Image Carousel ENDS -->
                                </div>

                                <!-- Product Info -->
                                <div class="col-8">
                                    <h4>${product.productName}</h4>
                                    <div class="price-and-buy my-3">
                                        <h5>${product.price}</h5>
                                        <button class="btn buy-button">Buy</button>
                                    </div>
                                    <div class="d-flex mt-3" id="details">
                                        <h6>Details:</h6>
                                        <p class="px-3">${product.description}</p>
                                    </div>
                                </div>
                                <!-- Product Info ENDS -->
                            </div>
                            <!-- Comments -->
                            <div class="accordion mt-3" id="accordionExample">
                            <div class="accordion-item">
                                <h2 class="accordion-header" id="headingOne">
                                <button id="viewComments" value="${product._id}" class="accordion-button collapsed" type="button" data-bs-toggle="collapse"
                                data-bs-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                                View Comments
                                </button>
                                 </h2>
                                <div id="collapseOne" class="accordion-collapse collapse" aria-labelledby="headingOne"
                                data-bs-parent="#accordionExample">
                                    <div class="accordion-body">
                                        <div id="comments">
                                            
                                        </div>
                                        <div class="add-comment">
                                            <label for="exampleFormControlTextarea1" class="form-label">New Comment</label>
                                            <textarea id="newCommentText" class="form-control" id="exampleFormControlTextarea1" rows="3"></textarea>
                                            <button id="saveComment" class="btn btn-primary mt-3">Save Comment</button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>  
                                <!-- Comments ENDS -->
                        </div>
                    </div>
                    `;
                        getComments();
                        viewComments();
                        saveComment();
                    },
                    error: function () {
                        alert('Unable to find product');
                    } //end of error
                }); //end of ajax
            }); // end of button listener
        }); //end of for each
    } //end of function

    // ---------------------- ADD USER API CALLS -------------------
    // Register User
    $('#r-submit').click(function (event) {
        event.preventDefault();
        let fullname = $('#r-fullname').val();
        let username = $('#r-username').val();
        let email = $('#r-email').val();
        let password = $('#r-password').val();

        if (fullname == '' || username == '' || email == '' || password == '') {
            alert('Please enter all details');
        } else {
            $.ajax({
                url: `http://${url}/registerUser`,
                type: 'POST',
                data: {
                    fullname: fullname,
                    username: username,
                    email: email,
                    password: password
                },
                success: function (user) {
                    if (user !== 'username already taken') {
                        sessionStorage.setItem('userID', user['_id']);
                        sessionStorage.setItem('userName', user['username']);
                        sessionStorage.setItem('userEmail', user['email']);
                        alert('Thank you for registering. You have been logged in automatically');
                    } else {
                        alert('Username taken already. Please try again');
                        $('#r-username').val('');
                        $('#r-email').val('');
                        $('#r-password').val('');
                    } // else
                },
                error: function () {} // error
            }); // end of ajax
        } // end of else
    }); // end of submit user click

    //Login User
    $('#login-submit').click(function (event) {
        event.preventDefault();
        let username = $('#login-username').val();
        let password = $('#login-password').val();

        if (username == '' || password == '') {
            alert('Please enter all details');
        } else {
            $.ajax({
                url: `http://${url}/loginUser`,
                type: 'POST',
                data: {
                    username: username,
                    password: password
                },
                success: function (user) {

                    if (user == 'User not found. Please register') {
                        alert('User not found. Please Register');
                    } else if (user == 'not authorized') {
                        alert('Please try with correct details');
                        $('#login-username').val('');
                        $('#password').val('');
                    } else {
                        sessionStorage.setItem('fullName', user['fullname']);
                        sessionStorage.setItem('userID', user['_id']);
                        sessionStorage.setItem('userName', user['username']);
                        sessionStorage.setItem('userEmail', user['email']);
                        alert(`Welcome back ${username.toUpperCase()}!`);
                    } // end of ifs
                }, //success
                error: function () {
                    alert('Unable to login - unable to call api');
                } //error
            }); //end of ajax
        } //end of else
    }); //end of login click function

    // Logout
    $('#logout').click(function () {
        sessionStorage.clear();
        alert('You are now logged out');
        window.location.href = '#';
    });

    // --------COMMENT AJAX FUNCTIONALITY---------

    // Get Comments

    function getComments() {
        let commentsContainer = document.getElementById('comments');
        let productId = $('#viewComments').val();
        $.ajax({
            url: `http://${url}/allComments`,
            type: 'GET',
            dataType: 'json',
            success: function (comments) {
                commentsContainer.innerHTML = '';
                for (i = 0; i < comments.length; i++) {
                    if (productId === comments[i].product_id) {
                        let date = comments[i].time;
                        commentsContainer.innerHTML += `
                        <div class="new-comment">
                        <p>${comments[i].text}</p>
                        <h6 class="text-muted">Posted by: <span>${comments[i].username}</span><br><span>${comments[i].time}</span></h6>
                        </div>
                        `;
                    }
                }
            },
            error: function () {}
        }); //end of ajax
    } //end of get comments

    //-------- View comments ------

    function viewComments() {
        $('#viewComments').click(function () {
            getComments();
        });
    }

    // ------ Add Comment ------
    function saveComment() {
    $('#saveComment').click(function () {
        let comment = $('#newCommentText').val();
        let user = sessionStorage.getItem('userName');
        let productId = $('#viewComments').val();
        if (user == null) {
            alert('Please log in to leave a comment');
        } else {
        $.ajax({
            url: `http://${url}/createComment`,
            type: 'POST',
            data: {
                text: comment,
                username: user,
                product_id: productId,
            },
            success: function (comment) {
                getComments();
            },
            error: function () {} //end of error
        }); //end of ajax
    }
    }); //end of click
}
    // filter functionality - By category

    $('#categorySelect').change(function () {
        let categoryChange = $('#categorySelect').val();
        if (categoryChange === "All") {
            getAllProducts();
        } else {
        $.ajax({
            url: `http://${url}/allProductsFromDB`,
            type: 'GET',
            data: {
                filter: $('#categorySelect').val(),
            },

            success: function (productsFromMongo) {
                let results = document.getElementById('result');
                results.innerHTML = '';
                for (let i = 0; i < productsFromMongo.length; i++) {
                    let mongoCategory = productsFromMongo[i].category;
                    if (categoryChange === mongoCategory) {
                        results.innerHTML += `
                            <!-- Product Card -->
                        <div class="col-4 listing">
                            <div class="card" style="width: 18rem;">
                                <a href="#listing"><img
                                        src="${productsFromMongo[i].image1}"
                                        class="card-img-top" img="card-img" alt="${productsFromMongo[i].productName}"></a>
                                <div class="card-body">
                                    <div class="row">
                                        <h5  href="#listing">${productsFromMongo[i].productName}</h5>
                                        <h6 href="#listing">${productsFromMongo[i].price}</h6>
                                    </div>
                                    <button value=${productsFromMongo[i]._id} class="m-1 btn readmore btn-primary" type="button" name="button">View Listing</button>
                                    <button value=${productsFromMongo[i]._id} class="btn edit btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" type="button" name="button">Edit</button>
                                    <button value=${productsFromMongo[i]._id} class="btn delete btn-primary" type="button" name="button">Delete</button>
                                </div>
                            </div>
                        </div>
                        <!-- Product Card Ends -->
                        `;
                        singleProduct();
                        editProducts();
                        deleteButtons();
                    }
                }
            },
            error: function () {
                alert('unable to filter products by category');
            }, // end of error    
        });
    }
    });

    // filter functionality - By Condition

    $('#conditionSelect').change(function () {
        let conditionChange = $('#conditionSelect').val();
        if (conditionChange === "All") {
            getAllProducts();
        } else {
        $.ajax({
            url: `http://${url}/allProductsFromDB`,
            type: 'GET',
            data: {
                filter: $('#conditionSelect').val()
            },

            success: function (productsFromMongo) {
                let results = document.getElementById('result');
                results.innerHTML = '';
                for (let i = 0; i < productsFromMongo.length; i++) {
                    let mongoCondition = productsFromMongo[i].condition;
                    if (conditionChange === mongoCondition) {
                        results.innerHTML += `
                                <!-- Product Card -->
                            <div class="col-4 listing">
                                <div class="card" style="width: 18rem;">
                                    <a href="#listing"><img
                                            src="${productsFromMongo[i].image1}"
                                            class="card-img-top" img="card-img" alt="${productsFromMongo[i].productName}"></a>
                                    <div class="card-body">
                                        <div class="row">
                                            <h5  href="#listing">${productsFromMongo[i].productName}</h5>
                                            <h6 href="#listing">${productsFromMongo[i].price}</h6>
                                        </div>
                                        <button value=${productsFromMongo[i]._id} class="m-1 btn readmore btn-primary" type="button" name="button">View Listing</button>
                                    <button value=${productsFromMongo[i]._id} class="btn edit btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" type="button" name="button">Edit</button>
                                    <button value=${productsFromMongo[i]._id} class="btn delete btn-primary" type="button" name="button">Delete</button>
                                    </div>
                                </div>
                            </div>
                            <!-- Product Card Ends -->
                            `;
                        singleProduct();
                        editProducts();
                        deleteButtons();
                    }
                }
            },
            error: function () {
                alert('unable to filter products by condition');
            }, // end of error    
        });
    }
    });

    // filtering functionality -- Search bar

    $('#searchInput').keyup(function () {
        let search = $('#searchInput').val();
        console.log(search);
        $.ajax({
            url: `http://${url}/allProductsFromDB`,
            type: 'GET',
            data: {
                filter: $('#searchInput').val()
            },

            success: function (filteredSearch) {
                let results = document.getElementById('result');
                results.innerHTML = '';
                for (let i = 0; i < filteredSearch.length; i++) {
                    if ((filteredSearch[i].productName.toLowerCase().includes(search.toLowerCase())) === true) {
                        results.innerHTML += `
                                <!-- Product Card -->
                            <div class="col-4 listing">
                                <div class="card" style="width: 18rem;">
                                    <a href="#listing"><img
                                            src="${filteredSearch[i].image1}"
                                            class="card-img-top" img="card-img" alt="${filteredSearch[i].productName}"></a>
                                    <div class="card-body">
                                        <div class="row">
                                            <h5  href="#listing">${filteredSearch[i].productName}</h5>
                                            <h6 href="#listing">${filteredSearch[i].price}</h6>
                                        </div>
                                        <button value=${filteredSearch[i]._id} class="m-1 btn readmore btn-primary" type="button" name="button">View Listing</button>
                                    <button value=${filteredSearch[i]._id} class="btn edit btn-primary" data-bs-toggle="modal" data-bs-target="#editModal" type="button" name="button">Edit</button>
                                    <button value=${filteredSearch[i]._id} class="btn delete btn-primary" type="button" name="button">Delete</button>
                                    </div>
                                </div>
                            </div>
                            <!-- Product Card Ends -->
                            `;
                        singleProduct();
                        editProducts();
                        deleteButtons();
                    }
                }
            },
            error: function () {
                alert('unable to filter products using Search Bar');
            }, // end of error    
        });
    });

    // clock function
    // set an interval for how often a function runs in milliseconds
setInterval(setClock, 1000);

const hourHand = document.getElementById('hours');
const minuteHand = document.getElementById('minutes');
const secondHand = document.getElementById('seconds');

// define the set clock function
function setClock() {
    const currentDate = new Date();
    const secondsRatio = currentDate.getSeconds() / 60;
    const minutesRatio = (secondsRatio + currentDate.getMinutes()) / 60;
    const hoursRatio = (minutesRatio + currentDate.getHours()) /12;
    //  because we don't want the hours or minutes to jump by minutes or hours, we want them to move gradually so we can call upon the previous rato to allow them to move smoothly

    // call the set rotation function of each hand parsing in the correct elements
    setRotation(secondHand, secondsRatio);
    setRotation(minuteHand, minutesRatio);
    setRotation(hourHand, hoursRatio);
}   

function setRotation(element, rotationRatio) {
    element.style.setProperty('--rotation', rotationRatio * 360);
}

setClock()
}); // Doc Ready function Ends
/*jshint esversion: 6 */
/*jshint -W069 */   /// *** Maz added 7 April *** /// removes dot notiation erros

console.log('frontend script is working');

$(document).ready(function () {

    let url;

    // Get Config.Json and variable from it
    $.ajax({
        url: 'config.json',
        type: 'GET',
        dataType: 'json',
        success: function (configData) {
            console.log(configData.SERVER_URL, configData.SERVER_PORT);
            url = `${configData.SERVER_URL}:${configData.SERVER_PORT}`;
            console.log(url);
            getAllProducts();
        },
        error: function (error) {
            console.log(error);
        }
    });

    // Get All products Function
    function getAllProducts() {

        /// *** Maz added 7 April ****** ///
        let userid = sessionStorage.getItem('userID');
        if (!userid) {
            alert('Please log in.');
        } else { /// *** Maz added 7 April ****** ///

        $.ajax({
            url: `http://${url}/allProductsFromDB`,
            type: 'GET',
            dataType: 'json',

            success: function (productsFromMongo) {
                let results = document.getElementById('result'); // Patricia - enter id name please :)
                results.innerHTML = '';
                for (let i = 0; i < productsFromMongo.length; i++) { 
                    /// *** Maz added 7 April start ****** ///
                    let createdBy = productsFromMongo[i].user_id;
                    console.log(productsFromMongo[i]);
                    if (createdBy === userid) {
                        results.innerHTML += 
                        ` 
                        <div class="col-4 mt-3 mb-3">
                        <div class="card">
                        <img class="card-img-top" src="${productsFromMongo[i].image1}" alt="${productsFromMongo[i].productName} image">
                            <div class="card-body">
                                <h5 class="card-title">${productsFromMongo[i].productName}</h5>
                                 <p class="card-text">${productsFromMongo[i].price}</p>
                                 <button value="${productsFromMongo[i]._id}" class="btn delete btn-primary" type="button" name="button">Delete</button>
                                 <button value="${productsFromMongo[i]._id}" data-bs-toggle="modal" data-bs-target="#editModal" class="btn edit btn-primary" type="button" name="button">Edit</button>
                                 <button value="${productsFromMongo[i]._id}" data-bs-toggle="modal" data-bs-target="#readmoreModal" class="btn readmore btn-primary" type="button" name="button">Read More</button>
                            </div>
                        </div>
                    </div>
                    `;
                    } else {
                        results.innerHTML += `
                        <div class="col-4 mt-3 mb-3">
                            <div class="card">
                            <img class="card-img-top" src="${productsFromMongo[i].image1}" alt="${productsFromMongo[i].productName} image">
                                <div class="card-body">
                                    <h5 class="card-title">${productsFromMongo[i].productName}</h5>
                                    <p class="card-text">${productsFromMongo[i].price}</p>
                                    <button value="${productsFromMongo[i]._id}" data-bs-toggle="modal" data-bs-target="#readmoreModal" class="btn readmore btn-primary" type="button" name="button">Read More</button>
                                </div>
                            </div>
                        </div> 
                        `; // Patricia - can you please paste in the card here :)
                        /// *** Maz added 7 April end ****** ///
                    } // end of for loop

                    editProducts(); /// *** Maz added 7 April ****** ///
                    deleteButtons(); /// *** Maz added 7 April ****** ///
                    readmore(); /// *** Maz added 7 April ****** ///
                }
            }, // end of success

            error: function () {
                alert('unable to get products');
            }, // end of error
        }); // end of ajax function
    } // end of getAllProducts function
}

    //View Products onclick of View Products Button
    $('#viewProducts').click(function () {
        getAllProducts();
    }); // End of View Products


    //add a product form a click
    $('#addProduct').click(function (event) {
        event.preventDefault();
        let productName = $('#a-productName').val();
        let price = $('#a-price').val();
        let image1 = $('#a-image1').val();
        let userid = sessionStorage.getItem('userID');
        console.log(userid);
        console.log(productName, price, image1);
        if (productName == '' || price == '' || image1 == '' || !userid) {
            alert('Please login and enter all details');
        } else {
            $.ajax({
                url: `http://${url}/addProduct`,
                type: 'POST',
                data: {
                    productName: productName,
                    price: price,
                    image1: image1,
                    user_id: userid
                },
                success: function (product) {
                    console.log(product);
                    alert('product added');
                    getAllProducts();
                },
                error: function () {
                    console.log('error: cannot call api');
                } // End of error
            }); // End of ajax
        } // End of else
    }); // End of add Product Click


    // Giving our "Save Changes" button an id for each product
    function editProducts() {
        let editButtons = document.querySelectorAll('.edit');
        let buttons = Array.from(editButtons);
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                let saveChange = document.querySelector('.saveChange');
                saveChange.value = this.value;
            });
        });
    }

    // UPDATE PRODUCT from Modal Save Button
    $('.saveChange').click(function (event) {
        event.preventDefault();
        let productId = this.value;
        let productName = $('#productName').val();
        let productPrice = $('#productPrice').val();
        let productImage1 = $('#image1').val();
        let userid = sessionStorage.getItem('userID');
        console.log(productId, productName, productPrice, productImage1);
        if (productId == '' || !userid) {
            alert('Please enter a product to update');
        } else {
            $.ajax({
                url: `http://${url}/updateProduct/${productId}`,
                type: 'PATCH',
                data: {
                    productName: productName,
                    price: productPrice,
                    image1: productImage1
                },
                success: function (data) {
                    console.log(data);
                    getAllProducts();
                },
                error: function () {
                    console.log('error: cannot update post');
                } // End of error
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
                console.log(productId);
                if (productId == '' || !userid) {
                    alert('Please enter product id to delete');
                } else {
                    $.ajax({
                        url: `http://${url}/deleteProduct/${productId}`,
                        type: 'DELETE',
                        success: function () {
                            console.log('deleted');
                            alert('Product Deleted');
                            getAllProducts();
                        },
                        error: function () {
                            console.log('error: cannot delete due to call on api');
                        } // error
                    }); // ajax
                } // if
            });
        });
    }

    // Get Single Product Data on Read More click and populate Read More Modal
    function readmore() {
        let readmoreButtons = document.querySelectorAll('.readmore');
        let buttons = Array.from(readmoreButtons);
        buttons.forEach(function (button) {
            button.addEventListener('click', function () {
                console.log(`readmore with an id of ${this.value}`);
                let productId = this.value;
                $.ajax({
                    url: `http://${url}/singleProduct/${productId}`,
                    type: `GET`,
                    dataType: `json`,
                    success: function (product) {
                        console.log(product);
                        let readmoreBody = document.getElementById('readMoreBody');
                        readmoreBody.innerHTML = `
                        <div class="row featurette">
                        <div class="col-md-7">
                            <h2 class="featurette-heading fw-normal lh-1">${product.productName} <span
                                    class="text-muted">$${product.price}</span></h2>
                            <p class="lead">Some great placeholder content for the first featurette here. Imagine some exciting prose here.</p>                                
                        </div>
                        <div class="col-md-5 ">
                            <img src="${product.image1}" class="w-100" alt="${product.name}">
                        </div>
                        <div class="accordion" id="accordionExample">
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
                    </div>
                        `;
                        viewComments();
                        addComment();
                    },
                    error: function () {
                        alert('Unable to find product');
                    }

                }); // End of Ajax
            }); // End of button onClcik
        }); // End of forEach
    } // End of readMore function


    /// *** Maz added 7 April ****** ///
    // ---------------------- ADD USER API CALLS -------------------
    // Register User
    $('#r-submit').click(function (event) {
        event.preventDefault();
        let username = $('#r-username').val();
        let email = $('#r-email').val();
        let password = $('#r-password').val();
        console.log(username, email, password);

        if (username == '' || email == '' || password == '') {
            alert('Please enter all details');
        } else {
            $.ajax({
                url: `http://${url}/registerUser`,
                type: 'POST',
                data: {
                    username: username,
                    email: email,
                    password: password
                },
                success: function (user) {
                    console.log(user); // remove when dev is finished
                    if (user !== 'username already taken') {
                        sessionStorage.setItem('userID', user['_id']);
                        sessionStorage.setItem('userName', user['username']);
                        sessionStorage.setItem('userEmail', user['email']);
                        console.log(sessionStorage);
                        alert('Thank you for registering. You have been logged in automatically');
                    } else {
                        alert('Username taken already. Please try again');
                        $('#r-username').val('');
                        $('#r-email').val('');
                        $('#r-password').val('');
                    } // else
                },
                error: function () {
                    console.log('error: cannot call add user api');
                } // error
            }); // end of ajax
        } // end of else
    }); // end of submit user click


    //Login User
    $('#login-submit').click(function (event) {
        event.preventDefault();
        let username = $('#login-username').val();
        let password = $('#login-password').val();

        console.log(username, password);

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
                    console.log(user);

                    if (user == 'User not found. Please register') {
                        alert('User not found. Please Register');
                    } else if (user == 'not authorized') {
                        alert('Please try with correct details');
                        $('#login-username').val('');
                        $('#password').val('');
                    } else {
                        sessionStorage.setItem('userID', user['_id']);
                        sessionStorage.setItem('userName', user['username']);
                        sessionStorage.setItem('userEmail', user['email']);
                        console.log(sessionStorage);
                        let loggedIn = document.querySelector('.logged-in');
                        loggedIn.innerHTML = `<p>Logged in as <span class="text-danger">${username.toUpperCase()}</span></p>`;
                        alert(`Welcome back ${username.toUpperCase()}!`);
                    } // end of ifs
                }, //success
                error: function () {
                    console.log('error: cannot call api');
                    alert('Unable to login - unable to call api');
                } //error
            }); //end of ajax
        } //end of else
    }); //end of login click function

    // Logout
    $('#logout').click(function () {
        sessionStorage.clear();
        alert('You are now logged out');
        console.log(sessionStorage);
        window.location.href = '#';
    });
    /// *** Maz added 7 April ****** ///



}); // Doc Ready function Ends
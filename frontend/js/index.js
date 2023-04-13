/*jshint esversion: 6 */
/*jshint -W069 */   /// *** Maz added 7 April *** /// removes dot notiation erros

console.log('frontend script is working');

$(document).ready(function () {

    let url;

    // ON CLICKS

    // Browse on-click - To make the listing & seller tab appear when a user clicks into a listing
    $('#browse-tab').click(function(){
        console.log('ayo this is working');
        let listingTab = document.getElementById('listing-tab');
        let sellerTab = document.getElementById('seller-tab');
        listingTab.style.display = "inline-block";
        sellerTab.style.display = "inline-block";
    });

    // Register on-click -  To make the add button appear when a user registers
    $('#r-submit').click(function(){
        console.log('ayo this is working');
        let addTab = document.getElementById('add-tab');
        addTab.style.display = "inline-block";
    });

    // Login on-click - To make the add button appear when a user registers
    $('#login-submit').click(function(){
        console.log('ayo this is working');
        let addTab = document.getElementById('add-tab');
        addTab.style.display = "inline-block";
    });


// populate account details modal with session storage details
$('#account-details').click(function(){
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
                <i class="fa-solid fa-trash"></i>
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
                                </div>
                            </div>
                        </div>
                        <!-- Product Card Ends -->
                    `;

                    editProducts(); /// *** Maz added 7 April ****** ///
                    deleteButtons(); /// *** Maz added 7 April ****** ///
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
    console.log(userid);

    // run a check to make sure the user is logged in before it validates our form
    if (!userid) {
       alert('Please login or register before trying to create a listing');
    } else {
       // once login is verified, have the javascript check if all the fields are entered before pushing to the mongo
        console.log(productName, price, image1, image2, image3, image4, description, category, condition);
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
                    console.log(product);
                    alert('product added');
                    getAllProducts();
                },
                error: function () {
                    console.log('error: cannot call api');
                } // End of error
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
        console.log(productId, productNameUpdate, productPrice, productImage1, productImage2, productImage3, productImage4, productDescription, productCategory, productCondition);
        if (productId == '' || !userid) {
            alert('Please enter a product to update');
        } else {
            $.ajax({
                url: `http://${url}/updateProduct/${productId}`,
                type: 'PATCH',
                data: {
                    productName: productName,
                    price: productPrice,
                    image1: productImage1,
                    image2: productimage2,
                    image3: productimage3,
                    image4: productimage4,
                    description: productDescription,
                    category: productCategory,
                    condition: productCondition
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

    // --------COMMENT AJAX FUNCTIONALITY---------

    // Get Comments

    function getComments(){
        let commentsContainer = document.getElementById('comments');
        let productId = $('#viewComments').val();
        $.ajax({
            url: `http://${url}/allComments`,
            type: 'GET',
            dataType: 'json',
            success: function(comments) {
                console.log(comments);
                commentsContainer.innerHTML = '';
                for (i = 0; i < comments.length; i++) {
                    if (productId === comments[i].product_id){
                        console.log(comments[i]);
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
            error: function(){
                console.log('error: cannot call comments api');
            }
        }); //end of ajax
    } //end of get comments

    //--------View comments------

    function viewComments(){
        $('#viewComments').click(function(){
            getComments();
        });
    }

    // ------add comment------
    $('#saveComment').click(function () {
        console.log("not working comments");
        let comment = $('#newCommentText').val();
        let user = sessionStorage.getItem('userName');
        let productId = $('#viewComments').val();
        console.log(user);
        console.log(comment);
        console.log(productId);
        $.ajax({
            url: `http://${url}/createComment`,
            type: 'POST',
            data: {
                text: comment,
                username: user,
                product_id: productId,
            },
            success: function(comment) {
                console.log(comment);
                getComments();
            },
            error: function(){
                console.log('error: cannot post comment');
            }//end of error
        });//end of ajax
    });//end of click

    // filter functionality

        $('#categorySelect').change(function () {
            let categoryChange = $('#categorySelect').val();
            console.log(categoryChange);
            $.ajax({
                url: `http://${url}/productCategoryFilter`,
                type: 'GET',
                dataType: 'json',
    
                success: function (productsFromMongo) {
                    let results = document.getElementById('result');
                    results.innerHTML = '';
                    for (let i = 0; i < productsFromMongo.length; i++) { 
                        let mongoCategory = productsFromMongo[i].category;
                        console.log(mongoCategory);
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
                                </div>
                            </div>
                        </div>
                        <!-- Product Card Ends -->
                        `;
                        }
                    }
                },
                error: function () {
                    alert('unable to filter products by category');
                }, // end of error    
            });
        });
    

}); // Doc Ready function Ends

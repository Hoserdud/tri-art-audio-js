
var variantMatrix = [];
var activeVariant = 0;
var activeVariantAvailability = false;
var client = ShopifyBuy.buildClient({
    domain: 'art-noise-music.myshopify.com',
    storefrontAccessToken: '0b822292e02fbb61e3651125956a1576'
});
var showPrice = true;
var productId = '7544358174905';
var productData;
var button = document.getElementById("cartToggle");
var element = document.getElementById("cartContainer");
element.style.display = "none";
// Add an event listener to the button to toggle the element's visibility when clicked
button.addEventListener("click", function () {
    if (element.style.display === "none") {
        element.style.display = "block";
    } else {
        element.style.display = "none";
    }
});
// asfafafssafas
function getFirstActiveVariant(productJSON) {
    //loop through the variants and return the first variant with an available status of true
    for (var i = 0; i < productJSON.variants.length; i++) {
        if (productJSON.variants[i].available) {
            //console.log(productJSON.variants[i].title)
            let variantValues = [];
            //loop through the selectedOptions array and push the value of each object into the variantValues array
            for (var j = 0; j < productJSON.variants[i].selectedOptions.length; j++) {
                variantValues.push(productJSON.variants[i].selectedOptions[j].value);
            }
            //console.log("the first active variant is: " + variantValues);
            activeVariant = i;
            return variantValues;
        }
    }
}
function setActiveImage(variantNumber, previousVariantNumber) {
    //find the image element with the attribute 'variant-image' equal to the variantNumber and set it to display block
    document.querySelector('[variant-image="' + previousVariantNumber + '"]').style.display = "none";
    document.querySelector('[variant-image="' + variantNumber + '"]').style.display = "block";

}
function changeActiveVariantButton(variantValues, productJSON) {
    //console.log(variantValues);
    //console.log(productJSON);
    var buttonContainer = document.getElementById('variantBlock');
    var buttons = buttonContainer.getElementsByClassName('variantbutton');
    let unavailableVariantValues = [];
    let activeVariantValues = [];
    //loop through the variants in the productJSON and make alist of variant values from unavailable variants  
    for (var k = 0; k < productJSON.variants.length; k++) {
        if (!productJSON.variants[k].available) {
            let currentVariantValues = [];
            for (var l = 0; l < productJSON.variants[k].selectedOptions.length; l++) {
                currentVariantValues.push(productJSON.variants[k].selectedOptions[l].value);
            }
            unavailableVariantValues.push(currentVariantValues);
        }
    }
    //loop through the variant buttons and clear active and unavailable classes from them
    for (var i = 0; i < buttons.length; i++) {
        buttons[i].classList.remove('active');
        buttons[i].classList.remove('unavailable');
        //loop through variantValues and check if the button's variant attribute is equal to the value in the variantValues array
        for (var j = 0; j < variantValues.length; j++) {
            if (buttons[i].getAttribute('variant') == variantValues[j]) {
                buttons[i].classList.add('active');
                activeVariantValues.push(variantValues[j]);
            }
        }
    }
    let activeButtons = document.querySelectorAll('.active.variantbutton');
    //console.log("unavailable variants:");
    //console.log(unavailableVariantValues); // Output: [1, 2, 3, 4, 5]
    //console.log("active variant buttons:");
    //console.log(activeButtons); // Output: [1, 2, 3, 4, 5]
    let inactiveButtons = [];
    for (var abutton = 0; abutton < activeButtons.length; abutton++) {
        //console.log("-----------------");
        //console.log(activeButtons[abutton].getAttribute('variant'))
        //console.log("-----------------");
        for (var i = 0; i < unavailableVariantValues.length; i++) {
            for (var j = 0; j < unavailableVariantValues[i].length; j++) {
                //console.log(unavailableVariantValues[i][j])
                if (activeButtons[abutton].getAttribute('variant') == unavailableVariantValues[i][j]) {

                    inactiveButtons = inactiveButtons.concat(unavailableVariantValues[i]);
                }
            }
        }
    }
    //console.log("-----------------");
    //console.log(inactiveButtons);
    //console.log("-----------------");
    for (var i = 0; i < buttons.length; i++) {
        for (var j = 0; j < inactiveButtons.length; j++) {
            if (buttons[i].text == inactiveButtons[j]) {
                if (!buttons[i].classList.contains('active')) {
                    buttons[i].classList.add('unavailable');
                }
            }
        }
    }
    let previousVariant = activeVariant;
    //find the active variant by looking at all active variant buttons and setting it to the number the variant is in the product variant list
    for (var i = 0; i < productJSON.variants.length; i++) {
        let variantValues = [];
        for (var j = 0; j < productJSON.variants[i].selectedOptions.length; j++) {
            variantValues.push(productJSON.variants[i].selectedOptions[j].value);
        }
        //console.log(variantValues);
        let matchingVariantValues = 0;
        for (var k = 0; k < variantValues.length; k++) {
            for (var l = 0; l < activeVariantValues.length; l++) {
                if (variantValues[k] == activeVariantValues[l]) {
                    matchingVariantValues++;
                }
            }
        }
        if (matchingVariantValues == variantValues.length) {
            //console.log("changing active variant from: " + activeVariant + " to: " + i + "");
            activeVariant = i;
            //based on the new active variant value, set the ativeVariantAvailablility
            if (productJSON.variants[i].available) {
                activeVariantAvailability = true;
            } else {
                activeVariantAvailability = false;
            }

        }

    }
    //set the active variant and change the image to match
    setBuyButtonVisibility();
    //console.log("the active variant is: " + activeVariant);
    setActiveImage(activeVariant, previousVariant);
}
function variantButtonPressed() {
    //check if the button has the class 'unavailable' and return if it does
    if (this.classList.contains('unavailable')) {
        //console.log('unavailable')
        //return;
    }
    //check to see if the calling button has "option-0" attributes based on the variantMatrix
    let optionnames = '';
    //console.log('a button has been pressed: ');
    //console.log(this);
    //populate optionnames based on the lkength of the variantMatrix array

    if (this.hasAttribute('variant')) {
        //console.log(this.getAttribute('variant'));
    }
    let currentlyActiveButtons = document.querySelectorAll('.active.variantbutton');
    let newActiveButtons = [];
    for (var i = 0; i < currentlyActiveButtons.length; i++) {
        if (currentlyActiveButtons[i].getAttribute('variantgroup') != this.getAttribute('variantgroup')) {
            newActiveButtons.push(currentlyActiveButtons[i].getAttribute('variant'));
        }
    }
    newActiveButtons.push(this.getAttribute('variant'));
    //console.log("the new active buttons are:");
    //console.log(newActiveButtons);
    //console.log(productData);
    changeActiveVariantButton(newActiveButtons, productData);
    return (newActiveButtons);
    //check if the button contains an attribute with the same name as one of the optionnames
}

function createPropertyMatrix(productJSON) {
    //if the object has the propery 'options', loop through every object in the array
    if (productJSON.hasOwnProperty("options")) {
        for (var i = 0; i < productJSON.options.length; i++) {
            //create a new array for each option
            var optionArray = [];
            optionArray.push(productJSON.options[i]['name']);
            //loop through every object in the 'values' key
            for (var j = 0; j < productJSON.options[i].values.length; j++) {
                //push the value of the 'values' key into the optionArray
                optionArray.push(String(productJSON.options[i].values[j]));
            }
            //push the optionArray into the variantMatrix
            variantMatrix.push(optionArray);
        }
        //console.log(variantMatrix);
    }

}

function generateVariantButtons(variantMatrix) {
    //console.log('generateVariantButtons');
    //console.log(variantMatrix);
    //loop through the variantMatrix
    var variantBlock = document.getElementById('variantBlock');
    for (var i = 0; i < variantMatrix.length; i++) {
        //create a new div for each row of buttons
        var buttonRow = document.createElement('div');
        buttonRow.setAttribute('id', 'vbcontainer');
        //loop through each array in the variantMatrix
        for (var j = 0; j < variantMatrix[i].length; j++) {
            //console.log(variantMatrix[i][j]);
            if (j == 0) {
                //create a header with the name of the variant and append it to the variantBlock
                var variantHeader = document.createElement('h1');
                variantHeader.innerText = variantMatrix[i][j];
                variantBlock.appendChild(variantHeader);
            }
            else {
                if (variantMatrix[i][j] != 'Default Title') {
                    //clone the element with the id 'baseVaraintButton' and replace the text with the value of the variantMatrix
                    var newButton = document.getElementById('baseVariantButton').cloneNode(true);
                    newButton.innerText = variantMatrix[i][j];
                    //clear the exisitng is' from the button
                    newButton.removeAttribute('id');
                    //add a listener to the button that triggers the function variantButtonPressed
                    newButton.addEventListener('click', variantButtonPressed);
                    //add custom attributes representing the element in the variantMatrix that the button represents
                    for (var k = 0; k < variantMatrix.length; k++) {
                        var attributeName = 'variant';
                        //set attribute to the value of 'i'
                        newButton.setAttribute(attributeName, variantMatrix[i][j]);
                        newButton.setAttribute('variantgroup', i);
                    }
                    buttonRow.appendChild(newButton);
                }
            }

            //append the newButton to the buttonRow

        }
        //append the buttonRow to the variantBlock

        //console.log(variantBlock);
        variantBlock.appendChild(buttonRow);
    }
    //hide the baseVariantButton
    document.getElementById('baseVariantButton').style.display = 'none';
}
async function getShopifyProduct(productIdString) {

    ////console.log(client);
    var newproductId = 'gid://shopify/Product/' + productIdString;
    //const productId = 'gid://shopify/Product/7544353128633';
    ////console.log(newproductId);
    client.product.fetch(newproductId).then((product) => {
        initializeProductDetails(product);
        const variants = product.variants;
        variants.forEach(variant => {
            client.product.fetch(variant.id).then((variant) => {
                ////console.log(variant)
                ////console.log(`Stock: ${variant.quantityAvailable}`);
            });
        });
        //console.log(product);
        productData = product;
        //console.log("This is the product data:");
        console.log(product);
        return (product);
    }).catch(function (err) {
        ////console.log('error');
        //console.log(err);
        return null;
    });
}
async function getProduct(productIdString) {
    try {
        const product = await getShopifyProduct(productIdString);
        return product;
    } catch (err) {
        //console.log(err);
        return null;
    }
}
function initializeProductDetails(productJSON) {
    const container = document.getElementById('product-container');
    let productObject = productJSON;
    // Create a new HTML element for the product title
    if (productObject.hasOwnProperty("title")) {
        const title = document.getElementById('productTitle');
        title.innerText = productObject.title;
    }
    // Create a new HTML element for the product 'img' is an available property

    //if (productObject.hasOwnProperty("images")) {
    //const image = document.createElement('img');
    //image.src = productObject.images[0].src;
    //container.appendChild(image);
    //}
    //loop through the variants of a product and create html elements with their images
    for (var i = 0; i < productObject.variants.length; i++) {
        const image = document.createElement('img');
        image.src = productObject.variants[i].image.src;
        image.setAttribute('variant-image', i);
        image.style.display = 'none';
        container.appendChild(image);
    }

    if (productObject.hasOwnProperty("price")) {
        // Create a new HTML element for the product price
        const price = document.getElementById('productPrice');
        price.innerText = productObject.price;
    }
    // Append all the elements to the container




    createPropertyMatrix(productObject);
    generateVariantButtons(variantMatrix);
    let variantTags = getFirstActiveVariant(productObject);
    changeActiveVariantButton(variantTags, productObject);
    initializeBuyButtons();
    setBuyButtonVisibility();
}
function initializeBuyButtons() {
    if (showPrice) {
        //find the buy buttons with ids buyButtonavailable and buyButtonUnavailable
        var buyButtonavailable = document.getElementById('buyButtonAvailable');
        var buyButtonUnavailable = document.getElementById('buyButtonUnavailable');
        //console.log(buyButtonavailable);
        //add the event listener to the buttons
        buyButtonavailable.addEventListener('click', addToCart);
        buyButtonUnavailable.addEventListener('click', addToCart);
        //hide both buttons

    }
}
function setBuyButtonVisibility() {
    //if the active variant is avliable then show the avalible button and hide the unavailable button, and vice versa
    if (activeVariantAvailability == true) {
        //console.log("set buy button visibility executed");
        document.getElementById('buyButtonAvailable').style.display = 'block';
        document.getElementById('buyButtonUnavailable').style.display = 'none';
    }
    else {
        //console.log("set buy button unav visibility executed");
        document.getElementById('buyButtonAvailable').style.display = 'none';
        document.getElementById('buyButtonUnavailable').style.display = 'block';
    }
    if (showPrice == false) {
        //console.log("buy button hidden");
        document.getElementById('buyButtonAvailable').style.display = 'none';
        document.getElementById('buyButtonUnavailable').style.display = 'none';
    }
}

//cart management scripts
var shoppingCartJSON = {};
var cartTotalQunatity = 0;
var cartTotalPrice = 0;
var cartrefresh = false;
async function getCartItemObject(productID, variantID, quantity) {
    let returnObject = new Object();
    let cartItemJSON = {};
    let variantCartItemJSON = {};

    await client.product.fetch(productID).then((product) => {
        //console.log("Cart Base Item:");
        //console.log(product);
        //find the matching variant from within the product
        for (var i = 0; i < product.variants.length; i++) {
            if (product.variants[i].id == variantID) {
                //add the variant to the cart
                console.log("Cart Item Variant:");
                console.log(product.variants[i]);
                //return product.variants[i]
                returnObject["product"] = product;
                returnObject["variant"] = product.variants[i];
                returnObject["quantity"] = quantity;
                //console.log("Cart Item Object:");
                //console.log(returnObject);

            }
        }
    });
    return returnObject;
}
function initializeCart() {
    //get the cart from the cookies
    //if the cart is empty then set the cart to an empty array
    //if the cart is not empty then set the cart to the cart from the cookies
    let obj = {};
    let jsonString = JSON.stringify(obj);
    let triartshoppingcart = Cookies.get("triartshoppingcart") || jsonString;
    shoppingCartJSON = triartshoppingcart;
    shoppingCartJSON = {
        0: {
            "productID": "gid://shopify/Product/7544358174905",
            "variantID": 'gid://shopify/ProductVariant/43025696522425',
            "quantity": 1,
            "price": 100.67
        },
        1: {
            "productID": "gid://shopify/Product/7544358174905",
            "variantID": 'gid://shopify/ProductVariant/43025696555193',
            "quantity": 3,
            "price": 1010.99
        }
    };
    //get the inital cart object and add listeners to the quantity buttons
    let initialCartElement = document.getElementById("baseCartObject");
    //get all elements within the initialcartelement with the class quantitybutton

    //add an event listener to the checkout button
    let checkoutButton = document.getElementById("checkout_button");
    checkoutButton.addEventListener('click', startCheckout);
    refreshCart();
    let triartshoppingcartArray = JSON.parse(triartshoppingcart);
    //console.log("Original Shopping Cart: ", triartshoppingcartArray);// Output: Array [ "asfasf", "asfafsa", 
    Cookies.set("triartshoppingcart", JSON.stringify(triartshoppingcartArray), { expires: 7 });
}
function changeCartQuantity() {
    console.log("change cart quantity executed");
    console.log(this.getAttribute('quantity'));
    console.log(this.getAttribute('cartitem'));
}
function showCartMessage(reason) {
    //show the removed from cart message
    //if the reason is out of stock then show the out of stock message
    //if the reason is not out of stock then show the removed from cart message
    if (reason == "out of stock") {
        console.log("out of stock message");
    }
    if (reason == "price change") {
        console.log("price change message");
    }
    else {
        console.log("removed from cart message");
    }
}

async function refreshCart() {
    cartrefresh = true;
    cartTotalPrice = 0;
    cartTotalQuantity = 0;
    let currentCartItem = {};
    let allCartItems = [];
    let newShoppingCartJSON = {};
    let newShoppingCartJSONIndex = 0;
    for (let property in shoppingCartJSON) {
        await getCartItemObject(shoppingCartJSON[property]["productID"], shoppingCartJSON[property]["variantID"], shoppingCartJSON[property]["quantity"]).then((currentCartItem) => {
            //currentCartItem = await ;
            //add the quantity to the cart total quantity
            console.log(currentCartItem);
            if (currentCartItem["variant"]['available'] == true) {
                let newItemObject = {};
                newItemObject["product"] = currentCartItem["product"]["id"];
                newItemObject["quantity"] = currentCartItem["quantity"];
                newItemObject["variant"] = currentCartItem["variant"]["id"];
                newItemObject["price"] = currentCartItem["variant"]["price"]["amount"];
                newShoppingCartJSON[newShoppingCartJSONIndex] = newItemObject;
                cartTotalQuantity += currentCartItem['quantity'];
                //check if the price of the pulled object is different from the stored price, and trigger a message if it is.
                console.log("Current Cart Item: ", currentCartItem);
                console.log("Current Cart Item Price: ", currentCartItem["variant"]["price"]["amount"]);
                console.log("Stored Cart Item Price: ", shoppingCartJSON[property]["price"]);
                if (parseFloat(currentCartItem.price) != shoppingCartJSON[property]["price"]) {
                    //update the price and tell the customer it has changed
                    console.log(shoppingCartJSON[property]["price"]);
                    shoppingCartJSON[property]["price"] = currentCartItem["variant"]["price"]["amount"];
                    showCartMessage("price change");
                    console.log(shoppingCartJSON[property]["price"]);
                }
                //add the price to the cart total price
                cartTotalPrice += parseFloat(currentCartItem["variant"]["price"]["amount"]) * shoppingCartJSON[property]["quantity"];
                //add the current cart item to the all cart items array
                allCartItems.push(currentCartItem);
                newShoppingCartJSONIndex++;
            } else {
                //show the cart message
                showCartMessage("out of stock");
            }
        });
    }
    console.log("Cart Total Price: ", cartTotalPrice);
    console.log("Cart Total Quantity: ", cartTotalQuantity);
    console.log("All Cart Items: ", allCartItems);
    let cartItemContainerElement = document.getElementById("cartItems");
    let baseCartObject = document.getElementById("baseCartObject");
    //make the base cart object display flex
    baseCartObject.style.display = "flex";
    console.log(baseCartObject);
    console.log(cartItemContainerElement);
    cartItemContainerElement.innerHTML = "";
    let currentCartItemNumber = 0;
    for (let cartItem in allCartItems) {
        console.log("-----------------------------------------------------------------------------------------------------");
        console.log(allCartItems[cartItem]);
        console.log(allCartItems[cartItem]['variant']['available']);
        if (allCartItems[cartItem]['variant']['available']) {
            let newCartItem = baseCartObject.cloneNode(true);
            let variantString = "";
            //loop through all variants and create a string to attach to the product title
            for (let variant in allCartItems[cartItem]["variant"]["selectedOptions"]) {
                if (variant != 'type') {
                    variantString += allCartItems[cartItem]["variant"]["selectedOptions"][variant]["value"] + ", ";
                }
            }
            variantString = variantString.substring(0, variantString.length - 2);
            newCartItem.getElementsByClassName("productcartimage")[0].src = allCartItems[cartItem]["variant"]["image"]["src"];
            newCartItem.getElementsByClassName("productcarttitle")[0].innerHTML = allCartItems[cartItem]["product"]["title"] + " - " + variantString;
            newCartItem.getElementsByClassName("productcartprice")[0].innerHTML = allCartItems[cartItem]["variant"]["price"]["amount"];
            newCartItem.getElementsByClassName("quantityvalue")[0].innerHTML = allCartItems[cartItem]["quantity"];
            let quantityButtons = newCartItem.getElementsByClassName("quantitybutton");
            //loop through the classes and add event listeners
            for (var i = 0; i < quantityButtons.length; i++) {
                quantityButtons[i].setAttribute('cartitem', currentCartItemNumber);
                quantityButtons[i].addEventListener('click', changeCartQuantity);

            }
            cartItemContainerElement.appendChild(newCartItem);

            currentCartItemNumber++;
        }
        else {
            showCartMessage("out of stock");
        }
    }
    baseCartObject.style.display = "none";
    console.log(shoppingCartJSON);
}

function addToCart() {
    //if the calling button is the avalible button then add the product to the cart
    if (this.id == 'buyButtonAvailable') {
        console.log("add to cart executed");
    }
    else {
        console.log("add to cart not executed");
    }
    //triartshoppingcartArray[randomNumberString] = quantityString;
}

//var productId = {{wf {&quot;path&quot;:&quot;shopify-number&quot;,&quot;type&quot;:&quot;Number&quot;\} }};

function startCheckout() {
    try {
        const variantId = 'gid://shopify/ProductVariant/43025696522425';
        const lineItems = [{
            variantId: variantId,
            quantity: 1
        }];

        const checkout = client.checkout.create({ lineItems });
        const checkoutId = checkout.id;
        console.log(checkoutId)
        console.log(checkout)
    } catch (error) {
        console.error(error);
        // Expected output: ReferenceError: nonExistentFunction is not defined
        // (Note: the exact output may be browser-dependent)
    }
}

getProduct(productId).then(function (product) {
    console.log(product);
    console.log("get product executed")
});
initializeCart();


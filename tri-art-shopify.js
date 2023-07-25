
var variantMatrix = [];
var activeVariant = 0;
var activeVariantAvailability = false;
var client = ShopifyBuy.buildClient({
    domain: 'art-noise-music.myshopify.com',
    storefrontAccessToken: '0b822292e02fbb61e3651125956a1576'
});
var showPrice = true;
try {
    var productId = document.getElementById("shopifyItemCode").innerText;
}
catch {
    var productId = '0';
}

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
    var buttons = buttonContainer.getElementsByClassName('shopify-variant-button');
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
    let activeButtons = document.querySelectorAll('.active.shopify-variant-button');
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
            //change the price being displayed to the active variant price
            //create a div with the class 'plan-price-2' and set the innerHTML to the active variant price plus a $ sign
            //create a new element
            var newElement = document.createElement('div');
            //set the class of the new element to 'plan-price-2'
            newElement.className = 'plan-price-2';
            //set the innerHTML of the new element to the active variant price plus a $ sign
            let priceString = productJSON.variants[i].price.amount;
            priceString = parseFloat(priceString).toFixed(2);
            //if the last three characters of the price string are .00, remove them 
            if (priceString.slice(-3) == ".00") {
                priceString = priceString.slice(0, -3);
            }
            newElement.innerHTML = "$" + priceString;

            //clear the element with the class 'product-price-wrapper'
            document.getElementsByClassName('product-price-wrapper')[0].innerHTML = "";
            //get the element with the class 'product-price-wrapper' and append the new element to it
            document.getElementsByClassName('product-price-wrapper')[0].appendChild(newElement);
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
    let currentlyActiveButtons = document.querySelectorAll('.active.shopify-variant-button');
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
            if (productJSON.options[i]['name'] != "Title"){
            optionArray.push(productJSON.options[i]['name']);
            //loop through every object in the 'values' key
            for (var j = 0; j < productJSON.options[i].values.length; j++) {
                //push the value of the 'values' key into the optionArray
                optionArray.push(String(productJSON.options[i].values[j]));
            }
            //push the optionArray into the variantMatrix
            variantMatrix.push(optionArray);
            }
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
        buttonRow.setAttribute('class', 'vbcontainer');
        //loop through each array in the variantMatrix
        for (var j = 0; j < variantMatrix[i].length; j++) {
            //console.log(variantMatrix[i][j]);
            if (j == 0) {
                //create a header with the name of the variant and append it to the variantBlock
                var variantHeader = document.createElement('h4');
                //add a 15 pixel margin to the top of the new element
                variantHeader.style.marginTop = '15px';
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
    styleButtons();
    document.getElementById('baseVariantButton').style.display = 'none';
}
async function getShopifyProduct(productIdString) {

    ////console.log(client);
    var newproductId = 'gid://shopify/Product/' + productIdString;
    //const productId = 'gid://shopify/Product/7544353128633';
    ////console.log(newproductId);
    await client.product.fetch(newproductId).then((product) => {
        console.log(product);
        initializeProductDetails(product);

        productData = product;
        console.log("This is the product data:");
        console.log(product);
        return (product);
    }).catch(function (err) {
        console.log('error');
        console.log(err);
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
        let image = document.createElement('img');
        let imageSource = productObject.variants[i].image.src + '?width=500';
        image.src = imageSource;
        image.setAttribute('variant-image', i);
        image.style.display = 'none';
        document.getElementsByClassName('image-wrapper')[0].appendChild(image);
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
    shoppingCartJSON = JSON.parse(triartshoppingcart);
    console.log("Shopping Cart JSON:");
    console.log(shoppingCartJSON);


    console.log("Shopping Cart JSON default:");
    console.log(shoppingCartJSON);
    //get the inital cart object and add listeners to the quantity buttons
    let initialCartElement = document.getElementById("baseCartObject");
    //get all elements within the initialcartelement with the class quantitybutton

    //add an event listener to the checkout button
    let checkoutButton = document.getElementById("checkout_button");
    checkoutButton.addEventListener('click', startCheckout);
    refreshCart();
    //console.log("Original Shopping Cart: ", triartshoppingcartArray);// Output: Array [ "asfasf", "asfafsa", 
    Cookies.set("triartshoppingcart", JSON.stringify(shoppingCartJSON), { expires: 7 });
}
function changeCartQuantity() {
    console.log("change cart quantity executed");
    console.log(this.getAttribute('quantity'));
    console.log(this.getAttribute('cartitem'));
    let cartItemKey = this.getAttribute('cartitem')
    //convert cartItemKey to an integer
    cartItemKey = parseInt(cartItemKey);
    if (this.getAttribute('quantity') == "increase") {
        //increase the quantity of the cart item in the shopping cart json object
        let quantityValueElements = document.getElementsByClassName('quantityvalue');
        //shoppingCartJSON[cartItemKey].quantity++;
        updateCartQuantity(cartItemKey, 1);
        //loop through the quantity value elements and find the one with the corresponding cartitem attribute
        for (var i = 0; i < quantityValueElements.length; i++) {
            if (quantityValueElements[i].getAttribute('cartitem') == cartItemKey) {

                //change the quantity value element to the quantity of the cart item
                quantityValueElements[i].innerHTML = shoppingCartJSON[cartItemKey].quantity;
            }
        }

        //cartTotalQuantity++;
    }
    if (this.getAttribute('quantity') == "decrease") {


        //reduce the quantity of the item in the shopping cart json object
        //shoppingCartJSON[cartItemKey].quantity--;
        //cartTotalQuantity--;
        updateCartQuantity(cartItemKey, -1);
        //ffind the elemtns with the class quantityvalue
        let quantityValueElements = document.getElementsByClassName('quantityvalue');
        //loop through the quantity value elements and find the one with the corresponding cartitem attribute
        for (var i = 0; i < quantityValueElements.length; i++) {
            if (quantityValueElements[i].getAttribute('cartitem') == cartItemKey) {
                //change the quantity value element to the quantity of the cart item
                quantityValueElements[i].innerHTML = shoppingCartJSON[cartItemKey].quantity;
            }
        }

        //set the quantity value element to the quantity of the cart ite
        //if the quantity of the item is 0 then remove the item from the shopping cart json object
        if (shoppingCartJSON[cartItemKey].quantity == 0) {
            delete shoppingCartJSON[cartItemKey];
            refreshCart();
        }

    }
    if (this.getAttribute('quantity') == "remove") {
        //reduce the cart quantity by the value of the quantity in the cart item
        cartTotalQuantity = cartTotalQuantity - shoppingCartJSON[cartItemKey].quantity;
        //remove the cart item from the shopping cart json object
        delete shoppingCartJSON[cartItemKey];
        refreshCart();

    }
    Cookies.set("triartshoppingcart", JSON.stringify(shoppingCartJSON), { expires: 7 });
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

async function refreshCart(item = -1) {
    let values = Object.values(shoppingCartJSON);
    let newShoppingCartJSON = {};
    values.forEach((value, index) => {
        newShoppingCartJSON[index] = value;
    });
    shoppingCartJSON = newShoppingCartJSON;
    cartrefresh = true;
    cartTotalPrice = 0;
    cartTotalQuantity = 0;
    let currentCartItem = {};
    let allCartItems = [];
    newShoppingCartJSON = {};
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
            let priceString = allCartItems[cartItem]["variant"]["price"]["amount"];
            priceString = parseFloat(priceString).toFixed(2);
            //remove the .00 from the end of the price string if it is exactly .00
            if (priceString.substring(priceString.length - 3, priceString.length) == ".00") {
                priceString = priceString.substring(0, priceString.length - 3);
            }
            newCartItem.getElementsByClassName("productcartprice")[0].innerHTML = "$" + priceString;
            newCartItem.getElementsByClassName("quantityvalue")[0].innerHTML = allCartItems[cartItem]["quantity"];
            //give the quantity value an unique id for uptading the quantity
            newCartItem.getElementsByClassName("quantityvalue")[0].setAttribute('cartitem', currentCartItemNumber);
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
    updateCartQuantity();
    Cookies.set("triartshoppingcart", JSON.stringify(shoppingCartJSON), { expires: 7 });
    baseCartObject.style.display = "none";
    console.log(shoppingCartJSON);

}
function updateCartQuantity(cartItemNumber = 0, quantity = 0) {
    cartTotalQuantity += quantity;
    try {
        shoppingCartJSON[cartItemNumber]["quantity"] += quantity;
        //get the div with the id of cartNumber
    } catch (err) {
        console.log(err);
    }
    let cartNumberElement = document.getElementById("cartNumber");
    //update the cart number with the new cart total quantity
    cartNumberElement.innerHTML = "Cart(" + cartTotalQuantity + ")";

}
function addToCart() {
    //if the calling button is the avalible button then add the product to the cart
    if (this.id == 'buyButtonAvailable') {
        console.log("add to cart executed");
        //create the information for the cart
        let cartItem = {};
        //get the active variant find its json in the productData
        let cartVariant = productData["variants"][activeVariant];
        //get the product id
        cartItem["productID"] = productData["id"];
        //get the variant id
        cartItem["variantID"] = cartVariant["id"];
        //get the quantity
        cartItem["quantity"] = 1;
        //get the price
        cartItem["price"] = cartVariant["price"]["amount"];
        //check if the same object is already in the cart
        let cartItemExists = false;
        for (let property in shoppingCartJSON) {
            if (shoppingCartJSON[property]["variantID"] == cartItem["variantID"]) {
                //console.log(cartItem["variant"]);
                //console.log(shoppingCartJSON[property]["variant"]);
                //if the variant is already in the cart then increase the quantity
                updateCartQuantity(property, 1);
                cartItemExists = true;
            }
        }
        //if the cart item does not exist then add it to the cart
        if (!cartItemExists) {
            shoppingCartJSON[100] = cartItem;
        }
        //update the cart
        refreshCart();


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
        client.checkout.create().then((checkout) => {
            // Store the checkout ID for future use
            checkoutId = checkout.id;
            console.log(checkoutId)
            const lineItemsToAdd = Object.keys(shoppingCartJSON).map((key) => {
                const item = shoppingCartJSON[key];
                return {
                  variantId: item.variantID,
                  quantity: item.quantity
                };
              });
              
              client.checkout.addLineItems(checkoutId, lineItemsToAdd).then((checkout) => {
                client.checkout.fetch(checkoutId).then((checkout) => {
                    //clear the shopping cart
                    shoppingCartJSON = {};
                    //update the cart
                    refreshCart();
                    
                    // Redirect the user to the checkout URL
                    window.location.href = checkout.webUrl;
                  });
                // Updated checkout with added line items
              });
              
          });
        //const checkout = client.checkout.create({ lineItems });
        //const checkoutId = checkout.id;
        
        //console.log(checkout)
    } catch (error) {
        console.error(error);
        // Expected output: ReferenceError: nonExistentFunction is not defined
        // (Note: the exact output may be browser-dependent)
    }
}


function styleButtons() {
    //get all elements that have the class of either 'shopify-variant-button' or 'varianbutton'
    var variantShopifyButtons = document.getElementsByClassName('shopify-variant-button');
    var variantWebflowButtons = document.getElementsByClassName('variantbutton');
    for (let buttonelem in variantShopifyButtons) {
        changeButtonToStainButtonShopify(variantShopifyButtons[buttonelem]);
    }
    for (let buttonelem in variantWebflowButtons) {
        changeButtonToStainButton(variantWebflowButtons[buttonelem]);
    }
}
function changeButtonToStainButton(buttonElement) {
    //check if the text content of the button matches any of the button lookups
    let buttonText = buttonElement.textContent;

    try {
        buttonText = buttonText.toLowerCase();
    }
    catch {
        console.log("error");
        buttonText = "error";
    }

    //loop through each entry in the button lookup object and search for a match in the text key

    for (let buttonLookup in button_lookup_object) {
        for (let textLookup in button_lookup_object[buttonLookup]["text"]) {
            if (buttonText == button_lookup_object[buttonLookup]["text"][textLookup]) {
                //put the button in a div and create a variable with the text of the button
                
                //add an whitespace wrap to the button
                buttonElement.style.whiteSpace = "normal";
                //buttonElement.style.overflowWrap = "break-word";
                //if the button index finds a match, get the image and set it as the bacground-image of the button
                buttonElement.style.backgroundImage = button_lookup_object[buttonLookup]["image"];
                buttonElement.style.backgroundSize = "cover";
                buttonElement.style.backgroundPosition = "center";
                buttonElement.style.width = "15vw";
                buttonElement.style.height = "15vw";
                buttonElement.style.maxWidth = "100px";
                buttonElement.style.maxHeight = "100px";
                buttonElement.style.borderRadius = "100px";
                let buttonDiv = document.createElement("div");
                let parentElement = buttonElement.parentNode;
                //put the button inside the div, and the div inside the buttons parent element
                //parentElement.innerText = buttonText;
                parentElement.appendChild(buttonDiv);
                //buttonDiv.appendChild(buttonElement);
                return true;
            }
        }
    }
    return false;
}
function changeButtonToStainButtonShopify(buttonElement){
    if(changeButtonToStainButton(buttonElement)){
        buttonElement.innerText = "";
    }
}
//check if the product ID string is not blank
if (productId != "") {
    getProduct(productId);
    initializeLottieBuyButton();
}
else {
    initializeNonShopifyProduct();
}
initializeCart();

styleButtons();






var relatedCarousel = document.getElementsByClassName("related-product-wrapper");
var leftButton = document.getElementById('left-carousel-button');
var rightButton = document.getElementById('right-carousel-button');
var carouselItems = document.getElementsByClassName("related-product-item");
var currentItem = 0;
var itemOffset = 3;
relatedCarousel = relatedCarousel.item(0);
console.log(relatedCarousel.offsetWidth);
rightButton.addEventListener("click", moveCarouselRight, false);
leftButton.addEventListener("click", moveCarouselLeft, false);
function calculateItemOffset() {
    console.log($(window).width());
    if ($(window).width() < 991) {
        return (1);
    }
    return (3)
}
window.onresize = function (event) {
    itemOffset = calculateItemOffset();
    var maxDistance = carouselItems.length * carouselItems.item(0).offsetWidth;
    var newPosition = parseInt((carouselItems.item(0).offsetWidth * currentItem), 10);
    //console.log(newPosition);
    relatedCarousel.style.right = `${newPosition - 1}px`
};
function moveCarouselRight(event) {
    itemOffset = calculateItemOffset();
    console.log(itemOffset)
    if (currentItem < carouselItems.length - itemOffset) {
        currentItem = currentItem + 1;
        var maxDistance = carouselItems.length * carouselItems.item(0).offsetWidth;
        var newPosition = parseInt((carouselItems.item(0).offsetWidth * currentItem), 10);
        //console.log(newPosition);
        relatedCarousel.style.right = `${newPosition - 1}px`
    }
}
function moveCarouselLeft(event) {
    if (currentItem > 0) {
        currentItem = currentItem - 1;
        var maxDistance = carouselItems.length * carouselItems.item(0).offsetWidth;
        var newPosition = parseInt((carouselItems.item(0).offsetWidth * currentItem), 10);
        //console.log(newPosition);
        relatedCarousel.style.right = `${newPosition - 1}px`
    }
}
function initializeNonShopifyProduct() {
    const button_lookups_en = ["natural", "black", "graphite", "distressed", "natural + black", "black + natural"];
    const button_lookups_fr = ["natural", "black", "graphite", "distressed", "natural + black", "black + natural"];
    const button_image_urls = ["url('https://uploads-ssl.webflow.com/61bcf133fac47a1111712223/61e6ed84c9042592c6048fd9_classic_finish.jpeg')", "url('https://uploads-ssl.webflow.com/61bcf133fac47a1111712223/61e6ed84f2f6415fb773618c_black_finish.jpeg')", "url('https://uploads-ssl.webflow.com/61bcf133fac47a1111712223/61e6ed84253c383c4696480a_grey_finish.jpeg')", "url('https://uploads-ssl.webflow.com/61bcf133fac47a1111712223/61e6ed84c3a3f94b27886dd4_distressed_finish.jpeg')", "url('https://uploads-ssl.webflow.com/61bcf133fac47a1111712223/627a945191983fa49cec57af_classic_black_finish.jpg')", "url('https://uploads-ssl.webflow.com/61bcf133fac47a1111712223/627a9451843a5809c239183e_black_classic_finish.jpg')"];
    var buttons = document.querySelectorAll('a[button="true"]');
    var variantImages = document.querySelectorAll('div[variantimage="true"]');
    var variantPrices = document.getElementsByClassName("price-collection-item");
    for (let i = 0; i < variantImages.length; i++) {
        variantImages.item(i).classList.remove("focused");
        //console.log(variantImages.item(i).textContent.toLowerCase());
    }
    for (let i = 0; i < variantPrices.length; i++) {
        variantPrices.item(i).style.display = "none";
        var variantValue = variantPrices.item(i).getElementsByClassName("variant-name-text");
        //console.log(variantValue.item(0).textContent.toLowerCase());
        variantValue.item(0).style.display = "none";
    }
    for (let b = 0; b < buttons.length; b++) {
        //console.log(buttons.item(b).textContent.toLowerCase());
        for (let i = 0; i < button_lookups_en.length; i++) {
            if (buttons.item(b).textContent.toLowerCase() == button_lookups_en[i]) {
                //console.log("changed bg")

                buttons.item(b).classList.remove("focused");
            }
        }
        buttons.item(0).classList.add("focused");
        variantImages.item(0).classList.add("focused");
        variantPrices.item(0).style.display = "flex";
        buttons.item(b).onclick = function (event) {
            for (let i = 0; i < variantImages.length; i++) {
                variantImages.item(i).classList.remove("focused");
            }
            var caller = event.target || event.srcElement;
            for (let i = 0; i < buttons.length; i++) {
                buttons.item(i).classList.remove("focused");
                variantPrices.item(i).style.display = "none";
            }
            for (let img = 0; img < variantImages.length; img++) {
                if (caller.textContent == variantImages.item(img).textContent) {
                    //console.log("-------");
                    //console.log(variantImages.item(img).textContent);
                    //console.log(caller.textContent);
                    variantImages.item(img).classList.add("focused");
                    variantPrices.item(img).style.display = "flex";
                    //console.log("-------");
                }
            }
            caller.classList.add("focused");
            //console.log(caller);
        }
    }
}





function initializeLottieBuyButton() {

    //fetch the lottie json and create the animation based on the container

    fetch("https://uploads-ssl.webflow.com/61bcf133fac47a1111712223/63dd682b172364b06f9997c8_shopping-cart-check-lottie.json").then(response => response.json()).then(data => {
        console.log('%c This is a blue text.', 'color: blue;');
        console.log("melp-----------------------------------------------------------------------");
        console.log('%c Styled Text', 'background: yellow; color: black; font-size: 20px; padding: 4px;');

        console.log(data);
        var lottieanimation = lottie.loadAnimation({
            container: document.getElementById('buyButtonLottieAnimation'),
            renderer: 'svg',
            loop: false,
            autoplay: false,
            animationData: data
        });

        document.getElementById("buyButtonAvailable").addEventListener("click", function () {
            console.log("clicked");
            lottieanimation.setCurrentRawFrameValue(0);
            lottieanimation.goToAndStop(0, true);
            let buttonElement = document.getElementById("buyButtonAvailable");
            let buttonAnimationBlock = document.getElementsByClassName("buy-button-animation-block")[0];
            let buttonText = buttonAnimationBlock.firstElementChild;
            let lottieBlock = document.getElementById("buyButtonLottieAnimation");
            let animationOffset = buttonAnimationBlock.offsetHeight - lottieBlock.offsetHeight + (buttonText.offsetHeight / 1.5);
            buttonAnimationBlock.style.marginTop = `-${animationOffset}px`;
            lottieanimation.play();
            lottieanimation.addEventListener("complete", function () {
                buttonAnimationBlock.style.marginTop = '0px';
            });
        });
    }).catch(error => {
        console.error("An error occurred while fetching the Lottie animation data:", error);
    });
}

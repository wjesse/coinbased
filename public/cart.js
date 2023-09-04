/* 
NAME: Jesse Wang
DATE: 6/09/2023

This file contains the client-side code for the cart page. It includes
functionality for rendering the cart items, removing items from the cart,
and checking out the cart.
*/

(function() {
    "use strict";

    // Post Endpoint
    const CHECKOUT_EP = '/checkout';

    /**
     * Initializes the cart functionality.
     */
    function init() {
        renderCartItems();
        id('checkout-btn').addEventListener('click', checkoutCart);
    }

    /**
     * Fetches the cart items from local storage.
     * @returns {Array} The cart items.
     */
    function fetchCartItems() {
        const cart = JSON.parse(window.localStorage.getItem('cart'));
        if (!cart) {
            return [];
        }
        return cart;
    }

    /**
     * Renders the cart items on the page.
     */
    function renderCartItems() {
        const cartItemsElement = document.getElementById('cart-items');
        const cart = fetchCartItems();
        
        cartItemsElement.innerHTML = '';
        
        cart.forEach((item, index) => {
            const itemElement = document.createElement('div');
            const nameElement = document.createElement('h3');
            const priceElement = document.createElement('p');
            const quantityElement = document.createElement('p');
            const removeButtonElement = document.createElement('button');
            
            nameElement.textContent = item.name;
            priceElement.textContent = `Price: ${item.price}`;
            quantityElement.textContent = `Quantity: ${item.quantity}`;
            removeButtonElement.textContent = 'Remove';
            
            // Set up the remove button's click event handler
            removeButtonElement.addEventListener('click',
                () => removeFromCart(index));
            
            itemElement.appendChild(nameElement);
            itemElement.appendChild(priceElement);
            itemElement.appendChild(quantityElement);
            itemElement.appendChild(removeButtonElement);
            
            // Append the item element to the cart items element
            cartItemsElement.appendChild(itemElement);
        });
    }

    /**
     * Removes an item from the cart.
     * @param {number} index - The index of the item to remove.
     */
    function removeFromCart(index) {
        let cart = fetchCartItems();
        cart.splice(index, 1);
        window.localStorage.setItem('cart', JSON.stringify(cart));
        renderCartItems();
    }

    /**
     * Clears the cart.
     */
    function clearCart() {
        window.localStorage.removeItem('cart');
        renderCartItems();
    }

    /**
     * Checks out the cart items by making a POST request to the server.
     */
    async function checkoutCart() {
        const cart = fetchCartItems();
    
        try {
            let response = await fetch(CHECKOUT_EP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(cart)
            });
            
            response = checkStatus(response);
            const data = await response.json();
    
            id('results').textContent = data.message;
            clearCart();
        } catch (error) {
            id('results').textContent = error.message;
        }
    }

    init();
})();
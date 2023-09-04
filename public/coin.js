/* 
NAME: Jesse Wang
DATE: 6/09/2023

This file contains the JavaScript code for the coin page, which displays
information about a specific coin. The user can also add the coin to their
cart from this page.
*/
(function() {
    "use strict";

    const coin_id = window.location.href.split('#')[1];
    
    const PRODUCTS_EP = '/products';

    /**
     * Initializes the page by loading the coin data
     */
    function init() {
        loadCoin();
    }

    /**
     * Loads the coin by fetching the specific coin data from the server, and
     * then populates the HTML DOM with the coin data.
     */
    async function loadCoin() {
        try {
            // get coin data
            let response = await fetch(PRODUCTS_EP + '/' + coin_id);
            response = checkStatus(response);
            const data = await response.json();

            id('buy-form').addEventListener('submit', (event) => {
                event.preventDefault();
                const quantity = parseInt(id('buy-quantity').value);
                addToCart(data, quantity);
            });

            const name = document.createElement('p');
            name.textContent = data.name;
            id('name').appendChild(name);

            const price = document.createElement('p');
            price.textContent = '$' + data.price;
            id('price').appendChild(price);

            const marketCap = document.createElement('p');
            marketCap.textContent = '$' + data.marketCap;
            id('market-cap').appendChild(marketCap);

            const quantity = document.createElement('p');
            quantity.textContent = data.quantity;
            id('quantity').appendChild(quantity);
        } catch (error) {
            qs("#coin-info p").textContent = error.message;
        }
    }

    /**
     * Fetches the cart items from local storage
     * @returns {Array} the cart items
     */
    function fetchCartItems() {
        const cart = JSON.parse(window.localStorage.getItem('cart'));
        if (!cart) {
            return [];
        }
        return cart;
    }

    /**
     * Adds a certain quantity of a certain coin to the local storage cart.
     * @param {JSON Object} coin 
     * @param {number} quantity 
     */
    function addToCart(coin, quantity) {
        const cart = fetchCartItems();
        const cartItem = cart.find(item => item.id === coin.id);
        if (cartItem) {
            cartItem.quantity += quantity;
        } else {
            cart.push({
                id: coin.id,
                name: coin.name,
                price: coin.price,
                quantity: quantity
            });
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        qs('#buy p').textContent = 'Added to cart!';
        id('buy-form').reset();
    }

    init();
})();
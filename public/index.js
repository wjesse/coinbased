/* 
NAME: Jesse Wang
DATE: 6/09/2023

Client side javascript for the index page. This page allows the user to search
for coins, and displays the results in a table. The table is populated by
fetching the coins from the server, and then filtering them client side if a
query is provided. 
*/

(function() {
    "use strict";

    /**
     * Initialize the page by adding an event handler to the search button, and
     * loading the coins.
     */
    function init() {
        loadCoins();
        id("search-button").addEventListener("click", searchCoins);
    }

    /**
     * Helper function to load the coins based on the current search query.
     */
    function searchCoins() {
        const query = id("search-input").value;
        loadCoins(query);
    }

    /**
     * Fetches all the coins from the server, and filters them client side if
     * a query is provided. Then populates the table with the coins.
     * @param {String} query 
     */
    async function loadCoins(query) {
        try {
            let response = await fetch('/products');
            response = checkStatus(response);
            let coins = await response.json();
    
            const coinsContainer = qs('#coin-table tbody');

            // clear the table
            while (coinsContainer.firstChild) {
                coinsContainer.removeChild(coinsContainer.firstChild);
            }

            // if query is provided, filter the coins
            if (query) {
                coins = coins.filter(coin =>
                    coin.name.toLowerCase().includes(query.toLowerCase()));
            }
            
            // populate the table
            coins.forEach((coin, index) => {
                const coinRow = document.createElement('tr');
    
                const numberCell = document.createElement('td');
                numberCell.textContent = index + 1;
                coinRow.appendChild(numberCell);
    
                const nameCell = document.createElement('td');
                const link = document.createElement('a');
                link.href = 'coin.html#' + coin.id;
                link.target = '_blank';
                link.textContent = coin.name;
                nameCell.appendChild(link);
                coinRow.appendChild(nameCell);
                nameCell.classList.add('coin-name');
    
                const priceCell = document.createElement('td');
                priceCell.textContent = '$' + coin.price;
                coinRow.appendChild(priceCell);
    
                const marketCapCell = document.createElement('td');
                marketCapCell.textContent = '$' + coin.marketCap;
                coinRow.appendChild(marketCapCell);
    
                const quantityCell = document.createElement('td');
                quantityCell.textContent = coin.quantity;
                coinRow.appendChild(quantityCell);
    
                coinsContainer.appendChild(coinRow);
            });
        } catch (error) {
            id("results").textContent = error.message;
        }
    }

    init();
})();
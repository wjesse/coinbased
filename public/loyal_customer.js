/* 
NAME: Jesse Wang
DATE: 6/09/2023

This file contains the client-side code for the loyal customer page.
It includes functionality to add a new loyal customers provided the form
is properly filled out.
*/

(function() {
    "use strict";

    const CUSTOMERS_EP = '/customers';

    /**
     * Initializes the event handler for the submit button
     */
    function init() {
        id("customer-form").addEventListener('submit', submitForm);
    }

    /**
     * Submits the form data to the server by making a POST request to the
     * customers endpoint.
     * @param {Object} event 
     */
    async function submitForm(event) {
        event.preventDefault();
        
        const name = id('name').value;
        const email = id('email').value;
        const address = id('address').value;
      
        try {
            let response = await fetch(CUSTOMERS_EP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ name, email, address })
            });

            response = checkStatus(response);
            const data = await response.json();
            
            id('message').textContent = data.message;
            id('customer-form').reset();
        } catch (error) {
            id('message').textContent = error.message;
        }
    }

    init();
})();
/* 
NAME: Jesse Wang
DATE: 6/09/2023

This is the client-side JavaScript code for the contact page. It handles
the submission of the feedback form to the server.
*/
(function() {
    "use strict";

    const FEEDBACK_EP = '/feedback';

    /**
     * Initializes the page by adding the appropriate event listeners to the
     * submit button.
     */
    function init() {
        id("contact-form").addEventListener('submit', submitFeedback);
    }

    /**
     * Parses and submits the feedback form to the server by maming a POST
     * request to the FEEDBACK_EP.
     * @param {Object} event 
     */
    async function submitFeedback(event) {
        try {
            event.preventDefault();

            const name = id('name').value;
            const email = id('email').value;
            const message = id('message').value;
        
            let response = await fetch(FEEDBACK_EP, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            });
        
            response = checkStatus(response);

            id('form-response').innerText =
                'Thanks for your feedback! We have received your message.';
        
            // Clear the form
            id('name').value = '';
            id('email').value = '';
            id('message').value = '';
        } catch (error) {
            id('form-response').innerText = error.message
        }
    }

    init();
})();
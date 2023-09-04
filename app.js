/*
NAME: Jesse Wang
DATE: 6/09/2023

app.js is a webservice that provides functionality for the CoinBased e-commerce
website, which sells cryptocurrencies. The webservice provides the following
endpoints:
- GET /products - Retrieves all products
- GET /products:id - Retrieves a single product by ID
- GET /products/filter - Retrieves products based on filter criteria
- POST /feedback - Adds feedback to the feedbacks.json file
- POST /checkout - Checks out the cart by subtracting the quantity of
                    each product in the cart
- POST /customers - Adds a new customer to the loyal_customers.json file
*/
const express = require('express');
const fs = require('fs').promises;
const app = express();

app.use(express.static('public'));
app.use(express.json());

const PRODUCTS_PATH = './products.json';
const FEEDBACKS_PATH = './feedbacks.json';
const LOYAL_CUSTOMERS_PATH = './loyal_customers.json';

const SERVER_ERROR = "Something went wrong on the server, please try again later.";
const SERVER_ERR_CODE = 500;

const PRODUCTS_EP = '/products';
const PRODUCTS_ID_EP = PRODUCTS_EP + '/:id';
const PRODUCTS_FILTER_EP = PRODUCTS_EP + '/filter';

const FEEDBACK_EP = '/feedback';
const CHECKOUT_EP = '/checkout';
const CUSTOMERS_EP = '/customers';

/**
 * Retrieves all products. Returns a JSON collection of products. Each product
 * has the following properties:
 * - id: number
 * - name: string
 * - price: number
 * - marketCap: number
 * - quantity: number
 */
app.get(PRODUCTS_EP, async (req, res) => {
    try {
        const products = JSON.parse(await fs.readFile(PRODUCTS_PATH, 'utf8'));
        res.json(products);
    } catch (error) {
        res.status(SERVER_ERR_CODE);
        error.message = SERVER_ERROR;
    }
});

/**
 * Retrieves a single product by ID. Returns a JSON object representing a 
 * product. The product has the following properties:
 * - id: number
 * - name: string
 * - price: number
 * - marketCap: number
 * - quantity: number
 */
app.get(PRODUCTS_ID_EP, async (req, res) => {
    try {
        const products = JSON.parse(await fs.readFile(PRODUCTS_PATH, 'utf8'));
        const product = products.find(p => p.id === parseInt(req.params.id));
        if (!product) {
            return res.status(404).send('Product not found');
        }
        res.json(product);
    } catch (error) {
        res.status(SERVER_ERR_CODE);
        error.message = SERVER_ERROR;
    }
});

/**
 * Retrieves products based on filter criteria. Returns a JSON collection of
 * products with the applied filter. Each product has the following properties:
 * - id: number
 * - name: string
 * - price: number
 * - marketCap: number
 * - quantity: number
 */
app.get(PRODUCTS_FILTER_EP, async (req, res) => {
    try {
        const products = JSON.parse(await fs.readFile(PRODUCTS_PATH, 'utf8'));
        let filteredProducts = products;
        // filter based on query parameters
        if (req.query.price) {
            filteredProducts = filteredProducts.filter(p =>
                p.price <= req.query.price);
        }
        if (req.query.category) {
            filteredProducts = filteredProducts.filter(p =>
                p.category === req.query.category);
        }
        res.json(filteredProducts);
    } catch (error) {
        res.status(SERVER_ERR_CODE);
        error.message = SERVER_ERROR;
    }
});

/**
 * Adds feedback to the feedbacks.json file. Returns a JSON object
 * representing the posted feedback. The feedback
 * has the following properties:
 * - name: string
 * - email: string
 * - message: string
 */
app.post(FEEDBACK_EP, async (req, res) => {
    try {
        let feedbacks = await fs.readFile(FEEDBACKS_PATH, 'utf8');
        feedbacks = JSON.parse(feedbacks);
        feedbacks.push(req.body);

        // Write the new feedback to the file
        await fs.writeFile(FEEDBACKS_PATH, JSON.stringify(feedbacks));
        res.json(req.body);
    } catch (error) {
        res.status(SERVER_ERR_CODE);
        error.message = SERVER_ERROR;
    }
});

/**
 * Checks out the cart by subtracting the quantity of each product in the cart.
 * Returns a JSON object with a message indicating the
 * successful checkout, or an error message if the checkout failed.
 * The cart has the following properties:
 * - id: number
 * - quantity: number
 * - name: string
 * - price: number
 * 
 */
app.post(CHECKOUT_EP, async (req, res) => {
    try {
        let coins = JSON.parse(await fs.readFile(PRODUCTS_PATH, 'utf8'));
        const cart = req.body;

        // Loop through the cart items and subtract quantities of coins
        cart.forEach(item => {
            const coin = coins.find(coin => coin.id === item.id);
            if (coin) {
                coin.quantity -= item.quantity;
            }
        });

        // Write the new coins to the file
        await fs.writeFile(PRODUCTS_PATH, JSON.stringify(coins));

        // Return a response indicating the successful checkout
        res.json({ message: 'Checkout successful' });
    } catch (error) {
        res.status(SERVER_ERR_CODE);
        error.message = SERVER_ERROR;
    }
});

/**
 * Adds a new customer to the loyal_customers.json file. Returns a JSON object
 * representing the posted customer.
 * The customer has the following properties:
 * - id: number
 * - name: string
 * - email: string
 * - address: string
 */
app.post(CUSTOMERS_EP, async (req, res) => {
    try {
        // Read the request body
        const { name, email, address } = req.body;

        // Validate the required fields
        if (!name || !email || !address) {
            return res.status(400).json(
                { error: 'Name, email, and address are required fields' });
        }

        // Read the existing customers
        const data = await fs.readFile(LOYAL_CUSTOMERS_PATH, 'utf8');
        const customers = JSON.parse(data);

        // Create a new customer object
        const newCustomer = {
            id: customers.length + 1,
            name: name,
            email: email,
            address: address
        };

        // Add the new customer to the array
        customers.push(newCustomer);

        // Save the updated customers data
        await fs.writeFile(LOYAL_CUSTOMERS_PATH, JSON.stringify(customers));

        res.json({ message: 'You are now a loyal customer!' });
    } catch (error) {
        res.status(SERVER_ERR_CODE);
        error.message = SERVER_ERROR;
    }
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);   
});

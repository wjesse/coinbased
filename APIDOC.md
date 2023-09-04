# CoinBased API Documentation
This API provides an interface for retrieving products (coins) in various
manners, posting and storing customer feedback and loyalty, and posting and
editting local storage for a simple e-commerce storefront application.
It returns a 500 error if any internal server error occurs during the operation.

## GET /products

**Request Type:** GET

**Returned Data Format:** JSON

**Description:** Retrieves all products.

**Example Request:**

```
GET /products
```

**Example Response:**

```
[
  {
    "id": 1,
    "name": "Bitcoin",
    "price": 50000,
    "marketCap": 1000000000000,
    "quantity": 81
  },
  {
    "id": 1,
    "name": "Ethereum",
    "price": 60000,
    "marketCap": 90000000000,
    "quantity": 100
  },
  ...
]
```

**Error Handling:**
- If an error occurs while retrieving the products, the response will have a status code of 500 and the body will contain an error message.
- Example Error Response (500 Internal Server Error): 

```
Something went wrong on the server, please try again later.
```

## GET /products/:id

**Request Type:** GET

**Returned Data Format:** JSON

**Description:** Retrieves a single product by its ID.

**Supported Parameters:**
- `:id` (required): The ID of the product.

**Example Request:**

```
GET /products/1
```

**Example Response:**

```
{
    "id": 1,
    "name": "Bitcoin",
    "price": 50000,
    "marketCap": 1000000000000,
    "quantity": 81
}
```

**Error Handling:**
- If the product with the specified ID is not found, the response will have a status code of 404 and the body will contain an error message.
- Example Error Response (404 Not Found):

```
Product not found
```

## GET /products/filter

**Request Type:** GET

**Returned Data Format:** JSON

**Description:** Retrieves filtered products based on query parameters.

**Supported Parameters:**
- `price` (optional): Maximum price to filter products by.
- `category` (optional): Category to filter products by.

**Example Request:**

```
GET /products/filter?price=15&category=Category%201
```

**Example Response:**

```
[
    {
        "id": 1,
        "name": "Bitcoin",
        "price": 50000,
        "marketCap": 1000000000000,
        "quantity": 81
    }
    ...
]
```

**Error Handling:**
- If an error occurs while retrieving the filtered products, the response will have a status code of 500 and the body will contain an error message.
- Example Error Response (500 Internal Server Error):

```
Something went wrong on the server, please try again later.
```

## POST /feedback

**Request Type:** POST

**Returned Data Format:** JSON

**Description:** Adds feedback to the feedbacks.json file. Returns the same
JSON object that was provided as the parameter for successful responses.

**Supported Parameters:**
- POST body parameters:
    - `name` (required): The user's name.
    - `email` (required): The user's email.
    - `message` (required): The feedback message.

**Example Request:**

```
POST /feedback

{
    "name": "Jesse"
    "email": "jessew@caltech.edu"
    "message": "This is great!"
}
```

**Example Response:**

```
{
    "name": "Jesse"
    "email": "jessew@caltech.edu"
    "message": "This is great!"
}
```

**Error Handling:**
- If an error occurs while submitting the feedback, the response will have a status code of 500 and the body will contain an error message.
- Example Error Response (500 Internal Server Error):

```
Something went wrong on the server, please try again later.
```

## POST /checkout

**Request Type:** POST

**Returned Data Format:** JSON

**Description:** Performs checkout by updating product quantities based on the
cart provided in the request body.

**Supported Parameters:**
- POST body parameters:
    - `cart` (required): An array of cart items containing `id`, `name`, `price`
    and `quantity` for each item.

**Example Request:**

```
POST /checkout

{
  "cart":
  [
    {
        "id": 1,
        "name": "Bitcoin",
        "price": 50000,
        "quantity": 81
    },
    ...
  ]
}
```

**Example Response:**

```
{
  "message": "Checkout successful"
}
```

**Error Handling:**
- If an error occurs while performing the checkout, the response will have a status code of 500 and the body will contain an error message.
- Example Error Response (500 Internal Server Error):

```
Something went wrong on the server, please try again later.
```

## POST /customers

**Request Type:** POST

**Returned Data Format:** JSON

**Description:** Adds a new customer to the loyal_customers.json file. Returns a JSON object representing the posted customer.

**Supported Parameters:**
- POST body parameters:
  - `name` (required): The name of the customer.
  - `email` (required): The email of the customer.
  - `address` (required): The address of the customer.

**Example Request:**

```
POST /customers

{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "address": "123 Main St"
}
```

**Example Response:**

```
{
    "message": "You are now a loyal customer!"
}
```

**Error Handling:**
- If any required field is missing (e.g., `name`, `email`, `address`), the response will have a status code of 400 and the body will contain an error message.
- Example Error Response (400 Bad Request):

```
{
  "error": "Name, email, and address are required fields"
}
```
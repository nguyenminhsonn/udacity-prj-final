# Project API Requirements

## Product Endpoints
### Get All Products
- Endpoint: `/products`
- HTTP Verb: GET

### Get a Specific Product
- Endpoint: `/products/:id`
- HTTP Verb: GET

### Create a New Product
- Endpoint: `/products`
- HTTP Verb: POST

### Update a Product
- Endpoint: `/products/:id`
- HTTP Verb: PUT

### Delete a Product
- Endpoint: `/products/:id`
- HTTP Verb: DELETE

## User Endpoints
### Get All Users
- Endpoint: `/users`
- HTTP Verb: GET

### Get a Specific User
- Endpoint: `/users/:id`
- HTTP Verb: GET

### Create a New User
- Endpoint: `/user/register`
- HTTP Verb: POST

### Check authentication
- Endpoint: `/user/login`
- HTTP Verb: POST

### Delete a User
- Endpoint: `/users/:id`
- HTTP Verb: DELETE

## Category Endpoints
### Get All Categories
- Endpoint: `/categories`
- HTTP Verb: GET

### Get a Specific Category
- Endpoint: `/categories/:id`
- HTTP Verb: GET

### Create a New Category
- Endpoint: `/categories`
- HTTP Verb: POST

### Delete a Category
- Endpoint: `/categories/:id`
- HTTP Verb: DELETE

## Order Endpoints
### Get All Orders
- Endpoint: `/orders`
- HTTP Verb: GET

### Get a Specific Order
- Endpoint: `/orders/:id`
- HTTP Verb: GET

### Create a New Order
- Endpoint: `/orders`
- HTTP Verb: POST

### Update an Order
- Endpoint: `/orders/:id`
- HTTP Verb: PUT

### Delete an Order
- Endpoint: `/orders/:id`
- HTTP Verb: DELETE

## Order Detail Endpoints
### Get All Order-Details
- Endpoint: `/order-details`
- HTTP Verb: GET

### Get an Order-Detail
- Endpoint: `/order-details/:order_id`
- HTTP Verb: GET

### Create an Order-Detail
- Endpoint: `/order-details`
- HTTP Verb: POST

### Update an Order-Detail
- Endpoint: `/order-details/:order_id/:product_id`
- HTTP Verb: PUT

### Delete an Order-Detail
- Endpoint: `/order-details/:order_id/:product_id`
- HTTP Verb: DELETE

# Database schemas                                                        
## Table "public.categories"
   Column    |         Type          | Collation | Nullable |                     Default                     | Storage  | Compression | Stats target | Description
-------------+-----------------------+-----------+----------+-------------------------------------------------+----------+-------------+--------------+-------------
 category_id | integer               |           | not null | nextval('categories_category_id_seq'::regclass) | plain    |             |              |
 name        | character varying(50) |           | not null |                                                 | extended |             |              |
Indexes:
    "categories_pkey" PRIMARY KEY, btree (category_id)
Referenced by:
    TABLE "products" CONSTRAINT "products_category_fkey" FOREIGN KEY (category) REFERENCES categories(category_id)

## Table "public.order_detail"
   Column   |  Type   | Collation | Nullable | Default | Storage | Compression | Stats target | Description
------------+---------+-----------+----------+---------+---------+-------------+--------------+-------------
 order_id   | integer |           |          |         | plain   |             |              |
 product_id | integer |           |          |         | plain   |             |              |
 quantity   | integer |           |          |         | plain   |             |              |
Foreign-key constraints:
    "order_detail_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id)
    "order_detail_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(product_id)

## Table "public.orders"
   Column    |       Type        | Collation | Nullable |              Default               | Storage  | Compression | Stats target | Description
-------------+-------------------+-----------+----------+------------------------------------+----------+-------------+--------------+-------------
 id          | integer           |           | not null | nextval('orders_id_seq'::regclass) | plain    |             |              |
 user_id     | integer           |           |          |                                    | plain    |             |              |
 status      | character varying |           |          |                                    | extended |             |              |
 create_time | character varying |           |          |                                    | extended |             |              |
Indexes:
    "orders_pkey" PRIMARY KEY, btree (id)
Foreign-key constraints:
    "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id)
Referenced by:
    TABLE "order_detail" CONSTRAINT "order_detail_order_id_fkey" FOREIGN KEY (order_id) REFERENCES orders(id)


## Table "public.products"
   Column   |          Type          | Collation | Nullable |                   Default                    | Storage  | Compression | Stats target | Description
------------+------------------------+-----------+----------+----------------------------------------------+----------+-------------+--------------+-------------
 product_id | integer                |           | not null | nextval('products_product_id_seq'::regclass) | plain    |             |              |
 name       | character varying(100) |           | not null |                                              | extended |             |              |
 price      | numeric                |           | not null |                                              | main     |             |              |
 category   | integer                |           |          |                                              | plain    |             |              |
Indexes:
    "products_pkey" PRIMARY KEY, btree (product_id)
Foreign-key constraints:
    "products_category_fkey" FOREIGN KEY (category) REFERENCES categories(category_id)
Referenced by:
    TABLE "order_detail" CONSTRAINT "order_detail_product_id_fkey" FOREIGN KEY (product_id) REFERENCES products(product_id)

## Table "public.users"
  Column  |          Type          | Collation | Nullable |                Default                 | Storage  | Compression | Stats target | Description
----------+------------------------+-----------+----------+----------------------------------------+----------+-------------+--------------+-------------
 user_id  | integer                |           | not null | nextval('users_user_id_seq'::regclass) | plain    |             |              |
 username | character varying(50)  |           | not null |                                        | extended |             |              |
 password | character varying      |           | not null |                                        | extended |             |              |
 email    | character varying(100) |           | not null |                                        | extended |             |              |
Indexes:
    "users_pkey" PRIMARY KEY, btree (user_id)
    "users_email_key" UNIQUE CONSTRAINT, btree (email)
    "users_username_key" UNIQUE CONSTRAINT, btree (username)
Referenced by:
    TABLE "orders" CONSTRAINT "orders_user_id_fkey" FOREIGN KEY (user_id) REFERENCES users(user_id)

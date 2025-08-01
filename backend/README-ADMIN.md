# Admin User Setup and Troubleshooting Guide

## Admin User Creation

To create an admin user in the database, we've provided a script called `create-admin.js` in the root directory of the backend. This script creates an admin user with the following credentials:

- **Email**: admin@helmets.com
- **Password**: admin123
- **Role**: admin

### How to Run the Admin Creation Script

```bash
cd backend
node create-admin.js
```

The script will check if an admin user with the email `admin@helmets.com` already exists. If not, it will create a new admin user with the specified credentials.

## Common Issues and Solutions

### 1. Association Error in Admin Order Controller

**Error Message**:
```
EagerLoadingError [SequelizeEagerLoadingError]: User is associated to Order using an alias. You must use the 'as' keyword to specify the alias within your include statement.
```

**Solution**:
When including the User model in the Order query, you must specify the alias using the 'as' keyword. The association is defined in `models/associations.js` with the alias 'User'.

```javascript
// Correct way to include User model in Order query
include: [
  {
    model: User,
    as: 'User', // This must match the alias in associations.js
    attributes: ["id", "name", "email"],
  },
]
```

### 2. User Model Field Names

The User model has a `name` field, not separate `firstName` and `lastName` fields. Make sure your frontend code references `User.name` instead of `User.firstName` and `User.lastName`.

## Admin API Endpoints

### Admin Login

- **URL**: `/api/auth/admin/login`
- **Method**: POST
- **Body**: 
  ```json
  {
    "email": "admin@helmets.com",
    "password": "admin123"
  }
  ```
- **Response**: 
  ```json
  {
    "data": {
      "access_token": "jwt_token_here",
      "role": "admin"
    },
    "message": "successfully logged in as admin"
  }
  ```

### Get All Orders (Admin)

- **URL**: `/api/admin/orders`
- **Method**: GET
- **Headers**: 
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Response**: 
  ```json
  {
    "message": "Orders fetched successfully",
    "orders": [...]
  }
  ```

### Update Order Status (Admin)

- **URL**: `/api/admin/orders/:orderId/status`
- **Method**: PUT
- **Headers**: 
  ```
  Authorization: Bearer jwt_token_here
  ```
- **Body**: 
  ```json
  {
    "status": "Shipped"
  }
  ```
- **Response**: 
  ```json
  {
    "message": "Order status updated successfully"
  }
  ```

## Security Considerations

1. In a production environment, passwords should be hashed before storing in the database.
2. Consider implementing rate limiting for login attempts to prevent brute force attacks.
3. Use HTTPS in production to encrypt data in transit.
4. Implement proper validation for all input data.
5. Consider using environment variables for sensitive information like JWT secret keys.
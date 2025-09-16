# Sylvester Delivery App API Documentation

Welcome to the API documentation for the **Sylvester Delivery App**. This guide is for frontend developers to understand and interact with the backend services.

---

## Table of Contents
- [Getting Started](#getting-started)
- [Standard API Response Formats](#standard-api-response-formats)
- [Authentication Routes](#1-authentication-routes)
- [User Routes](#2-user-routes)
- [Customer Routes](#3-customer-routes)
- [Rider Routes](#4-rider-routes)
- [Vendor Routes](#5-vendor-routes)
- [Admin Routes](#6-admin-routes)

---

## Getting Started

To run the backend locally:

```bash
git clone https://github.com/Itzjunio/SYLVESTER-DELIVERY-APP.git
cd SYLVESTER-DELIVERY-APP
npm install
npm run dev
```

The server runs at **http://127.0.0.1:3000**.

### Environment Variables (.env)

```env
MONGODB_URI=mongodb://localhost:<password>/<collection name>
ACCESS_TOKEN_SECRET=""
REFRESH_TOKEN_SECRET=""
JWT_SECRET=""
NODE_ENV=development # or production
APP_URL=""
EMAIL_USER=""
EMAIL_PASS=""
```

---

## Standard API Response Formats

### Success Response (200, 201, etc.)
```json
{
  "status": "success",
  "data": {},
  "message": "Action succeeded."
}
```

### Error Response (400, 401, 404, 500, etc.)
```json
{
  "status": "error",
  "data": null,
  "message": "Description of the error."
}
```

---

## 1. Authentication Routes
**Base Path:** `/auth`

Routes marked *(protected)* require `Authorization: Bearer <access_token>`.

### POST `/register`
Create a new user.
```json
{
  "email": "user@example.com",
  "password": "strong-password",
  "role": "customer"
}
```
**Example cURL**
```bash
curl -X POST https://api.example.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"strong-password","role":"customer"}'
```
*201:* Returns user object and accessToken.

Errors: 400 Invalid body, 409 Email exists.

### POST `/login`
Authenticate a user.
```json
{
  "email": "user@example.com",
  "password": "strong-password"
}
```
**Example cURL**
```bash
curl -X POST https://api.example.com/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","password":"strong-password"}'
```
*200:* Returns user and accessToken.

Errors: 400 Invalid credentials, 403 Not validated, 429 Too many attempts.

### POST `/resend-code`
Resend email verification code.
```json
{
  "email": "user@example.com"
}
```
**Example cURL**
```bash
curl -X POST https://api.example.com/auth/resend-code \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```
*200:* Code sent. Errors: 404 User not found.

### POST `/verify`
Validate account.
```json
{
  "email": "user@example.com",
  "validateCode": "123456"
}
```
**Example cURL**
```bash
curl -X POST https://api.example.com/auth/verify \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com","validateCode":"123456"}'
```
*200:* Account validated. Errors: 400 Invalid/expired code, 404 User not found.

### POST `/refresh-token` *(protected)*
Generate new access token.
**Example cURL**
```bash
curl -X POST https://api.example.com/auth/refresh-token \
  -H "Authorization: Bearer <refresh_token>"
```
*200:* Returns new token. Error: 401 Invalid/expired refresh token.

### POST `/forgot-password`
Send password reset link.
```json
{
  "email": "user@example.com"
}
```
**Example cURL**
```bash
curl -X POST https://api.example.com/auth/forgot-password \
  -H "Content-Type: application/json" \
  -d '{"email":"user@example.com"}'
```
*200:* Reset link sent if user exists.

### PUT `/reset-password`
Reset password.
```json
{
  "newPassword": "new-password",
  "email": "user@example.com",
  "validateCode": "123456"
}
```
**Example cURL**
```bash
curl -X PUT https://api.example.com/auth/reset-password \
  -H "Content-Type: application/json" \
  -d '{"newPassword":"new-password","email":"user@example.com","validateCode":"123456"}'
```
*200:* Password reset successful. Error: 400 Invalid/expired code.

### PUT `/register-devicetoken` *(protected)*
Register device token.
```json
{
  "userId": "user-id",
  "role": "customer",
  "token": "device-token",
  "platform": "web"
}
```
**Example cURL**
```bash
curl -X PUT https://api.example.com/auth/register-devicetoken \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"userId":"user-id","role":"customer","token":"device-token","platform":"web"}'
```
*200:* Device token registered.

### DELETE `/logout` *(protected)*
Logout user (clears refresh token).
**Example cURL**
```bash
curl -X DELETE https://api.example.com/auth/logout \
  -H "Authorization: Bearer <access_token>"
```
*204:* No content.

---

## 2. User Routes
**Base Path:** `/user`

Require `Authorization: Bearer <access_token>`.

### GET `/profile`
Fetch user profile.
**Example cURL**
```bash
curl -X GET https://api.example.com/user/profile \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns profile. Errors: 401 Unauthorized, 404 Not found.

### PUT `/update`
Update profile.
```json
{
  "email": "new-email@example.com",
  "mobile": "1234567890"
}
```
**Example cURL**
```bash
curl -X PUT https://api.example.com/user/update \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"email":"new-email@example.com","mobile":"1234567890"}'
```
*200:* Returns updated profile. Error: 400 Invalid data.

---

## 3. Customer Routes
**Base Path:** `/api/customer`

Require `Authorization: Bearer <access_token>`.

### GET `/restaurants`
Fetch nearby restaurants.
```json
{
  "latitude": 34.0522,
  "longitude": -118.2437,
  "maxDistanceInMeters": 5000
}
```
**Example cURL**
```bash
curl -X GET https://api.example.com/api/customer/restaurants \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns restaurant array. Error: 404 None found.

### GET `/restaurants/:restaurantId/menu`
Retrieve restaurant menu.
**Example cURL**
```bash
curl -X GET https://api.example.com/api/customer/restaurants/<restaurantId>/menu \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns menu items. Errors: 400 Invalid ID, 404 Not found.

### GET `/orders/history`
Retrieve user order history.
**Example cURL**
```bash
curl -X GET https://api.example.com/api/customer/orders/history \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns orders array.

### POST `/order`
Place a new order.
```json
{
  "restaurantId": "restaurant-id",
  "items": [
    { "name": "Pizza", "quantity": 1 },
    { "name": "Coke", "quantity": 2 }
  ],
  "paymentMethod": "Cash"
}
```
**Example cURL**
```bash
curl -X POST https://api.example.com/api/customer/order \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"restaurantId":"restaurant-id","items":[{"name":"Pizza","quantity":1},{"name":"Coke","quantity":2}],"paymentMethod":"Cash"}'
```
*201:* Returns new order. Errors: 400 Invalid body, 404 Restaurant not found.

### GET `/orders/:orderId/status`
Track order status.
**Example cURL**
```bash
curl -X GET https://api.example.com/api/customer/orders/<orderId>/status \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns order status. Errors: 400 Invalid ID, 404 Not found.

---

## 4. Rider Routes
**Base Path:** `/api/rider`

Require `Authorization: Bearer <access_token>`.

### GET `/me`
Retrieve rider dashboard.
**Example cURL**
```bash
curl -X GET https://api.example.com/api/rider/me \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns order history.

### GET `/order/:orderId`
Get assigned order details.
**Example cURL**
```bash
curl -X GET https://api.example.com/api/rider/order/<orderId> \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns full order. Errors: 400 Invalid ID, 404 Not found/unauthorized.

### PUT `/order/:orderId/status`
Update order status.
```json
{
  "status": "in-transit" // or "delivered"
}
```
**Example cURL**
```bash
curl -X PUT https://api.example.com/api/rider/order/<orderId>/status \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"in-transit"}'
```
*200:* Returns updated order. Errors: 400 Invalid status, 404 Not found/unauthorized.

### PUT `/order/:orderId/accept/assign`
Assign order to rider.
**Example cURL**
```bash
curl -X PUT https://api.example.com/api/rider/order/<orderId>/accept/assign \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns order details. Error: 404 Not available.

---

## 5. Vendor Routes
**Base Path:** `/api/vendor`

Require `Authorization: Bearer <access_token>`.

### GET `/dashboard`
Retrieve vendor summary.
**Example cURL**
```bash
curl -X GET https://api.example.com/api/vendor/dashboard \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns restaurant and order summary.

### POST `/menu/items`
Add new menu item.
```json
{
  "name": "Pizza",
  "description": "Delicious pizza",
  "price": 300,
  "image": "https://example.com/pizza.jpg",
  "category": "Main",
  "isAvailable": true
}
```
**Example cURL**
```bash
curl -X POST https://api.example.com/api/vendor/menu/items \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"name":"Pizza","description":"Delicious pizza","price":300,"image":"https://example.com/pizza.jpg","category":"Main","isAvailable":true}'
```
*201:* Returns new menu item. Error: 400 Invalid body.

### PUT `/orders/:orderId/status`
Update order status.
```json
{
  "status": "accepted"
}
```
**Example cURL**
```bash
curl -X PUT https://api.example.com/api/vendor/orders/<orderId>/status \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"status":"accepted"}'
```
*200:* Returns updated order. Errors: 400 Invalid status, 404 Order not found.

### PUT `/restaurant/:restaurantId/item/:itemName/availability`
Update menu item availability.
```json
{
  "isAvailable": true
}
```
**Example cURL**
```bash
curl -X PUT https://api.example.com/api/vendor/restaurant/<restaurantId>/item/<itemName>/availability \
  -H "Authorization: Bearer <access_token>" \
  -H "Content-Type: application/json" \
  -d '{"isAvailable":true}'
```
*200:* Updated successfully. Error: 404 Restaurant/item required.

### PUT `/orders/:orderId/reject`
Reject an order.
**Example cURL**
```bash
curl -X PUT https://api.example.com/api/vendor/orders/<orderId>/reject \
  -H "Authorization: Bearer <access_token>"
```
*200:* Rejected successfully. Errors: 401 ID not found, 404 Not pending.

---

## 6. Admin Routes
**Base Path:** `/api/admin`

Require `Authorization: Bearer <access_token>`.

### GET `/dashboard`
Get summary of all user data.
**Example cURL**
```bash
curl -X GET https://api.example.com/api/admin/dashboard \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns user counts by role.

### GET `/users`
Retrieve all users.
**Example cURL**
```bash
curl -X GET https://api.example.com/api/admin/users \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns user array.

### GET `/orders`
Retrieve all orders.
**Example cURL**
```bash
curl -X GET https://api.example.com/api/admin/orders \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns order array.

### GET `/orders/:orderId/status`
Get order status.
**Example cURL**
```bash
curl -X GET https://api.example.com/api/admin/orders/<orderId>/status \
  -H "Authorization: Bearer <access_token>"
```
*200:* Returns status. Errors: 400 Invalid ID, 404 Not found.

### GET `/rider/performance`
Query: `startDate`, `endDate`, `riderId`
**Example cURL**
```bash
curl -X GET "https://api.example.com/api/admin/rider/performance?startDate=2025-01-01&endDate=2025-02-01&riderId=<riderId>" \
  -H "Authorization: Bearer <access_token>"
```
*200:* Performance report or "No data". Error: 400 Invalid query.

### PUT `/user/:userId/deactivate`
Deactivate a user.
**Example cURL**
```bash
curl -X PUT https://api.example.com/api/admin/user/<userId>/deactivate \
  -H "Authorization: Bearer <access_token>"
```
*200:* User deactivated. Error: 404 User not found.

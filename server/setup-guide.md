# PocketBase Setup Guide

Follow these steps to set up your PocketBase database for Avilasha:

## 1. Create Collections

In the PocketBase Admin UI (http://localhost:8090/_/), create the following collections:

### Users Collection (Auth Type)
- Go to Collections → New Collection
- Name: `users`
- Type: Auth collection
- Add the following fields:
  - `name` (Text, Required)
  - `avatar` (File)
  - `role` (Select, Options: "user", "admin", Default: "user")
  - `verified` (Boolean, Default: false)

### Tokens Collection
- Go to Collections → New Collection
- Name: `tokens`
- Type: Base collection
- Add the following fields:
  - `symbol` (Text, Required)
  - `name` (Text, Required)
  - `image` (Text, Required)
  - `current_price` (Number, Required)
  - `market_cap` (Number, Required)
  - `market_cap_rank` (Number, Required)
  - `price_change_percentage_24h` (Number, Required)
  - `user_id` (Relation, Required, Collection: users)
  - `is_favorite` (Boolean, Default: false)

### Portfolio Collection
- Go to Collections → New Collection
- Name: `portfolio`
- Type: Base collection
- Add the following fields:
  - `token_id` (Relation, Required, Collection: tokens)
  - `user_id` (Relation, Required, Collection: users)
  - `amount` (Number, Required)
  - `purchase_price` (Number, Required)
  - `purchase_date` (Date, Required)

### Transactions Collection
- Go to Collections → New Collection
- Name: `transactions`
- Type: Base collection
- Add the following fields:
  - `user_id` (Relation, Required, Collection: users)
  - `token_id` (Relation, Required, Collection: tokens)
  - `type` (Select, Required, Options: "buy", "sell", "transfer_in", "transfer_out")
  - `amount` (Number, Required)
  - `price` (Number, Required)
  - `fee` (Number, Default: 0)
  - `date` (Date, Required)
  - `notes` (Text)

### Wallets Collection
- Go to Collections → New Collection
- Name: `wallets`
- Type: Base collection
- Add the following fields:
  - `user_id` (Relation, Required, Collection: users)
  - `name` (Text, Required)
  - `type` (Select, Required, Options: "hot", "cold", "exchange", "other")
  - `address` (Text)
  - `balance` (Number, Required, Default: 0)
  - `is_default` (Boolean, Default: false)

### Notifications Collection
- Go to Collections → New Collection
- Name: `notifications`
- Type: Base collection
- Add the following fields:
  - `user_id` (Relation, Required, Collection: users)
  - `title` (Text, Required)
  - `message` (Text, Required)
  - `type` (Select, Required, Options: "info", "success", "warning", "error")
  - `is_read` (Boolean, Default: false)
  - `link` (Text)

## 2. Create a Demo User

- Go to the `users` collection
- Click "New record"
- Fill in the following details:
  - Email: demo@example.com
  - Password: password
  - Name: Demo User
  - Role: user
  - Verified: true
- Save the record

## 3. Update Client Configuration

Make sure your client application is configured to connect to the PocketBase server at http://localhost:8090.

## 4. Testing the Application

You can now test the application with the demo user:
- Email: demo@example.com
- Password: password

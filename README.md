# Overview

The project is a library system built with React, Apollo Client, Node.js, and GraphQL.
It allows users to:

View all books and authors.

Filter books by genre using GraphQL queries.

Add new books (only for logged-in users).

View personalized book recommendations based on their favorite genre.

See real-time updates when new books are added through GraphQL subscriptions.

## Tech Stack

### Frontend

---> React with React Router for page navigation
---> Apollo Client for GraphQL queries, mutations, and subscriptions

### Backend
---> Node.js + Express
---> Apollo Server 4
--->MongoDB (Mongoose) for data persistence
--->GraphQL Subscriptions using graphql-ws and PubSub

## How to run the App? 
OPEN 2 TERMINAL BARS
Go to the backend library and create MONGODB_URI and JWT_SECRET
Go to the frontend library and run it

```bash 
    (BACKEND)
    cd library-backend 
    code .env
    (there code
    MONGODB_URI=your_mongodb_connection_string
    JWT_SECRET=your_secret_key
    )
    npm run dev

    (FRONTEND)
    cd library-frontend 
    npm run dev
```

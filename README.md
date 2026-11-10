# MERN Full Stack 2

An admin dashboard for managing contacts, built with React and a Firebase Cloud Function API backed by MongoDB.

## Features

- Admin registration protected by a private enrollment key
- Password-hashed admin accounts and signed, HttpOnly session cookies
- Server-verified sessions and authenticated user management routes
- MongoDB-backed contact create, list, update, and delete operations
- Server-side validation, duplicate checks, and safe API responses
- Search and sort contacts in the dashboard

## Requirements

- Node.js 22
- MongoDB (local or Atlas)
- Firebase CLI for the Functions emulator or deployment

## Local development

1. Start MongoDB and configure the backend environment:

       Copy-Item backend/functions/.env.example backend/functions/.env

   Set TOKEN_KEY and ADMIN_REGISTRATION_KEY to separate random values, each at least 32 bytes.

2. Start the Functions emulator from backend/functions:

       npm install
       npm run serve

   The API will be available at http://localhost:5001/ashishranjan-net/asia-south1/api/v1.

3. Configure and start the React app:

       Copy-Item frontend/.env.example frontend/.env.local
       cd frontend
       npm install
       npm start

   Open http://localhost:3000. Use the admin enrollment key from the backend environment when creating the first admin account.

## Environment

The Functions API reads these values from backend/functions/.env:

- MONGODB_URI: MongoDB connection string. MONGODB_URL is also accepted for existing deployments.
- TOKEN_KEY: secret used to sign admin session tokens.
- ADMIN_REGISTRATION_KEY: secret required to create an admin account.
- CLIENT_ORIGIN: comma-separated allowed frontend origins.
- COOKIE_SAME_SITE: use strict locally. Production runs over HTTPS and uses none for the separately hosted frontend and API.

Never commit .env files or share the enrollment key. The checked-in .env.example contains placeholders only.

## API routes

All routes are prefixed with /v1.

- POST /admin/register: create an admin account; requires X-Admin-Registration-Key.
- POST /admin/login: sign in and receive an HttpOnly session cookie.
- POST /admin: verify the current session.
- POST /admin/logout: clear the session cookie.
- GET /user: list contacts for an authenticated admin session.
- POST /user/add: create a contact.
- PATCH /user/:id: update a contact.
- DELETE /user/:id: delete a contact.

## Deploying the Functions API

The Firebase Functions configuration in backend/firebase.json targets the ashishranjan-net project, matching the API URL used by the frontend. Configure production environment values before deploying:

    cd backend/functions
    npm install
    firebase deploy --only functions

The project must meet Firebase's current runtime and billing requirements. The frontend Hosting project is configured separately under frontend/.

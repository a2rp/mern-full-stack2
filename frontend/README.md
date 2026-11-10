# React frontend

This React app connects to the Firebase Functions API for admin login and persistent contact management.

## Local development

1. Start MongoDB and the Functions emulator from backend/functions.
2. Copy .env.example to .env.local to point the app at the emulator.
3. Install dependencies and start the development server:

       Copy-Item .env.example .env.local
       npm install
       npm start

The development server opens at http://localhost:3000.

The deployed build defaults to the Firebase Functions API for the ashishranjan-net project. Set REACT_APP_API_URL only when using a different API endpoint.

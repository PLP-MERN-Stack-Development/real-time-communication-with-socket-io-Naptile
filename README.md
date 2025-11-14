Real-Time Communication App with Socket.io

Live Demo: https://real-time-communication-with-socket-io-vtua.onrender.com/

A real-time chat application built using the MERN stack and Socket.io, allowing users to communicate instantly in a modern web interface.

Features

Real-time messaging powered by Socket.io

React frontend with Vite for fast development

Express.js backend with RESTful API support

Cross-Origin Resource Sharing (CORS) enabled

Environment configuration via dotenv

Easily deployable on platforms like Render

Tech Stack

Frontend: React, Vite, CSS

Backend: Node.js, Express, Socket.io

Deployment: Render

Folder Structure
real-time-communication-with-socket-io-Naptile/
│
├─ client/                # Frontend
│  ├─ public/
│  ├─ src/
│  ├─ package.json
│  └─ vite.config.js
│
├─ server/                # Backend
│  ├─ server.js
│  ├─ package.json
│  └─ .env
│
└─ README.md

Getting Started
1. Clone the repository
git clone https://github.com/PLP-MERN-Stack-Development/real-time-communication-with-socket-io-Naptile.git
cd real-time-communication-with-socket-io-Naptile

2. Backend Setup
cd server
npm install


Create a .env file in server/:

PORT=5000


Run backend locally:

npm run dev

3. Frontend Setup
cd ../client
npm install
npm run dev


Open http://localhost:5173
 in your browser to use the app.

Deployment Instructions
Backend (Render)

Root Directory: server

Build Command: npm install

Start Command: node server.js

Frontend (Render)

Root Directory: client

Build Command: npm install && npm run build

Publish Directory: dist

Usage

Open the app in a web browser.

Enter a username to join the chat room.

Send and receive messages in real-time.

Dependencies

Backend:

express

socket.io

dotenv

cors

nodemon (dev dependency)

Frontend:

react

react-dom

vite

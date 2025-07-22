# Collaborative Whiteboard

A **real-time collaborative whiteboard** application built with React, Redux, Socket.IO, and Node.js.

## Features

- Live drawing tools: Rectangle, Line, Ellipse, Text
- Rubber (eraser), Selection, and Resizing tools
- Responsive canvas for all devices
- Shareable room links for seamless collaboration
- User authentication with JWT (Sign Up / Sign In)
- Interactive UI with toast notifications and custom cursors

## Technologies

- Frontend: React, Redux Toolkit, RoughJS
- Backend: Node.js, Express, MongoDB, Socket.IO
- Utilities: nanoid, bcrypt, zod for validation

## Setup Instructions

1. Clone the repository:
git clone https://github.com/yourusername/collaborative-whiteboard.git
cd collaborative-whiteboard



2. Backend setup:
cd server
npm install

Create a `.env` file with:
MONGODB_URL=your_mongo_connection_string
JWT_USER_SECRET=your_jwt_secret
PORT=3000

Start backend server:
npm run dev

text

3. Frontend setup:
cd ../client
npm install
npm start



## Usage

- Visit the homepage to sign up or sign in.
- Create or join a whiteboard session via unique shareable links.
- Share the link to collaborate live with others (Sign In required).
- Use the intuitive toolbar for drawing, writing, erasing, selecting, and resizing.

## Folder Structure

frontend/ # React frontend source code
server/ # Backend API and socket server



## Future Enhancements

- Undo/Redo functionality
- Persistent whiteboard saving/loading
- Real-time user cursors and avatars

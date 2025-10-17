# Image Annotation Platform for Thesis Research

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/node-%3E%3D18.0.0-brightgreen)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)](https://www.mongodb.com/cloud/atlas)
[![React](https://img.shields.io/badge/React-18-blue)](https://react.dev)
[![Express.js](https://img.shields.io/badge/Express-5.0-black)](https://expressjs.com)

A collaborative multi-user MERN stack application for annotating and managing large-scale image datasets with intelligent task distribution. Built with modern React, Express.js, MongoDB, and premium enterprise-grade UI design.

The repository is split into two workspaces:

- `server/` — Express API handling authentication, media ingestion, and intelligent assignment distribution.
- `client/` — React client (Create React App) with premium UI featuring authentication flow, file upload, and annotation dashboard.

## Prerequisites

- Node.js 18+ and npm
- MongoDB instance (local or hosted) for development data storage

## Getting Started

### 1. Install dependencies

```powershell
cd "e:\Project\Annotator for thesis\server"
npm install

cd "e:\Project\Annotator for thesis\client"
npm install
```

Dependencies are already installed in this workspace, but run the above commands if you clone the repository afresh.

### 2. Configure environment variables

Copy `server/.env.example` to `server/.env` and update the values:

```
PORT=5000
MONGODB_URI=<your MongoDB connection string>
JWT_SECRET=<random-string>
CLIENT_ORIGIN=http://localhost:3000
ASSIGNMENT_BLOCK_SIZE=200
```

Replace placeholders with real values. `ASSIGNMENT_BLOCK_SIZE` controls how many media items are handed to each user before cycling to the next collaborator.

Copy `client/.env.example` (create if needed) to configure the React app. By default the UI targets `http://localhost:5000/api`, so no additional setup is required unless you change server ports or deploy.

### 3. Run the development servers

```powershell
# Terminal 1 - backend
cd "e:\Project\Annotator for thesis\server"
npm run dev

# Terminal 2 - frontend
cd "e:\Project\Annotator for thesis\client"
npm start
```

The React app proxies API requests to the backend via `src/setupProxy.js`. By default, CRA serves on http://localhost:3000 and the backend on http://localhost:5000.

## Project Scripts

### Backend (`server`)

- `npm run dev` — Start Express server with nodemon hot reloading.
- `npm start` — Start Express server in production mode.
- `npm run lint` — Lint backend source files with ESLint.

### Frontend (`client`)

- `npm start` — Launch CRA dev server.
- `npm run build` — Create a production build.
- `npm test` — Run CRA test runner.
- `npm run eject` — Eject CRA configuration.

## Features

- **Authentication** — Registration and login pages powered by JWT-based tokens stored in local storage. Authenticated users are routed to `/app` while guests are redirected to `/login`.
- **Dashboard Navigation** — Authenticated workspace renders a navbar with quick access to Upload and Annotate tabs plus logout.
- **Bulk Uploads** — Users can upload up to 50 files at once (images, CSVs, or any arbitrary dataset files). Uploaded files are stored on the server and metadata is persisted in MongoDB.
- **Assignment Distribution** — The `/api/media/assignments` endpoint chunks the dataset into configurable blocks (default 200) and rotates them evenly across all registered users (e.g., user1 gets items 1-200, user2 201-400, user3 401-500, then back to user1 with 501-600, etc.).
- **Annotation View** — Users can browse their assigned files; images render inline while other file types surface download links.

### Troubleshooting

- **Error:** `Missing MONGODB_URI environment variable`
	- Ensure `server/.env` exists (you can copy `server/.env.example` and fill in your credentials).
	- Verify the file contains a `MONGODB_URI=` line with a valid connection string.
	- Restart the backend process after updating the environment variables.

## Tech Stack

- **MongoDB** for persistence
- **Express** REST API with middleware support (CORS, multer uploads, logging via morgan)
- **React** client bootstrapped with Create React App
- **React Router**, **TanStack Query**, **Zustand**, and **React Konva** for building the annotation UI
- **Multer** for multi-file uploads and `http-proxy-middleware` for local dev proxying

## Next Steps

- Persist annotation labels (e.g., bounding boxes) and expose CRUD endpoints.
- Expand assignment logic to support reassignment, locking, and progress tracking.
- Build collaborative review tools (comments, approval queues).
- Add automated tests and CI workflows.

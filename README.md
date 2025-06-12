🎥 Live Streaming Platform with VOD & Chat

A full-stack live streaming system supporting real-time video broadcasting, live chat, viewer stats, and recorded video playback (VOD). Built with Java Spring Boot, ReactJS, React Native, Redis, MySQL, and SRS Media Server.

📆 Features

✅ User Registration & Login with JWT

✅ Live Streaming using SRS (Simple Realtime Server)

✅ Stream Metadata & Management APIs

✅ Real-time Viewer Count with Redis

✅ Live Chat with Redis Pub/Sub and WebSockets

✅ VOD (Recorded Streams) Management

✅ Frontend: Web + Android App (React Native)

✅ Dockerized for Local and Cloud Deployment

📁 Project Structure

live-streaming-platform/
├── backend/            # Spring Boot backend API
├── frontend-web/       # Vite + ReactJS frontend
├── frontend-mobile/    # React Native mobile app (Android)
├── srs-server/         # Local setup or Docker config for SRS media server
├── docker-compose.yml  # For unified local deployment

🚀 Tech Stack

Layer

Tech Used

Backend

Java 17/21, Spring Boot, Spring Security, JWT, Redis, MySQL

Frontend Web

ReactJS, Vite, Video.js/Shaka Player, WebSockets

Frontend App

React Native, react-native-video, WebSockets

Media Server

SRS (Simple Realtime Server) for RTMP ingest and HLS/DASH output

Realtime

Redis Pub/Sub, Spring WebSockets for chat & viewer counts

Deployment

Docker, Docker Compose, DigitalOcean / Render

🔄 Development Roadmap (Condensed)

Phase 1: Initialization



Phase 2: Auth + DB



Phase 3: Streaming



Phase 4: Realtime & VOD



Phase 5: Deployment



🛎️ API Endpoints (Sample)

GET /api/hello — Backend health check

POST /auth/register — Create new user

POST /auth/login — Get JWT token

GET /stream/active — List active streams

POST /stream/start — Create stream metadata

GET /vod/list — List VOD content

🚧 Local Development

# Run backend
cd backend
./mvnw spring-boot:run

# Run frontend web
cd frontend-web
npm install && npm run dev

# Run mobile (Android)
cd frontend-mobile
npx react-native run-android

# Start SRS Media Server
cd srs-server
./objs/srs -c conf/srs.conf

🚀 Deployment

# Run all using Docker
docker-compose up --build

📖 License

MIT License. Feel free to fork and build upon this project.


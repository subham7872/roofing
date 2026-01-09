# RestorePro Backend Server

## Setup Instructions

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Variables
Create a `.env` file in the `server` directory with:
```
PORT=8088
MONGODB_URI=mongodb://localhost:27017/restorepro
NODE_ENV=development
```

### 3. Start MongoDB
Make sure MongoDB is running on your system:
```bash
# Windows
net start MongoDB

# Mac/Linux
sudo systemctl start mongod
# or
mongod
```

### 4. Run the Server
```bash
# Development mode (with auto-reload)
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:8088`

## API Endpoints

- `GET /api/services` - Get all services
- `GET /api/services/:id` - Get single service
- `POST /api/services` - Create new service
- `PUT /api/services/:id` - Update service
- `DELETE /api/services/:id` - Delete service

## Database Schema

**Service Model:**
- `image` (String, required) - Image URL or path
- `title` (String, required) - Service title
- `description` (String, required) - Service description
- `createdAt` (Date, auto) - Creation timestamp
- `updatedAt` (Date, auto) - Update timestamp

## Project Structure

```
server/
├── app.js                 # Main application file
├── config/
│   └── database.js        # MongoDB connection
├── controller/
│   └── serviceController.js  # Service CRUD operations
├── model/
│   └── Service.js        # Service Mongoose model
├── routes/
│   └── appRouter.js      # API routes
└── .env                  # Environment variables
```


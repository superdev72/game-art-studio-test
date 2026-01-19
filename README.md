# Game Art Studio Test - Backend API

This is a NestJS REST API application built for the fans-crm.com backend developer assessment.

## Requirements

- Node.js v22+
- MongoDB (running locally or remote)
- npm or yarn

## Features

- REST API with three main endpoints
- JWT authentication for all API requests
- MongoDB database with Mongoose ORM
- Automatic seeding of 2 million users on first startup
- Pagination and filtering support
- Request logging to console

## Installation

1. Install dependencies:
```bash
npm install
```

2. Set up environment variables (optional):
Create a `.env` file in the root directory:
```
MONGODB_URI=mongodb://localhost:27017/fans-crm
JWT_SECRET=your-secret-key-change-in-production
PORT=3000
```

If you don't create a `.env` file, the application will use default values:
- MongoDB: `mongodb://localhost:27017/fans-crm`
- JWT Secret: `your-secret-key-change-in-production`
- Port: `3000`

## Running the Application

### Development Mode
```bash
npm run start:dev
```

### Production Mode
```bash
npm run build
npm run start:prod
```

### Start Mode
```bash
npm start
```

## Database Seeding

On the first startup, if the database is empty, the application will automatically seed 2 million random user records. This process may take several minutes depending on your system performance.

**Note:** The seeding process runs asynchronously and won't block the server from starting. You can check the console logs to see the seeding progress.

## API Endpoints

All endpoints require JWT authentication via the `Authorization` header:
```
Authorization: Bearer <your-jwt-token>
```

### 1. Get JWT Token (for testing)

**POST** `/api/v1/auth/login`

Request body:
```json
{
  "username": "test-user"
}
```

Response:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Add User

**POST** `/api/v1/users/add-user`

Request body:
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

Response:
```json
{
  "_id": "...",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

**Note:** The request data is also logged to the console.

### 3. Get Users (with pagination and filtering)

**GET** `/api/v1/users/get-users`

Query parameters:
- `page` (optional, default: 1) - Page number
- `limit` (optional, default: 10) - Items per page
- `name` (optional) - Filter by name (case-insensitive partial match)
- `email` (optional) - Filter by email (case-insensitive partial match)
- `phone` (optional) - Filter by phone (case-insensitive partial match)

Example:
```
GET /api/v1/users/get-users?page=1&limit=20&name=John
```

Response:
```json
{
  "data": [
    {
      "_id": "...",
      "name": "John Doe",
      "email": "...",
      "phone": "...",
      "dateOfBirth": "...",
      "createdAt": "...",
      "updatedAt": "..."
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 20,
    "total": 2000000,
    "totalPages": 100000
  }
}
```

### 4. Get User by ID

**GET** `/api/v1/users/get-user/:id`

Example:
```
GET /api/v1/users/get-user/507f1f77bcf86cd799439011
```

Response:
```json
{
  "_id": "507f1f77bcf86cd799439011",
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01T00:00:00.000Z",
  "createdAt": "...",
  "updatedAt": "..."
}
```

## Testing the API

### Using cURL

1. First, get a JWT token:
```bash
curl -X POST http://localhost:3000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "test-user"}'
```

2. Use the token to make authenticated requests:
```bash
# Add a user
curl -X POST http://localhost:3000/api/v1/users/add-user \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "name": "John Doe",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "dateOfBirth": "1990-01-01"
  }'

# Get users with pagination
curl -X GET "http://localhost:3000/api/v1/users/get-users?page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get users with filter
curl -X GET "http://localhost:3000/api/v1/users/get-users?name=John&page=1&limit=10" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"

# Get user by ID
curl -X GET "http://localhost:3000/api/v1/users/get-user/USER_ID_HERE" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### Using Postman or Similar Tools

1. Import the following collection or create requests manually
2. Set the base URL to `http://localhost:3000/api/v1`
3. For authenticated endpoints, add header:
   - Key: `Authorization`
   - Value: `Bearer YOUR_TOKEN_HERE`

## Project Structure

```
src/
├── auth/                 # Authentication module
│   ├── guards/          # JWT guard
│   ├── strategies/      # JWT strategy
│   └── auth.controller.ts
├── users/               # Users module
│   ├── dto/            # Data transfer objects
│   ├── schemas/         # Mongoose schemas
│   ├── users.controller.ts
│   ├── users.service.ts
│   └── users.module.ts
├── database-seeder/     # Database seeding service
│   ├── database-seeder.service.ts
│   └── database-seeder.module.ts
├── app.module.ts        # Root module
└── main.ts              # Application entry point
```

## Checking Results

### 1. Verify Server is Running
- Check console output for: `Application is running on: http://localhost:3000`
- Check for database connection messages

### 2. Verify Database Seeding
- Check console logs for seeding progress messages
- Look for messages like: `Seeded batch X/Y (Z%) - N/2000000 users`
- After completion, you should see: `Database seeding completed successfully!`

### 3. Test API Endpoints
- Use the cURL commands above or Postman
- Verify responses match expected format
- Check console logs for POST request logging

### 4. Verify Database Content
You can connect to MongoDB and check:
```javascript
// In MongoDB shell or MongoDB Compass
use fans-crm
db.users.countDocuments()  // Should return 2000000 after seeding
db.users.findOne()          // View a sample user
```

## Troubleshooting

### MongoDB Connection Issues

**Error: `connect ECONNREFUSED 127.0.0.1:27017`**

This means MongoDB is not running. Here's how to fix it:

#### Option 1: Install MongoDB Community Edition (Linux - Ubuntu/Debian)

**Method A: Using Installation Script (Easiest)**
```bash
# Run the provided installation script
sudo bash install-mongodb.sh
```

**Method B: Manual Installation**
```bash
# Add MongoDB GPG key
curl -fsSL https://www.mongodb.org/static/pgp/server-7.0.asc | sudo gpg -o /usr/share/keyrings/mongodb-server-7.0.gpg --dearmor

# Add MongoDB repository (for Ubuntu 22.04/Jammy)
echo "deb [ arch=amd64,arm64 signed-by=/usr/share/keyrings/mongodb-server-7.0.gpg ] https://repo.mongodb.org/apt/ubuntu jammy/mongodb-org/7.0 multiverse" | sudo tee /etc/apt/sources.list.d/mongodb-org-7.0.list

# For other Ubuntu versions, replace "jammy" with your codename:
# - Ubuntu 20.04: focal
# - Ubuntu 18.04: bionic
# - Debian: use debian instead of ubuntu

# Update and install
sudo apt-get update
sudo apt-get install -y mongodb-org

# Start MongoDB service
sudo systemctl start mongod
sudo systemctl enable mongod

# Check status
sudo systemctl status mongod
```

**Note:** The service name is `mongod` (not `mongodb`)

#### Option 2: Install and Start MongoDB (macOS)
```bash
# Install using Homebrew
brew tap mongodb/brew
brew install mongodb-community

# Start MongoDB
brew services start mongodb-community
```

#### Option 3: Install and Start MongoDB (Windows)
1. Download MongoDB from https://www.mongodb.com/try/download/community
2. Install MongoDB
3. Start MongoDB service from Services (services.msc) or run:
```cmd
net start MongoDB
```

#### Option 4: Use Docker (Easiest - Recommended)

**Method A: Using the provided script**
```bash
# Run the Docker setup script
bash start-mongodb-docker.sh
```

**Method B: Manual Docker commands**
```bash
# Run MongoDB in Docker
docker run -d -p 27017:27017 --name mongodb -v mongodb-data:/data/db mongo:latest

# Check if it's running
docker ps

# To stop MongoDB
docker stop mongodb

# To start MongoDB again
docker start mongodb

# To remove MongoDB container
docker rm -f mongodb
```

**Note:** If Docker is not installed, you can install it with:
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
newgrp docker  # or log out and back in
```

#### Option 5: Use MongoDB Atlas (Cloud)
1. Create a free account at https://www.mongodb.com/cloud/atlas
2. Create a cluster and get connection string
3. Update `.env` file:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/fans-crm
```

#### Verify MongoDB is Running
```bash
# Check if MongoDB is listening on port 27017
netstat -an | grep 27017
# Or
lsof -i :27017
# Or
ss -tuln | grep 27017
```

#### Test MongoDB Connection
```bash
# Try connecting with MongoDB shell
mongosh
# Or older versions
mongo
```

If connection works, you should see MongoDB shell prompt.

### Port Already in Use
- Change the PORT in `.env` file
- Or kill the process using port 3000

### Seeding Takes Too Long
- This is normal for 2 million records
- The seeding runs in batches of 10,000 records
- Progress is logged to console
- The server remains available during seeding

### JWT Token Issues
- Ensure you're including the token in the Authorization header
- Token format: `Bearer <token>`
- Tokens expire after 24 hours (default)

## Testing with Postman

### Import Postman Collection

1. Open Postman
2. Click **Import** button
3. Import the `postman_collection.json` file from this project
4. Or manually create requests as described below

### Manual Postman Setup

#### 1. Get JWT Token
- **Method:** POST
- **URL:** `http://localhost:3000/api/v1/auth/login`
- **Headers:**
  - `Content-Type: application/json`
- **Body (raw JSON):**
```json
{
  "username": "test-user"
}
```
- **Response:** Copy the `access_token` value

#### 2. Set Environment Variable (Optional but Recommended)
1. Create a new Environment in Postman
2. Add variable:
   - **Variable:** `token`
   - **Initial Value:** (leave empty, will be set from login response)
3. In the login request, add a **Test** script:
```javascript
if (pm.response.code === 201 || pm.response.code === 200) {
    const jsonData = pm.response.json();
    pm.environment.set("token", jsonData.access_token);
}
```

#### 3. Add User
- **Method:** POST
- **URL:** `http://localhost:3000/api/v1/users/add-user`
- **Headers:**
  - `Content-Type: application/json`
  - `Authorization: Bearer {{token}}` (or paste token directly)
- **Body (raw JSON):**
```json
{
  "name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "+1234567890",
  "dateOfBirth": "1990-01-01"
}
```

#### 4. Get Users (with Pagination)
- **Method:** GET
- **URL:** `http://localhost:3000/api/v1/users/get-users?page=1&limit=10`
- **Headers:**
  - `Authorization: Bearer {{token}}`

#### 5. Get Users (with Filter)
- **Method:** GET
- **URL:** `http://localhost:3000/api/v1/users/get-users?name=John&page=1&limit=10`
- **Headers:**
  - `Authorization: Bearer {{token}}`

#### 6. Get User by ID
- **Method:** GET
- **URL:** `http://localhost:3000/api/v1/users/get-user/YOUR_USER_ID_HERE`
- **Headers:**
  - `Authorization: Bearer {{token}}`
- **Note:** Replace `YOUR_USER_ID_HERE` with an actual user ID from previous responses

## Testing with Browser

**Note:** Browser testing is limited because:
1. The login endpoint works (POST request)
2. Other endpoints require JWT authentication which is easier with tools like Postman

### Using Browser Developer Tools

1. **Get JWT Token:**
   - Open browser console (F12)
   - Run:
```javascript
fetch('http://localhost:3000/api/v1/auth/login', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ username: 'test-user' })
})
.then(res => res.json())
.then(data => {
  console.log('Token:', data.access_token);
  window.token = data.access_token; // Save for later use
});
```

2. **Test GET Endpoints:**
```javascript
// Get users
fetch('http://localhost:3000/api/v1/users/get-users?page=1&limit=5', {
  headers: {
    'Authorization': `Bearer ${window.token}`
  }
})
.then(res => res.json())
.then(data => console.log('Users:', data));
```

### Using Browser Extensions

**REST Client Extensions:**
- **REST Client (VS Code extension)** - If using VS Code
- **Thunder Client (VS Code extension)** - Alternative to Postman
- **ModHeader** - Browser extension to add headers

### Using curl (Command Line)

See the "Testing the API" section above for curl examples.

## Notes

- The application uses case-insensitive partial matching for filters
- Pagination starts at page 1
- All timestamps are in UTC
- User emails must be unique (enforced by database index)

@echo off
echo 🚀 Abhivriddhi Backend Setup Script
echo ===================================

echo.
echo Step 1: Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found! Please install Node.js first.
    pause
    exit /b 1
)
echo ✅ Node.js found

echo.
echo Step 2: Checking MongoDB...
net start | find "MongoDB" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB service not running
    echo.
    echo 🔧 To fix this:
    echo 1. Install MongoDB from: https://www.mongodb.com/try/download/community
    echo 2. Run installer as Administrator
    echo 3. Start service: net start MongoDB
    echo.
    echo Or use MongoDB Atlas (cloud): https://cloud.mongodb.com/
    echo.
    pause
    exit /b 1
)
echo ✅ MongoDB service is running

echo.
echo Step 3: Installing backend dependencies...
cd backend
if not exist node_modules (
    npm install
    if %errorlevel% neq 0 (
        echo ❌ npm install failed
        pause
        exit /b 1
    )
) else (
    echo ✅ Dependencies already installed
)

echo.
echo Step 4: Testing MongoDB connection...
node test-mongo.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ MongoDB test failed
    echo.
    echo 🔧 Check your .env file MONGODB_URI setting
    echo Current setting:
    if exist .env (
        findstr "MONGODB_URI" .env
    ) else (
        echo .env file not found
    )
    pause
    exit /b 1
)

echo.
echo Step 5: Starting backend server...
echo.
echo 🎉 Setup complete! Starting server...
echo.
echo 📱 Frontend: http://localhost:5173
echo 🔧 Backend: http://localhost:5000
echo 🗄️  MongoDB: mongodb://localhost:27017/abhivriddhi
echo.
echo Press Ctrl+C to stop the server
echo.

npm run dev
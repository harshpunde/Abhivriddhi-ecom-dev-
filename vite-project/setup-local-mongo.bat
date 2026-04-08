@echo off
echo 🚀 Abhivriddhi Backend Setup with Local MongoDB
echo ================================================
echo.

echo 📋 Prerequisites Check:
echo.

echo 1. Checking Node.js installation...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Node.js not found!
    echo.
    echo 🔧 Please install Node.js from: https://nodejs.org/
    echo   - Download LTS version
    echo   - Run installer
    echo   - Restart this script
    echo.
    pause
    exit /b 1
)
echo ✅ Node.js found

echo.
echo 2. Checking MongoDB installation...
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB not found!
    echo.
    echo 🔧 Please install MongoDB:
    echo   1. Go to: https://www.mongodb.com/try/download/community
    echo   2. Download Windows MSI installer
    echo   3. Run installer with 'Complete' setup
    echo   4. Install MongoDB Compass (optional GUI)
    echo   5. Restart this script
    echo.
    pause
    exit /b 1
)
echo ✅ MongoDB found

echo.
echo 3. Checking MongoDB service...
net start | find "MongoDB" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB service not running
    echo.
    echo 🔧 Starting MongoDB service...
    net start MongoDB >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Failed to start MongoDB service
        echo.
        echo 🔧 Try running Command Prompt as Administrator, then:
        echo    net start MongoDB
        echo.
        pause
        exit /b 1
    )
    echo ✅ MongoDB service started
) else (
    echo ✅ MongoDB service is running
)

echo.
echo 4. Setting up backend directory...
if not exist backend (
    echo ❌ Backend directory not found!
    echo Please run this script from the project root directory
    pause
    exit /b 1
)
cd backend

echo.
echo 5. Installing dependencies...
if not exist node_modules (
    echo Installing npm packages...
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
echo 6. Checking environment configuration...
if not exist .env (
    echo ❌ .env file not found!
    echo.
    echo Creating default .env file...
    echo # Environment Configuration > .env
    echo NODE_ENV=development >> .env
    echo PORT=5000 >> .env
    echo MONGODB_URI=mongodb://localhost:27017/abhivriddhi >> .env
    echo JWT_SECRET=your_jwt_secret_key_change_in_production >> .env
    echo JWT_EXPIRE=7d >> .env
    echo EMAIL_HOST=smtp.gmail.com >> .env
    echo EMAIL_PORT=587 >> .env
    echo EMAIL_SECURE=false >> .env
    echo EMAIL_USER=your_email@gmail.com >> .env
    echo EMAIL_PASS=your_app_password >> .env
    echo TWILIO_ACCOUNT_SID=your_twilio_sid >> .env
    echo TWILIO_AUTH_TOKEN=your_twilio_token >> .env
    echo TWILIO_PHONE_NUMBER=+1234567890 >> .env
    echo FRONTEND_URL=http://localhost:5173 >> .env
    echo OTP_EXPIRE_MINUTES=10 >> .env
    echo OTP_LENGTH=6 >> .env
    echo ✅ Default .env file created
    echo.
    echo ⚠️  IMPORTANT: Update these values in .env:
    echo    - JWT_SECRET: Use a strong random string
    echo    - EMAIL_USER/PASS: Your Gmail credentials
    echo    - TWILIO_*: Your Twilio credentials (optional)
) else (
    echo ✅ .env file exists
)

echo.
echo 7. Testing MongoDB connection...
node test-mongo.js
if %errorlevel% neq 0 (
    echo.
    echo ❌ MongoDB connection test failed
    echo.
    echo 🔧 Possible solutions:
    echo 1. Check MongoDB service: net start MongoDB
    echo 2. Verify .env MONGODB_URI setting
    echo 3. Try MongoDB Compass to test connection
    echo.
    pause
    exit /b 1
)

echo.
echo 🎉 Setup complete! Starting backend server...
echo.
echo 📊 Services Status:
echo    ✅ Node.js
echo    ✅ MongoDB (Local)
echo    ✅ Backend Dependencies
echo    ✅ Database Connection
echo.
echo 🌐 URLs:
echo    Frontend: http://localhost:5173
echo    Backend:  http://localhost:5000
echo    MongoDB:  mongodb://localhost:27017/abhivriddhi
echo.
echo 🧪 Test API:
echo    curl http://localhost:5000/api/health
echo.
echo 🛑 Press Ctrl+C to stop the server
echo.

npm run dev
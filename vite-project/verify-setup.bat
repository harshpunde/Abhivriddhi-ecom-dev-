@echo off
echo 🔍 MongoDB Setup Verification
echo ============================
echo.

echo 1. Checking MongoDB installation...
where mongod >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB not installed
    echo Please install MongoDB first
    goto :end
)
echo ✅ MongoDB installed

echo.
echo 2. Checking MongoDB service...
net start | find "MongoDB" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ MongoDB service not running
    echo Starting service...
    net start MongoDB >nul 2>&1
    if %errorlevel% neq 0 (
        echo ❌ Failed to start MongoDB
        echo Try running as Administrator: net start MongoDB
        goto :end
    )
    echo ✅ MongoDB service started
) else (
    echo ✅ MongoDB service running
)

echo.
echo 3. Testing database connection...
cd backend
node test-mongo.js
if %errorlevel% neq 0 (
    echo ❌ Database connection failed
    goto :end
)

echo.
echo 4. Checking backend setup...
if not exist node_modules (
    echo ❌ Backend dependencies not installed
    echo Run: npm install
    goto :end
)
echo ✅ Backend dependencies installed

echo.
echo 🎉 Everything is ready!
echo.
echo 🚀 Run: setup-local-mongo.bat
echo    to start your backend server
echo.

:end
echo.
pause
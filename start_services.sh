#!/usr/bin/env bash

# Exit if any command fails
set -e

# Support running either from repo root or parent directory
if [ -d "apphill" ]; then
  APP_DIR="apphill"
  ML_SERVICE_DIR="ml_service"
elif [ -d "SMARTHILL-Application-BD/apphill" ]; then
  APP_DIR="SMARTHILL-Application-BD/apphill"
  ML_SERVICE_DIR="SMARTHILL-Application-BD/ml_service"
else
  echo "Error: Cannot locate apphill directory."
  exit 1
fi

echo "=========================================="
echo "Starting Backend Server (Port 3000)..."
echo "=========================================="
nohup node "$APP_DIR/backend/server.js" > "$APP_DIR/backend_server.log" 2>&1 &
BACKEND_PID=$!
echo "Backend started with PID: $BACKEND_PID"

echo ""
echo "=========================================="
echo "Starting ML Service (Port 5001)..."
echo "=========================================="
if [ -f "${ML_SERVICE_DIR}/venv/bin/activate" ]; then
  nohup bash -c "cd ${ML_SERVICE_DIR} && source venv/bin/activate && python app.py" > "${ML_SERVICE_DIR}/ml_service.log" 2>&1 &
else
  nohup bash -c "cd ${ML_SERVICE_DIR} && python3 app.py" > "${ML_SERVICE_DIR}/ml_service.log" 2>&1 &
fi
ML_PID=$!
echo "ML Service started with PID: $ML_PID"

echo ""
echo "=========================================="
echo "Starting Metro Bundler..."
echo "=========================================="
nohup bash -c "cd $APP_DIR && npx react-native start --reset-cache" > "$APP_DIR/metro_bundler.log" 2>&1 &
METRO_PID=$!
echo "Metro Bundler started with PID: $METRO_PID"

echo ""
echo "Waiting for services to initialize (5 seconds)..."
sleep 5

echo ""
echo "=========================================="
echo "Forwarding ports 3000 and 8081 for physical device..."
echo "=========================================="
adb reverse tcp:3000 tcp:3000 || echo "Port 3000 forwarding failed, is device connected?"
adb reverse tcp:8081 tcp:8081 || echo "Port 8081 forwarding failed, is device connected?"

echo "=========================================="
echo "Starting Android App..."
echo "=========================================="
echo "Make sure your Android Emulator is running or a device is connected."
(cd "$APP_DIR" && npm run android) || echo "⚠️ Could not auto-launch app (no device/emulator detected). Please start an emulator or connect a device and run 'npm run android'."

echo ""
echo "=========================================="
echo "To stop background services later, run:"
echo "kill $BACKEND_PID $ML_PID $METRO_PID"
echo "=========================================="

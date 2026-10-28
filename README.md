# 🌾 SmartHill (AppHill) — Smart Agriculture & Farm Marketplace

[![React Native](https://img.shields.io/badge/React%20Native-0.83.5-blue?logo=react&logoColor=white)](https://reactnative.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Node.js](https://img.shields.io/badge/Node.js-18+-green?logo=node.js&logoColor=white)](https://nodejs.org)
[![Python Flask](https://img.shields.io/badge/Python-Flask%20ML-yellow?logo=python&logoColor=white)](https://flask.palletsprojects.com)
[![AWS DynamoDB](https://img.shields.io/badge/Database-AWS%20DynamoDB-orange?logo=amazon-dynamodb&logoColor=white)](https://aws.amazon.com/dynamodb/)
[![IoT ThingSpeak](https://img.shields.io/badge/IoT-ThingSpeak%20REST-blue?logo=iot&logoColor=white)](https://thingspeak.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

**SmartHill** is an end-to-end smart agriculture ecosystem combining **IoT sensor telemetry**, **AI-driven crop recommendation**, **peer-to-peer tractor rental marketplace**, and **direct farm-to-consumer e-commerce**.

Built as a cross-platform mobile application powered by **React Native (Fabric / New Architecture)** in **TypeScript**, backed by an **Express.js API gateway**, a **Python scikit-learn microservice**, and **ThingSpeak IoT cloud integration**.

---

## 📑 Table of Contents
- [Architecture Overview](#-architecture-overview)
- [Key Features by Role](#-key-features-by-role)
- [Tech Stack](#-tech-stack)
- [Project Directory Structure](#-project-directory-structure)
- [Quick Start Guide](#-quick-start-guide)
- [Backend API Reference](#-backend-api-reference)
- [Machine Learning Microservice](#-machine-learning-microservice)
- [IoT & Telemetry Integration](#-iot--telemetry-integration)
- [Testing & Quality Assurance](#-testing--quality-assurance)

---

## 🏛️ Architecture Overview

```
                      +-----------------------------------+
                      |         SmartHill Mobile          |
                      |     React Native + TypeScript     |
                      |   (Fabric New Architecture / TSX) |
                      +-----------------+-----------------+
                                        |
                 +----------------------+----------------------+
                 | (HTTP REST :3000)                           | (ThingSpeak REST)
                 v                                             v
+-----------------------------------+        +-----------------------------------+
|       Express.js Backend API      |        |        ThingSpeak IoT Cloud       |
|    - Auth (Signup/Login/Roles)    |        |    - Channel 3232296 (Soil/NPK)   |
|    - Tractor Rental Engine        |        |    - Channel 3259969 (Controls)   |
|    - Farm Marketplace Orders      |        +-----------------------------------+
+--------+------------------+-------+
         |                  |
         | (Proxy :5001)    | (AWS SDK v3)
         v                  v
+------------------+  +-----------------------------------+
|  Python Flask ML |  |        Storage Layer              |
|  Crop Prediction |  |  - Primary: AWS DynamoDB          |
|  (RandomForest)  |  |  - Local Fallback: In-Memory RAM  |
+------------------+  +-----------------------------------+
```

---

## 👥 Key Features by Role

### 🌾 1. Farmer
* **IoT Farm Telemetry:** Live tracking of multi-node soil temperature, pH levels, NPK nutrient balance, and moisture directly from field sensors.
* **AI Crop Recommendation:** Real-time crop suggestions (confidence %, alternative crops, cultivation tips) based on Nitrogen, Phosphorus, Potassium, Temperature, Humidity, pH, and Rainfall.
* **Harvest Marketplace:** List harvested crops, fruits, and vegetables for direct sale to customers.
* **Tractor Rental:** Browse nearby tractors, view hourly rates, and submit rental booking requests.

### 🚜 2. Tractor Owner
* **Fleet Management:** Register and manage tractors (horsepower, model, hourly rate, location).
* **Booking Pipeline:** Real-time incoming rental requests with one-tap Accept / Reject workflow.
* **Schedule & Earnings:** Track active bookings, confirmed schedules, and rental income.

### 🛒 3. Customer
* **Direct Farm-to-Fork:** Browse fresh farm produce directly from verified farmers without middlemen.
* **Order Tracking:** Place orders and track fulfillment status (`Pending` ➔ `Confirmed` ➔ `Shipped`).
* **Equipment Rental:** Rent tractors and agricultural equipment for custom landscaping and heavy-duty tasks.

---

## 💻 Tech Stack

| Domain | Technology | Details |
| :--- | :--- | :--- |
| **Mobile App** | [React Native](https://reactnative.dev) `0.83.5` | Fabric New Architecture, TypeScript 5.0 |
| **Navigation** | [React Navigation](https://reactnavigation.org) `v7` | Native Stack + Bottom Tabs with isolated role flows |
| **UI & Styling** | Custom Design System | Dynamic safe area insets, dark status bar, typography scale |
| **Backend API** | [Node.js](https://nodejs.org) + [Express](https://expressjs.com) | Express REST API, CORS, AWS SDK v3 |
| **Database** | [AWS DynamoDB](https://aws.amazon.com/dynamodb/) | Tables: `Users`, `Tractors`, `Bookings`, `Products`, `Orders` |
| **ML Engine** | [Python 3](https://python.org) + [Flask](https://flask.palletsprojects.com) | scikit-learn (RandomForest, XGBoost), NumPy |
| **IoT Cloud** | [MathWorks ThingSpeak](https://thingspeak.com/) | REST API channels for sensor telemetry & actuator controls |
| **Testing** | [Jest](https://jestjs.io) | React Native Testing Library, NetInfo Native Mocks |

---

## 📂 Project Directory Structure

```text
SMARTHILL-Application-BD/
├── apphill/                         # React Native Mobile Application & Backend
│   ├── App.tsx                      # Root entry with SafeAreaProvider & dark StatusBar
│   ├── index.js                     # React Native app registration
│   ├── tsconfig.json                # TypeScript strict configuration
│   ├── jest.config.js               # Jest ESM transform & test setup
│   ├── jest.setup.js                # Native modules mock definitions
│   │
│   ├── backend/                     # Node.js Express Gateway
│   │   ├── server.js                # REST API routes, DynamoDB client & RAM fallback
│   │   └── package.json             # Backend dependencies
│   │
│   ├── src/                         # Mobile App TypeScript Source (.tsx)
│   │   ├── components/              # Shared UI components (ScreenHeader, AppCard, etc.)
│   │   ├── config/                  # AWS & AI Chatbot service configurations
│   │   ├── context/                 # AuthContext (user session state management)
│   │   ├── navigation/              # Role-based Stack & Tab Navigators
│   │   ├── screens/                 # Role-based Screens
│   │   │   ├── auth/                # LoginScreen, SignupScreen
│   │   │   ├── farmer/              # Dashboard, FarmData, CropPrediction, Sell, Tractors
│   │   │   ├── tractorOwner/        # Dashboard, RegisterTractor, MyTractors, Requests
│   │   │   ├── customer/            # Dashboard, BuyProducts, RentTractor, Orders
│   │   │   └── common/              # FAQ, Notifications, AIChatBoxScreen
│   │   ├── services/                # API client, ThingSpeak IoT & AI Chat services
│   │   └── theme/                   # Design tokens: colors, spacing, typography
│   │
│   └── android/                     # Native Android Gradle configuration
│
└── ml_service/                      # Python ML Microservice
    ├── app.py                       # Flask inference API (Port 5001)
    ├── model_random_forest.pkl      # Trained Random Forest classifier
    ├── model_xgboost.pkl            # Trained XGBoost classifier
    └── requirements.txt             # Python dependencies
```

---

## 🚀 Quick Start Guide

### 1. Prerequisites
* **Node.js** (v18 or higher) & **npm**
* **Python** (3.9+) with `pip`
* **Android Studio** & **Android SDK** (API 34/35)
* **ADB** configured in `$PATH`

### 2. Start All Services Automatically
The project includes a unified startup script that launches the Express backend, Python ML service, Metro bundler, and connects your physical Android phone:

```bash
# From the project root
./start_services.sh
```

### 3. Or Start Services Individually

#### A. Backend API (Port 3000)
```bash
cd apphill
node backend/server.js
# Health check: curl http://localhost:3000/test
```

#### B. ML Microservice (Port 5001)
```bash
cd ml_service
python3 -m venv venv && source venv/bin/activate
pip install -r requirements.txt
python app.py
# Health check: curl http://localhost:5001/health
```

#### C. React Native Metro & Mobile App
```bash
cd apphill
npm install

# Reverse ports for USB-connected Android device:
adb reverse tcp:3000 tcp:3000
adb reverse tcp:8081 tcp:8081

# Start Metro Bundler:
npx react-native start --reset-cache

# Build & launch on connected phone / emulator:
npm run android
```

---

## 📡 Backend API Reference

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/test` | Server health check (returns `SERVER OK`) |
| `POST` | `/signup` | Register new user (`farmer`, `tractor_owner`, `customer`) |
| `POST` | `/login` | Authenticate user with phone & password |
| `GET` | `/users` | List registered users with storage source indicator |
| `POST` | `/register-tractor` | List a tractor for rent |
| `GET` | `/tractors` | Fetch available tractors for rent |
| `POST` | `/book-tractor` | Submit a rental booking request |
| `GET` | `/bookings/:phone` | Get farmer / customer rental bookings |
| `GET` | `/owner-requests/:owner` | Get rental requests for a tractor owner |
| `POST` | `/update-booking` | Accept, reject, or complete a rental booking |
| `POST` | `/products` | List harvested crop produce for sale |
| `GET` | `/products` | Browse marketplace produce |
| `POST` | `/buy-product` | Place a crop purchase order |
| `GET` | `/orders/:phone` | Fetch order history |
| `POST` | `/predict-crop` | Proxy request to Flask ML prediction engine |
| `GET` | `/notifications/:userId` | Retrieve user notification alerts |

---

## 🤖 Machine Learning Microservice

The crop prediction microservice evaluates seven soil and environmental parameters:

* **Inputs:** `Nitrogen (N)`, `Phosphorus (P)`, `Potassium (K)`, `Temperature (°C)`, `Humidity (%)`, `Soil pH`, and `Rainfall (mm)`.
* **Model:** Pre-trained Random Forest Classifier (`model_random_forest.pkl`).
* **Supported Crops:** Rice, Maize, Chickpea, Kidneybeans, Pigeonpeas, Mungbean, Blackgram, Lentil, Pomegranate, Banana, Mango, Grapes, Watermelon, Muskmelon, Apple, Orange, Papaya, Coconut, Cotton, Jute, Coffee.
* **Response:** Predicted crop, confidence score, primary season (Kharif / Rabi / Zaid), cultivation tips, and alternative crop candidates.

---

## 🌐 IoT & Telemetry Integration

Telemetry is read directly from physical field sensors through MathWorks ThingSpeak:
* **Soil & Climate Telemetry:** `Channel ID: 3232296`
* **Irrigation & Motor Controls:** `Channel ID: 3259969`
* Telemetry attributes monitored: Soil temperature, environmental moisture, soil pH, NPK index, motor/valve statuses.

---

## 🧪 Testing & Quality Assurance

All 51 migrated source files compile with strict TypeScript checks:

```bash
cd apphill

# Run TypeScript compiler check (0 errors):
npx tsc --noEmit

# Run ESLint (0 errors):
npm run lint

# Run Jest unit test suite:
npm test
```

---

## 📄 License
This project is licensed under the [MIT License](LICENSE).

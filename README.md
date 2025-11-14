# Security Home Dashboard

Modern dark mode web dashboard for IoT-based home security system with ESP32, gas sensor, PIR motion sensor, ESP32-CAM, and alarm integration.

## Features

### 🎯 Admin-Only System

- Single administrator access (no multi-role needed)
- Simple authentication flow
- Secure session management

### 📊 Dashboard Pages

#### 1. Dashboard

- **System Mode Toggle**: Arm/Disarm security system
- **Real-time Gas Level**: Live PPM reading with color-coded status (Safe/Warning/Danger)
- **PIR Motion Sensor**: Motion detection status
- **Alarm Status**: Current alarm state
- **Camera Control**: Take manual snapshots
- **Latest Snapshot Preview**: Quick view with full-screen modal
- **Recent Activity**: Last alarm events

#### 2. Alarms (History)

- Comprehensive alarm history table
- Filter by type (Gas/PIR/RFID), severity, and date range
- Each alarm includes:
  - Timestamp
  - Type and severity
  - Description message
  - Snapshot thumbnail (if available)
- Detailed view modal with full metadata and full-size image
- Pagination support

#### 3. Snapshots (Gallery)

- Grid view of all captured snapshots
- Stats: Total snapshots, today's count, storage used
- Filter by date range and sort options
- Trigger type badges (Manual/Alarm/Auto)
- Full-screen image viewer
- Download and delete functionality
- Pagination for large collections

#### 4. Settings

- **Safety Settings**:
  - Gas threshold (PPM)
  - Alarm hold-off time (seconds)
- **Camera Settings**:
  - Auto snapshot on alarm toggle
  - Snapshot retention period
- **Notification Settings**:
  - Telegram Chat ID configuration
  - Individual toggles for Gas/Motion/RFID alerts
- **System Information**: Version, status, connectivity
- **Danger Zone**: Clear history, factory reset

### 🎨 Design

- **Dark Mode**: Modern minimalist dark theme (gray-950/900 background)
- **Blue Accents**: Primary color scheme matching the reference design
- **Card-Based Layout**: Clean, organized UI components
- **Left Sidebar Navigation**: Persistent navigation with active states
- **Responsive**: Mobile-friendly design
- **Icon-Based**: Lucide icons for clarity

## Tech Stack

### Frontend

- **Vue 3** - Progressive JavaScript framework
- **Vue Router** - Client-side routing
- **Tailwind CSS 4** - Utility-first CSS framework
- **Lucide Vue** - Beautiful icon library
- **Chart.js & Vue-ChartJS** - Data visualization

### Backend Integration

- **Firebase**:
  - Authentication (single admin)
  - Firestore (settings, alarms, snapshots metadata)
  - Storage (optional for backup)
- **MQTT** (over WebSocket):
  - Real-time telemetry from ESP32
  - Alarm notifications
  - Command publishing
- **Node-RED**:
  - MQTT message processing
  - Snapshot handling (POST endpoint)
  - API endpoints for commands

### Hardware (ESP32 + Sensors)

- **ESP32**: Main controller with MQTT TLS client
- **MQ-2 Gas Sensor**: Gas level detection (PPM)
- **PIR Motion Sensor**: Motion detection
- **ESP32-CAM**: Snapshot capture
- **RFID Reader**: Access control
- **Buzzer/Alarm**: Audio alert

## Installation

### 1. Clone Repository

```bash
git clone <your-repo-url>
cd Dashboard-Smart-Home-Iot
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Configuration

Copy `.env.example` to `.env` and configure:

```env
# Firebase
VITE_FIREBASE_API_KEY=your-api-key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef

# MQTT
VITE_MQTT_HOST=mqtt.example.com
VITE_MQTT_PORT=8883
VITE_MQTT_WS_PORT=8083
VITE_MQTT_USER=mqtt_user
VITE_MQTT_PASSWORD=yourpassword

# Node-RED
VITE_NODE_RED_URL=https://node-red.local:1880
VITE_NODE_RED_AUTH_TOKEN=your-token

# Defaults
VITE_GAS_THRESHOLD_DEFAULT=400
VITE_ALARM_HOLD_OFF_DEFAULT=30
VITE_AUTO_SNAPSHOT_DEFAULT=true
```

### 4. Firebase Setup

1. Create a Firebase project
2. Enable Authentication (Email/Password)
3. Create Firestore database with collections:
   - `settings/global`
   - `alarms/{alarmId}`
   - `snapshots/{snapshotId}`
   - `status/last`
4. Set Firestore rules:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### 5. MQTT Broker Setup

- Use MQTT broker with TLS (port 8883)
- Enable WebSocket (WSS on port 8083)
- Configure user credentials

### 6. Node-RED Setup

Install required flows:

- MQTT input nodes (subscribe to device topics)
- Snapshot POST endpoint
- Command publish endpoint
- Firestore integration nodes

## Development

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Usage

### Default Login

- **Email**: `admin@security.com`
- **Password**: `admin123`

### MQTT Topics Structure

```
devices/{deviceId}/telemetry    # Gas level, PIR status
devices/{deviceId}/alarm        # Alarm events
devices/{deviceId}/snapshot     # Snapshot metadata
control/{deviceId}/command      # System commands (arm/disarm)
```

### API Endpoints (Node-RED)

```
POST /api/snapshot              # Trigger snapshot capture
POST /api/command               # Send system command
GET  /api/status                # Get current status
```

## Data Flow

```
ESP32 Sensors → MQTT (TLS) → Node-RED → Firebase Firestore
                    ↓                          ↓
              WebSocket/WSS              Web Dashboard
                    ↓                          ↓
              Real-time Updates ←──────────────┘
```

## Project Structure

```
src/
├── components/
│   └── Layout.vue           # Main layout with sidebar
├── views/
│   ├── Login.vue            # Authentication page
│   ├── Dashboard.vue        # Main dashboard
│   ├── Alarms.vue           # Alarm history
│   ├── Snapshots.vue        # Snapshot gallery
│   └── Settings.vue         # Configuration
├── services/
│   ├── firebase.js          # Firebase initialization
│   └── mqtt.js              # MQTT WebSocket client
├── router/
│   └── router.js            # Route configuration
└── main.js                  # App entry point
```

## Security Considerations

1. **Authentication**: Use Firebase Auth for secure login
2. **MQTT TLS**: Always use encrypted MQTT connection
3. **API Tokens**: Secure Node-RED endpoints with tokens
4. **Firestore Rules**: Restrict access to authenticated users only
5. **Environment Variables**: Never commit `.env` file

## Customization

### Change Theme Colors

Edit Tailwind configuration or use Tailwind classes:

- Primary: `blue-500`, `blue-600`, `blue-700`
- Background: `gray-950`, `gray-900`, `gray-800`
- Accent: Modify button and card styles

### Add New Sensors

1. Update Dashboard.vue to add new sensor cards
2. Subscribe to new MQTT topics in mqtt.js
3. Add to Firestore schema if persistent storage needed

## Troubleshooting

### MQTT Connection Issues

- Check WebSocket URL and port (WSS on 8083)
- Verify credentials in `.env`
- Ensure MQTT broker allows WebSocket connections

### Firebase Errors

- Verify all Firebase config values in `.env`
- Check Firestore rules allow authenticated access
- Ensure Firebase project is active

### Snapshot Not Loading

- Check Node-RED snapshot endpoint is accessible
- Verify image URLs are correct and accessible
- Check CORS settings on Node-RED

## License

MIT

## Support

For issues and questions, please create an issue in the repository.

---

**Built with ❤️ for IoT Home Security**

# Project Architecture

## 📁 Directory Structure

```
Dashboard-Smart-Home-Iot/
├── public/                      # Static assets
├── src/
│   ├── assets/                  # Images, fonts, etc.
│   ├── components/
│   │   └── Layout.vue          # Main layout with sidebar navigation
│   ├── services/
│   │   ├── firebase.js         # Firebase initialization & config
│   │   └── mqtt.js             # MQTT WebSocket client service
│   ├── router/
│   │   ├── index.js            # (empty - legacy)
│   │   └── router.js           # Vue Router configuration
│   ├── views/
│   │   ├── Login.vue           # Authentication page
│   │   ├── Dashboard.vue       # Main dashboard (renamed from Overview)
│   │   ├── Alarms.vue          # Alarm history & details
│   │   ├── Snapshots.vue       # Camera snapshot gallery (new)
│   │   └── Settings.vue        # System configuration
│   ├── App.vue                 # Root component
│   ├── main.js                 # Application entry point
│   └── style.css               # Global styles
├── .env.example                # Environment variables template
├── .gitignore                  # Git ignore rules
├── index.html                  # HTML entry point
├── package.json                # Dependencies & scripts
├── vite.config.js              # Vite configuration
├── README.md                   # Full documentation
└── SETUP.md                    # Quick start guide
```

## 🔧 Key Components

### Layout.vue

**Purpose**: Main application shell with navigation

- Dark mode sidebar with logo
- Navigation menu (Dashboard, Alarms, Snapshots, Settings)
- User profile section
- Logout functionality
- Responsive mobile menu

### Dashboard.vue (Main Page)

**Features**:

- System mode toggle (Armed/Disarmed)
- Real-time sensor cards:
  - Gas level with color-coded status
  - PIR motion detection
  - Alarm status
- Camera controls:
  - Manual snapshot button
  - Latest snapshot preview
  - Full-screen image modal
- Recent activity feed
- Live clock/timestamp

**Data Sources**:

- MQTT subscriptions for real-time data
- Firestore for historical data
- LocalStorage for offline mode

### Alarms.vue

**Features**:

- Sortable/filterable table
- Alarm metadata display
- Snapshot thumbnails
- Detail modal with full image
- Pagination

**Data Structure**:

```javascript
{
  id: 'alarm-001',
  timestamp: '2024-11-14T10:30:00Z',
  type: 'GAS' | 'PIR' | 'RFID',
  severity: 'HIGH' | 'MEDIUM' | 'LOW',
  message: 'Description',
  thumbnailUrl: 'path/to/thumb.jpg',
  imageUrl: 'path/to/full.jpg',
  metadata: { /* custom fields */ }
}
```

### Snapshots.vue (New)

**Features**:

- Grid gallery view
- Statistics cards
- Manual snapshot capture
- Download & delete actions
- Date filtering
- Full-screen viewer

**Data Structure**:

```javascript
{
  id: 'snapshot-001',
  timestamp: '2024-11-14T10:30:00Z',
  thumbnailUrl: 'path/to/thumb.jpg',
  imageUrl: 'path/to/full.jpg',
  triggerType: 'MANUAL' | 'ALARM' | 'AUTO',
  description: 'Optional description'
}
```

### Settings.vue

**Sections**:

1. **Safety Settings**:
   - Gas threshold (PPM)
   - Alarm hold-off (seconds)
2. **Camera Settings**:
   - Auto snapshot toggle
   - Retention period (days)
3. **Notifications**:
   - Telegram Chat ID
   - Alert toggles (Gas/Motion/RFID)
4. **System Info**:
   - Version
   - Connection status
   - Last updated
5. **Danger Zone**:
   - Clear all data
   - Factory reset

## 🔌 Services

### firebase.js

**Responsibilities**:

- Initialize Firebase app
- Export db, auth, storage instances
- Graceful fallback if not configured

**Usage**:

```javascript
import { db } from "@/services/firebase";
import { collection, getDocs } from "firebase/firestore";

const alarms = await getDocs(collection(db, "alarms"));
```

### mqtt.js

**Responsibilities**:

- Singleton MQTT client
- WebSocket connection management
- Topic subscription/unsubscription
- Message publishing
- Event handling

**Usage**:

```javascript
import mqttService from "@/services/mqtt";

// Connect
await mqttService.connect();

// Subscribe
mqttService.subscribe("devices/esp32/telemetry", (data) => {
  console.log("Gas level:", data.gas_ppm);
});

// Publish
mqttService.publish("control/esp32/command", {
  action: "arm",
  timestamp: Date.now(),
});
```

## 🛣️ Routing

### Route Configuration

```javascript
/                    → redirect to /login
/login               → Login.vue (public)
/                    → Layout wrapper (authenticated)
  ├─ /dashboard      → Dashboard.vue
  ├─ /alarms         → Alarms.vue
  ├─ /snapshots      → Snapshots.vue
  └─ /settings       → Settings.vue
```

### Navigation Guards

- Check for `authToken` in localStorage
- Redirect to login if not authenticated
- Redirect to dashboard if already logged in

## 📊 State Management

Currently using **Vue Composition API** with local state:

- `ref()` for reactive data
- `computed()` for derived state
- `onMounted()` / `onUnmounted()` for lifecycle

**No Vuex/Pinia** needed for single-admin app.

### Data Persistence

1. **LocalStorage**: Settings, auth token, user preferences
2. **Firestore**: Alarms, snapshots metadata, global settings
3. **MQTT**: Real-time telemetry (ephemeral)

## 🎨 Styling

### Tailwind CSS 4

**Color Palette**:

- Background: `gray-950`, `gray-900`, `gray-800`
- Text: `white`, `gray-400`, `gray-300`
- Primary: `blue-600`, `blue-500`, `blue-700`
- Success: `green-500`
- Warning: `yellow-500`
- Danger: `red-500`

**Key Classes**:

- Cards: `bg-gray-900 border border-gray-800 rounded-xl p-6`
- Buttons: `bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg`
- Inputs: `bg-gray-800 border-gray-700 text-white rounded-lg px-4 py-3`

### Icons

**Lucide Vue** - Imported as needed:

```javascript
import { Home, Shield, Camera, Settings } from "lucide-vue-next";
```

## 🔐 Security

### Authentication Flow

1. User enters credentials
2. Validate against Firebase Auth (or mock for demo)
3. Store token in localStorage
4. Router guard checks token on each navigation
5. Logout clears token

### API Security

- MQTT: TLS encryption + username/password
- Firebase: Authentication required for all operations
- Node-RED: Bearer token authentication

## 📡 Real-time Updates

### MQTT Topics (Subscribe)

```
devices/{deviceId}/telemetry
devices/{deviceId}/alarm
devices/{deviceId}/snapshot
```

### MQTT Topics (Publish)

```
control/{deviceId}/command
```

### Data Flow

```
ESP32 → MQTT Broker → WebSocket → Dashboard (Live)
ESP32 → MQTT → Node-RED → Firestore → Dashboard (Historical)
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

Output: `dist/` folder

### Hosting Options

1. **Vercel** (Recommended)

   - Auto SSL
   - Zero config
   - Free tier

2. **Netlify**

   - Similar to Vercel
   - Good for Vue apps

3. **Firebase Hosting**
   - Integrated with Firebase
   - Global CDN

### Environment Variables

Set in hosting platform:

- Vercel: Project Settings → Environment Variables
- Netlify: Site Settings → Build & Deploy → Environment
- Firebase: `.env.production` file

## 📈 Future Enhancements

1. **Real-time Dashboard**:
   - Live charts with Chart.js
   - Historical trends
2. **Advanced Notifications**:
   - Push notifications
   - Email alerts
3. **Multi-camera Support**:
   - Multiple ESP32-CAM
   - Camera switching
4. **Data Export**:
   - CSV/PDF reports
   - Analytics dashboard

---

**Architecture designed for scalability and maintainability** 🏗️

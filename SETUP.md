# Quick Setup Guide

## 🚀 Getting Started (5 Minutes)

### Step 1: Install Dependencies

```bash
npm install
```

### Step 2: Create Environment File

Copy `.env.example` to `.env`:

```bash
cp .env.example .env
```

Or on Windows:

```powershell
Copy-Item .env.example .env
```

### Step 3: Run Development Server

```bash
npm run dev
```

### Step 4: Login

Open http://localhost:5173 in your browser

**Default Credentials:**

- Email: `admin@security.com`
- Password: `admin123`

## ⚙️ Configuration (Optional)

### For Demo/Development Mode

The app works out of the box with:

- ✅ Mock data for all features
- ✅ Local storage for settings
- ✅ Simulated real-time updates

**No Firebase or MQTT setup required for testing!**

### For Production Mode

#### 1. Firebase Setup

1. Go to https://console.firebase.google.com
2. Create a new project
3. Enable Authentication → Email/Password
4. Create Firestore Database
5. Copy config values to `.env`:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   ```

#### 2. MQTT Setup

Update in `.env`:

```env
VITE_MQTT_HOST=your-mqtt-broker.com
VITE_MQTT_WS_PORT=8083
VITE_MQTT_USER=your-username
VITE_MQTT_PASSWORD=your-password
```

#### 3. Node-RED Setup

```env
VITE_NODE_RED_URL=http://your-node-red:1880
VITE_NODE_RED_AUTH_TOKEN=your-token
```

## 📱 Pages Overview

### 1. Dashboard (`/dashboard`)

- System arm/disarm toggle
- Real-time sensor readings (Gas PPM, PIR motion)
- Alarm status
- Camera snapshot control
- Recent activity feed

### 2. Alarms (`/alarms`)

- Complete alarm history
- Filters: type, severity, date range
- Click any row to see details
- Snapshot thumbnails

### 3. Snapshots (`/snapshots`)

- Image gallery view
- Take new snapshots
- Download/delete images
- Automatic retention management

### 4. Settings (`/settings`)

- Safety thresholds (gas level, hold-off time)
- Camera auto-snapshot toggle
- Telegram notifications
- System info

## 🎨 Customization

### Change Colors

Edit in component files or use Tailwind classes:

- Primary: `blue-600` → `purple-600` (or any color)
- Background: `gray-950` → `slate-950` (or darker)

### Add Features

1. Create new component in `src/views/`
2. Add route in `src/router/router.js`
3. Add menu item in `src/components/Layout.vue`

## 🐛 Common Issues

### Port Already in Use

```bash
# Change port in package.json or run:
npm run dev -- --port 3000
```

### Module Not Found

```bash
# Clear cache and reinstall:
rm -rf node_modules package-lock.json
npm install
```

### Dark Mode Not Working

Check if Tailwind v4 is properly configured in `vite.config.js`

## 📝 Next Steps

1. **Connect Hardware**: Setup ESP32 with MQTT
2. **Deploy**: Build and host on Vercel/Netlify
3. **Secure**: Setup proper Firebase authentication
4. **Optimize**: Add caching, lazy loading

## 🆘 Need Help?

Check the full README.md for detailed documentation.

---

**Happy Coding! 🎉**

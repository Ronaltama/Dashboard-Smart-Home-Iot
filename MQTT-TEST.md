# MQTT Test Guide

## 🔌 Konfigurasi MQTT Aktif

```
Broker: broker.mqtt-dashboard.com
Port: 1883 (TCP)
WebSocket: 8000
Username: ronal
Password: ronaltama12345
```

## 🧪 Test Koneksi MQTT

### 1. Dari Dashboard Vue

Buka browser console (`F12`) setelah login, seharusnya muncul:

```
✅ MQTT connected successfully
```

### 2. Test Subscribe Topic

Di file `Dashboard.vue`, tambahkan di `onMounted`:

```javascript
import mqttService from "@/services/mqtt";

onMounted(async () => {
  // Connect to MQTT
  try {
    await mqttService.connect();

    // Subscribe to test topic
    mqttService.subscribe("test/topic", (message) => {
      console.log("Received:", message);
    });

    // Subscribe to sensor data
    mqttService.subscribe("devices/esp32/telemetry", (data) => {
      console.log("Sensor data:", data);
      // Update UI dengan data sensor
      gasLevel.value = data.gas_ppm || 0;
      motionDetected.value = data.motion || false;
    });
  } catch (error) {
    console.error("MQTT connection failed:", error);
  }
});
```

### 3. Test Publish Data

```javascript
// Kirim command ke ESP32
mqttService.publish("control/esp32/command", {
  action: "arm",
  timestamp: Date.now(),
});
```

### 4. Test dengan MQTT Client External

Gunakan MQTT.fx atau MQTTX untuk test:

**Subscribe:**

```
Topic: devices/esp32/telemetry
```

**Publish:**

```
Topic: devices/esp32/telemetry
Message: {"gas_ppm": 350, "motion": true}
```

## 📋 Topic Structure yang Disarankan

```
devices/esp32/telemetry      → Data sensor (gas, PIR, dll)
devices/esp32/alarm          → Alarm events
devices/esp32/snapshot       → Snapshot metadata
control/esp32/command        → Control commands (arm/disarm)
control/esp32/response       → Command responses
```

## 🎨 Theme Toggle

Sekarang ada tombol theme (Sun/Moon) di header kanan atas:

- ☀️ Sun icon = Dark mode aktif (klik untuk Light mode)
- 🌙 Moon icon = Light mode aktif (klik untuk Dark mode)

Tema tersimpan di localStorage, jadi akan tetap sama setelah refresh.

## ✅ Checklist

- [x] MQTT configuration updated
- [x] WebSocket protocol changed to `ws://`
- [x] Broker: broker.mqtt-dashboard.com:8000
- [x] Credentials configured
- [x] Theme toggle added to Layout
- [x] Dark/Light mode support in all pages
- [x] Theme preference saved to localStorage

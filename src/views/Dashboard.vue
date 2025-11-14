<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1
        :class="[
          'text-3xl font-bold',
          isDarkMode ? 'text-white' : 'text-gray-900',
        ]"
      >
        Dashboard
      </h1>
      <div :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
        {{ currentTime }}
      </div>
    </div>

    <!-- Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- System Mode -->
      <div
        :class="[
          'rounded-xl p-6 border',
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between mb-4">
          <Shield
            :class="[
              'h-8 w-8',
              systemMode === 'ARMED' ? 'text-red-500' : 'text-green-500',
            ]"
          />
          <button
            @click="toggleSystemMode"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              systemMode === 'ARMED' ? 'bg-red-500' : 'bg-gray-600',
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                systemMode === 'ARMED' ? 'translate-x-6' : 'translate-x-1',
              ]"
            ></span>
          </button>
        </div>
        <p
          :class="[
            'text-2xl font-bold mb-1',
            isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ systemMode }}
        </p>
        <p :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          System Mode
        </p>
      </div>

      <!-- Gas Level -->
      <div
        :class="[
          'rounded-xl p-6 border',
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between mb-4">
          <AlertTriangle
            :class="[
              'h-8 w-8',
              gasStatus === 'DANGER'
                ? 'text-red-500'
                : gasStatus === 'WARNING'
                ? 'text-yellow-500'
                : 'text-green-500',
            ]"
          />
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              gasStatus === 'DANGER'
                ? 'bg-red-500/20 text-red-400'
                : gasStatus === 'WARNING'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-green-500/20 text-green-400',
            ]"
          >
            {{ gasStatus }}
          </span>
        </div>
        <p
          :class="[
            'text-2xl font-bold mb-1',
            isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ gasLevel || "-" }} {{ gasLevel ? "PPM" : "" }}
        </p>
        <p :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          Gas Level
        </p>
      </div>

      <!-- Motion -->
      <div
        :class="[
          'rounded-xl p-6 border',
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between mb-4">
          <Activity
            :class="[
              'h-8 w-8',
              motionDetected ? 'text-red-500' : 'text-gray-500',
            ]"
          />
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              motionDetected
                ? 'bg-red-500/20 text-red-400'
                : 'bg-gray-500/20 text-gray-400',
            ]"
          >
            {{ motionDetected ? "DETECTED" : "CLEAR" }}
          </span>
        </div>
        <p
          :class="[
            'text-2xl font-bold mb-1',
            isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ motionDetected ? "Motion" : "No Motion" }}
        </p>
        <p :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          PIR Sensor
        </p>
      </div>

      <!-- Alarm -->
      <div
        :class="[
          'rounded-xl p-6 border',
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between mb-4">
          <Bell
            :class="[
              'h-8 w-8',
              alarmActive ? 'text-red-500 animate-pulse' : 'text-gray-500',
            ]"
          />
          <span
            :class="[
              'px-3 py-1 rounded-full text-xs font-semibold',
              alarmActive
                ? 'bg-red-500/20 text-red-400'
                : 'bg-gray-500/20 text-gray-400',
            ]"
          >
            {{ alarmActive ? "ACTIVE" : "IDLE" }}
          </span>
        </div>
        <p
          :class="[
            'text-2xl font-bold mb-1',
            isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
        >
          {{ alarmActive ? "Alarming" : "Normal" }}
        </p>
        <p :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
          Alarm Status
        </p>
      </div>
    </div>

    <!-- Camera & Activity -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Camera -->
      <div
        :class="[
          'rounded-xl p-6 border',
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200',
        ]"
      >
        <h2
          :class="[
            'text-xl font-semibold mb-4',
            isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
        >
          Camera
        </h2>
        <button
          @click="takeSnapshot"
          :disabled="loading"
          class="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 text-white py-3 rounded-lg mb-4"
        >
          {{ loading ? "Taking..." : "Take Snapshot" }}
        </button>
        <div
          :class="[
            'w-full h-48 rounded-lg flex items-center justify-center border-2 border-dashed',
            isDarkMode
              ? 'border-gray-700 text-gray-500'
              : 'border-gray-300 text-gray-400',
          ]"
        >
          <div class="text-center">
            <Camera class="h-12 w-12 mx-auto mb-2" />
            <p class="text-sm">{{ snapshotText }}</p>
          </div>
        </div>
      </div>

      <!-- Activity -->
      <div
        :class="[
          'rounded-xl p-6 border',
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between mb-4">
          <h2
            :class="[
              'text-xl font-semibold',
              isDarkMode ? 'text-white' : 'text-gray-900',
            ]"
          >
            Recent Activity
          </h2>
          <router-link to="/alarms" class="text-sm text-blue-500"
            >View All</router-link
          >
        </div>
        <div class="space-y-3">
          <div
            v-for="activity in activities"
            :key="activity.id"
            :class="[
              'p-4 rounded-lg flex items-center space-x-3',
              isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50',
            ]"
          >
            <div
              :class="[
                'p-2 rounded-lg',
                activity.type === 'GAS'
                  ? 'bg-red-500/20'
                  : activity.type === 'PIR'
                  ? 'bg-yellow-500/20'
                  : 'bg-blue-500/20',
              ]"
            >
              <component
                :is="
                  activity.type === 'GAS'
                    ? AlertTriangle
                    : activity.type === 'PIR'
                    ? Activity
                    : Bell
                "
                :class="[
                  'h-5 w-5',
                  activity.type === 'GAS'
                    ? 'text-red-400'
                    : activity.type === 'PIR'
                    ? 'text-yellow-400'
                    : 'text-blue-400',
                ]"
              />
            </div>
            <div class="flex-1">
              <p
                :class="[
                  'font-medium',
                  isDarkMode ? 'text-white' : 'text-gray-900',
                ]"
              >
                {{ activity.message }}
              </p>
              <p
                :class="[
                  'text-sm',
                  isDarkMode ? 'text-gray-400' : 'text-gray-600',
                ]"
              >
                {{ activity.time }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, computed } from "vue";
import { Shield, AlertTriangle, Activity, Bell, Camera } from "lucide-vue-next";

// Inject theme
const isDarkMode = inject("isDarkMode", ref(true));

// State
const systemMode = ref("DISARMED");
const gasLevel = ref(0);
const motionDetected = ref(false);
const alarmActive = ref(false);
const currentTime = ref("");
const loading = ref(false);
const snapshotText = ref("-");
const activities = ref([]);

// Computed
const gasStatus = computed(() => {
  if (gasLevel.value >= 400) return "DANGER";
  if (gasLevel.value >= 200) return "WARNING";
  return "SAFE";
});

// Methods
const toggleSystemMode = () => {
  systemMode.value = systemMode.value === "ARMED" ? "DISARMED" : "ARMED";
};

const takeSnapshot = async () => {
  loading.value = true;
  await new Promise((r) => setTimeout(r, 1500));
  snapshotText.value = `Captured at ${new Date().toLocaleTimeString()}`;
  loading.value = false;
};

const updateTime = () => {
  currentTime.value = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
};

// TODO: Subscribe to MQTT topics for real-time sensor data
// import { mqttClient } from "../services/mqtt";
// mqttClient.subscribe('devices/esp32/gas', (message) => {
//   gasLevel.value = parseInt(message);
// });
// mqttClient.subscribe('devices/esp32/pir', (message) => {
//   motionDetected.value = message === '1' || message === 'true';
// });
// mqttClient.subscribe('devices/esp32/alarm', (message) => {
//   alarmActive.value = message === '1' || message === 'true';
// });

// Fetch recent activities from Firestore
const fetchActivities = async () => {
  try {
    // TODO: Uncomment when Firestore is ready
    // const q = query(collection(db, 'alarms'), orderBy('timestamp', 'desc'), limit(3));
    // const querySnapshot = await getDocs(q);
    // activities.value = querySnapshot.docs.map(doc => ({
    //   id: doc.id,
    //   type: doc.data().type,
    //   message: doc.data().message,
    //   time: formatRelativeTime(doc.data().timestamp)
    // }));
    console.log("TODO: Fetch activities from Firestore");
  } catch (error) {
    console.error("Error fetching activities:", error);
  }
};

let timeInterval;

onMounted(() => {
  updateTime();
  fetchActivities();
  timeInterval = setInterval(updateTime, 1000);

  // TODO: Initialize MQTT subscriptions here
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);

  // TODO: Unsubscribe from MQTT topics
  // mqttClient.unsubscribe('devices/esp32/gas');
  // mqttClient.unsubscribe('devices/esp32/pir');
  // mqttClient.unsubscribe('devices/esp32/alarm');
});
</script>

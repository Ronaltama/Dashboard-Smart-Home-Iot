<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
      <h1
        :class="[
          'text-2xl md:text-4xl font-bold tracking-tight',
          isDarkMode ? 'text-white' : 'text-gray-900',
        ]"
      >
        History
      </h1>
      <button
        @click="downloadJson"
        :class="[
          'px-4 py-2 rounded-xl text-sm font-bold tracking-wide transition-all duration-300 shadow-lg self-start md:self-auto',
          isDarkMode
            ? 'bg-blue-600 hover:bg-blue-500 text-white shadow-blue-500/30'
            : 'bg-blue-500 hover:bg-blue-600 text-white shadow-blue-500/30',
        ]"
      >
        Download JSON
      </button>
    </div>

    <!-- History Table -->
    <div
      :class="[
        'rounded-3xl border overflow-hidden backdrop-blur-md',
        isDarkMode ? 'glass-card border-white/10' : 'bg-white border-gray-200 shadow-xl',
      ]"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead
            :class="[
              'text-left text-xs font-bold uppercase tracking-wider border-b',
              isDarkMode
                ? 'bg-white/5 text-gray-400 border-white/10'
                : 'bg-gray-50 text-gray-500 border-gray-200',
            ]"
          >
            <tr>
              <th class="px-6 py-4 whitespace-nowrap">Time</th>
              <th class="px-6 py-4 whitespace-nowrap">Type</th>
              <th class="px-6 py-4 whitespace-nowrap">Event</th>
              <th class="px-6 py-4 whitespace-nowrap">Details</th>
            </tr>
          </thead>
          <tbody
            :class="[
              'divide-y',
              isDarkMode ? 'divide-white/5' : 'divide-gray-100',
            ]"
          >
            <tr
              v-for="(event, index) in history"
              :key="index"
              :class="[
                'transition-colors duration-200',
                isDarkMode ? 'hover:bg-white/5' : 'hover:bg-gray-50',
              ]"
            >
              <td
                :class="[
                  'px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium',
                  isDarkMode ? 'text-gray-300' : 'text-gray-600',
                ]"
              >
                {{ formatDate(event.timestamp) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-3 py-1 text-[10px] md:text-xs font-bold rounded-full border',
                    event.type === 'ALARM'
                      ? 'bg-white/10 text-white border-white/20'
                      : 'bg-blue-500/10 text-blue-400 border-blue-500/20',
                  ]"
                >
                  {{ event.type }}
                </span>
              </td>
              <td
                :class="[
                  'px-6 py-4 whitespace-nowrap text-xs md:text-sm font-medium',
                  isDarkMode ? 'text-white' : 'text-gray-900',
                ]"
              >
                {{ event.message }}
              </td>
              <td
                :class="[
                  'px-6 py-4 whitespace-nowrap text-xs md:text-sm',
                  isDarkMode ? 'text-gray-400' : 'text-gray-500',
                ]"
              >
                {{ event.payload }}
              </td>
            </tr>
            <tr v-if="history.length === 0">
              <td
                colspan="4"
                class="px-6 py-12 text-center text-sm text-gray-500"
              >
                No history available
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted } from "vue";
import mqttService from "../services/mqtt";

const isDarkMode = inject("isDarkMode", ref(true));
const history = ref([]);
const STORAGE_KEY = "iot_history";
const RETENTION_DAYS = 7;

// Methods
const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const loadHistory = () => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      // Filter out old events
      const cutoff = new Date();
      cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
      
      history.value = parsed.filter(e => new Date(e.timestamp) > cutoff);
      
      // Save back if we filtered anything
      if (history.value.length !== parsed.length) {
        saveHistory();
      }
      
      // Sort by newest first
      history.value.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
    }
  } catch (e) {
    console.error("Failed to load history", e);
  }
};

const saveHistory = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(history.value));
};

const addEvent = (type, message, payload) => {
  const event = {
    timestamp: new Date().toISOString(),
    type,
    message,
    payload
  };
  
  history.value.unshift(event);
  
  // Clean up old events periodically or on add
  const cutoff = new Date();
  cutoff.setDate(cutoff.getDate() - RETENTION_DAYS);
  history.value = history.value.filter(e => new Date(e.timestamp) > cutoff);
  
  saveHistory();
};

const downloadJson = () => {
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(history.value, null, 2));
  const downloadAnchorNode = document.createElement('a');
  downloadAnchorNode.setAttribute("href", dataStr);
  downloadAnchorNode.setAttribute("download", "iot_history.json");
  document.body.appendChild(downloadAnchorNode); // required for firefox
  downloadAnchorNode.click();
  downloadAnchorNode.remove();
};

// MQTT Handlers
const handleAlarmStatus = (message) => {
  // Only log changes or specific states if needed. 
  // For now, logging every status message as an event might be too much if it sends periodically.
  // Assuming it sends on change.
  addEvent("ALARM", "Alarm Status Update", message.toString());
};

const handleRfid = (message) => {
  addEvent("RFID", "RFID Tag Detected", message.toString());
};

onMounted(async () => {
  loadHistory();
  
  try {
    await mqttService.connect();
    mqttService.subscribe("status/alarm", handleAlarmStatus);
    mqttService.subscribe("rfid", handleRfid);
  } catch (e) {
    console.error("MQTT error in History", e);
  }
});

onUnmounted(() => {
  mqttService.unsubscribe("status/alarm", handleAlarmStatus);
  mqttService.unsubscribe("rfid", handleRfid);
});
</script>

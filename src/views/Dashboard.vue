<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 pt-12 lg:pt-0">
      <div>
        <h1
          :class="[
            'text-2xl md:text-4xl font-bold tracking-tight',
            isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
        >
          Dashboard
        </h1>
        <p :class="['mt-1 text-xs md:text-sm font-medium', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
          Real-time monitoring system
        </p>
      </div>
      <div 
        :class="[
          'px-4 py-2 rounded-xl text-xs md:text-sm font-medium backdrop-blur-md border self-start md:self-auto',
          isDarkMode ? 'bg-white/5 border-white/10 text-gray-300' : 'bg-white border-gray-200 text-gray-600'
        ]"
      >
        {{ currentTime }}
      </div>
    </div>

    <!-- Status Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
      <!-- Alarm Control -->
      <div
        :class="[
          'rounded-3xl p-6 md:p-8 relative overflow-hidden group transition-all duration-300 h-full flex flex-col justify-between',
          isDarkMode ? 'glass-card' : 'bg-white border border-gray-100 shadow-xl hover:shadow-2xl',
        ]"
      >
        <div class="absolute -right-10 -top-10 h-32 w-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500"></div>
        
        <div class="flex items-center justify-between mb-6 relative z-10">
          <div class="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 shadow-inner">
            <Bell
              :class="[
                'h-6 w-6 md:h-8 md:w-8',
                alarmActive ? 'text-blue-400 animate-pulse' : 'text-gray-400',
              ]"
            />
          </div>
          <button
            @click.stop="toggleAlarm"
            :class="[
              'px-4 py-2 md:px-6 md:py-3 rounded-xl text-xs md:text-sm font-bold tracking-wide transition-all duration-300 shadow-lg cursor-pointer active:scale-95 border',
              alarmActive
                ? 'bg-blue-600 text-white border-blue-500 shadow-blue-500/30 hover:bg-blue-500'
                : 'bg-transparent text-blue-400 border-blue-500/30 hover:bg-blue-500/10',
            ]"
          >
            {{ alarmActive ? "DEACTIVATE" : "ACTIVATE" }}
          </button>
        </div>
        <div>
          <p
            :class="[
              'text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight',
              isDarkMode ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ alarmActive ? "ARMED" : "DISARMED" }}
          </p>
          <p :class="['text-xs md:text-sm font-bold tracking-wide uppercase', isDarkMode ? 'text-gray-500' : 'text-gray-400']">
            System Status
          </p>
        </div>
      </div>

      <!-- PIR Sensor -->
      <div
        :class="[
          'rounded-3xl p-6 md:p-8 relative overflow-hidden group transition-all duration-300 h-full flex flex-col justify-between',
          isDarkMode ? 'glass-card' : 'bg-white border border-gray-100 shadow-xl hover:shadow-2xl',
        ]"
      >
        <div class="absolute -right-10 -top-10 h-32 w-32 bg-cyan-500/20 rounded-full blur-3xl group-hover:bg-cyan-500/30 transition-all duration-500"></div>

        <div class="flex items-center justify-between mb-6 relative z-10">
          <div class="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 shadow-inner">
            <Activity
              :class="[
                'h-6 w-6 md:h-8 md:w-8',
                pirStatus ? 'text-cyan-400' : 'text-gray-400',
              ]"
            />
          </div>
          <span
            :class="[
              'px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider border shadow-sm',
              pirStatus
                ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/20'
                : 'bg-gray-500/10 text-gray-400 border-gray-500/20',
            ]"
          >
            {{ pirStatus ? "DETECTED" : "CLEAR" }}
          </span>
        </div>
        <div>
          <p
            :class="[
              'text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight',
              isDarkMode ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ pirStatus ? "Motion" : "No Motion" }}
          </p>
          <p :class="['text-xs md:text-sm font-bold tracking-wide uppercase', isDarkMode ? 'text-gray-500' : 'text-gray-400']">
            PIR Sensor
          </p>
        </div>
      </div>

      <!-- Gas Level Current -->
      <div
        :class="[
          'rounded-3xl p-6 md:p-8 relative overflow-hidden group transition-all duration-300 h-full flex flex-col justify-between',
          isDarkMode ? 'glass-card' : 'bg-white border border-gray-100 shadow-xl hover:shadow-2xl',
        ]"
      >
        <div class="absolute -right-10 -top-10 h-32 w-32 bg-blue-500/20 rounded-full blur-3xl group-hover:bg-blue-500/30 transition-all duration-500"></div>

        <div class="flex items-center justify-between mb-6 relative z-10">
          <div class="p-3 md:p-4 rounded-2xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 shadow-inner">
            <AlertTriangle
              :class="[
                'h-6 w-6 md:h-8 md:w-8',
                gasLevel > 2000
                  ? 'text-white'
                  : gasLevel > 1000
                  ? 'text-cyan-300'
                  : 'text-blue-400',
              ]"
            />
          </div>
          <span
            :class="[
              'px-3 py-1 md:px-4 md:py-1.5 rounded-full text-[10px] md:text-xs font-bold tracking-wider border shadow-sm',
              gasLevel > 2000
                ? 'bg-white/10 text-white border-white/20'
                : gasLevel > 1000
                ? 'bg-cyan-500/10 text-cyan-300 border-cyan-500/20'
                : 'bg-blue-500/10 text-blue-400 border-blue-500/20',
            ]"
          >
            {{ gasLevel }} PPM
          </span>
        </div>
        <div>
          <p
            :class="[
              'text-2xl md:text-4xl font-black mb-1 md:mb-2 tracking-tight',
              isDarkMode ? 'text-white' : 'text-gray-900',
            ]"
          >
            {{ gasStatusText }}
          </p>
          <p :class="['text-xs md:text-sm font-bold tracking-wide uppercase', isDarkMode ? 'text-gray-500' : 'text-gray-400']">
            Air Quality
          </p>
        </div>
      </div>
    </div>

    <!-- Gas Chart -->
    <div
      :class="[
        'rounded-2xl p-6 border relative overflow-hidden',
        isDarkMode ? 'glass-card' : 'bg-white border-gray-100 shadow-xl',
      ]"
    >
      <h2
        :class="[
          'text-xl font-semibold mb-4',
          isDarkMode ? 'text-white' : 'text-gray-900',
        ]"
      >
        Gas Level History
      </h2>
      <div class="h-80 w-full">
        <Line :data="chartData" :options="chartOptions" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted, onUnmounted, computed } from "vue";
import { Bell, Activity, AlertTriangle } from "lucide-vue-next";
import mqttService from "../services/mqtt";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";
import { Line } from "vue-chartjs";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Inject theme
const isDarkMode = inject("isDarkMode", ref(true));

// State
const currentTime = ref("");
const alarmActive = ref(false);
const pirStatus = ref(false);
const gasLevel = ref(0);
const gasHistory = ref([]);
const maxDataPoints = 20;

// Chart Data
const chartData = computed(() => ({
  labels: gasHistory.value.map((d) => d.time),
  datasets: [
    {
      label: "Gas Level (PPM)",
      data: gasHistory.value.map((d) => d.value),
      borderColor: "#3b82f6",
      backgroundColor: "rgba(59, 130, 246, 0.1)",
      fill: true,
      tension: 0.4,
    },
  ],
}));

const chartOptions = computed(() => ({
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    y: {
      min: 0,
      max: 5000,
      grid: {
        color: isDarkMode.value ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.1)",
      },
      ticks: {
        color: isDarkMode.value ? "#9ca3af" : "#4b5563",
      },
    },
    x: {
      grid: {
        display: false,
      },
      ticks: {
        color: isDarkMode.value ? "#9ca3af" : "#4b5563",
      },
    },
  },
  plugins: {
    legend: {
      labels: {
        color: isDarkMode.value ? "#fff" : "#000",
      },
    },
  },
}));

const gasStatusText = computed(() => {
  if (gasLevel.value > 2000) return "DANGER";
  if (gasLevel.value > 1000) return "WARNING";
  return "SAFE";
});

// Methods
const updateTime = () => {
  currentTime.value = new Date().toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
};

const toggleAlarm = () => {
  // Optimistic update
  alarmActive.value = !alarmActive.value;
  
  const payload = alarmActive.value ? "1" : "0";
  mqttService.publish("set/alarm", payload).catch(err => {
    console.error("Failed to publish alarm state", err);
    // Revert on failure
    alarmActive.value = !alarmActive.value;
  });
};

// MQTT Handlers
const handleGasMessage = (message) => {
  const value = parseInt(message);
  if (!isNaN(value)) {
    gasLevel.value = value;
    const now = new Date();
    const timeLabel = `${now.getHours()}:${now.getMinutes()}:${now.getSeconds()}`;
    
    gasHistory.value.push({ time: timeLabel, value });
    if (gasHistory.value.length > maxDataPoints) {
      gasHistory.value.shift();
    }
  }
};

const handlePirMessage = (message) => {
  // message can be "1", "0", "true", "false", "ON", "OFF"
  const msg = message.toString().toUpperCase();
  pirStatus.value = msg === "1" || msg === "TRUE" || msg === "ON";
};

const handleAlarmStatusMessage = (message) => {
  const msg = message.toString().toUpperCase();
  alarmActive.value = msg === "1" || msg === "TRUE" || msg === "ON";
};

let timeInterval;

onMounted(async () => {
  updateTime();
  timeInterval = setInterval(updateTime, 1000);

  try {
    await mqttService.connect();
    
    mqttService.subscribe("sensor/gas", handleGasMessage);
    mqttService.subscribe("sensor/pir", handlePirMessage);
    mqttService.subscribe("status/alarm", handleAlarmStatusMessage);
    
    console.log("Subscribed to MQTT topics");
  } catch (error) {
    console.error("Failed to connect/subscribe to MQTT:", error);
  }
});

onUnmounted(() => {
  if (timeInterval) clearInterval(timeInterval);
  
  mqttService.unsubscribe("sensor/gas", handleGasMessage);
  mqttService.unsubscribe("sensor/pir", handlePirMessage);
  mqttService.unsubscribe("status/alarm", handleAlarmStatusMessage);
});
</script>

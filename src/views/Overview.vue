<template>
  <Layout>
    <div :class="['space-y-6', isDarkMode ? 'text-white' : 'text-gray-900']">
      <h1
        :class="[
          'text-3xl font-bold',
          isDarkMode ? 'text-white' : 'text-gray-900',
        ]"
      >
        Overview
      </h1>

      <!-- Quick Status Cards -->
      <div
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6"
      >
        <!-- Mode Card -->
        <div
          :class="[
            'rounded-xl p-6 border',
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <Shield class="h-8 w-8 text-blue-700" />
            <button
              @click="
                systemMode = systemMode === 'ARMED' ? 'DISARMED' : 'ARMED'
              "
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                systemMode === 'ARMED' ? 'bg-red-500' : 'bg-gray-300',
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  systemMode === 'ARMED' ? 'translate-x-6' : 'translate-x-1',
                ]"
              ></span>
            </button>
          </div>
          <p class="text-2xl font-bold">{{ systemMode }}</p>
          <p
            :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']"
          >
            System Mode
          </p>
        </div>

        <!-- Gas Sensor Card -->
        <div
          :class="[
            'rounded-xl p-6 border',
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <AlertTriangle
              :class="[
                'h-8 w-8',
                gasLevel === 'Bahaya'
                  ? 'text-red-500'
                  : gasLevel === 'Waspada'
                  ? 'text-orange-500'
                  : 'text-green-500',
              ]"
            />
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                gasLevel === 'Bahaya'
                  ? 'bg-red-100 text-red-700'
                  : gasLevel === 'Waspada'
                  ? 'bg-orange-100 text-orange-700'
                  : 'bg-green-100 text-green-700',
              ]"
            >
              {{ gasLevel }}
            </span>
          </div>
          <p class="text-2xl font-bold">{{ gasPPM }} PPM</p>
          <p
            :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']"
          >
            Gas Sensor
          </p>
        </div>

        <!-- Motion Sensor Card -->
        <div
          :class="[
            'rounded-xl p-6 border',
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <Activity
              :class="[
                'h-8 w-8',
                motionActive ? 'text-red-500' : 'text-gray-400',
              ]"
            />
            <span
              :class="[
                'px-3 py-1 rounded-full text-xs font-medium',
                motionActive
                  ? 'bg-red-100 text-red-700'
                  : 'bg-gray-100 text-gray-700',
              ]"
            >
              {{ motionActive ? "Detected" : "Clear" }}
            </span>
          </div>
          <p class="text-sm">Last Motion:</p>
          <p
            :class="[
              'text-lg font-medium',
              isDarkMode ? 'text-gray-300' : 'text-gray-700',
            ]"
          >
            {{ lastMotion }}
          </p>
          <p
            :class="['text-sm', isDarkMode ? 'text-gray-400' : 'text-gray-600']"
          >
            Motion Sensor
          </p>
        </div>

        <!-- Light Card -->
        <div
          :class="[
            'rounded-xl p-6 border',
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <Lightbulb
              :class="[
                'h-8 w-8',
                lightOn ? 'text-yellow-500' : 'text-gray-400',
              ]"
            />
            <button
              @click="lightOn = !lightOn"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
                lightOn ? 'bg-blue-700' : 'bg-gray-300',
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                  lightOn ? 'translate-x-6' : 'translate-x-1',
                ]"
              ></span>
            </button>
          </div>
          <p class="text-sm mb-1">Status: {{ lightOn ? "ON" : "OFF" }}</p>
          <span
            :class="[
              'text-xs px-2 py-1 rounded',
              isDarkMode ? 'bg-gray-700' : 'bg-gray-100',
            ]"
            >{{ lightSource }}</span
          >
        </div>

        <!-- Camera Card -->
        <div
          :class="[
            'rounded-xl p-6 border',
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <Camera class="h-8 w-8 text-purple-700 mb-4" />
          <img
            :src="lastSnapshot.url"
            class="w-full h-16 object-cover rounded mb-2"
          />
          <p
            :class="[
              'text-xs mb-2',
              isDarkMode ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            {{ lastSnapshot.time }}
          </p>
          <button
            @click="$router.push('/camera')"
            class="text-xs text-blue-700 hover:underline"
          >
            Lihat Galeri
          </button>
        </div>
      </div>

      <!-- Charts -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <!-- Gas Chart -->
        <div
          :class="[
            'rounded-xl p-6 border',
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <h3 class="text-lg font-semibold mb-4">Gas PPM (24 Jam)</h3>
          <div class="h-64">
            <Line :data="gasChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- Motion Chart -->
        <div
          :class="[
            'rounded-xl p-6 border',
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <h3 class="text-lg font-semibold mb-4">Motion Detection (Per Jam)</h3>
          <div class="h-64">
            <Bar :data="motionChartData" :options="chartOptions" />
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import Layout from "../components/Layout.vue";
import {
  Shield,
  AlertTriangle,
  Activity,
  Lightbulb,
  Camera,
} from "lucide-vue-next";
import { Line, Bar } from "vue-chartjs";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const isDarkMode = ref(false);
const systemMode = ref("ARMED");
const gasPPM = ref(120);
const gasLevel = computed(() => {
  if (gasPPM.value > 400) return "Bahaya";
  if (gasPPM.value > 200) return "Waspada";
  return "Aman";
});
const motionActive = ref(false);
const lastMotion = ref("14:32");
const lightOn = ref(false);
const lightSource = ref("web");
const lastSnapshot = ref({
  url: "https://via.placeholder.com/150",
  time: "14:30",
});

const gasChartData = ref({
  labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  datasets: [
    {
      label: "Gas PPM",
      data: [100, 120, 110, 150, 130, 120],
      borderColor: "rgb(29, 78, 216)",
      backgroundColor: "rgba(29, 78, 216, 0.1)",
      tension: 0.4,
    },
  ],
});

const motionChartData = ref({
  labels: ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"],
  datasets: [
    {
      label: "Motion Count",
      data: [2, 1, 5, 8, 12, 6],
      backgroundColor: "rgb(29, 78, 216)",
    },
  ],
});

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
  },
};

onMounted(() => {
  const saved = localStorage.getItem("darkMode");
  if (saved) isDarkMode.value = saved === "true";

  setInterval(() => {
    gasPPM.value = Math.floor(Math.random() * 300) + 100;
    motionActive.value = Math.random() > 0.7;
    lastMotion.value = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, 5000);
});
</script>

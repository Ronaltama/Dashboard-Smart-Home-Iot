<template>
  <Layout>
    <div :class="['space-y-6', isDarkMode ? 'text-white' : 'text-gray-900']">
      <h1
        :class="[
          'text-3xl font-bold',
          isDarkMode ? 'text-white' : 'text-gray-900',
        ]"
      >
        Devices
      </h1>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="device in devices"
          :key="device.id"
          :class="[
            'rounded-xl p-6 border',
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
        >
          <div class="flex items-center justify-between mb-4">
            <h3 class="font-semibold">{{ device.name }}</h3>
            <span
              :class="[
                'px-2 py-1 rounded text-xs',
                device.online
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700',
              ]"
            >
              {{ device.online ? "Online" : "Offline" }}
            </span>
          </div>
          <div
            :class="[
              'text-sm space-y-2',
              isDarkMode ? 'text-gray-400' : 'text-gray-600',
            ]"
          >
            <p>RSSI: {{ device.rssi }} dBm</p>
            <p>Uptime: {{ device.uptime }}</p>
            <p>Firmware: {{ device.firmware }}</p>
          </div>
          <div class="mt-4 flex space-x-2">
            <button
              class="flex-1 px-3 py-2 bg-blue-700 text-white text-sm rounded hover:bg-blue-800"
            >
              Reboot
            </button>
            <button
              class="flex-1 px-3 py-2 bg-gray-300 text-gray-700 text-sm rounded hover:bg-gray-400"
            >
              Test
            </button>
          </div>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Layout from "../components/Layout.vue";

const isDarkMode = ref(false);
const devices = ref([
  {
    id: 1,
    name: "ESP32-CAM",
    online: true,
    rssi: -45,
    uptime: "5d 12h",
    firmware: "v1.2.3",
  },
  {
    id: 2,
    name: "Gas Sensor",
    online: true,
    rssi: -52,
    uptime: "5d 12h",
    firmware: "v1.0.1",
  },
  {
    id: 3,
    name: "PIR Sensor",
    online: true,
    rssi: -48,
    uptime: "5d 12h",
    firmware: "v1.1.0",
  },
]);

onMounted(() => {
  const saved = localStorage.getItem("darkMode");
  if (saved) isDarkMode.value = saved === "true";
});
</script>

<template>
  <Layout>
    <div :class="['space-y-6', isDarkMode ? 'text-white' : 'text-gray-900']">
      <h1
        :class="[
          'text-3xl font-bold',
          isDarkMode ? 'text-white' : 'text-gray-900',
        ]"
      >
        Logs (Audit)
      </h1>

      <div
        :class="[
          'rounded-xl border',
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead :class="[isDarkMode ? 'bg-gray-700' : 'bg-gray-50']">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                  Time
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                  Actor
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                  Device
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                  Action
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                  Result
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="log in logs"
                :key="log.id"
                :class="[isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50']"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  {{ log.time }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs',
                      actorColors[log.actor],
                    ]"
                    >{{ log.actor }}</span
                  >
                </td>
                <td class="px-6 py-4 text-sm">{{ log.device }}</td>
                <td class="px-6 py-4 text-sm">{{ log.action }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs',
                      log.result === 'success'
                        ? 'bg-green-100 text-green-700'
                        : 'bg-red-100 text-red-700',
                    ]"
                  >
                    {{ log.result }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Layout from "../components/Layout.vue";

const isDarkMode = ref(false);
const logs = ref([
  {
    id: 1,
    time: "2025-01-07 14:30",
    actor: "web",
    device: "Light",
    action: "Turn ON",
    result: "success",
  },
  {
    id: 2,
    time: "2025-01-07 13:15",
    actor: "ai",
    device: "ESP32-CAM",
    action: "Snapshot",
    result: "success",
  },
  {
    id: 3,
    time: "2025-01-07 12:00",
    actor: "rule",
    device: "Gas Sensor",
    action: "Alert",
    result: "success",
  },
]);

const actorColors = {
  web: "bg-blue-100 text-blue-700",
  ai: "bg-purple-100 text-purple-700",
  rule: "bg-green-100 text-green-700",
};

onMounted(() => {
  const saved = localStorage.getItem("darkMode");
  if (saved) isDarkMode.value = saved === "true";
});
</script>

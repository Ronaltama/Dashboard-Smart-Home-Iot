<template>
  <Layout>
    <div :class="['space-y-6', isDarkMode ? 'text-white' : 'text-gray-900']">
      <div class="flex items-center justify-between">
        <h1
          :class="[
            'text-3xl font-bold',
            isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
        >
          Alarms
        </h1>
        <div class="flex space-x-2">
          <select
            :class="[
              'px-4 py-2 rounded-lg border',
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200',
            ]"
            v-model="filterType"
          >
            <option value="all">All Types</option>
            <option value="gas">Gas</option>
            <option value="motion">Motion</option>
            <option value="rfid_denied">RFID Denied</option>
          </select>
          <select
            :class="[
              'px-4 py-2 rounded-lg border',
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-white border-gray-200',
            ]"
            v-model="filterSeverity"
          >
            <option value="all">All Severity</option>
            <option value="critical">Critical</option>
            <option value="warning">Warning</option>
            <option value="info">Info</option>
          </select>
        </div>
      </div>

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
                  Type
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                  Severity
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                  Message
                </th>
                <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody
              :class="[isDarkMode ? 'divide-gray-700' : 'divide-gray-200']"
            >
              <tr
                v-for="alarm in filteredAlarms"
                :key="alarm.id"
                :class="[isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50']"
              >
                <td class="px-6 py-4 whitespace-nowrap text-sm">
                  {{ alarm.time }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs',
                      typeColors[alarm.type],
                    ]"
                    >{{ alarm.type }}</span
                  >
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span
                    :class="[
                      'px-2 py-1 rounded text-xs',
                      severityColors[alarm.severity],
                    ]"
                    >{{ alarm.severity }}</span
                  >
                </td>
                <td class="px-6 py-4 text-sm">{{ alarm.message }}</td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <button
                    @click="acknowledgeAlarm(alarm.id)"
                    class="text-blue-700 hover:underline text-sm"
                  >
                    Ack
                  </button>
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
import { ref, computed, onMounted } from "vue";
import Layout from "../components/Layout.vue";

const isDarkMode = ref(false);
const filterType = ref("all");
const filterSeverity = ref("all");

const alarms = ref([
  {
    id: 1,
    time: "2025-01-07 14:30",
    type: "gas",
    severity: "critical",
    message: "Gas level exceeded 400 PPM",
  },
  {
    id: 2,
    time: "2025-01-07 13:15",
    type: "motion",
    severity: "warning",
    message: "Motion detected in living room",
  },
  {
    id: 3,
    time: "2025-01-07 12:00",
    type: "rfid_denied",
    severity: "info",
    message: "Unknown RFID card detected",
  },
  {
    id: 4,
    time: "2025-01-07 10:45",
    type: "gas",
    severity: "warning",
    message: "Gas level at 250 PPM",
  },
]);

const filteredAlarms = computed(() => {
  return alarms.value.filter((alarm) => {
    const typeMatch =
      filterType.value === "all" || alarm.type === filterType.value;
    const severityMatch =
      filterSeverity.value === "all" || alarm.severity === filterSeverity.value;
    return typeMatch && severityMatch;
  });
});

const typeColors = {
  gas: "bg-orange-100 text-orange-700",
  motion: "bg-purple-100 text-purple-700",
  rfid_denied: "bg-red-100 text-red-700",
};

const severityColors = {
  critical: "bg-red-100 text-red-700",
  warning: "bg-yellow-100 text-yellow-700",
  info: "bg-blue-100 text-blue-700",
};

const acknowledgeAlarm = (id) => {
  alarms.value = alarms.value.filter((a) => a.id !== id);
};

onMounted(() => {
  const saved = localStorage.getItem("darkMode");
  if (saved) isDarkMode.value = saved === "true";
});
</script>

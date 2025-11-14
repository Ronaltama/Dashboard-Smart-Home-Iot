<template>
  <div class="space-y-4 sm:space-y-6">
    <!-- Header -->
    <div
      class="flex flex-col sm:flex-row sm:items-center justify-between gap-4"
    >
      <h1
        :class="[
          'text-2xl sm:text-3xl font-bold',
          isDarkMode ? 'text-white' : 'text-gray-900',
        ]"
      >
        Alarm History
      </h1>
      <button
        @click="refreshAlarms"
        :class="[
          'px-4 py-2 rounded-lg transition-colors flex items-center justify-center',
          isDarkMode
            ? 'bg-gray-800 hover:bg-gray-700 text-white'
            : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
        ]"
      >
        <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
        Refresh
      </button>
    </div>

    <!-- Filters -->
    <div
      :class="[
        'rounded-xl p-4 border',
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
      ]"
    >
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div>
          <label
            :class="[
              'block text-sm font-medium mb-2',
              isDarkMode ? 'text-gray-400' : 'text-gray-700',
            ]"
          >
            Type
          </label>
          <select
            v-model="filterType"
            :class="[
              'w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900',
            ]"
          >
            <option value="">All Types</option>
            <option value="GAS">Gas Alert</option>
            <option value="PIR">Motion Detection</option>
            <option value="RFID">RFID Wrong</option>
          </select>
        </div>

        <div>
          <label
            :class="[
              'block text-sm font-medium mb-2',
              isDarkMode ? 'text-gray-400' : 'text-gray-700',
            ]"
          >
            Severity
          </label>
          <select
            v-model="filterSeverity"
            :class="[
              'w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900',
            ]"
          >
            <option value="">All Severity</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <label
            :class="[
              'block text-sm font-medium mb-2',
              isDarkMode ? 'text-gray-400' : 'text-gray-700',
            ]"
          >
            Date From
          </label>
          <input
            v-model="filterDateFrom"
            type="date"
            :class="[
              'w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900',
            ]"
          />
        </div>

        <div>
          <label
            :class="[
              'block text-sm font-medium mb-2',
              isDarkMode ? 'text-gray-400' : 'text-gray-700',
            ]"
          >
            Date To
          </label>
          <input
            v-model="filterDateTo"
            type="date"
            :class="[
              'w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900',
            ]"
          />
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredAlarms.length === 0"
      :class="[
        'rounded-xl p-12 border text-center',
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
      ]"
    >
      <AlertTriangle
        :class="[
          'h-16 w-16 mx-auto mb-4',
          isDarkMode ? 'text-gray-600' : 'text-gray-400',
        ]"
      />
      <p
        :class="[
          'text-lg font-medium mb-2',
          isDarkMode ? 'text-gray-400' : 'text-gray-600',
        ]"
      >
        No alarms found
      </p>
      <p :class="['text-sm', isDarkMode ? 'text-gray-500' : 'text-gray-500']">
        Alarm history will appear here when triggered
      </p>
    </div>

    <!-- Alarms List (Mobile/Tablet) -->
    <div v-else class="block lg:hidden space-y-3">
      <div
        v-for="alarm in filteredAlarms"
        :key="alarm.id"
        @click="viewAlarmDetail(alarm)"
        :class="[
          'rounded-xl p-4 border cursor-pointer transition-all',
          isDarkMode
            ? 'bg-gray-900 border-gray-800 hover:border-blue-500'
            : 'bg-white border-gray-200 hover:border-blue-500',
        ]"
      >
        <div class="flex items-start justify-between mb-3">
          <div class="flex items-center space-x-2">
            <component
              :is="getTypeIcon(alarm.type)"
              :class="[
                'h-5 w-5',
                alarm.type === 'GAS'
                  ? 'text-red-400'
                  : alarm.type === 'PIR'
                  ? 'text-yellow-400'
                  : 'text-blue-400',
              ]"
            />
            <span
              :class="[
                'text-sm font-medium',
                isDarkMode ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ alarm.type }}
            </span>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              alarm.severity === 'HIGH'
                ? 'bg-red-500/20 text-red-400'
                : alarm.severity === 'MEDIUM'
                ? 'bg-yellow-500/20 text-yellow-400'
                : 'bg-green-500/20 text-green-400',
            ]"
          >
            {{ alarm.severity }}
          </span>
        </div>
        <p
          :class="[
            'text-sm mb-2',
            isDarkMode ? 'text-gray-300' : 'text-gray-700',
          ]"
        >
          {{ alarm.message }}
        </p>
        <div class="flex items-center justify-between text-xs">
          <span :class="isDarkMode ? 'text-gray-400' : 'text-gray-600'">
            {{ formatDate(alarm.timestamp) }}
          </span>
          <span :class="isDarkMode ? 'text-gray-500' : 'text-gray-500'">
            {{ formatTime(alarm.timestamp) }}
          </span>
        </div>
      </div>
    </div>

    <!-- Alarms Table (Desktop) -->
    <div
      v-if="filteredAlarms.length > 0"
      :class="[
        'hidden lg:block rounded-xl overflow-hidden border',
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
      ]"
    >
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead
            :class="[
              'border-b',
              isDarkMode
                ? 'bg-gray-800 border-gray-700'
                : 'bg-gray-100 border-gray-200',
            ]"
          >
            <tr>
              <th
                :class="[
                  'px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider',
                  isDarkMode ? 'text-gray-400' : 'text-gray-700',
                ]"
              >
                Timestamp
              </th>
              <th
                :class="[
                  'px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider',
                  isDarkMode ? 'text-gray-400' : 'text-gray-700',
                ]"
              >
                Type
              </th>
              <th
                :class="[
                  'px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider',
                  isDarkMode ? 'text-gray-400' : 'text-gray-700',
                ]"
              >
                Message
              </th>
              <th
                :class="[
                  'px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider',
                  isDarkMode ? 'text-gray-400' : 'text-gray-700',
                ]"
              >
                Severity
              </th>
            </tr>
          </thead>
          <tbody
            :class="[
              'divide-y',
              isDarkMode ? 'divide-gray-800' : 'divide-gray-200',
            ]"
          >
            <tr
              v-for="alarm in filteredAlarms"
              :key="alarm.id"
              @click="viewAlarmDetail(alarm)"
              :class="[
                'cursor-pointer transition-colors',
                isDarkMode ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50',
              ]"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div
                  :class="[
                    'text-sm',
                    isDarkMode ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  {{ formatDate(alarm.timestamp) }}
                </div>
                <div
                  :class="[
                    'text-xs',
                    isDarkMode ? 'text-gray-400' : 'text-gray-600',
                  ]"
                >
                  {{ formatTime(alarm.timestamp) }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <component
                    :is="getTypeIcon(alarm.type)"
                    :class="[
                      'h-5 w-5 mr-2',
                      alarm.type === 'GAS'
                        ? 'text-red-400'
                        : alarm.type === 'PIR'
                        ? 'text-yellow-400'
                        : 'text-blue-400',
                    ]"
                  />
                  <span
                    :class="[
                      'text-sm',
                      isDarkMode ? 'text-white' : 'text-gray-900',
                    ]"
                  >
                    {{ alarm.type }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div
                  :class="[
                    'text-sm',
                    isDarkMode ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  {{ alarm.message }}
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    alarm.severity === 'HIGH'
                      ? 'bg-red-500/20 text-red-400'
                      : alarm.severity === 'MEDIUM'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-green-500/20 text-green-400',
                  ]"
                >
                  {{ alarm.severity }}
                </span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted } from "vue";
import {
  AlertTriangle,
  Activity,
  CreditCard,
  RefreshCw,
} from "lucide-vue-next";

// Inject theme
const isDarkMode = inject("isDarkMode", ref(true));

// State
const loading = ref(false);
const alarms = ref([]);
const selectedAlarm = ref(null);

// Filters
const filterType = ref("");
const filterSeverity = ref("");
const filterDateFrom = ref("");
const filterDateTo = ref("");

// Computed
const filteredAlarms = computed(() => {
  let filtered = alarms.value;

  if (filterType.value) {
    filtered = filtered.filter((a) => a.type === filterType.value);
  }

  if (filterSeverity.value) {
    filtered = filtered.filter((a) => a.severity === filterSeverity.value);
  }

  if (filterDateFrom.value) {
    filtered = filtered.filter(
      (a) => new Date(a.timestamp) >= new Date(filterDateFrom.value)
    );
  }

  if (filterDateTo.value) {
    filtered = filtered.filter(
      (a) => new Date(a.timestamp) <= new Date(filterDateTo.value)
    );
  }

  return filtered;
});

// Methods
const getTypeIcon = (type) => {
  switch (type) {
    case "GAS":
      return AlertTriangle;
    case "PIR":
      return Activity;
    case "RFID":
      return CreditCard;
    default:
      return AlertTriangle;
  }
};

const formatDate = (timestamp) => {
  return new Date(timestamp).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

const formatTime = (timestamp) => {
  return new Date(timestamp).toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
  });
};

const viewAlarmDetail = (alarm) => {
  selectedAlarm.value = alarm;
};

const fetchAlarms = async () => {
  loading.value = true;
  try {
    // TODO: Fetch from Firestore
    alarms.value = [];
    console.log("TODO: Fetch alarms from Firestore");
  } catch (error) {
    console.error("Failed to fetch alarms:", error);
  } finally {
    loading.value = false;
  }
};

const refreshAlarms = () => {
  fetchAlarms();
};

// Lifecycle
onMounted(() => {
  fetchAlarms();
});
</script>

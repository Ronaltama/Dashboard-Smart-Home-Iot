<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-white">Alarm History</h1>
      <button
        @click="refreshAlarms"
        class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
      >
        <RefreshCw class="h-4 w-4 mr-2" :class="{ 'animate-spin': loading }" />
        Refresh
      </button>
    </div>

    <!-- Filters -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2"
            >Type</label
          >
          <select
            v-model="filterType"
            class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Types</option>
            <option value="GAS">Gas Alert</option>
            <option value="PIR">Motion Detection</option>
            <option value="RFID">RFID Wrong</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2"
            >Severity</label
          >
          <select
            v-model="filterSeverity"
            class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Severity</option>
            <option value="HIGH">High</option>
            <option value="MEDIUM">Medium</option>
            <option value="LOW">Low</option>
          </select>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2"
            >Date From</label
          >
          <input
            v-model="filterDateFrom"
            type="date"
            class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2"
            >Date To</label
          >
          <input
            v-model="filterDateTo"
            type="date"
            class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>

    <!-- Alarms Table -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full">
          <thead class="bg-gray-800 border-b border-gray-700">
            <tr>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Timestamp
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Type
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Message
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Severity
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Snapshot
              </th>
              <th
                class="px-6 py-4 text-left text-xs font-semibold text-gray-400 uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-800">
            <tr
              v-for="alarm in filteredAlarms"
              :key="alarm.id"
              class="hover:bg-gray-800/50 transition-colors cursor-pointer"
              @click="viewAlarmDetail(alarm)"
            >
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="text-sm text-white">
                  {{ formatDate(alarm.timestamp) }}
                </div>
                <div class="text-xs text-gray-400">
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
                  <span class="text-sm text-white">{{ alarm.type }}</span>
                </div>
              </td>
              <td class="px-6 py-4">
                <div class="text-sm text-white">{{ alarm.message }}</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <span
                  :class="[
                    'px-3 py-1 rounded-full text-xs font-semibold',
                    alarm.severity === 'HIGH'
                      ? 'bg-red-500/20 text-red-400'
                      : alarm.severity === 'MEDIUM'
                      ? 'bg-yellow-500/20 text-yellow-400'
                      : 'bg-blue-500/20 text-blue-400',
                  ]"
                >
                  {{ alarm.severity }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div
                  v-if="alarm.thumbnailUrl"
                  class="w-16 h-12 rounded overflow-hidden"
                >
                  <img
                    :src="alarm.thumbnailUrl"
                    alt="Snapshot"
                    class="w-full h-full object-cover"
                  />
                </div>
                <span v-else class="text-xs text-gray-500">No image</span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <button
                  @click.stop="viewAlarmDetail(alarm)"
                  class="text-blue-500 hover:text-blue-400 text-sm font-medium"
                >
                  View Details
                </button>
              </td>
            </tr>

            <tr v-if="filteredAlarms.length === 0">
              <td colspan="6" class="px-6 py-12 text-center">
                <AlertTriangle class="h-12 w-12 mx-auto mb-3 text-gray-600" />
                <p class="text-gray-400">No alarms found</p>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination -->
      <div
        class="bg-gray-800 px-6 py-4 flex items-center justify-between border-t border-gray-700"
      >
        <div class="text-sm text-gray-400">
          Showing
          {{ Math.min((currentPage - 1) * itemsPerPage + 1, totalItems) }} to
          {{ Math.min(currentPage * itemsPerPage, totalItems) }} of
          {{ totalItems }} results
        </div>
        <div class="flex space-x-2">
          <button
            @click="currentPage--"
            :disabled="currentPage === 1"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Previous
          </button>
          <button
            @click="currentPage++"
            :disabled="currentPage >= totalPages"
            class="px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
          >
            Next
          </button>
        </div>
      </div>
    </div>

    <!-- Detail Modal -->
    <div
      v-if="selectedAlarm"
      @click="closeModal"
      class="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4"
    >
      <div
        @click.stop
        class="relative max-w-4xl w-full bg-gray-900 border border-gray-800 rounded-xl overflow-hidden"
      >
        <!-- Modal Header -->
        <div
          class="flex items-center justify-between p-6 border-b border-gray-800"
        >
          <h3 class="text-xl font-semibold text-white">Alarm Details</h3>
          <button
            @click="closeModal"
            class="p-2 hover:bg-gray-800 rounded-lg text-gray-400 hover:text-white transition-colors"
          >
            <X class="h-6 w-6" />
          </button>
        </div>

        <!-- Modal Content -->
        <div class="p-6 space-y-6">
          <!-- Alarm Info -->
          <div class="grid grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1"
                >Timestamp</label
              >
              <p class="text-white">
                {{ formatDate(selectedAlarm.timestamp) }}
                {{ formatTime(selectedAlarm.timestamp) }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1"
                >Type</label
              >
              <div class="flex items-center">
                <component
                  :is="getTypeIcon(selectedAlarm.type)"
                  :class="[
                    'h-5 w-5 mr-2',
                    selectedAlarm.type === 'GAS'
                      ? 'text-red-400'
                      : selectedAlarm.type === 'PIR'
                      ? 'text-yellow-400'
                      : 'text-blue-400',
                  ]"
                />
                <span class="text-white">{{ selectedAlarm.type }}</span>
              </div>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1"
                >Severity</label
              >
              <span
                :class="[
                  'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                  selectedAlarm.severity === 'HIGH'
                    ? 'bg-red-500/20 text-red-400'
                    : selectedAlarm.severity === 'MEDIUM'
                    ? 'bg-yellow-500/20 text-yellow-400'
                    : 'bg-blue-500/20 text-blue-400',
                ]"
              >
                {{ selectedAlarm.severity }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1"
                >ID</label
              >
              <p class="text-white text-sm font-mono">{{ selectedAlarm.id }}</p>
            </div>
          </div>

          <!-- Message -->
          <div>
            <label class="block text-sm font-medium text-gray-400 mb-2"
              >Message</label
            >
            <p class="text-white bg-gray-800 p-4 rounded-lg">
              {{ selectedAlarm.message }}
            </p>
          </div>

          <!-- Metadata -->
          <div v-if="selectedAlarm.metadata">
            <label class="block text-sm font-medium text-gray-400 mb-2"
              >Metadata</label
            >
            <pre
              class="text-white bg-gray-800 p-4 rounded-lg text-sm overflow-auto"
              >{{ JSON.stringify(selectedAlarm.metadata, null, 2) }}</pre
            >
          </div>

          <!-- Snapshot Image -->
          <div v-if="selectedAlarm.imageUrl">
            <label class="block text-sm font-medium text-gray-400 mb-2"
              >Snapshot</label
            >
            <div class="bg-gray-800 rounded-lg overflow-hidden">
              <img
                :src="selectedAlarm.imageUrl"
                alt="Alarm Snapshot"
                class="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  AlertTriangle,
  Activity,
  CreditCard,
  RefreshCw,
  X,
} from "lucide-vue-next";

// State
const loading = ref(false);
const alarms = ref([]);
const selectedAlarm = ref(null);

// Filters
const filterType = ref("");
const filterSeverity = ref("");
const filterDateFrom = ref("");
const filterDateTo = ref("");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10);

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

  return filtered.slice(
    (currentPage.value - 1) * itemsPerPage.value,
    currentPage.value * itemsPerPage.value
  );
});

const totalItems = computed(() => alarms.value.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
);

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

const closeModal = () => {
  selectedAlarm.value = null;
};

const fetchAlarms = async () => {
  loading.value = true;
  try {
    // TODO: Fetch from Firestore
    // const q = query(collection(db, 'alarms'), orderBy('timestamp', 'desc'));
    // const querySnapshot = await getDocs(q);
    // alarms.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Set empty array untuk sekarang
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

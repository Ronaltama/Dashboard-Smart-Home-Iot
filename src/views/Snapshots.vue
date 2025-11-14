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
        Snapshots
      </h1>
      <div class="flex space-x-3">
        <button
          @click="refreshSnapshots"
          :class="[
            'px-4 py-2 rounded-lg transition-colors flex items-center justify-center',
            isDarkMode
              ? 'bg-gray-800 hover:bg-gray-700 text-white'
              : 'bg-gray-200 hover:bg-gray-300 text-gray-900',
          ]"
        >
          <RefreshCw
            class="h-4 w-4 mr-2"
            :class="{ 'animate-spin': loading }"
          />
          Refresh
        </button>
        <button
          @click="takeNewSnapshot"
          :disabled="snapshotLoading"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
        >
          <Camera class="h-4 w-4 mr-2" />
          <span class="hidden sm:inline">{{
            snapshotLoading ? "Capturing..." : "Take Snapshot"
          }}</span>
          <span class="sm:hidden">{{ snapshotLoading ? "..." : "Take" }}</span>
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
      <div
        :class="[
          'rounded-xl p-4 sm:p-6 border',
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              :class="[
                'text-sm mb-1',
                isDarkMode ? 'text-gray-400' : 'text-gray-600',
              ]"
            >
              Total Snapshots
            </p>
            <p
              :class="[
                'text-2xl font-bold',
                isDarkMode ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ totalSnapshots }}
            </p>
          </div>
          <Image class="h-10 w-10 text-blue-500" />
        </div>
      </div>

      <div
        :class="[
          'rounded-xl p-4 sm:p-6 border',
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              :class="[
                'text-sm mb-1',
                isDarkMode ? 'text-gray-400' : 'text-gray-600',
              ]"
            >
              Today
            </p>
            <p
              :class="[
                'text-2xl font-bold',
                isDarkMode ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ todaySnapshots }}
            </p>
          </div>
          <Calendar class="h-10 w-10 text-green-500" />
        </div>
      </div>

      <div
        :class="[
          'rounded-xl p-4 sm:p-6 border',
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between">
          <div>
            <p
              :class="[
                'text-sm mb-1',
                isDarkMode ? 'text-gray-400' : 'text-gray-600',
              ]"
            >
              Storage Used
            </p>
            <p
              :class="[
                'text-2xl font-bold',
                isDarkMode ? 'text-white' : 'text-gray-900',
              ]"
            >
              {{ storageUsed }}
            </p>
          </div>
          <HardDrive class="h-10 w-10 text-purple-500" />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div
      :class="[
        'rounded-xl p-4 border',
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
      ]"
    >
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
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

        <div>
          <label
            :class="[
              'block text-sm font-medium mb-2',
              isDarkMode ? 'text-gray-400' : 'text-gray-700',
            ]"
          >
            Sort By
          </label>
          <select
            v-model="sortOrder"
            :class="[
              'w-full rounded-lg px-4 py-2 border focus:outline-none focus:ring-2 focus:ring-blue-500',
              isDarkMode
                ? 'bg-gray-800 border-gray-700 text-white'
                : 'bg-white border-gray-300 text-gray-900',
            ]"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div
      v-if="filteredSnapshots.length === 0"
      :class="[
        'rounded-xl p-12 border text-center',
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
      ]"
    >
      <Camera
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
        No snapshots yet
      </p>
      <p :class="['text-sm', isDarkMode ? 'text-gray-500' : 'text-gray-500']">
        Take your first snapshot to get started
      </p>
    </div>

    <!-- Snapshot Grid -->
    <div
      v-else
      class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4"
    >
      <div
        v-for="snapshot in filteredSnapshots"
        :key="snapshot.id"
        @click="viewSnapshot(snapshot)"
        :class="[
          'group relative aspect-square rounded-xl overflow-hidden cursor-pointer transition-all border',
          isDarkMode
            ? 'bg-gray-900 border-gray-800 hover:border-blue-500'
            : 'bg-gray-100 border-gray-200 hover:border-blue-500',
        ]"
      >
        <!-- Image -->
        <img
          :src="snapshot.thumbnailUrl"
          :alt="snapshot.description"
          class="w-full h-full object-cover"
        />

        <!-- Overlay -->
        <div
          class="absolute inset-0 bg-black/0 group-hover:bg-black/60 transition-all flex items-center justify-center"
        >
          <ZoomIn
            class="h-8 w-8 text-white opacity-0 group-hover:opacity-100 transition-opacity"
          />
        </div>

        <!-- Info Badge -->
        <div
          class="absolute bottom-0 left-0 right-0 p-2 sm:p-3 bg-linear-to-t from-black/80 to-transparent"
        >
          <p class="text-xs text-white font-medium truncate">
            {{ formatDate(snapshot.timestamp) }}
          </p>
          <p class="text-xs text-gray-300 hidden sm:block">
            {{ formatTime(snapshot.timestamp) }}
          </p>
        </div>

        <!-- Type Badge -->
        <div class="absolute top-2 right-2">
          <span
            :class="[
              'px-2 py-1 rounded text-xs font-semibold',
              snapshot.triggerType === 'MANUAL'
                ? 'bg-blue-500/80 text-white'
                : snapshot.triggerType === 'ALARM'
                ? 'bg-red-500/80 text-white'
                : 'bg-gray-500/80 text-white',
            ]"
          >
            {{ snapshot.triggerType }}
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted } from "vue";
import {
  Camera,
  RefreshCw,
  ZoomIn,
  Image,
  Calendar,
  HardDrive,
} from "lucide-vue-next";

// Inject theme
const isDarkMode = inject("isDarkMode", ref(true));

// State
const loading = ref(false);
const snapshotLoading = ref(false);
const snapshots = ref([]);
const selectedSnapshot = ref(null);

// Filters
const filterDateFrom = ref("");
const filterDateTo = ref("");
const sortOrder = ref("newest");

// Computed
const filteredSnapshots = computed(() => {
  let filtered = [...snapshots.value];

  if (filterDateFrom.value) {
    filtered = filtered.filter(
      (s) => new Date(s.timestamp) >= new Date(filterDateFrom.value)
    );
  }

  if (filterDateTo.value) {
    filtered = filtered.filter(
      (s) => new Date(s.timestamp) <= new Date(filterDateTo.value)
    );
  }

  // Sort
  filtered.sort((a, b) => {
    const dateA = new Date(a.timestamp);
    const dateB = new Date(b.timestamp);
    return sortOrder.value === "newest" ? dateB - dateA : dateA - dateB;
  });

  return filtered;
});

const totalSnapshots = computed(() => snapshots.value.length || 0);
const todaySnapshots = computed(() => {
  const today = new Date().setHours(0, 0, 0, 0);
  return (
    snapshots.value.filter(
      (s) => new Date(s.timestamp).setHours(0, 0, 0, 0) === today
    ).length || 0
  );
});
const storageUsed = computed(() =>
  snapshots.value.length > 0 ? "45.2 MB" : "-"
);

// Methods
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

const viewSnapshot = (snapshot) => {
  selectedSnapshot.value = snapshot;
};

const fetchSnapshots = async () => {
  loading.value = true;
  try {
    // TODO: Fetch from Firebase Storage
    snapshots.value = [];
    console.log("TODO: Fetch snapshots from Firebase Storage");
  } catch (error) {
    console.error("Failed to fetch snapshots:", error);
  } finally {
    loading.value = false;
  }
};

const refreshSnapshots = () => {
  fetchSnapshots();
};

const takeNewSnapshot = async () => {
  snapshotLoading.value = true;
  try {
    // TODO: Call Node-RED API
    await new Promise((resolve) => setTimeout(resolve, 1500));
    await fetchSnapshots();
  } catch (error) {
    console.error("Failed to take snapshot:", error);
  } finally {
    snapshotLoading.value = false;
  }
};

// Lifecycle
onMounted(() => {
  fetchSnapshots();
});
</script>

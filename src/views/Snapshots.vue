<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 class="text-3xl font-bold text-white">Snapshots</h1>
      <div class="flex space-x-3">
        <button
          @click="refreshSnapshots"
          class="px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center"
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
          {{ snapshotLoading ? "Capturing..." : "Take Snapshot" }}
        </button>
      </div>
    </div>

    <!-- Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400 mb-1">Total Snapshots</p>
            <p class="text-2xl font-bold text-white">{{ totalSnapshots }}</p>
          </div>
          <Image class="h-10 w-10 text-blue-500" />
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400 mb-1">Today</p>
            <p class="text-2xl font-bold text-white">{{ todaySnapshots }}</p>
          </div>
          <Calendar class="h-10 w-10 text-green-500" />
        </div>
      </div>

      <div class="bg-gray-900 border border-gray-800 rounded-xl p-6">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-sm text-gray-400 mb-1">Storage Used</p>
            <p class="text-2xl font-bold text-white">{{ storageUsed }}</p>
          </div>
          <HardDrive class="h-10 w-10 text-purple-500" />
        </div>
      </div>
    </div>

    <!-- Filters -->
    <div class="bg-gray-900 border border-gray-800 rounded-xl p-4">
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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

        <div>
          <label class="block text-sm font-medium text-gray-400 mb-2"
            >Sort By</label
          >
          <select
            v-model="sortOrder"
            class="w-full bg-gray-800 border border-gray-700 text-white rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="newest">Newest First</option>
            <option value="oldest">Oldest First</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Snapshot Grid -->
    <div
      v-if="filteredSnapshots.length > 0"
      class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
    >
      <div
        v-for="snapshot in filteredSnapshots"
        :key="snapshot.id"
        @click="viewSnapshot(snapshot)"
        class="group relative aspect-square bg-gray-900 border border-gray-800 rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition-all"
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
          class="absolute bottom-0 left-0 right-0 p-3 bg-linear-to-t from-black/80 to-transparent"
        >
          <p class="text-xs text-white font-medium truncate">
            {{ formatDate(snapshot.timestamp) }}
          </p>
          <p class="text-xs text-gray-300">
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

    <!-- Empty State -->
    <div
      v-else
      class="bg-gray-900 border border-gray-800 rounded-xl p-12 text-center"
    >
      <ImageOff class="h-16 w-16 mx-auto mb-4 text-gray-600" />
      <p class="text-gray-400 text-lg mb-2">No snapshots found</p>
      <p class="text-gray-500 text-sm mb-6">
        Take your first snapshot or adjust filters
      </p>
      <button
        @click="takeNewSnapshot"
        :disabled="snapshotLoading"
        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors inline-flex items-center"
      >
        <Camera class="h-5 w-5 mr-2" />
        {{ snapshotLoading ? "Capturing..." : "Take Snapshot" }}
      </button>
    </div>

    <!-- Pagination -->
    <div
      v-if="filteredSnapshots.length > 0"
      class="flex items-center justify-between"
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
          class="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Previous
        </button>
        <button
          @click="currentPage++"
          :disabled="currentPage >= totalPages"
          class="px-4 py-2 bg-gray-800 hover:bg-gray-700 disabled:bg-gray-900 disabled:cursor-not-allowed text-white rounded-lg transition-colors"
        >
          Next
        </button>
      </div>
    </div>

    <!-- Snapshot Modal -->
    <div
      v-if="selectedSnapshot"
      @click="closeModal"
      class="fixed inset-0 z-50 bg-black/90 flex items-center justify-center p-4"
    >
      <div @click.stop class="relative max-w-6xl w-full">
        <!-- Close Button -->
        <button
          @click="closeModal"
          class="absolute -top-12 right-0 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-white transition-colors"
        >
          <X class="h-6 w-6" />
        </button>

        <!-- Image Container -->
        <div class="bg-gray-900 rounded-xl overflow-hidden">
          <img
            :src="selectedSnapshot.imageUrl"
            :alt="selectedSnapshot.description"
            class="w-full h-auto max-h-[80vh] object-contain"
          />
        </div>

        <!-- Info Panel -->
        <div class="mt-4 bg-gray-900 border border-gray-800 rounded-xl p-6">
          <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1"
                >Timestamp</label
              >
              <p class="text-white">
                {{ formatDate(selectedSnapshot.timestamp) }}
                {{ formatTime(selectedSnapshot.timestamp) }}
              </p>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1"
                >Trigger Type</label
              >
              <span
                :class="[
                  'inline-block px-3 py-1 rounded-full text-xs font-semibold',
                  selectedSnapshot.triggerType === 'MANUAL'
                    ? 'bg-blue-500/20 text-blue-400'
                    : selectedSnapshot.triggerType === 'ALARM'
                    ? 'bg-red-500/20 text-red-400'
                    : 'bg-gray-500/20 text-gray-400',
                ]"
              >
                {{ selectedSnapshot.triggerType }}
              </span>
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-400 mb-1"
                >Snapshot ID</label
              >
              <p class="text-white text-sm font-mono">
                {{ selectedSnapshot.id }}
              </p>
            </div>
            <div v-if="selectedSnapshot.description" class="md:col-span-3">
              <label class="block text-sm font-medium text-gray-400 mb-1"
                >Description</label
              >
              <p class="text-white">{{ selectedSnapshot.description }}</p>
            </div>
          </div>

          <!-- Actions -->
          <div class="mt-6 flex space-x-3">
            <button
              @click="downloadSnapshot"
              class="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <Download class="h-4 w-4 mr-2" />
              Download
            </button>
            <button
              @click="deleteSnapshot"
              class="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
            >
              <Trash2 class="h-4 w-4 mr-2" />
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import {
  Camera,
  RefreshCw,
  ZoomIn,
  X,
  ImageOff,
  Image,
  Calendar,
  HardDrive,
  Download,
  Trash2,
} from "lucide-vue-next";

// State
const loading = ref(false);
const snapshotLoading = ref(false);
const snapshots = ref([]);
const selectedSnapshot = ref(null);

// Filters
const filterDateFrom = ref("");
const filterDateTo = ref("");
const sortOrder = ref("newest");

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(20);

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

  return filtered.slice(
    (currentPage.value - 1) * itemsPerPage.value,
    currentPage.value * itemsPerPage.value
  );
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
const totalItems = computed(() => snapshots.value.length);
const totalPages = computed(() =>
  Math.ceil(totalItems.value / itemsPerPage.value)
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

const closeModal = () => {
  selectedSnapshot.value = null;
};

const fetchSnapshots = async () => {
  loading.value = true;
  try {
    // TODO: Fetch from Firestore Storage
    // const q = query(collection(db, 'snapshots'), orderBy('timestamp', 'desc'));
    // const querySnapshot = await getDocs(q);
    // snapshots.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

    // Set empty array untuk sekarang
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

const downloadSnapshot = () => {
  if (selectedSnapshot.value) {
    // TODO: Implement download
    window.open(selectedSnapshot.value.imageUrl, "_blank");
  }
};

const deleteSnapshot = async () => {
  if (
    selectedSnapshot.value &&
    confirm("Are you sure you want to delete this snapshot?")
  ) {
    try {
      // TODO: Call delete API
      snapshots.value = snapshots.value.filter(
        (s) => s.id !== selectedSnapshot.value.id
      );
      closeModal();
    } catch (error) {
      console.error("Failed to delete snapshot:", error);
    }
  }
};

// Lifecycle
onMounted(() => {
  fetchSnapshots();
});
</script>

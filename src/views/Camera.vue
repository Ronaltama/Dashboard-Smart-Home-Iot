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
          Camera
        </h1>
        <button
          @click="takeSnapshot"
          class="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Ambil Snapshot
        </button>
      </div>

      <div
        class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
      >
        <div
          v-for="img in gallery"
          :key="img.id"
          :class="[
            'rounded-xl border overflow-hidden cursor-pointer hover:scale-105 transition',
            isDarkMode
              ? 'bg-gray-800 border-gray-700'
              : 'bg-white border-gray-200',
          ]"
          @click="selectedImage = img"
        >
          <img :src="img.url" class="w-full h-48 object-cover" />
          <div class="p-4">
            <p
              :class="[
                'text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-600',
              ]"
            >
              {{ img.time }}
            </p>
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="selectedImage"
        @click="selectedImage = null"
        class="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4"
      >
        <div
          @click.stop
          :class="[
            'rounded-xl p-6 max-w-4xl',
            isDarkMode ? 'bg-gray-800' : 'bg-white',
          ]"
        >
          <img :src="selectedImage.url" class="w-full rounded" />
          <p class="mt-4 text-center">{{ selectedImage.time }}</p>
          <button
            @click="selectedImage = null"
            class="mt-4 w-full px-4 py-2 bg-blue-700 text-white rounded-lg"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Layout from "../components/Layout.vue";

const isDarkMode = ref(false);
const selectedImage = ref(null);
const gallery = ref([
  {
    id: 1,
    url: "https://via.placeholder.com/400x300",
    time: "2025-01-07 14:30",
  },
  {
    id: 2,
    url: "https://via.placeholder.com/400x300",
    time: "2025-01-07 13:15",
  },
  {
    id: 3,
    url: "https://via.placeholder.com/400x300",
    time: "2025-01-07 12:00",
  },
]);

const takeSnapshot = () => {
  const newId = gallery.value.length + 1;
  gallery.value.unshift({
    id: newId,
    url: `https://via.placeholder.com/400x300?text=Snapshot+${newId}`,
    time: new Date().toLocaleString("id-ID"),
  });
};

onMounted(() => {
  const saved = localStorage.getItem("darkMode");
  if (saved) isDarkMode.value = saved === "true";
});
</script>

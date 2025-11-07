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
          Access (RFID)
        </h1>
        <button
          @click="showAddCard = true"
          class="px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
        >
          Tambah Kartu
        </button>
      </div>

      <div
        :class="[
          'rounded-xl border',
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200',
        ]"
      >
        <table class="w-full">
          <thead :class="[isDarkMode ? 'bg-gray-700' : 'bg-gray-50']">
            <tr>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                User
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                UID
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                Granted
              </th>
              <th class="px-6 py-3 text-left text-xs font-medium uppercase">
                Last Tap
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="card in cards"
              :key="card.id"
              :class="[isDarkMode ? 'hover:bg-gray-700' : 'hover:bg-gray-50']"
            >
              <td class="px-6 py-4">{{ card.user }}</td>
              <td class="px-6 py-4 font-mono text-sm">{{ card.uid }}</td>
              <td class="px-6 py-4">
                <button
                  @click="card.granted = !card.granted"
                  :class="[
                    'relative inline-flex h-6 w-11 items-center rounded-full',
                    card.granted ? 'bg-blue-700' : 'bg-gray-300',
                  ]"
                >
                  <span
                    :class="[
                      'inline-block h-4 w-4 transform rounded-full bg-white transition',
                      card.granted ? 'translate-x-6' : 'translate-x-1',
                    ]"
                  ></span>
                </button>
              </td>
              <td class="px-6 py-4 text-sm">{{ card.lastTap }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Add Card Modal -->
      <div
        v-if="showAddCard"
        class="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center p-4"
      >
        <div
          :class="[
            'rounded-xl p-6 w-full max-w-md',
            isDarkMode ? 'bg-gray-800' : 'bg-white',
          ]"
        >
          <h3 class="text-xl font-bold mb-4">Tambah Kartu RFID</h3>
          <input
            v-model="newCard.user"
            :class="[
              'w-full px-4 py-2 border rounded-lg mb-4',
              isDarkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300',
            ]"
            placeholder="Nama User"
          />
          <input
            v-model="newCard.uid"
            :class="[
              'w-full px-4 py-2 border rounded-lg mb-4',
              isDarkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300',
            ]"
            placeholder="UID (auto-detect)"
          />
          <div class="flex space-x-4">
            <button
              @click="addCard"
              class="flex-1 px-4 py-2 bg-blue-700 text-white rounded-lg"
            >
              Simpan
            </button>
            <button
              @click="showAddCard = false"
              class="flex-1 px-4 py-2 bg-gray-300 rounded-lg"
            >
              Batal
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
const showAddCard = ref(false);
const newCard = ref({ user: "", uid: "" });
const cards = ref([
  {
    id: 1,
    user: "Admin",
    uid: "A1B2C3D4",
    granted: true,
    lastTap: "2025-01-07 14:00",
  },
  {
    id: 2,
    user: "Guest",
    uid: "E5F6G7H8",
    granted: false,
    lastTap: "2025-01-07 10:30",
  },
]);

const addCard = () => {
  cards.value.push({
    id: cards.value.length + 1,
    user: newCard.value.user,
    uid:
      newCard.value.uid ||
      Math.random().toString(36).substr(2, 8).toUpperCase(),
    granted: true,
    lastTap: "Never",
  });
  newCard.value = { user: "", uid: "" };
  showAddCard.value = false;
};

onMounted(() => {
  const saved = localStorage.getItem("darkMode");
  if (saved) isDarkMode.value = saved === "true";
});
</script>

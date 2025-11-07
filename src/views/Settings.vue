<template>
  <Layout>
    <div :class="['space-y-6', isDarkMode ? 'text-white' : 'text-gray-900']">
      <h1
        :class="[
          'text-3xl font-bold',
          isDarkMode ? 'text-white' : 'text-gray-900',
        ]"
      >
        Settings
      </h1>

      <div
        :class="[
          'rounded-xl p-6 border',
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200',
        ]"
      >
        <h3 class="font-semibold mb-4">Safety</h3>
        <div class="space-y-4">
          <div>
            <label class="block text-sm mb-2">Gas Threshold (PPM)</label>
            <input
              v-model="settings.gasThreshold"
              type="number"
              :class="[
                'w-full px-4 py-2 border rounded-lg',
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300',
              ]"
            />
          </div>
          <div>
            <label class="block text-sm mb-2">Alarm Hold-off (seconds)</label>
            <input
              v-model="settings.alarmHoldoff"
              type="number"
              :class="[
                'w-full px-4 py-2 border rounded-lg',
                isDarkMode
                  ? 'bg-gray-700 border-gray-600'
                  : 'bg-white border-gray-300',
              ]"
            />
          </div>
          <div class="flex items-center justify-between">
            <label class="text-sm">Auto Snapshot</label>
            <button
              @click="settings.autoSnapshot = !settings.autoSnapshot"
              :class="[
                'relative inline-flex h-6 w-11 items-center rounded-full',
                settings.autoSnapshot ? 'bg-blue-700' : 'bg-gray-300',
              ]"
            >
              <span
                :class="[
                  'inline-block h-4 w-4 transform rounded-full bg-white transition',
                  settings.autoSnapshot ? 'translate-x-6' : 'translate-x-1',
                ]"
              ></span>
            </button>
          </div>
        </div>
      </div>

      <div
        :class="[
          'rounded-xl p-6 border',
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200',
        ]"
      >
        <h3 class="font-semibold mb-4">Notifications</h3>
        <div>
          <label class="block text-sm mb-2">Telegram Chat ID</label>
          <input
            v-model="settings.telegramChatId"
            :class="[
              'w-full px-4 py-2 border rounded-lg',
              isDarkMode
                ? 'bg-gray-700 border-gray-600'
                : 'bg-white border-gray-300',
            ]"
          />
          <button
            class="mt-2 px-4 py-2 bg-blue-700 text-white rounded-lg text-sm"
          >
            Test Notification
          </button>
        </div>
      </div>

      <button
        @click="saveSettings"
        class="px-6 py-3 bg-blue-700 text-white rounded-lg hover:bg-blue-800"
      >
        Save Settings
      </button>
    </div>
  </Layout>
</template>

<script setup>
import { ref, onMounted } from "vue";
import Layout from "../components/Layout.vue";

const isDarkMode = ref(false);
const settings = ref({
  gasThreshold: 400,
  alarmHoldoff: 30,
  autoSnapshot: true,
  telegramChatId: "",
});

const saveSettings = () => {
  localStorage.setItem("securitySettings", JSON.stringify(settings.value));
  alert("Settings saved!");
};

onMounted(() => {
  const saved = localStorage.getItem("darkMode");
  if (saved) isDarkMode.value = saved === "true";

  const savedSettings = localStorage.getItem("securitySettings");
  if (savedSettings) settings.value = JSON.parse(savedSettings);
});
</script>

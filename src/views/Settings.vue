<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex items-center justify-between">
      <h1 :class="['text-3xl font-bold', isDarkMode ? 'text-white' : 'text-gray-900']">
        Settings
      </h1>
      <div class="flex space-x-3">
        <button
          v-if="hasChanges"
          @click="resetSettings"
          :class="[
            'px-4 py-2 rounded-lg transition-colors',
            isDarkMode ? 'bg-gray-800 hover:bg-gray-700 text-white' : 'bg-gray-200 hover:bg-gray-300 text-gray-900'
          ]"
        >
          Reset
        </button>
        <button
          @click="saveSettings"
          :disabled="saving || !hasChanges"
          class="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white rounded-lg transition-colors flex items-center"
        >
          <Save class="h-4 w-4 mr-2" />
          {{ saving ? "Saving..." : "Save Settings" }}
        </button>
      </div>
    </div>

    <!-- Success/Error Message -->
    <div
      v-if="message"
      :class="[
        'p-4 rounded-lg flex items-center',
        messageType === 'success'
          ? 'bg-green-500/20 border border-green-500/50'
          : 'bg-red-500/20 border border-red-500/50',
      ]"
    >
      <CheckCircle
        v-if="messageType === 'success'"
        class="h-5 w-5 mr-3 text-green-400"
      />
      <AlertTriangle v-else class="h-5 w-5 mr-3 text-red-400" />
      <p :class="messageType === 'success' ? 'text-green-400' : 'text-red-400'">
        {{ message }}
      </p>
    </div>

    <!-- Safety Settings -->
    <div :class="['rounded-xl p-6 border', isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200']">
      <div class="flex items-center mb-6">
        <Shield class="h-6 w-6 text-blue-500 mr-3" />
        <h2 :class="['text-xl font-semibold', isDarkMode ? 'text-white' : 'text-gray-900']">
          Safety Settings
        </h2>
      </div>

      <div class="space-y-6">
        <!-- Gas Threshold -->
        <div>
          <label :class="['block text-sm font-medium mb-2', isDarkMode ? 'text-gray-400' : 'text-gray-700']">
            Gas Threshold (PPM)
          </label>
          <input
            v-model.number="settings.gasThreshold"
            type="number"
            min="0"
            max="1000"
            step="10"
            :class="[
              'w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border',
              isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            ]"
            placeholder="400"
          />
          <p class="text-xs text-gray-500 mt-2">
            Gas levels above this threshold will trigger an alarm
          </p>
        </div>

        <!-- Alarm Hold-off -->
        <div>
          <label :class="['block text-sm font-medium mb-2', isDarkMode ? 'text-gray-400' : 'text-gray-700']">
            Alarm Hold-off (seconds)
          </label>
          <input
            v-model.number="settings.alarmHoldOff"
            type="number"
            min="0"
            max="300"
            step="5"
            :class="[
              'w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border',
              isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            ]"
            placeholder="30"
          />
          <p class="text-xs text-gray-500 mt-2">
            Delay before alarm is triggered after detection
          </p>
        </div>
      </div>
    </div>

    <!-- Camera Settings -->
    <div :class="['rounded-xl p-6 border', isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200']">
      <div class="flex items-center mb-6">
        <Camera class="h-6 w-6 text-blue-500 mr-3" />
        <h2 :class="['text-xl font-semibold', isDarkMode ? 'text-white' : 'text-gray-900']">
          Camera Settings
        </h2>
      </div>

      <div class="space-y-6">
        <!-- Auto Snapshot -->
        <div :class="['flex items-center justify-between p-4 rounded-lg', isDarkMode ? 'bg-gray-800/50' : 'bg-gray-100/50']">
          <div>
            <p :class="['font-medium', isDarkMode ? 'text-white' : 'text-gray-900']">
              Auto Snapshot on Alarm
            </p>
            <p :class="['text-sm mt-1', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
              Automatically capture snapshot when alarm is triggered
            </p>
          </div>
          <button
            @click="settings.autoSnapshot = !settings.autoSnapshot"
            :class="[
              'relative inline-flex h-6 w-11 items-center rounded-full transition-colors',
              settings.autoSnapshot ? 'bg-blue-600' : 'bg-gray-600',
            ]"
          >
            <span
              :class="[
                'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
                settings.autoSnapshot ? 'translate-x-6' : 'translate-x-1',
              ]"
            ></span>
          </button>
        </div>

        <!-- Snapshot Retention -->
        <div>
          <label :class="['block text-sm font-medium mb-2', isDarkMode ? 'text-gray-400' : 'text-gray-700']">
            Snapshot Retention (days)
          </label>
          <input
            v-model.number="settings.snapshotRetention"
            type="number"
            min="1"
            max="90"
            step="1"
            :class="[
              'w-full rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 border',
              isDarkMode ? 'bg-gray-800 border-gray-700 text-white' : 'bg-white border-gray-300 text-gray-900'
            ]"
            placeholder="30"
          />
          <p class="text-xs text-gray-500 mt-2">
            Snapshots older than this will be automatically deleted
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject, computed, onMounted } from "vue";
import { Shield, Camera, Save, CheckCircle, AlertTriangle } from "lucide-vue-next";

// Inject theme
const isDarkMode = inject('isDarkMode', ref(true));

// State
const saving = ref(false);
const message = ref("");
const messageType = ref("success");

// Settings
const settings = ref({
  gasThreshold: 400,
  alarmHoldOff: 30,
  autoSnapshot: true,
  snapshotRetention: 30,
});

const originalSettings = ref({});

// Computed
const hasChanges = computed(() => {
  return JSON.stringify(settings.value) !== JSON.stringify(originalSettings.value);
});

// Methods
const loadSettings = () => {
  try {
    // TODO: Load from Firebase or localStorage
    const saved = localStorage.getItem("systemSettings");
    if (saved) {
      const parsed = JSON.parse(saved);
      settings.value = { ...settings.value, ...parsed };
    }
    originalSettings.value = JSON.parse(JSON.stringify(settings.value));
  } catch (error) {
    console.error("Error loading settings:", error);
  }
};

const saveSettings = async () => {
  saving.value = true;
  message.value = "";

  try {
    // TODO: Save to Firebase Firestore
    // await setDoc(doc(db, 'settings', 'system'), settings.value);
    
    // For now, save to localStorage
    localStorage.setItem("systemSettings", JSON.stringify(settings.value));
    
    originalSettings.value = JSON.parse(JSON.stringify(settings.value));
    
    message.value = "Settings saved successfully!";
    messageType.value = "success";
    
    setTimeout(() => {
      message.value = "";
    }, 3000);
  } catch (error) {
    console.error("Error saving settings:", error);
    message.value = "Failed to save settings. Please try again.";
    messageType.value = "error";
  } finally {
    saving.value = false;
  }
};

const resetSettings = () => {
  if (confirm("Are you sure you want to reset all changes?")) {
    settings.value = JSON.parse(JSON.stringify(originalSettings.value));
  }
};

// Lifecycle
onMounted(() => {
  loadSettings();
});
</script>

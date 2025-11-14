<template>
  <div id="app" :class="isDarkMode ? 'dark' : ''">
    <router-view />
  </div>
</template>

<script setup>
import { ref, onMounted, provide, watch } from "vue";

const isDarkMode = ref(true);

// Provide to all children
provide("isDarkMode", isDarkMode);
provide("toggleTheme", () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value.toString());
});

// Watch for changes
watch(isDarkMode, (newValue) => {
  if (newValue) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

onMounted(() => {
  // Load theme
  const savedTheme = localStorage.getItem("darkMode");
  if (savedTheme !== null) {
    isDarkMode.value = savedTheme === "true";
  }

  // Apply theme
  if (isDarkMode.value) {
    document.documentElement.classList.add("dark");
  }
});
</script>

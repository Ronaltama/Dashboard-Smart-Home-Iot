<template>
  <div :class="['min-h-screen', isDarkMode ? 'bg-gray-900' : 'bg-gray-50']">
    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0',
        isDarkMode
          ? 'bg-gray-900 border-r border-gray-800'
          : 'bg-white border-r border-gray-200',
        { '-translate-x-full': !sidebarOpen },
      ]"
    >
      <div
        :class="[
          'flex items-center justify-between h-16 px-4 border-b',
          isDarkMode ? 'border-gray-800' : 'border-gray-200',
        ]"
      >
        <div class="flex items-center">
          <Shield class="h-8 w-8 text-blue-700 mr-2" />
          <span
            :class="[
              'text-lg font-semibold',
              isDarkMode ? 'text-white' : 'text-gray-900',
            ]"
            >Security</span
          >
        </div>
        <button
          @click="toggleTheme"
          :class="[
            'p-2 rounded-lg',
            isDarkMode
              ? 'hover:bg-gray-800 text-gray-400'
              : 'hover:bg-gray-100 text-gray-600',
          ]"
        >
          <Sun v-if="isDarkMode" class="h-5 w-5" />
          <Moon v-else class="h-5 w-5" />
        </button>
      </div>

      <nav class="p-4 space-y-2">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-colors',
            $route.path === item.path
              ? isDarkMode
                ? 'bg-blue-900 text-white'
                : 'bg-blue-700 text-white'
              : isDarkMode
              ? 'text-gray-400 hover:bg-gray-800'
              : 'text-gray-600 hover:bg-gray-100',
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 mr-3" />
          {{ item.label }}
        </router-link>
      </nav>

      <div class="absolute bottom-0 left-0 right-0 p-4">
        <button
          @click="handleLogout"
          :class="[
            'w-full flex items-center px-4 py-3 rounded-lg transition-colors',
            isDarkMode
              ? 'text-gray-400 hover:bg-gray-800'
              : 'text-gray-600 hover:bg-gray-100',
          ]"
        >
          <LogOut class="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Navbar -->
      <header
        :class="[
          'sticky top-0 z-40 border-b',
          isDarkMode
            ? 'bg-gray-800 border-gray-700'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between px-4 h-16">
          <button @click="sidebarOpen = !sidebarOpen" class="lg:hidden">
            <Menu class="h-6 w-6" />
          </button>

          <div class="flex-1"></div>

          <div class="flex items-center space-x-4">
            <span
              :class="[
                'text-sm',
                isDarkMode ? 'text-gray-400' : 'text-gray-600',
              ]"
              >{{ userEmail }}</span
            >
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6">
        <slot />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black bg-opacity-25 lg:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Shield,
  Home,
  AlertTriangle,
  Camera,
  CreditCard,
  Cpu,
  Settings,
  FileText,
  LogOut,
  Sun,
  Moon,
  Menu,
} from "lucide-vue-next";

const router = useRouter();
const sidebarOpen = ref(false);
const isDarkMode = ref(false);
const userEmail = ref("");

const menuItems = [
  { path: "/overview", label: "Overview", icon: "Home" },
  { path: "/alarms", label: "Alarms", icon: "AlertTriangle" },
  { path: "/camera", label: "Camera", icon: "Camera" },
  { path: "/access", label: "Access (RFID)", icon: "CreditCard" },
  { path: "/devices", label: "Devices", icon: "Cpu" },
  { path: "/settings", label: "Settings", icon: "Settings" },
  { path: "/logs", label: "Logs", icon: "FileText" },
];

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value.toString());
};

const handleLogout = () => {
  localStorage.removeItem("authToken");
  localStorage.removeItem("userEmail");
  router.push("/login");
};

onMounted(() => {
  const savedTheme = localStorage.getItem("darkMode");
  if (savedTheme) isDarkMode.value = savedTheme === "true";
  userEmail.value = localStorage.getItem("userEmail") || "User";
});
</script>

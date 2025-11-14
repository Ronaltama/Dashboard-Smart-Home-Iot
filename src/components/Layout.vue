<template>
  <div :class="['min-h-screen', isDarkMode ? 'bg-gray-950' : 'bg-gray-50']">
    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 border-r transform transition-transform duration-300 lg:translate-x-0',
        isDarkMode ? 'bg-gray-900 border-gray-800' : 'bg-white border-gray-200',
        { '-translate-x-full': !sidebarOpen },
      ]"
    >
      <!-- Logo -->
      <div
        :class="[
          'flex items-center h-16 px-6 border-b',
          isDarkMode ? 'border-gray-800' : 'border-gray-200',
        ]"
      >
        <Shield class="h-6 w-6 text-blue-500 mr-3" />
        <span
          :class="[
            'text-lg font-semibold',
            isDarkMode ? 'text-white' : 'text-gray-900',
          ]"
          >Security Home</span
        >
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-1">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            $route.path === item.path
              ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/50'
              : isDarkMode
              ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          ]"
        >
          <component :is="item.icon" class="h-5 w-5 mr-3" />
          {{ item.label }}
        </router-link>
      </nav>

      <!-- Logout Button -->
      <div
        :class="[
          'absolute bottom-0 left-0 right-0 p-4 border-t',
          isDarkMode ? 'border-gray-800' : 'border-gray-200',
        ]"
      >
        <button
          @click="handleLogout"
          :class="[
            'w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200',
            isDarkMode
              ? 'text-gray-400 hover:bg-gray-800 hover:text-white'
              : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900',
          ]"
        >
          <LogOut class="h-5 w-5 mr-3" />
          Logout
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="lg:pl-64">
      <!-- Header -->
      <header
        :class="[
          'sticky top-0 z-40 border-b',
          isDarkMode
            ? 'bg-gray-900 border-gray-800'
            : 'bg-white border-gray-200',
        ]"
      >
        <div class="flex items-center justify-between px-6 h-16">
          <!-- Mobile Menu Button -->
          <button
            @click="sidebarOpen = !sidebarOpen"
            :class="[
              'lg:hidden',
              isDarkMode
                ? 'text-gray-400 hover:text-white'
                : 'text-gray-600 hover:text-gray-900',
            ]"
          >
            <Menu class="h-6 w-6" />
          </button>

          <div class="flex-1"></div>

          <!-- User Info & Theme Toggle -->
          <div class="flex items-center space-x-4">
            <!-- Theme Toggle -->
            <button
              @click="handleToggleTheme"
              :class="[
                'p-2 rounded-lg transition-colors',
                isDarkMode
                  ? 'hover:bg-gray-800 text-gray-400'
                  : 'hover:bg-gray-100 text-gray-600',
              ]"
              title="Toggle theme"
            >
              <Sun v-if="isDarkMode" class="h-5 w-5" />
              <Moon v-else class="h-5 w-5" />
            </button>

            <!-- User Info -->
            <div class="flex items-center space-x-3">
              <div class="text-right">
                <p
                  :class="[
                    'text-sm font-medium',
                    isDarkMode ? 'text-white' : 'text-gray-900',
                  ]"
                >
                  Admin
                </p>
                <p class="text-xs text-gray-400">{{ userEmail }}</p>
              </div>
              <div
                class="h-10 w-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center"
              >
                <span class="text-white font-semibold text-sm">A</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="p-6 min-h-screen">
        <router-view />
      </main>
    </div>

    <!-- Mobile Overlay -->
    <div
      v-if="sidebarOpen"
      @click="sidebarOpen = false"
      class="fixed inset-0 z-40 bg-black bg-opacity-50 lg:hidden"
    ></div>
  </div>
</template>

<script setup>
import { ref, inject, onMounted } from "vue";
import { useRouter } from "vue-router";
import {
  Shield,
  Home,
  AlertTriangle,
  Camera,
  Settings,
  LogOut,
  Menu,
  Sun,
  Moon,
} from "lucide-vue-next";
import { signOut } from "firebase/auth";
import { auth } from "../services/firebase";

const router = useRouter();
const sidebarOpen = ref(false);
const userEmail = ref("");

// Inject from App.vue
const isDarkMode = inject("isDarkMode", ref(true));
const toggleTheme = inject("toggleTheme", () => {});

const menuItems = [
  { path: "/dashboard", label: "Dashboard", icon: Home },
  { path: "/alarms", label: "Alarms", icon: AlertTriangle },
  { path: "/snapshots", label: "Snapshots", icon: Camera },
  { path: "/settings", label: "Settings", icon: Settings },
];

const handleToggleTheme = () => {
  toggleTheme();
};

const handleLogout = async () => {
  try {
    await signOut(auth);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    console.log("✅ Logout berhasil");
    router.push("/login");
  } catch (error) {
    console.error("❌ Logout error:", error);
    localStorage.removeItem("authToken");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("userId");
    router.push("/login");
  }
};

onMounted(() => {
  const currentUser = auth.currentUser;
  if (currentUser) {
    userEmail.value = currentUser.email;
  } else {
    userEmail.value = localStorage.getItem("userEmail") || "admin@security.com";
  }
});
</script>

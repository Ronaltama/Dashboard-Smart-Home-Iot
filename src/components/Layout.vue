<template>
  <div :class="['min-h-screen', isDarkMode ? 'bg-gray-950' : 'bg-gray-50']">
    <!-- Sidebar -->
    <div
      :class="[
        'fixed inset-y-0 left-0 z-50 w-64 transform transition-transform duration-300 lg:translate-x-0',
        isDarkMode ? 'bg-black/60 backdrop-blur-xl border-r border-white/10' : 'bg-white/90 backdrop-blur-xl border-r border-gray-200 shadow-sm',
        { '-translate-x-full': !sidebarOpen },
      ]"
    >
      <!-- Logo -->
      <div
        :class="[
          'flex items-center justify-center h-24 border-b',
          isDarkMode ? 'border-white/10' : 'border-gray-100',
        ]"
      >
        <div class="text-center">
          <h1
            class="text-2xl font-black bg-gradient-to-r from-blue-400 via-cyan-400 to-blue-500 bg-clip-text text-transparent tracking-widest"
          >
            SECURITY
          </h1>
          <span :class="['text-xs font-bold tracking-[0.3em] uppercase', isDarkMode ? 'text-gray-400' : 'text-gray-500']">
            Home System
          </span>
        </div>
      </div>

      <!-- Navigation -->
      <nav class="p-4 space-y-2 mt-4">
        <router-link
          v-for="item in menuItems"
          :key="item.path"
          :to="item.path"
          :class="[
            'flex items-center px-4 py-3.5 rounded-xl transition-all duration-300 group relative overflow-hidden',
            $route.path === item.path
              ? 'text-white shadow-[0_0_20px_rgba(59,130,246,0.5)]'
              : isDarkMode
              ? 'text-gray-400 hover:text-white hover:bg-white/5'
              : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100',
          ]"
        >
          <div 
            v-if="$route.path === item.path"
            class="absolute inset-0 bg-gradient-to-r from-blue-600 to-cyan-600 opacity-100"
          ></div>
          
          <component 
            :is="item.icon" 
            :class="[
              'h-5 w-5 mr-3 relative z-10 transition-transform duration-300 group-hover:scale-110',
              $route.path === item.path ? 'text-white' : 'text-current'
            ]" 
          />
          <span class="font-bold relative z-10 tracking-wide">{{ item.label }}</span>
        </router-link>
      </nav>

      <!-- Sidebar Footer -->
      <div class="absolute bottom-0 left-0 right-0 p-6 space-y-4">
        <!-- Theme Toggle & User -->
        <div 
          :class="[
            'flex items-center justify-between p-3 rounded-xl border',
            isDarkMode ? 'bg-white/5 border-white/10' : 'bg-gray-50 border-gray-100'
          ]"
        >
          <div class="flex items-center space-x-3">
            <div class="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-500 to-cyan-400 p-[1px]">
              <div class="h-full w-full rounded-full bg-black flex items-center justify-center">
                  <span class="text-blue-400 font-bold text-xs">A</span>
              </div>
            </div>
            <div class="text-xs">
              <p :class="['font-bold', isDarkMode ? 'text-white' : 'text-gray-900']">ADMIN</p>
              <p :class="isDarkMode ? 'text-gray-400' : 'text-gray-500'">Online</p>
            </div>
          </div>
          
          <button
            @click="handleToggleTheme"
            :class="[
              'p-2 rounded-lg transition-all duration-300',
              isDarkMode
                ? 'text-yellow-400 hover:bg-white/10'
                : 'text-gray-400 hover:text-blue-600 hover:bg-white',
            ]"
          >
            <Sun v-if="isDarkMode" class="h-4 w-4" />
            <Moon v-else class="h-4 w-4" />
          </button>
        </div>
        <button
          @click="handleLogout"
          :class="[
            'w-full flex items-center justify-center px-4 py-3 rounded-xl transition-all duration-300 group border',
            isDarkMode
              ? 'border-blue-500/20 text-blue-400 hover:bg-blue-500/10 hover:border-blue-500/40 hover:shadow-[0_0_15px_rgba(59,130,246,0.2)]'
              : 'border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300 hover:text-blue-600',
          ]"
        >
          <LogOut class="h-5 w-5 mr-2 group-hover:-translate-x-1 transition-transform duration-300" />
          <span class="font-bold">Logout</span>
        </button>
      </div>
    </div>

    <!-- Main Content -->
    <div class="lg:pl-64 transition-all duration-300">
      <!-- Page Content -->
      <main class="p-4 lg:p-8 relative">
        <!-- Mobile Menu Button -->
        <button
          @click="sidebarOpen = !sidebarOpen"
          :class="[
            'lg:hidden absolute top-4 left-4 z-30 p-2 rounded-xl transition-colors shadow-lg',
            isDarkMode
              ? 'bg-black/40 text-white border border-white/10 backdrop-blur-md'
              : 'bg-white text-gray-900 border border-gray-200 shadow-sm',
          ]"
        >
          <Menu class="h-6 w-6" />
        </button>

        <router-view v-slot="{ Component }">
          <transition 
            enter-active-class="transition ease-out duration-300"
            enter-from-class="opacity-0 translate-y-4"
            enter-to-class="opacity-100 translate-y-0"
            leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100 translate-y-0"
            leave-to-class="opacity-0 translate-y-4"
          >
            <component :is="Component" />
          </transition>
        </router-view>
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
  Home,
  Clock,
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
  { path: "/history", label: "History", icon: Clock },
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

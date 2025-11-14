<template>
  <div
    :class="[
      'min-h-screen flex items-center justify-center px-4',
      isDarkMode
        ? 'bg-gray-900'
        : 'bg-linear-to-br from-blue-700 via-blue-800 to-blue-900',
    ]"
  >
    <div class="max-w-md w-full">
      <div
        :class="[
          'rounded-2xl shadow-2xl p-8',
          isDarkMode ? 'bg-gray-800' : 'bg-white',
        ]"
      >
        <div class="text-center mb-8">
          <div
            class="mx-auto h-16 w-16 bg-linear-to-r from-blue-700 to-blue-800 rounded-full flex items-center justify-center mb-4"
          >
            <Shield class="h-8 w-8 text-white" />
          </div>
          <h2
            :class="[
              'text-3xl font-bold',
              isDarkMode ? 'text-white' : 'text-gray-900',
            ]"
          >
            Security System
          </h2>
          <p :class="['mt-2', isDarkMode ? 'text-gray-400' : 'text-gray-600']">
            Sistem Keamanan Rumah Pintar
          </p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-6">
          <div>
            <label
              :class="[
                'block text-sm font-medium mb-2',
                isDarkMode ? 'text-gray-300' : 'text-gray-700',
              ]"
              >Email</label
            >
            <div class="relative">
              <Mail
                :class="[
                  'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5',
                  isDarkMode ? 'text-gray-500' : 'text-gray-400',
                ]"
              />
              <input
                v-model="form.email"
                type="email"
                required
                :class="[
                  'w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-700',
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300',
                ]"
                placeholder="admin@security.com"
              />
            </div>
          </div>

          <div>
            <label
              :class="[
                'block text-sm font-medium mb-2',
                isDarkMode ? 'text-gray-300' : 'text-gray-700',
              ]"
              >Password</label
            >
            <div class="relative">
              <Lock
                :class="[
                  'absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5',
                  isDarkMode ? 'text-gray-500' : 'text-gray-400',
                ]"
              />
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                required
                :class="[
                  'w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-blue-700',
                  isDarkMode
                    ? 'bg-gray-700 border-gray-600 text-white'
                    : 'bg-white border-gray-300',
                ]"
                placeholder="••••••••"
              />
              <button
                type="button"
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 transform -translate-y-1/2"
              >
                <Eye v-if="showPassword" class="h-5 w-5" />
                <EyeOff v-else class="h-5 w-5" />
              </button>
            </div>
          </div>

          <div
            v-if="errorMessage"
            :class="[
              'rounded-lg p-3',
              isDarkMode
                ? 'bg-red-900/20 text-red-400'
                : 'bg-red-50 text-red-600',
            ]"
          >
            {{ errorMessage }}
          </div>

          <button
            type="submit"
            :disabled="isLoading"
            class="w-full bg-linear-to-r from-blue-700 to-blue-800 text-white py-3 rounded-lg font-medium hover:from-blue-800 hover:to-blue-900 disabled:opacity-50"
          >
            <span v-if="isLoading">Loading...</span>
            <span v-else>Login</span>
          </button>

          <button
            type="button"
            @click="toggleTheme"
            :class="[
              'w-full flex items-center justify-center py-2 rounded-lg border',
              isDarkMode
                ? 'border-gray-600 text-gray-300'
                : 'border-gray-300 text-gray-700',
            ]"
          >
            <Sun v-if="isDarkMode" class="h-4 w-4 mr-2" />
            <Moon v-else class="h-4 w-4 mr-2" />
            {{ isDarkMode ? "Light Mode" : "Dark Mode" }}
          </button>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { Shield, Mail, Lock, Eye, EyeOff, Sun, Moon } from "lucide-vue-next";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../services/firebase";

const router = useRouter();
const form = ref({ email: "", password: "" });
const showPassword = ref(false);
const isLoading = ref(false);
const errorMessage = ref("");
const isDarkMode = ref(false);

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = "";

  try {
    // Login dengan Firebase Authentication
    const userCredential = await signInWithEmailAndPassword(
      auth,
      form.value.email,
      form.value.password
    );

    const user = userCredential.user;

    // Simpan token dan user info ke localStorage
    const token = await user.getIdToken();
    localStorage.setItem("authToken", token);
    localStorage.setItem("userEmail", user.email);
    localStorage.setItem("userId", user.uid);

    console.log("✅ Login berhasil:", user.email);

    // Redirect ke dashboard
    router.push("/dashboard");
  } catch (error) {
    console.error("❌ Login error:", error);

    // Handle berbagai error dari Firebase
    switch (error.code) {
      case "auth/user-not-found":
        errorMessage.value = "Email tidak terdaftar!";
        break;
      case "auth/wrong-password":
        errorMessage.value = "Password salah!";
        break;
      case "auth/invalid-email":
        errorMessage.value = "Format email tidak valid!";
        break;
      case "auth/too-many-requests":
        errorMessage.value = "Terlalu banyak percobaan. Coba lagi nanti.";
        break;
      case "auth/invalid-credential":
        errorMessage.value = "Email atau password salah!";
        break;
      default:
        errorMessage.value = "Login gagal. Silakan coba lagi.";
    }
  } finally {
    isLoading.value = false;
  }
};

const toggleTheme = () => {
  isDarkMode.value = !isDarkMode.value;
  localStorage.setItem("darkMode", isDarkMode.value.toString());
};

onMounted(() => {
  const savedTheme = localStorage.getItem("darkMode");
  if (savedTheme) isDarkMode.value = savedTheme === "true";
});
</script>

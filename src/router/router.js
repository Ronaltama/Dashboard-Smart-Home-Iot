import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Alarms from "../views/Alarms.vue";
import Snapshots from "../views/Snapshots.vue";
import Settings from "../views/Settings.vue";
import Layout from "../components/Layout.vue";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const routes = [
  {
    path: "/",
    redirect: "/login",
  },
  {
    path: "/login",
    name: "Login",
    component: Login,
  },
  {
    path: "/",
    component: Layout,
    meta: { requiresAuth: true },
    children: [
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "alarms",
        name: "Alarms",
        component: Alarms,
      },
      {
        path: "snapshots",
        name: "Snapshots",
        component: Snapshots,
      },
      {
        path: "settings",
        name: "Settings",
        component: Settings,
      },
    ],
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation guard dengan Firebase Auth check
let isAuthReady = false;

onAuthStateChanged(auth, (user) => {
  isAuthReady = true;
  if (user) {
    console.log("✅ User authenticated:", user.email);
  } else {
    console.log("⚠️ No user authenticated");
  }
});

router.beforeEach((to, from, next) => {
  // Tunggu Firebase Auth ready
  if (!isAuthReady) {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      unsubscribe();
      isAuthReady = true;

      if (to.meta.requiresAuth && !user) {
        next("/login");
      } else if (to.path === "/login" && user) {
        next("/dashboard");
      } else {
        next();
      }
    });
  } else {
    const user = auth.currentUser;

    if (to.meta.requiresAuth && !user) {
      next("/login");
    } else if (to.path === "/login" && user) {
      next("/dashboard");
    } else {
      next();
    }
  }
});

export default router;

import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Dashboard from "../views/Dashboard.vue";
import Layout from "../components/Layout.vue";
import { auth } from "../services/firebase";
import { onAuthStateChanged } from "firebase/auth";

const routes = [
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
        path: "",
        redirect: "/dashboard",
      },
      {
        path: "dashboard",
        name: "Dashboard",
        component: Dashboard,
      },
      {
        path: "history",
        name: "History",
        component: () => import("../views/History.vue"),
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

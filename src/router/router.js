import { createRouter, createWebHistory } from "vue-router";
import Login from "../views/Login.vue";
import Overview from "../views/Overview.vue";
import Alarms from "../views/Alarms.vue";
import Camera from "../views/Camera.vue";
import Access from "../views/Access.vue";
import Devices from "../views/Devices.vue";
import Settings from "../views/Settings.vue";
import Logs from "../views/Logs.vue";

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
    path: "/overview",
    name: "Overview",
    component: Overview,
    meta: { requiresAuth: true },
  },
  {
    path: "/alarms",
    name: "Alarms",
    component: Alarms,
    meta: { requiresAuth: true },
  },
  {
    path: "/camera",
    name: "Camera",
    component: Camera,
    meta: { requiresAuth: true },
  },
  {
    path: "/access",
    name: "Access",
    component: Access,
    meta: { requiresAuth: true },
  },
  {
    path: "/devices",
    name: "Devices",
    component: Devices,
    meta: { requiresAuth: true },
  },
  {
    path: "/settings",
    name: "Settings",
    component: Settings,
    meta: { requiresAuth: true },
  },
  {
    path: "/logs",
    name: "Logs",
    component: Logs,
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem("authToken");

  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!token) {
      next({ name: "Login" });
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

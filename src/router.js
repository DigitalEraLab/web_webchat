import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home/Home.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: Home,
    },
  ],
});

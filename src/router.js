import { createRouter, createWebHistory } from "vue-router";
import Home from "@/pages/Home/Home.vue";
import modify from "@/pages/Home/modify.vue";
import write from "@/pages/Home/write.vue";

export default createRouter({
  history: createWebHistory(),
  routes: [
    // {
    //   path: "/",
    //   component: Home,
    // },
    // {
    //   path: "/",
    //   component: modify,
    // },
    {
      path: "/",
      component: write,
    },
  ],
});

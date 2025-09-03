<template>
  <aside
    ref="target"
    :class="{
      'translate-x-0': sidebarStore.isSidebarOpen,
      '-translate-x-full': !sidebarStore.isSidebarOpen,
    }"
    class="fixed left-0 top-0 z-50 flex h-screen w-72 flex-col overflow-y-hidden bg-gradient-to-br from-blue-800 via-blue-900 to-indigo-900 shadow-2xl transition-transform duration-300 ease-in-out lg:static lg:translate-x-0"
  >
    <!-- Sidebar Header with glass effect -->
    <div class="relative border-b border-white/10 backdrop-blur-sm">
      <div class="flex items-center justify-between px-6 py-5 lg:py-6">
        <router-link to="/" class="flex items-center space-x-3">
          <img src="@/assets/images/logo/logo.svg" alt="Logo" class="h-8 w-auto" />
          <span class="text-xl font-bold text-white">Admin</span>
        </router-link>

        <button
          class="rounded-lg p-1.5 text-blue-100 transition-all duration-200 hover:bg-white/10 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-400 lg:hidden"
          @click="sidebarStore.isSidebarOpen = false"
        >
          <svg
            class="h-6 w-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>
    </div>

    <!-- Sidebar Content with improved styling -->
    <div class="flex-1 overflow-y-auto px-4 py-2">
      <nav class="space-y-6">
        <template v-for="menuGroup in menuGroups" :key="menuGroup.name">
          <div class="space-y-3">
            <h3 class="px-4 text-xs font-semibold uppercase tracking-wider text-blue-200/80">
              {{ menuGroup.name }}
            </h3>

            <ul class="space-y-1">
              <!-- Menu Item Component -->
              <li v-for="(menuItem, index) in menuGroup.menuItems" :key="index">
                <router-link
                  v-if="!menuItem.children"
                  :to="menuItem.route"
                  class="flex items-center rounded-lg px-4 py-2.5 text-sm font-medium text-blue-100/80 transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-lg"
                >
                  <i
                    v-if="menuItem.icon"
                    :class="`fa fa-${menuItem.icon}`"
                    class="mr-3 h-5 w-5 flex-shrink-0 opacity-80"
                  ></i>
                  <span>{{ menuItem.label }}</span>
                </router-link>

                <div v-else class="space-y-1">
                  <button
                    @click="toggleMenu(index)"
                    class="flex w-full items-center justify-between rounded-lg px-4 py-2.5 text-sm font-medium text-blue-100/80 transition-all duration-200 hover:bg-white/10 hover:text-white"
                  >
                    <div class="flex items-center">
                      <i
                        v-if="menuItem.icon"
                        :class="`fa fa-${menuItem.icon}`"
                        class="mr-3 h-5 w-5 flex-shrink-0 opacity-80"
                      ></i>
                      <span>{{ menuItem.label }}</span>
                    </div>
                    <svg
                      class="h-4 w-4 transform transition-transform duration-200"
                      :class="{ 'rotate-180': openMenus[index] }"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </button>

                  <div v-show="openMenus[index]" class="space-y-1 pl-11">
                    <router-link
                      v-for="child in menuItem.children"
                      :key="child.label"
                      :to="child.route"
                      class="block rounded-lg px-4 py-2 text-sm text-blue-200/60 transition-all duration-200 hover:bg-white/10 hover:text-white hover:shadow-md"
                    >
                      {{ child.label }}
                    </router-link>
                  </div>
                </div>
              </li>
            </ul>
          </div>
        </template>
      </nav>
    </div>

    <!-- Bottom gradient effect -->
    <div class="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-blue-900 to-transparent"></div>
  </aside>
</template>

<script setup>
import { useSidebarStore } from "@/stores/sidebar";
import { onClickOutside } from "@vueuse/core";
import { ref, reactive } from "vue";

const target = ref(null);
const sidebarStore = useSidebarStore();
const openMenus = reactive({});

const toggleMenu = (index) => {
  openMenus[index] = !openMenus[index];
};

onClickOutside(target, () => {
  sidebarStore.isSidebarOpen = false;
});

const menuGroups = ref([
  {
    name: "MENU",
    menuItems: [
      {
        icon: `sitemap`,
        label: "Dashboard",
        route: "#",
        children: [{ label: "eCommerce", route: "/admin" }],
      },
      {
        icon: `boxes-stacked`,
        label: "Products",
        route: "#",
        children: [
          { label: "Import product", route: "/admin/products/import" },
          { label: "List products", route: "/admin/products/list" },
          { label: "Category product", route: "/admin/products/categories" },
        ],
      },
      {
        icon: "users",
        label: "Customer",
        route: "#",
        children: [{ label: "Customer management", route: "/admin/customers" }],
      },
     
      {
        icon: "truck",
        label: "Order",
        route: "/admin/order",
      },
    ],
  },
]);
</script>

<style scoped>
.overflow-y-auto {
  scrollbar-width: thin;
  scrollbar-color: rgba(147, 197, 253, 0.3) transparent;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 4px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: transparent;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background-color: rgba(147, 197, 253, 0.3);
  border-radius: 20px;
}
</style>
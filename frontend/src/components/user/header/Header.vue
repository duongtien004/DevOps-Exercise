<template>
  <header class="bg-white shadow-sm">
    <nav class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex items-center justify-between h-16">
        <!-- Logo -->
        <div class="flex-shrink-0">
          <RouterLink to="/" class="text-2xl font-bold text-indigo-600"
            >E-Shop</RouterLink
          >
        </div>

        <!-- Search Bar -->
        <div class="flex-1 max-w-lg mx-8">
          <div class="relative">
            <input
              @keyup.enter="handleSearch"
              type="text"
              v-model="searchQuery"
              placeholder="Tìm kiếm sản phẩm..."
              class="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <button
              @click="handleSearch"
              class="absolute right-3 top-2.5 text-gray-400 hover:text-indigo-600"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
        </div>

        <!-- Right Section -->
        <div class="flex items-center space-x-4">
          <!-- Cart -->
          <RouterLink to="/cart" class="text-gray-500 hover:text-indigo-600">
            <div class="relative">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                />
              </svg>
              <span
                v-if="cartItemCount > 0 && userStore.user.isAuthenticated"
                class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full text-xs w-5 h-5 flex items-center justify-center"
              >
                {{ cartItemCount }}
              </span>
            </div>
          </RouterLink>

          <!-- Auth Section -->
          <!-- !userStore.user.isAuthenticated -->
          <div
            v-if="!userStore.user.isAuthenticated"
            class="flex items-center space-x-2"
          >
            <button
              @click="handleLogin"
              class="px-4 py-2 text-sm font-medium rounded-md border hover:bg-indigo-700 text-indigo-600 hover:text-white"
            >
              Đăng nhập
            </button>
            <button
              @click="handleSignup"
              class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border rounded-md hover:bg-white hover:text-indigo-600"
            >
              Đăng ký
            </button>
          </div>

          <!-- User Profile Dropdown -->
          <div v-else class="relative">
            <button
              @click="toggleDropdown"
              class="flex items-center space-x-2 focus:outline-none"
            >
              <img
                :src="
                  userStore.user.avatar
                    ? 'http://127.0.0.1:8088' + userStore.user.avatar
                    : 'https://i.pinimg.com/1200x/bc/43/98/bc439871417621836a0eeea768d60944.jpg'
                "
                alt="User avatar"
                class="w-8 h-8 rounded-full object-cover border-2 border-indigo-600"
              />
              <svg
                :class="{ 'rotate-180': isDropdownOpen }"
                class="w-4 h-4 transition-transform duration-200"
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

            <!-- Dropdown Menu -->
            <div
              v-if="isDropdownOpen"
              class="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-50"
            >
              <div class="px-4 py-2 border-b">
                <p class="text-sm font-medium text-gray-900">
                  {{ userStore.user.name }}
                </p>
                <p class="text-sm text-gray-500">{{ userStore.user.email }}</p>
              </div>

              <RouterLink
                v-for="(item, index) in menuItems"
                :key="index"
                :to="item.to"
                class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                @click="isDropdownOpen = false"
              >
                {{ item.label }}
              </RouterLink>

              <button
                @click="handleLogout"
                class="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
              >
                Đăng xuất
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  </header>
</template>

<script setup>
import { ref, computed, onBeforeUnmount, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { useUserStore } from "@/stores/user";
import oauthServices from "@/services/oauthServices";

const userStore = useUserStore();
const router = useRouter();
const cartStore = useCartStore();
const isDropdownOpen = ref(false);

const menuItems = [
  {
    label: "Thông tin cá nhân",
    to: { name: "myaccount", query: { tab: "profile" } },
  },
];
// State
const searchQuery = ref("");
const cartItemCount = computed(() => cartStore.items.length); // Example count

// Methods
const handleSearch = () => {
  if (searchQuery.value.trim() !== "") {
    router.push({ name: "search", query: { q: searchQuery.value } });
  }
};

const handleLogin = () => {
  router.push({ name: "login" });
};

const handleSignup = () => {
  router.push({ name: "register" });
};
const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

// Close dropdown when clicking outside
const closeDropdown = (e) => {
  if (!e.target.closest(".relative")) {
    isDropdownOpen.value = false;
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener("click", closeDropdown);
});

onBeforeUnmount(() => {
  document.removeEventListener("click", closeDropdown);
});

const handleLogout = async () => {
  await oauthServices.logout(userStore.user.access, userStore.user.refresh);
  userStore.removeToken();
  userStore.$reset();
  router.push("/login");
};
</script>

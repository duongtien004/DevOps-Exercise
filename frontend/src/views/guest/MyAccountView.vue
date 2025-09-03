<script setup>
import { ref, watch, onMounted, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";
import oauthServices from "@/services/oauthServices";
import { useUserStore } from "@/stores/user";
import orderServices from "@/services/orderServices";
import Pagination from "@/components/user/pagination/Pagination.vue";
import { loadScript } from "@paypal/paypal-js";
const userStore = useUserStore();
const route = useRoute();
const router = useRouter();

const activeTab = ref(route.query.tab);
watch(
  () => route.query.tab,
  (newTab) => {
    activeTab.value = newTab || "profile";
  }
);

const profileData = ref({
  name: "",
  email: "",
  phone: "",
  avatar: null,
});

const orders = ref([]);
const currentPage = ref(parseInt(route.params.page) || 1);
const totalPages = ref(0);
const itemsPerPage = ref(5);
const fetchOrder = async () => {
  await orderServices.getByUser({
    limit: itemsPerPage.value,
    page: currentPage.value - 1,
  })
    .then(response => {
      orders.value = response.data.data
      totalPages.value = response.data.totalPage
    })
    .catch(error => {
      console.error(error)
    })
}

onBeforeMount(
  fetchOrder
)
// Event handlers
const handlePageChange = (page) => {
  currentPage.value = page;
  router.push({
    name: "myaccount",
    query: {
      ...route.query,
      page: page
    }
  });
};
watch(
  () => [route.params.page],
  async ([newPage]) => {
    if (newPage) {
      currentPage.value = parseInt(newPage);
    }
    await fetchOrder();
  },
  { immediate: true }
);
// Refs for avatar upload
const fileInput = ref(null);
const previewImage = ref(null);
const isUploading = ref(false);
const uploadProgress = ref(0);

const handleFileSelect = (event) => {
  const file = event.target.files[0];
  if (file) {
    if (file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (e) => {
        previewImage.value = e.target.result;
        profileData.value.avatar = e.target.result;
      };
      reader.readAsDataURL(file);
      simulateUpload();
    } else {
      alert("Please select an image file");
    }
  }
};

const simulateUpload = () => {
  isUploading.value = true;
  uploadProgress.value = 0;

  const interval = setInterval(() => {
    if (uploadProgress.value < 100) {
      uploadProgress.value += 10;
    } else {
      clearInterval(interval);
      isUploading.value = false;
    }
  }, 100);
};

const triggerFileInput = () => {
  fileInput.value.click();
};

const getUser = async () => {
  userStore.initStore();

  const userResponse = await oauthServices.getme(
    userStore.user.access,
    userStore.user.id
  );

  profileData.value = {
    name: userResponse.data.data.name,
    email: userResponse.data.data.email,
    phone: userResponse.data.data.phone,
    avatar: userResponse.data.data.avatar,
  };
};

const handleProfileUpdate = async (event) => {
  event.preventDefault();
  await oauthServices.updateProfile(userStore.user.id, profileData.value).then((res) => {
    console.log(res.data)
  });
};

function showTab(tabName) {
  activeTab.value = tabName;
  router.push({ query: { ...route.query, tab: tabName } });
}
onMounted(() => getUser());
const handleToOrderDetail = (id) => {
  router.push({ name: "order-detail", query: { order: id } })
}

</script>

<template>
  <DefaultLayout>
    <div class="container mx-auto px-4 py-8 max-w-7xl">
      <div class="flex flex-col md:flex-row gap-8">
        <!-- Sidebar for Tabs -->
        <div class="md:w-1/4">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <h2 class="text-xl font-semibold text-gray-800 mb-6">
              Account Settings
            </h2>
            <ul class="space-y-2">
              <li>
                <button class="w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-left"
                  :class="activeTab === 'profile'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    " @click="showTab('profile')">
                  <font-awesome-icon icon="id-card" class="w-5 h-5 mr-3" :class="activeTab === 'profile'
                    ? 'text-blue-600'
                    : 'text-gray-400'
                    " />
                  <span class="font-medium">Profile</span>
                </button>
              </li>
              <li>
                <button class="w-full flex items-center px-4 py-3 rounded-lg transition-all duration-200 text-left"
                  :class="activeTab === 'orders'
                    ? 'bg-blue-50 text-blue-600'
                    : 'text-gray-600 hover:bg-gray-50'
                    " @click="showTab('orders')">
                  <font-awesome-icon icon="clipboard-list" class="w-5 h-5 mr-3" :class="activeTab === 'orders' ? 'text-blue-600' : 'text-gray-400'
                    " />
                  <span class="font-medium">Orders</span>
                </button>
              </li>
            </ul>
          </div>
        </div>

        <!-- Tab Content -->
        <div class="flex-1">
          <div class="bg-white rounded-xl shadow-sm p-6">
            <!-- Profile Tab -->
            <div v-show="activeTab === 'profile'">
              <h2 class="text-2xl font-semibold text-gray-800 mb-8">
                Profile Information
              </h2>
              <form @submit="handleProfileUpdate" class="space-y-8">
                <!-- Avatar Upload Section -->
                <div class="flex items-center gap-6">
                  <div class="relative group">
                    <input type="file" ref="fileInput" @change="handleFileSelect" accept="image/*" class="hidden" />
                    <div class="relative">
                      <img :src="previewImage ||
                        'http://127.0.0.1:8088' + profileData.avatar" alt=" Profile"
                        class="w-24 h-24 rounded-full object-cover ring-4 ring-gray-100" />
                      <!-- Upload Progress Overlay -->
                      <div v-if="isUploading"
                        class="absolute inset-0 bg-black bg-opacity-50 rounded-full flex items-center justify-center">
                        <div class="text-white text-sm font-medium">
                          {{ uploadProgress }}%
                        </div>
                      </div>
                      <!-- Hover Overlay -->
                      <div @click="triggerFileInput"
                        class="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 rounded-full flex items-center justify-center cursor-pointer transition-all duration-200">
                        <div class="text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                          <font-awesome-icon icon="camera" class="w-6 h-6" />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 class="text-lg font-medium text-gray-900">
                      Profile Photo
                    </h3>
                    <p class="text-sm text-gray-500 mt-1">
                      Click the image to update your profile picture
                    </p>
                  </div>
                </div>

                <div class="grid md:grid-cols-2 gap-6">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Full Name</label>
                    <input type="text" v-model="profileData.name"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                  </div>

                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Email Address</label>
                    <input type="email" v-model="profileData.email"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                  </div>

                  <div class="space-y-2">
                    <label class="text-sm font-medium text-gray-700">Phone Number</label>
                    <input type="tel" v-model="profileData.phone"
                      class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200" />
                  </div>
                </div>

                <div class="pt-6">
                  <button type="submit"
                    class="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:ring-4 focus:ring-blue-200 transition-all duration-200">
                    Save Changes
                  </button>
                </div>
              </form>
            </div>

            <!-- Orders Tab -->
            <div v-show="activeTab === 'orders'">
              <h2 class="text-2xl font-semibold text-gray-800 mb-8">
                Order History
              </h2>
              <div class="space-y-6">
                <div v-for="order in orders" :key="order.id"
                  class="border border-gray-100 rounded-xl p-6 hover:shadow-md transition-all duration-200">
                  <div class="flex justify-between items-start mb-6">
                    <div>
                      <h3 class="text-lg font-semibold text-gray-800">
                        {{ order._id }}
                      </h3>
                      <p class="text-sm text-gray-500 mt-1">
                        Ordered on {{ order.createdAt }}
                      </p>
                    </div>
                    <span :class="{
                      'px-4 py-1.5 rounded-full text-sm font-medium': true,
                      'bg-green-50 text-green-700':
                        order.orderStatus === 'Paid',
                      'bg-blue-50 text-blue-700':
                        order.orderStatus === 'Pending',
                    }">
                      {{ order.orderStatus }}
                    </span>
                  </div>

                  <div class="space-y-3">
                    <div v-for="item in order.orderItems" :key="item.name"
                      class="flex justify-between items-center py-2">
                      <div class="flex items-center gap-4">
                        <div class="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                          <img :src="'http://127.0.0.1:8088/' + item.image" alt="">
                        </div>
                        <div>
                          <p class="font-medium text-gray-800">
                            {{ item.name }}
                          </p>
                          <p class="text-sm text-gray-500">
                            Qty: {{ item.amount }}
                          </p>
                        </div>
                      </div>
                      <span class="font-medium text-gray-800">{{ item.price }}</span>
                    </div>

                  </div>

                  <div class="mt-6 pt-6 border-t border-gray-100 flex justify-between items-center">
                    <div>
                      <span class="text-sm text-gray-500">Total Price</span>
                      <p class="text-lg font-semibold text-gray-800 mt-1">
                        {{ order.totalPrice }}
                      </p>
                    </div>
                    <button @click="handleToOrderDetail(order._id)"
                      class="px-4 py-2 text-blue-600 font-medium hover:text-blue-700 transition-colors">
                      View Details
                    </button>

                  </div>
                </div>
                <!-- Pagination -->
                <Pagination :total-page="totalPages" :current-page="currentPage" :max-visible-pages="5"
                  @page-changed="handlePageChange" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

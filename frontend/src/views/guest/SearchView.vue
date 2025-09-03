<script setup>
import { computed, onBeforeMount, ref, watch } from "vue";
import { useRoute, useRouter } from "vue-router";
import { FontAwesomeIcon } from "@fortawesome/vue-fontawesome";

import Pagination from "@/components/user/pagination/Pagination.vue";
import ProductList from "@/components/user/product/ProductList.vue";
import SidebarLayout from "@/layouts/user/SidebarLayout.vue";
import productServices from "@/services/productServices";

// Router setup
const router = useRouter();
const route = useRoute();

// State management
const products = ref([]);
const loading = ref(false);
const error = ref(null);

// Pagination state
const itemsPerPage = ref(5);
const currentPage = ref(parseInt(route.query.page) || 1);
const totalPages = ref(0);

// Filter and sort state
const sortOrder = ref("");
const openFilterModal = ref(false);
const filterOptions = ref({
    minPrice: null,
    maxPrice: null,
    starRating: null,
});

// UI state
const minPrice = ref("");
const maxPrice = ref("");
const starRating = ref("");

// Fetch products with error handling
const fetchProducts = async () => {
    loading.value = true;
    error.value = null;

    try {
        const params = {
            limit: itemsPerPage.value,
            page: currentPage.value - 1,
            sort: sortOrder.value,
            ...filterOptions.value
        };

        // Add search query if present
        if (route.query.q) {
            params.filter = ["name", route.query.q.toLowerCase()];
        }

        const response = await productServices.gets(params);
        products.value = response.data.data;
        totalPages.value = response.data.totalPage;
    } catch (err) {
        error.value = "Failed to fetch products. Please try again later.";
        console.error("Error fetching products:", err);
    } finally {
        loading.value = false;
    }
};

// Filter handlers
const applyFilter = () => {
    filterOptions.value = {
        minPrice: minPrice.value || null,
        maxPrice: maxPrice.value || null,
        starRating: starRating.value || null,
    };
    closeModal();
    fetchProducts();
};

const closeModal = () => {
    openFilterModal.value = false;
};

const handleSort = () => {
    fetchProducts();
};

// Pagination handlers
const handlePageChange = (page) => {
    currentPage.value = page;
    router.push({
        name: "search",
        query: { ...route.query, page }
    });
};

// Watchers
watch(() => route.query.page, (newPage) => {
    currentPage.value = parseInt(newPage) || 1;
    fetchProducts();
});

watch(() => route.query.q, () => {
    currentPage.value = 1;
    fetchProducts();
});

// Lifecycle
onBeforeMount(fetchProducts);
</script>

<template>
    <SidebarLayout>
        <!-- Header Section -->
        <div class="flex items-center mb-4">
            <h1 class="text-2xl font-bold flex-1">
                Search Results for "{{ route.query.q }}"
            </h1>

            <div class="flex items-center space-x-4">
                <button @click="openFilterModal = true"
                    class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition" title="Open filters">
                    <FontAwesomeIcon icon="filter" />
                </button>

                <select v-model="sortOrder" @change="handleSort"
                    class="px-4 py-2 rounded-lg bg-slate-100 border-gray-300">
                    <option value="" disabled>Sort</option>
                    <option value="asc">Price: Low to High</option>
                    <option value="desc">Price: High to Low</option>
                </select>
            </div>
        </div>

        <!-- Loading and Error States -->
        <div v-if="loading" class="text-center py-8">
            Loading products...
        </div>

        <div v-else-if="error" class="text-red-500 text-center py-8">
            {{ error }}
        </div>

        <!-- Products Grid -->
        <ProductList v-else :products="products" :sort="sortOrder" :filter-options="filterOptions" />

        <!-- Filter Modal -->
        <div v-if="openFilterModal" class="fixed inset-0 bg-black bg-opacity-50 flex justify-end z-50"
            @click.self="closeModal">
            <div class="bg-white w-80 h-full p-6 shadow-lg animate-slide-in">
                <h2 class="text-xl font-semibold mb-4">Filter Options</h2>

                <!-- Price Range Filter -->
                <div class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">Price Range</label>
                    <div class="flex space-x-2">
                        <input type="number" v-model="minPrice" placeholder="Min"
                            class="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500" min="0" />
                        <input type="number" v-model="maxPrice" placeholder="Max"
                            class="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500" min="0" />
                    </div>
                </div>

                <!-- Star Rating Filter -->
                <div class="mb-6">
                    <label class="block text-gray-700 font-medium mb-2">Star Rating</label>
                    <div class="space-y-2">
                        <label v-for="rating in ['', '1', '2', '3', '4', '5']" :key="rating" class="flex items-center">
                            <input type="radio" v-model="starRating" :value="rating" class="mr-2" />
                            {{ rating ? `${rating} Star${rating === '1' ? '' : 's'} & Up` : 'Any' }}
                        </label>
                    </div>
                </div>

                <button @click="applyFilter"
                    class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition">
                    Apply Filters
                </button>
            </div>
        </div>

        <!-- Pagination -->
        <Pagination v-if="totalPages > 1" :total-page="totalPages" :current-page="currentPage" :max-visible-pages="5"
            @page-changed="handlePageChange" />
    </SidebarLayout>
</template>

<style scoped>
.animate-slide-in {
    animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
    from {
        transform: translateX(100%);
    }

    to {
        transform: translateX(0);
    }
}
</style>
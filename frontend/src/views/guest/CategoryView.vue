<template>
    <SidebarLayout>
        <!-- Header Controls -->
        <div class="flex justify-end items-center mb-4 space-x-4">
            <!-- Filter Button -->
            <button @click="openFilterModal = true"
                class="px-4 py-2 bg-gray-300 rounded-lg hover:bg-gray-400 transition-colors"
                aria-label="Open filter options">
                <font-awesome-icon icon="filter" />
            </button>

            <!-- Sort Dropdown -->
            <div class="relative">
                <select v-model="sortOrder" @change="handleSort"
                    class="px-4 py-2 rounded-lg bg-slate-100 hover:bg-slate-200 transition-colors cursor-pointer">
                    <option value="" disabled>Sort</option>
                    <option value="asc">Giá thấp đến cao</option>
                    <option value="desc">Giá cao đến thấp</option>
                </select>
            </div>
        </div>

        <!-- Product List -->
        <ProductList :products="productsByCategory" :loading="loading" :sort="sortOrder" :filterOptions="filterOptions"
            :title="category?.title || 'Products'" />

        <!-- Pagination -->
        <Pagination :total-page="totalPages" :current-page="currentPage" :max-visible-pages="5"
            @page-changed="handlePageChange" />

        <!-- Filter Modal -->
        <Transition enter-active-class="transition ease-out duration-300" enter-from-class="opacity-0"
            enter-to-class="opacity-100" leave-active-class="transition ease-in duration-200"
            leave-from-class="opacity-100" leave-to-class="opacity-0">
            <div v-if="openFilterModal" class="fixed inset-0 bg-black bg-opacity-50 z-50" @click.self="closeModal">
                <div class="absolute right-0 top-0 h-full w-80 bg-white p-6 shadow-lg transform transition-transform"
                    :class="{ 'translate-x-0': openFilterModal, 'translate-x-full': !openFilterModal }">
                    <div class="flex justify-between items-center mb-6">
                        <h2 class="text-xl font-semibold">Filter Options</h2>
                        <button @click="closeModal" class="text-gray-500 hover:text-gray-700"
                            aria-label="Close filter modal">
                            <font-awesome-icon icon="times" />
                        </button>
                    </div>

                    <!-- Price Range Filter -->
                    <div class="mb-6">
                        <label class="block text-gray-700 font-medium mb-2">Price Range</label>
                        <div class="flex space-x-2">
                            <input type="number" v-model="minPrice" placeholder="Min" min="0"
                                class="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                            <input type="number" v-model="maxPrice" placeholder="Max" min="0"
                                class="w-1/2 p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500" />
                        </div>
                    </div>

                    <!-- Star Rating Filter -->
                    <div class="mb-6">
                        <label class="block text-gray-700 font-medium mb-2">Star Rating</label>
                        <div class="space-y-2">
                            <label v-for="rating in ['', '1', '2', '3', '4', '5']" :key="rating"
                                class="flex items-center space-x-2 cursor-pointer hover:bg-gray-50 p-2 rounded">
                                <input type="radio" v-model="starRating" :value="rating"
                                    class="text-blue-500 focus:ring-blue-500" />
                                <span>{{ rating === '' ? 'Any' : `${rating} Star${rating === '1' ? '' : 's'} & Up`
                                    }}</span>
                            </label>
                        </div>
                    </div>

                    <!-- Apply Button -->
                    <button @click="applyFilter"
                        class="w-full py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
                        Apply Filters
                    </button>
                </div>
            </div>
        </Transition>
    </SidebarLayout>
</template>

<script setup>
import { ref, watch, onBeforeMount } from "vue";
import { useRoute, useRouter } from "vue-router";
import SidebarLayout from "@/layouts/user/SidebarLayout.vue";
import ProductList from "@/components/user/product/ProductList.vue";
import Pagination from "@/components/user/pagination/Pagination.vue";
import categoryServices from "@/services/categoryServices";
import productServices from "@/services/productServices";

// Router setup
const router = useRouter();
const route = useRoute();

// State management
const loading = ref(false);
const category = ref({});
const productsByCategory = ref([]);
const sortOrder = ref("");
const openFilterModal = ref(false);
const currentPage = ref(parseInt(route.params.page) || 1);
const totalPages = ref(0);
const itemsPerPage = ref(5);

// Filter state
const minPrice = ref("");
const maxPrice = ref("");
const starRating = ref("");
const filterOptions = ref({
    minPrice: null,
    maxPrice: null,
    starRating: null,
});

//API calls
const fetchCategory = async () => {
    try {
        const response = await categoryServices.gets({
            limit: 1,
            filter: ["slug", route.params.categorySlug]
        });
        category.value = response.data.data[0];
    } catch (error) {
        console.error("Error fetching category:", error);
    }
};

const fetchProducts = async () => {
    if (!category.value._id) return;

    loading.value = true;
    try {
        const response = await productServices.gets({
            limit: itemsPerPage.value,
            page: currentPage.value - 1,
            filter: ["category", category.value._id],
            sort: sortOrder.value
        });

        productsByCategory.value = response.data.data;
        totalPages.value = response.data.totalPage;
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        loading.value = false;
    }
};

// Lifecycle hooks
onBeforeMount(async () => {
    await fetchCategory();
    await fetchProducts();
});

// Watchers
watch(
    () => [route.params.page, route.params.categorySlug],
    async ([newPage, newCategorySlug]) => {
        if (newPage) {
            currentPage.value = parseInt(newPage);
        }

        if (newCategorySlug) {
            await fetchCategory();
            await fetchProducts();
        }
    },
    { immediate: true }
);

watch(
    () => filterOptions.value,
    async () => {
        currentPage.value = 1;
        await fetchProducts();
    },
    { deep: true }
);

// Event handlers
const handlePageChange = (page) => {
    currentPage.value = page;
    router.push({
        name: "category",
        query: {
            ...route.query,
            page: page
        }
    });
};

const handleSort = async () => {
    currentPage.value = 1;
    await fetchProducts();
};

const closeModal = () => {
    openFilterModal.value = false;
};

const applyFilter = () => {
    filterOptions.value = {
        minPrice: minPrice.value || null,
        maxPrice: maxPrice.value || null,
        starRating: starRating.value || null,
    };
    closeModal();
};
</script>
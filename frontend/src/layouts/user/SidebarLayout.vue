<template>
    <div class="">
        <Header />
        <div class="flex mt-10">
            <!-- Left Sidebar -->
            <aside class="w-1/4 bg-white p-4 shadow-lg rounded-lg">
                <h2 class="text-xl font-bold mb-4">Categories</h2>
                <ul class="space-y-2">
                    <li v-for="category in visibleCategories" :key="category._id"
                        class="w-full hover:bg-gray-300 p-2 flex items-center space-x-3 rounded-lg">
                        <RouterLink :to="{
                            name: 'category',
                            params: { categorySlug: category.slug },
                        }" class="text-black w-full block  items-center">
                            <span>{{ category.title }} ({{ getTotalItems(category._id) }})</span>
                        </RouterLink>
                    </li>
                </ul>
                <button v-if="hasMoreCategories" @click="loadMoreCategories"
                    class="mt-4 p-2 text-black hover:underline">
                    Xem Thêm
                </button>
            </aside>

            <!-- Main Content - Product List -->
            <div class="w-3/4 ml-8">
                <slot></slot>
            </div>
        </div>
        <Footer />
    </div>
</template>
<script setup>
import { RouterLink } from "vue-router";
import { computed, onBeforeMount, ref } from "vue";

import categoryServices from "@/services/categoryServices";
import productServices from "@/services/productServices";

import Header from "@/components/user/header/Header.vue";
import Footer from "@/components/user/footer/Footer.vue";

const categories = ref([]);
const products = ref([]);
const displayedCount = ref(2);

const visibleCategories = computed(() => {
    return categories.value.slice(0, displayedCount.value);
});
const hasMoreCategories = computed(
    () => displayedCount.value < categories.value.length
);

const fetchCategory = async () => {
    await categoryServices.gets()
        .then(response => {
            categories.value = response.data.data

        })
        .catch(error => {
            console.error(error)
        })
}

const fetchProduct = async () => {
    await productServices.gets()
        .then(response => {
            products.value = response.data.data
        })
        .catch(error => {
            console.error(error)
        })
}
onBeforeMount(() => {
    fetchProduct()
    fetchCategory()
})

const loadMoreCategories = () => {
    displayedCount.value += 10;
};
const getTotalItems = (categoryId) => {
    return products.value.filter((p) => p.category === categoryId).length;
};
</script>

<style scoped></style>

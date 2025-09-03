<template>
    <section class="">
        <div class="container mx-auto px-4">
            <div class="grid grid-cols-1">
                <div class="col-span-1">
                    <div class="tabs product-tabs">
                        <div class="tabs-header flex justify-between border-b my-2">
                            <h3 class="text-lg font-semibold">{{ title }}</h3>
                        </div>

                        <div class="tab-content" id="nav-tabContent">
                            <div class="sm:block">
                                <div
                                    class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-4">
                                    <!-- Product -->

                                    <div v-if="sortedProducts.length !== 0" class="col"
                                        v-for="(item, index) in sortedProducts" :key="index">
                                        <ProductCard :item="item" />
                                    </div>
                                    <h3 v-else>No product</h3>
                                </div>
                                <!--product-->
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script setup>
import { defineProps, computed } from "vue";
import ProductCard from "./ProductCard.vue";

const props = defineProps({
    title: {
        type: String,
    },
    sort: {
        type: String,
    },
    filterOptions: {
        type: Object,
        default: () => ({
            minPrice: null,
            maxPrice: null,
            starRating: null,
        }),
    },
    products: {
        type: Array,
        required: true,
    },
});

// Sorting and filter logic
const sortedProducts = computed(() => {
    const { minPrice, maxPrice, starRating } = props.filterOptions || {
        minPrice: null,
        maxPrice: null,
        starRating: null,
    };

    // Step 1: Filter products by both price range and star rating
    let filteredProducts = props.products.filter((product) => {
        const inPriceRange =
            (minPrice === null || product.price >= minPrice) &&
            (maxPrice === null || product.price <= maxPrice);

        const meetsStarRating = starRating === null || product.rating >= starRating;

        return inPriceRange && meetsStarRating;
    });
    console.log(filteredProducts);

    // Step 2: Sort the filtered products
    if (props.sort === "asc") {
        filteredProducts = filteredProducts.sort((a, b) => a.price - b.price);
    } else if (props.sort === "desc") {
        filteredProducts = filteredProducts.sort((a, b) => b.price - a.price);
    }

    return filteredProducts;
});
</script>

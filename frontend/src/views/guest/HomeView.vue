<template>
  <DefaultLayout>
    <!-- Hero Section -->
    <section class="relative bg-white overflow-hidden">
      <div class="max-w-7xl mx-auto">
        <div class="relative z-10 pb-8 bg-white sm:pb-16 md:pb-20 lg:max-w-2xl lg:w-full lg:pb-28 xl:pb-32">
          <main class="mt-10 mx-auto max-w-7xl px-4 sm:mt-12 sm:px-6 md:mt-16 lg:mt-20 lg:px-8 xl:mt-28">
            <div class="sm:text-center lg:text-left">
              <h1 class="text-4xl tracking-tight font-extrabold text-gray-900 sm:text-5xl md:text-6xl">
                <span class="block xl:inline">Mua sắm thông minh</span>
                <span class="block text-indigo-600 xl:inline">giá tốt mỗi ngày</span>
              </h1>

              <p
                class="mt-3 text-base text-gray-500 sm:mt-5 sm:text-lg sm:max-w-xl sm:mx-auto md:mt-5 md:text-xl lg:mx-0">
                Khám phá hàng ngàn sản phẩm chất lượng với giá ưu đãi. Giao hàng nhanh chóng và đảm bảo toàn quốc.
              </p>

              <div class="mt-5 sm:mt-8 sm:flex sm:justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-3">
                <button @click="navigateToShop"
                  class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200 md:py-4 md:text-lg md:px-10">
                  Mua ngay
                </button>

                <button @click="navigateToCategory"
                  class="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 transition-colors duration-200 md:py-4 md:text-lg md:px-10">
                  Xem thêm
                </button>
              </div>
            </div>
          </main>
        </div>
      </div>

      <div class="lg:absolute lg:inset-y-0 lg:right-0 lg:w-2/5">
        <img class="h-56 w-full object-cover sm:h-72 md:h-96 lg:w-full lg:h-full"
          src="https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80"
          alt="E-shop hero image" loading="eager">
      </div>
    </section>

    <!-- Promotion Cards Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">Ưu đãi hot</h2>
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        <PromotionCard v-for="promo in promotions" :key="promo.id" :promo="promo" />

      </div>
    </section>

    <!-- Featured Products Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="flex justify-between items-center mb-8">
        <h2 class="text-2xl font-bold text-gray-900">Sản phẩm nổi bật</h2>
        <button @click="navigateToShop" class="text-indigo-600 hover:text-indigo-800 font-medium">
          Xem tất cả
        </button>
      </div>

      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        <ProductCard v-for="product in featuredProducts" :key="product._id" :item="product" />
      </div>
    </section>

    <!-- Categories Section -->
    <section class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h2 class="text-2xl font-bold text-gray-900 mb-8">Danh mục sản phẩm</h2>
      <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

        <CategoryCard v-for="category in categories" :key="category._id" :category="category" />
      </div>
    </section>
  </DefaultLayout>
</template>

<script setup>
import { onBeforeMount, onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'

import productServices from '@/services/productServices'
import categoryServices from '@/services/categoryServices'

import DefaultLayout from '@/layouts/user/DefaultLayout.vue'

import PromotionCard from '@/components/user/promotion/PromotionCard.vue'
import ProductCard from '@/components/user/product/ProductCard.vue'
import CategoryCard from '@/components/user/category/CategoryCard.vue'

const router = useRouter()

// Sample Data
const promotions = ref([
  {
    id: 1,
    title: 'Sale Tháng 11',
    description: 'Giảm giá cực sốc cho tất cả sản phẩm',
    discount: 50,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80'
  },
  {
    id: 2,
    title: 'Combo tiết kiệm',
    description: 'Mua 2 tặng 1 cho tất cả phụ kiện',
    discount: 30,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80'
  },
  {
    id: 3,
    title: 'Flash Sale',
    description: 'Săn deal sốc mỗi ngày',
    discount: 70,
    image: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?ixlib=rb-1.2.1&auto=format&fit=crop&w=2850&q=80'
  },
])
const featuredProducts = ref([])
const categories = ref([])

const fetchProduct = async () => {
  await productServices.gets()
    .then(response => {
      featuredProducts.value = response.data.data
    })
    .catch(error => {
      console.error(error)
    })
}
const fetchCategory = async () => {
  await categoryServices.gets()
    .then(response => {
      categories.value = response.data.data
    })
    .catch(error => {
      console.error(error)
    })
}
onBeforeMount(() => {
  fetchProduct()
  fetchCategory()
})

// Methods
const navigateToShop = () => {
  router.push('/shop')
}
</script>
<template>
  <DefaultLayout>
    <section class="container mx-auto py-12 bg-white">
      <div class="flex space-x-8">
        <!-- Product Image -->
        <div class="w-1/2">
          <ImageGallery :images="item.images" />
        </div>

        <!-- Product Info -->
        <div class="w-1/2">
          <h1 class="text-4xl font-bold text-black">{{ item.name }}</h1>
          <p class="text-2xl mt-4 line-through text-red-500">
            ${{ item.price }}
          </p>
          <!-- <p class="text-2xl mt-4 text-yellow-600">${{ calculateDiscountedPrice(item.price,
                        item.discount).toFixed(2) }}</p> -->

          <!-- Dynamic Rating Display -->
          <!-- <div class="mt-4">
                        <span class="font-bold">Rating:</span>
                        <span class="text-yellow-500">
                            <span v-for="star in fullStars" :key="'full' + star">★</span>
                            <span v-if="hasHalfStar">☆</span>
                            <span v-for="star in emptyStars" :key="'empty' + star">☆</span>
                        </span>
                        {{ item.rating }}
                    </div> -->

          <!-- Quantity Selector -->
          <div class="flex items-center rounded product-qty">
            <button
              type="button"
              class="quantity-left-minus bg-red-500 btn-number text-white p-1 rounded"
              data-type="minus"
              @click="decrementQuantity"
            >
              <font-awesome-icon icon="minus" />
            </button>
            <input
              type="text"
              id="quantity"
              name="quantity"
              class="form-control input-number w-12 text-center border-0 focus:ring-0 focus:outline-none"
              :value="quantity"
              readonly
            />
            <button
              type="button"
              class="quantity-right-plus bg-green-500 btn-number text-white p-1 rounded"
              data-type="plus"
              @click="incrementQuantity"
            >
              <font-awesome-icon icon="plus" />
            </button>
          </div>

          <!-- Add to Cart Button -->
          <button
            class="mt-6 bg-yellow-500 text-white px-6 py-3 rounded-lg"
            @click="handleAddToCart"
          >
            Add to Cart
          </button>

          <!-- Additional Info -->
          <div class="mt-8">
            <h2 class="text-2xl font-bold">Product Details</h2>
            <p class="mt-4 text-gray-700">
              {{ item.description }}
            </p>
          </div>
        </div>
      </div>
    </section>
    <!-- Related Products Section -->
    <!-- <section class="container mx-auto py-12">
      <h2 class="text-3xl font-bold mb-6">Related Products</h2>
      <div class="grid grid-cols-4 gap-6">
        <div class="p-6 bg-white rounded shadow">
          <img src="banana.png" alt="Product Image" class="w-32 h-32 mx-auto" />
          <h3 class="mt-4 text-lg font-bold">Banana Smoothie</h3>
          <p class="mt-2">$12.00</p>
          <button class="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
        <div class="p-6 bg-white rounded shadow">
          <img
            src="apple_juice.png"
            alt="Product Image"
            class="w-32 h-32 mx-auto"
          />
          <h3 class="mt-4 text-lg font-bold">Apple Juice</h3>
          <p class="mt-2">$14.00</p>
          <button class="mt-4 bg-yellow-500 text-white px-4 py-2 rounded">
            Add to Cart
          </button>
        </div>
      </div>
    </section> -->
  </DefaultLayout>
</template>
<script setup>
import { computed, defineProps, onBeforeMount, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";
import ImageGallery from "@/components/user/slider/ImageGallery.vue";
import { useCartStore } from "@/stores/cart";
import productServices from "@/services/productServices";

const route = useRoute();
const router = useRouter();
const cartStore = useCartStore();
const quantity = ref(1);

let item = ref({});
const fetchProduct = async () => {
  await productServices
    .get(route.params.id)
    .then((response) => {
      item.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
};
onBeforeMount(fetchProduct);

const calculateDiscountedPrice = (price, discount) => {
  return price * (1 - discount / 100);
};

// Rating Display Logic
const fullStars = computed(() => Math.floor(item.rating));
const hasHalfStar = computed(() => item.rating % 1 >= 0.5);
const emptyStars = computed(
  () => 5 - fullStars.value - (hasHalfStar.value ? 1 : 0)
);

const incrementQuantity = () => {
  quantity.value++;
};

const decrementQuantity = () => {
  if (quantity.value > 1) {
    quantity.value--;
  }
};

const handleAddToCart = () => {
  console.log(cartStore.items);
  cartStore.items.forEach((ele) => {
    if (ele._id === item.value._id) {
        
        ele.quantity += quantity.value;
        return;
      }
  });
  const data = {
    ...item.value,
    quantity: quantity.value,
    user: {
      id: 1,
      name: "John Doe",
      email: "john.doe@example.com",
    },
  };
  cartStore.addItem(data);
};
</script>

<template>
  <DefaultLayout>
    <div class="container px-4 py-8">
      <div class="flex flex-col mx-auto shadow-lg overflow-hidden">
        <div class="bg-gradient-to-r dark:bg-boxdark focus:ring-blue-200 dark:text-white px-6 py-4">
          <h2 class="text-2xl font-bold">Product Import</h2>
        </div>

        <form @submit.prevent="submitImport" class="p-6 space-y-6 dark:bg-boxdark focus:ring-blue-200 dark:text-white">
          <!-- Product List -->
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h3 class="text-lg font-medium">Product List</h3>
              <ProductModal @add-product="handleAddProduct" />
            </div>

            <div class="overflow-x-auto">
              <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-600">
                <thead class="bg-gray-50 dark:bg-gray-700">
                  <tr>
                    <!-- <th
                      class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase"
                    >
                      Product Code
                    </th> -->
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Thumbnail
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Product Name
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Category
                    </th>

                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Quantity
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Total Amount
                    </th>
                    <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-600">
                  <tr v-for="(product, index) in products" :key="index">
                    <!-- <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {{ product.code }}
                    </td> -->
                    <td class="px-6 py-4 whitespace-nowrap">
                      <img :src="product.thumbnail" alt="Product thumbnail" class="w-12 h-12 object-cover rounded" />
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {{ product.name }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {{ findcategory(product.category) }}
                    </td>

                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {{ product.countInStock }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap text-sm">
                      {{ formatCurrency(product.countInStock * product.price) }}
                    </td>
                    <td class="px-6 py-4 whitespace-nowrap flex items-center justify-center">
                      <button @click="removeProduct(index)" class="text-red-600 hover:text-red-900">
                        <svg class="fill-current" width="18" height="18" viewBox="0 0 18 18" fill="none"
                          xmlns="http://www.w3.org/2000/svg">
                          <path
                            d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                            fill="" />
                          <path
                            d="M9.00039 9.11255C8.66289 9.11255 8.35352 9.3938 8.35352 9.75942V13.3313C8.35352 13.6688 8.63477 13.9782 9.00039 13.9782C9.33789 13.9782 9.64727 13.6969 9.64727 13.3313V9.75942C9.64727 9.3938 9.33789 9.11255 9.00039 9.11255Z"
                            fill="" />
                          <path
                            d="M11.2502 9.67504C10.8846 9.64692 10.6033 9.90004 10.5752 10.2657L10.4064 12.7407C10.3783 13.0782 10.6314 13.3875 10.9971 13.4157C11.0252 13.4157 11.0252 13.4157 11.0533 13.4157C11.3908 13.4157 11.6721 13.1625 11.6721 12.825L11.8408 10.35C11.8408 9.98442 11.5877 9.70317 11.2502 9.67504Z"
                            fill="" />
                          <path
                            d="M6.72245 9.67504C6.38495 9.70317 6.1037 10.0125 6.13182 10.35L6.3287 12.825C6.35683 13.1625 6.63808 13.4157 6.94745 13.4157C6.97558 13.4157 6.97558 13.4157 7.0037 13.4157C7.3412 13.3875 7.62245 13.0782 7.59433 12.7407L7.39745 10.2657C7.39745 9.90004 7.08808 9.64692 6.72245 9.67504Z"
                            fill="" />
                        </svg>
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- Control Buttons -->
          <div class="flex justify-end space-x-4 pt-4">
            <button type="button" @click="resetForm"
              class="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-600 dark:text-white rounded-md hover:bg-gray-300 dark:hover:bg-gray-500 transition-colors">
              Reset
            </button>
            <button type="submit" :disabled="isSubmitting"
              class="px-6 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-md hover:opacity-90 transition-all disabled:opacity-50">
              {{ isSubmitting ? "Processing..." : "Import Products" }}
            </button>
          </div>
        </form>
      </div>

      <!-- Notifications -->
      <div v-if="notification.message" :class="[
        'fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white z-50',
        notification.type === 'success' ? 'bg-green-500' : 'bg-red-500',
      ]">
        {{ notification.message }}
      </div>
    </div>
  </DefaultLayout>
</template>

<script setup>
import { ref, computed, reactive, onBeforeMount } from "vue";
import DefaultLayout from "@/layouts/admin/DefaultLayout.vue";
import ProductModal from "@/components/admin/ProductModal.vue";
import categoryServices from "@/services/categoryServices";
import productServices from '@/services/productServices'

// State
const categories = ref([]);
const importDate = ref(new Date().toISOString().split("T")[0]);
const products = ref([]);
const isSubmitting = ref(false);
const notification = reactive({
  message: "",
  type: "success",
});

// Methods
const handleAddProduct = (newProduct) => {
  products.value.push(newProduct);
};

const removeProduct = (index) => {
  products.value.splice(index, 1);
};

const formatCurrency = (value) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
};

const resetForm = () => {
  products.value = [];
  notification.message = "";
};

const submitImport = async () => {
  if (products.value.length === 0) {
    notification.message = "Please add at least one product";
    notification.type = "error";
    return;
  }

  try {
    isSubmitting.value = true;

    await new Promise((resolve) => setTimeout(resolve, 1500));

    products.value.forEach(async (element) => {
      await productServices
        .create(element)
        .then((response) => {
          products.value = response.data.data;
        })
        .catch((error) => {
          console.error(error);
        });
    });

    notification.message = "Products imported successfully!";
    notification.type = "success";
  } catch (error) {
    console.error("Import error:", error);
    notification.message = "An error occurred. Please try again.";
    notification.type = "error";
  } finally {
    isSubmitting.value = false;
  }
};

const fetchCategory = async () => {
  await categoryServices
    .gets()
    .then((response) => {
      categories.value = response.data.data;
    })
    .catch((error) => {
      console.error(error);
    });
};
onBeforeMount(() => {
  fetchCategory();
});

const findcategory = (id) => {
  return categories.value.find((c) => c._id == id).title;
};
</script>

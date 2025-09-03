<script setup>
import { onBeforeMount, ref, watch, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import DefaultLayout from "@/layouts/admin/DefaultLayout.vue";
import categoryServices from "@/services/categoryServices";
import Pagination from "@/components/user/pagination/Pagination.vue";

const route = useRoute();
const router = useRouter();
const itemsPerPage = ref(5);
const currentPage = ref(parseInt(route.params.query) || 1);
const totalPages = ref(0);
const searchQuery = ref("");

// State
const categories = ref([]);
const fetchCategory = async () => {
  await categoryServices
    .gets({
      limit: itemsPerPage.value,
      page: currentPage.value - 1,
    })
    .then((response) => {
      categories.value = response.data.data;
      totalPages.value = response.data.totalPage;
    })
    .catch((error) => {
      console.error(error);
    });
};
onBeforeMount(() => {
  fetchCategory();
});
const showModal = ref(false);
const isEditing = ref(false);
const currentCategory = ref({
  name: "",
});

const openAddModal = () => {
  isEditing.value = false;
  currentCategory.value = {
    name: "",
  };
  showModal.value = true;
};

const openEditModal = (category) => {
  isEditing.value = true;
  currentCategory.value = { ...category };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentCategory.value = {
    id: null,
    name: "",
    slug: "",
    description: "",
    status: "active",
  };
};

const saveCategory = () => {
  if (!currentCategory.value.title) {
    alert("Please enter category name");
    return;
  }

  if (isEditing.value) {
    // const index = categories.value.findIndex(
    //   c => c.id === currentCategory.value.id,
    // )
    // if (index !== -1) {
    //   categories.value[index] = { ...currentCategory.value }
    // }
    categoryServices.update(currentCategory.value);
  } else {
    categoryServices.create(currentCategory.value);
  }

  closeModal();
};

const handleDelete = (id) => {
  if (window.confirm("Are you sure you want to delete this category?")) {
    categoryServices.delete(id);
  }
};
const handlePageChange = (page) => {
  currentPage.value = page;
  router.push({
    name: "categoryproduct",
    query: { ...route.query, page },
  });
};

watch(
  () => [route.query.page],
  async ([newPage]) => {
    if (newPage) {
      currentPage.value = parseInt(newPage);
      await fetchCategory();
    }
  },
  { immediate: true }
);

const filteredCategories = computed(() => {
  const query = searchQuery.value.toLowerCase().trim();
  if (!query) return categories.value;

  return categories.value.filter((category) =>
    category.title.toLowerCase().includes(query)
  );
});
</script>

<template>
  <DefaultLayout>
    <div class="p-4">
      <div class="mb-6 flex justify-between">
        <h2 class="text-2xl font-bold dark:text-white">Category Management</h2>
        <button
          @click="openAddModal"
          class="px-6 py-2 bg-primary text-white rounded-md hover:bg-opacity-90 transition-all"
        >
          <i class="fas fa-plus-circle mr-2"></i>
          Add Category
        </button>
      </div>

      <!-- Table List -->
      <div
        class="mt-6 rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      >
        <input
          type="text"
          v-model="searchQuery"
          placeholder="Search category..."
          class="w-64 px-4 py-2 border rounded-lg focus:outline-none focus:border-primary dark:border-strokedark dark:bg-meta-4 dark:text-white"
        />

        <div class="max-w-full overflow-x-auto mt-3">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-2 text-left dark:bg-meta-4">
                <th
                  class="min-w-[50px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  ID
                </th>
                <th
                  class="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Category Name
                </th>
                <th
                  class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Slug
                </th>
               
                <th class="py-4 px-4 font-medium text-black dark:text-white">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="category in filteredCategories"
                :key="category._id"
                class="border-b border-[#eee] dark:border-strokedark"
              >
                <td class="py-5 px-4">
                  <p class="text-black dark:text-white">{{ category._id }}</p>
                </td>
                <td class="py-5 px-4">
                  <p class="text-black dark:text-white">{{ category.title }}</p>
                </td>
                <td class="py-5 px-4">
                  <p class="text-gray-600 dark:text-gray-400">
                    {{ category.slug }}
                  </p>
                </td>
                
                <td class="py-5 px-4">
                  <div class="flex items-center space-x-3.5">
                    <button
                      @click="openEditModal(category)"
                      class="text-yellow-600 hover:text-yellow-900"
                    >
                      <svg
                        class="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M8.99981 14.8219C3.43106 14.8219 0.674805 9.50624 0.562305 9.28124C0.47793 9.11249 0.47793 8.88749 0.562305 8.71874C0.674805 8.49374 3.43106 3.20624 8.99981 3.20624C14.5686 3.20624 17.3248 8.49374 17.4373 8.71874C17.5217 8.88749 17.5217 9.11249 17.4373 9.28124C17.3248 9.50624 14.5686 14.8219 8.99981 14.8219ZM1.85605 8.99999C2.4748 10.0406 4.89356 13.5562 8.99981 13.5562C13.1061 13.5562 15.5248 10.0406 16.1436 8.99999C15.5248 7.95936 13.1061 4.44374 8.99981 4.44374C4.89356 4.44374 2.4748 7.95936 1.85605 8.99999Z"
                          fill=""
                        />
                        <path
                          d="M9 11.3906C7.67812 11.3906 6.60938 10.3219 6.60938 9C6.60938 7.67813 7.67812 6.60938 9 6.60938C10.3219 6.60938 11.3906 7.67813 11.3906 9C11.3906 10.3219 10.3219 11.3906 9 11.3906ZM9 7.875C8.38125 7.875 7.875 8.38125 7.875 9C7.875 9.61875 8.38125 10.125 9 10.125C9.61875 10.125 10.125 9.61875 10.125 9C10.125 8.38125 9.61875 7.875 9 7.875Z"
                          fill=""
                        />
                      </svg>
                    </button>
                    <button
                      @click="handleDelete(category._id)"
                      class="text-red-600 hover:text-red-900"
                    >
                      <svg
                        class="fill-current"
                        width="18"
                        height="18"
                        viewBox="0 0 18 18"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M13.7535 2.47502H11.5879V1.9969C11.5879 1.15315 10.9129 0.478149 10.0691 0.478149H7.90352C7.05977 0.478149 6.38477 1.15315 6.38477 1.9969V2.47502H4.21914C3.40352 2.47502 2.72852 3.15002 2.72852 3.96565V4.8094C2.72852 5.42815 3.09414 5.9344 3.62852 6.1594L4.07852 15.4688C4.13477 16.6219 5.09102 17.5219 6.24414 17.5219H11.7004C12.8535 17.5219 13.8098 16.6219 13.866 15.4688L14.3441 6.13127C14.8785 5.90627 15.2441 5.3719 15.2441 4.78127V3.93752C15.2441 3.15002 14.5691 2.47502 13.7535 2.47502ZM7.67852 1.9969C7.67852 1.85627 7.79102 1.74377 7.93164 1.74377H10.0973C10.2379 1.74377 10.3504 1.85627 10.3504 1.9969V2.47502H7.70664V1.9969H7.67852ZM4.02227 3.96565C4.02227 3.85315 4.10664 3.74065 4.24727 3.74065H13.7535C13.866 3.74065 13.9785 3.82502 13.9785 3.96565V4.8094C13.9785 4.9219 13.8941 5.0344 13.7535 5.0344H4.24727C4.13477 5.0344 4.02227 4.95002 4.02227 4.8094V3.96565ZM11.7285 16.2563H6.27227C5.79414 16.2563 5.40039 15.8906 5.37227 15.3844L4.95039 6.2719H13.0785L12.6566 15.3844C12.6004 15.8625 12.2066 16.2563 11.7285 16.2563Z"
                          fill=""
                        />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div class="w-full flex items-center justify-center">
            <Pagination
              v-if="totalPages > 1"
              :total-page="totalPages"
              :current-page="currentPage"
              :max-visible-pages="5"
              @page-changed="handlePageChange"
            />
          </div>
        </div>
      </div>

      <!-- Modal -->
      <div
        v-if="showModal"
        class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
      >
        <!-- Modal Content -->
        <div
          class="relative top-20 mx-auto p-5 border w-full max-w-2xl shadow-lg rounded-md bg-white dark:border-strokedark dark:bg-boxdark"
          @click.stop
        >
          <!-- Modal Header -->
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-medium dark:text-white">
              {{ isEditing ? "Edit Category" : "Add New Category" }}
            </h3>
            <button
              @click="closeModal"
              class="text-gray-400 hover:text-gray-500"
            >
              <span class="text-2xl">&times;</span>
            </button>
          </div>

          <!-- Modal Body -->
          <div class="mt-2">
            <form @submit.prevent="saveCategory" class="space-y-4">
              <div class="form-control">
                <label class="block text-sm font-medium mb-1 dark:text-white">
                  Category Name
                </label>
                <input
                  v-model="currentCategory.title"
                  type="text"
                  required
                  class="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-strokedark dark:bg-boxdark dark:text-white"
                  placeholder="Enter category name"
                />
              </div>

              <!-- <div class="form-control">
                <label class="block text-sm font-medium mb-1 dark:text-white">
                  Slug
                </label>
                <input v-model="currentCategory.slug" type="text"
                  class="w-full p-2 rounded-md bg-gray-50 border-gray-300 shadow-sm dark:border-strokedark dark:bg-boxdark dark:text-white"
                  readonly />
              </div> -->

              <!-- <div class="form-control">
                <label class="block text-sm font-medium mb-1 dark:text-white">
                  Description
                </label>
                <textarea v-model="currentCategory.description" rows="4"
                  class="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-strokedark dark:bg-boxdark dark:text-white"
                  placeholder="Enter category description"></textarea>
              </div>

              <div class="form-control">
                <label class="block text-sm font-medium mb-1 dark:text-white">
                  Status
                </label>
                <select v-model="currentCategory.status"
                  class="w-full p-2 rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 dark:border-strokedark dark:bg-boxdark dark:text-white">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div> -->
            </form>
          </div>

          <!-- Modal Footer -->
          <div class="items-center px-4 py-3 mt-4">
            <button
              @click="closeModal"
              class="px-4 py-2 bg-gray-500 text-white text-base font-medium rounded-md shadow-sm hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-300 mr-2"
            >
              Cancel
            </button>
            <button
              @click="saveCategory"
              class="px-4 py-2 bg-primary text-white text-base font-medium rounded-md shadow-sm hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-opacity-50"
            >
              {{ isEditing ? "Update" : "Save" }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

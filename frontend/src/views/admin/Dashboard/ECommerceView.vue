<script setup>
import { onBeforeMount, ref } from "vue";

import DataStatsOne from "@/components/admin/DataStats/DataStatsOne.vue";
import DefaultLayout from "@/layouts/admin/DefaultLayout.vue";
import oauthServices from "@/services/oauthServices";
import orderServices from "@/services/orderServices";
import { useAdminStore } from "@/stores/admin";

import { useRouter } from "vue-router";
const router = useRouter();
const adminStore = useAdminStore();
if (!adminStore.admin.isAuthenticated) {
  router.push("/admin/auth/signin");
}

const orders = ref([]);

const orderStatuses = ref([
  { value: "Pending", label: "Pending" },
  { value: "Paid", label: "Paid" },
  { value: "Cancelled", label: "Cancelled" },
]);

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("vi-VN", {
    style: "currency",
    currency: "VND",
  }).format(amount);
};

const formatDate = (date) => {
  if (!date) return "";
  return new Date(date).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

onBeforeMount(async () => {
  const access = useAdminStore().admin.access;
  const response = await orderServices.gets();
  const orderList = response.data.data;
  for (const element of orderList) {
    const userResponse = await oauthServices.getme(access, element.user);
    element.name = userResponse.data.data.name;
  }
  orders.value = orderList;
});
</script>

<template>
  <DefaultLayout>
    <div
      class="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 xl:grid-cols-4 2xl:gap-7.5"
    >
      <DataStatsOne />
    </div>

    <div
      class="mt-4 grid grid-cols-1 gap-4 md:mt-6 md:gap-6 2xl:mt-7.5 2xl:gap-7.5"
    >
      <h1 class="text-3xl">Order</h1>
      <div
        class="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1"
      >
        <div class="max-w-full overflow-x-auto">
          <table class="w-full table-auto">
            <thead>
              <tr class="bg-gray-2 text-left dark:bg-meta-4">
                <th
                  class="min-w-[180px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Customer
                </th>
                <th
                  class="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Order Date
                </th>
                <th
                  class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Total Price
                </th>
                <th
                  class="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white"
                >
                  Status
                </th>
              
              </tr>
            </thead>
            <tbody>
              <tr v-for="order in orders" :key="order.id">
                <td class="py-5 px-4">
                  <p class="text-black dark:text-white">{{ order.name }}</p>
                </td>
                <td class="py-5 px-4">
                  <p class="text-black dark:text-white">
                    {{ formatDate(order.createdAt) }}
                  </p>
                </td>
                <td class="py-5 px-4">
                  <p class="text-black dark:text-white">
                    {{ formatCurrency(order.totalPrice) }}
                  </p>
                </td>
                <td class="py-5 px-4">
                  <select
                  disabled
                    v-model="order.orderStatus"
                    @change="handleStatusChange(order)"
                    class="rounded-md border-stroke bg-transparent py-1.5 px-3 outline-none transition-all dark:border-strokedark"
                  >
                    <option
                      v-for="status in orderStatuses"
                      :key="status.value"
                      :value="status.value"
                      :selected="order.orderStatus === status.value"
                    >
                      {{ status.label }}
                    </option>
                  </select>
                </td>
               
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DefaultLayout>
</template>

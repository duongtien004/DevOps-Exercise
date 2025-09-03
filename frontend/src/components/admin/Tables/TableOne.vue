<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  orders: {
    type: Array,
    required: true,
  },
  orderStatuses: {
    type: Array,
    required: true,
  },
})

const emit = defineEmits(['updateStatus', 'viewDetails', 'deleteOrder'])

const formatCurrency = amount => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount)
}

const handleStatusChange = order => {
  emit('updateStatus', order)
}

const handleViewDetails = order => {
  emit('viewDetails', order)
}

const handleDelete = order => {
  emit('deleteOrder', order)
}
</script>

<template>
  <div class="overflow-x-auto rounded-lg border border-gray-200">
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50">
        <tr>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Order ID
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Customer
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Order Date
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Total Amount
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Status
          </th>
          <th
            class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            Actions
          </th>
        </tr>
      </thead>
      <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="order in orders" :key="order.id">
          <td class="px-6 py-4 whitespace-nowrap">{{ order.id }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ order.customerName }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">{{ order.orderDate }}</td>
          <td class="px-6 py-4 whitespace-nowrap">
            {{ formatCurrency(order.total) }}
          </td>
          <td class="px-6 py-4 whitespace-nowrap">
            <select
              v-model="order.status"
              @change="handleStatusChange(order)"
              class="text-sm rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option
                v-for="status in orderStatuses"
                :key="status.value"
                :value="status.value"
              >
                {{ status.label }}
              </option>
            </select>
          </td>
          <td class="px-6 py-4 whitespace-nowrap space-x-2">
            <button
              @click="handleViewDetails(order)"
              class="text-indigo-600 hover:text-indigo-900 text-sm font-medium"
            >
              View Details
            </button>
            <button
              @click="handleDelete(order)"
              class="text-red-600 hover:text-red-900 text-sm font-medium"
            >
              Delete
            </button>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

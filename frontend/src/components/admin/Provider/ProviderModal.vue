<!-- ProviderModal.vue -->
<template>
  <div
    v-if="isOpen"
    class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
  >
    <div class="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-lg mx-4">
      <h3 class="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
        {{ isEdit ? 'Edit Provider' : 'Add New Provider' }}
      </h3>

      <!-- Provider Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <!-- Name Field -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            v-model="form.name"
            class="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            :class="{ 'border-red-500': errors.name }"
          />
          <p v-if="errors.name" class="mt-1 text-sm text-red-500">
            {{ errors.name }}
          </p>
        </div>

        <!-- Phone Field -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Phone
          </label>
          <input
            type="tel"
            v-model="form.phone"
            class="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            :class="{ 'border-red-500': errors.phone }"
          />
          <p v-if="errors.phone" class="mt-1 text-sm text-red-500">
            {{ errors.phone }}
          </p>
        </div>

        <!-- Email Field -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Email
          </label>
          <input
            type="email"
            v-model="form.email"
            class="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            :class="{ 'border-red-500': errors.email }"
          />
          <p v-if="errors.email" class="mt-1 text-sm text-red-500">
            {{ errors.email }}
          </p>
        </div>

        <!-- Address Field -->
        <div>
          <label
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
          >
            Address
          </label>
          <textarea
            v-model="form.address"
            rows="3"
            class="w-full p-2 border rounded-lg focus:outline-none focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            :class="{ 'border-red-500': errors.address }"
          ></textarea>
          <p v-if="errors.address" class="mt-1 text-sm text-red-500">
            {{ errors.address }}
          </p>
        </div>

        <!-- Form Actions -->
        <div class="flex justify-end space-x-4 pt-4">
          <button
            type="button"
            @click="closeModal"
            class="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
          >
            Cancel
          </button>
          <button
            type="submit"
            class="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            {{ isEdit ? 'Update' : 'Add' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { reactive, computed, watch } from 'vue'

const props = defineProps({
  isOpen: {
    type: Boolean,
    required: true,
  },
  provider: {
    type: Object,
    default: null,
  },
})

const emit = defineEmits(['close', 'submit'])

const isEdit = computed(() => !!props.provider)

// Form state
const form = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
})

// Error state
const errors = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
})

// Reset form on open/close
watch(
  () => props.isOpen,
  newVal => {
    if (newVal && props.provider) {
      // Edit mode - populate form
      Object.assign(form, props.provider)
    } else if (newVal) {
      // Add mode - reset form
      Object.assign(form, {
        name: '',
        phone: '',
        email: '',
        address: '',
      })
    }
    // Clear errors
    Object.keys(errors).forEach(key => (errors[key] = ''))
  },
)

// Validation
const validateForm = () => {
  let isValid = true

  // Reset errors
  Object.keys(errors).forEach(key => (errors[key] = ''))

  // Name validation
  if (!form.name.trim()) {
    errors.name = 'Name is required'
    isValid = false
  }

  // Phone validation
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/
  if (!form.phone.trim()) {
    errors.phone = 'Phone is required'
    isValid = false
  } else if (!phoneRegex.test(form.phone)) {
    errors.phone = 'Phone format should be XXX-XXX-XXXX'
    isValid = false
  }

  // Email validation
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!form.email.trim()) {
    errors.email = 'Email is required'
    isValid = false
  } else if (!emailRegex.test(form.email)) {
    errors.email = 'Please enter a valid email address'
    isValid = false
  }

  // Address validation
  if (!form.address.trim()) {
    errors.address = 'Address is required'
    isValid = false
  }

  return isValid
}

// Form submission
const handleSubmit = () => {
  if (validateForm()) {
    emit('submit', { ...form })
    closeModal()
  }
}

// Close modal
const closeModal = () => {
  emit('close')
}
</script>

<!-- CommentTree.vue -->
<template>
  <div class="space-y-4">
    <div
      v-for="comment in comments"
      :key="comment.id"
      class="rounded-lg border border-gray-200 p-4 dark:border-strokedark"
    >
      <div class="flex justify-between">
        <div>
          <div class="flex items-center space-x-2">
            <span class="font-medium dark:text-white">{{ comment.user }}</span>
            <span class="text-sm text-gray-500">
              {{ formatDate(comment.createdAt) }}
            </span>
          </div>
          <p class="mt-2 text-gray-600 dark:text-gray-400">
            {{ comment.comment }}
          </p>
          <div class="mt-2 flex items-center">
            <span class="text-yellow-500">{{
              '★'.repeat(comment.rating)
            }}</span>
            <span class="text-gray-300">{{
              '★'.repeat(5 - comment.rating)
            }}</span>
            <span class="ml-2 text-sm text-gray-600 dark:text-gray-400">
              ({{ comment.rating }}/5)
            </span>
          </div>
        </div>
        <div class="flex items-center space-x-2">
          <button
            @click="$emit('reply', comment.id)"
            class="text-blue-600 hover:text-blue-800"
          >
            Reply
          </button>
          <button
            @click="$emit('edit', comment)"
            class="text-yellow-600 hover:text-yellow-800"
          >
            Edit
          </button>
          <button
            @click="$emit('delete', comment.id)"
            class="text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>

      <!-- Nested replies -->
      <div v-if="comment.children?.length" class="mt-4 ml-8 space-y-4">
        <CommentTree
          :comments="comment.children"
          @edit="$emit('edit', $event)"
          @reply="$emit('reply', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue'

defineProps({
  comments: {
    type: Array,
    required: true,
  },
})

defineEmits(['edit', 'reply', 'delete'])

const formatDate = dateString => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
</script>

<template>
    <div class="relative rounded-lg overflow-hidden group cursor-pointer">
        <img :src="promo.image" :alt="promo.title" class="w-full h-48 object-cover">
        <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-4">
            <h3 class="text-white font-semibold text-lg">{{ promo.title }}</h3>
            <p class="text-white/90 text-sm mb-2">{{ promo.description }}</p>
            <span class="inline-block bg-red-500 text-white px-3 py-1 rounded-full text-sm">
                Giảm đến {{ promo.discount }}%
            </span>
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue'
const props = defineProps({
    promo: {
        type: Object,
        required: true
    }
})
</script>
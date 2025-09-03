<template>
    <div class="image-gallery flex flex-col justify-center items-center">
        <!-- Main Image Display with Fixed Size -->
        <div class="main-image-wrapper">
            <img v-if="currentImage" :src="getImageUrl(currentImage)" alt="Main Product Image" class="main-image" />
            <div v-else class="flex items-center justify-center w-full h-full bg-gray-100">
                <span class="text-gray-400">No image available</span>
            </div>
        </div>

        <!-- Thumbnail Images with Next/Prev buttons -->
        <div v-if="hasImages" class="thumbnails flex items-center mt-4 space-x-2">
            <!-- Prev Button -->
            <button @click="prevThumbnails" class="text-gray-500 hover:text-gray-900 p-1" :disabled="startIndex === 0">
                <font-awesome-icon icon="chevron-left" />
            </button>

            <!-- Thumbnails Display -->
            <div class="flex space-x-2 overflow-hidden">
                <div v-for="(image, index) in visibleThumbnails" :key="index" :class="[
                    'thumbnail',
                    index + startIndex === currentIndex ? 'border-2 border-red-500' : '',
                ]" @click="selectImage(index + startIndex)">
                    <img :src="getImageUrl(image)" :alt="`Thumbnail ${index + 1}`" class="thumbnail-image" />
                </div>
            </div>

            <!-- Next Button -->
            <button @click="nextThumbnails" class="text-gray-500 hover:text-gray-900 p-1"
                :disabled="startIndex + thumbnailsToShow >= totalImages">
                <font-awesome-icon icon="chevron-right" />
            </button>
        </div>
    </div>
</template>

<script setup>
import { ref, computed, watch, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    images: {
        type: Array,
        required: true,
        default: () => []
    },
});

// State
const currentIndex = ref(0);
const startIndex = ref(0);
const thumbnailsToShow = 5;
let interval = null;

// Computed properties
const hasImages = computed(() => props.images && props.images.length > 0);
const totalImages = computed(() => props.images?.length || 0);

const currentImage = computed(() => {
    if (!hasImages.value) return null;
    return props.images[currentIndex.value];
});

const visibleThumbnails = computed(() => {
    if (!hasImages.value) return [];
    return props.images.slice(startIndex.value, startIndex.value + thumbnailsToShow);
});

// Methods
const getImageUrl = (path) => {
    if (!path) return '';
    return `http://127.0.0.1:8088/${path}`;
};

function selectImage(index) {
    if (index >= 0 && index < totalImages.value) {
        currentIndex.value = index;
    }
}

function startAutoSlide() {
    if (!hasImages.value) return;

    stopAutoSlide(); // Clear any existing interval
    interval = setInterval(() => {
        currentIndex.value = (currentIndex.value + 1) % totalImages.value;
    }, 5000);
}

function stopAutoSlide() {
    if (interval) {
        clearInterval(interval);
        interval = null;
    }
}

function nextThumbnails() {
    if (startIndex.value + thumbnailsToShow < totalImages.value) {
        startIndex.value += 1;
    }
}

function prevThumbnails() {
    if (startIndex.value > 0) {
        startIndex.value -= 1;
    }
}

// Watchers
watch(() => props.images, (newImages) => {
    if (newImages && newImages.length > 0) {
        currentIndex.value = 0;
        startIndex.value = 0;
        startAutoSlide();
    } else {
        stopAutoSlide();
    }
}, { immediate: true });

// Lifecycle hooks
onMounted(() => {
    if (hasImages.value) {
        startAutoSlide();
    }
});

onBeforeUnmount(() => {
    stopAutoSlide();
});
</script>

<style scoped>
.main-image-wrapper {
    width: 400px;
    height: 320px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    border-radius: 8px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    margin: auto;
    background-color: white;
}

.main-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease-in-out;
}

.thumbnail {
    cursor: pointer;
    border-radius: 4px;
    overflow: hidden;
    transition: all 0.2s ease;
    width: 60px;
    height: 60px;
}

.thumbnail-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.3s ease;
}

.thumbnail:hover {
    transform: scale(1.05);
}

.thumbnail:hover .thumbnail-image {
    transform: scale(1.1);
}

button:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}
</style>
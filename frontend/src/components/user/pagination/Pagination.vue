<template>
    <div class="mt-8 flex justify-center">
        <nav class="inline-flex rounded-md shadow-sm" role="navigation" aria-label="Pagination">
            <!-- Previous Button -->
            <button class="px-4 py-2 rounded-l-md border border-gray-300 bg-white text-gray-700 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed hover:bg-white': isFirstPage, 'hover:bg-gray-50': !isFirstPage }"
                @click="previousPage" :disabled="isFirstPage" aria-label="Previous page">
                <span class="sr-only">Previous</span>
                &larr;
            </button>

            <!-- Page Numbers -->
            <template v-if="shouldShowPages">
                <!-- First Page -->
                <button v-if="showStartEllipsis" @click="goToPage(1)"
                    class="px-4 py-2 border-t border-b border-gray-300" :class="getPageClass(1)">
                    1
                </button>

                <!-- Start Ellipsis -->
                <span v-if="showStartEllipsis"
                    class="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
                    ...
                </span>

                <!-- Visible Pages -->
                <button v-for="page in visiblePages" :key="page" @click="goToPage(page)"
                    class="px-4 py-2 border-t border-b border-gray-300" :class="getPageClass(page)"
                    :aria-current="page === currentPage ? 'page' : null">
                    {{ page }}
                </button>

                <!-- End Ellipsis -->
                <span v-if="showEndEllipsis" class="px-4 py-2 border-t border-b border-gray-300 bg-white text-gray-700">
                    ...
                </span>

                <!-- Last Page -->
                <button v-if="showEndEllipsis" @click="goToPage(totalPage)"
                    class="px-4 py-2 border-t border-b border-gray-300" :class="getPageClass(totalPage)">
                    {{ totalPage }}
                </button>
            </template>

            <!-- Next Button -->
            <button class="px-4 py-2 rounded-r-md border border-gray-300 bg-white text-gray-700 transition-colors"
                :class="{ 'opacity-50 cursor-not-allowed hover:bg-white': isLastPage, 'hover:bg-gray-50': !isLastPage }"
                @click="nextPage" :disabled="isLastPage" aria-label="Next page">
                <span class="sr-only">Next</span>
                &rarr;
            </button>
        </nav>
    </div>
</template>

<script setup>
import { computed } from 'vue';

// Props definition
const props = defineProps({
    totalPage: {
        type: Number,
        required: true,
        validator: (value) => value >= 0
    },
    currentPage: {
        type: Number,
        required: true,
        validator: (value) => value >= 1
    },
    maxVisiblePages: {
        type: Number,
        default: 5,
        validator: (value) => value >= 3
    }
});

// Emit events
const emit = defineEmits(['page-changed']);

// Computed properties
const isFirstPage = computed(() => props.currentPage === 1);
const isLastPage = computed(() => props.currentPage === props.totalPage);
const shouldShowPages = computed(() => props.totalPage > 1);

const visiblePages = computed(() => {
    if (props.totalPage <= props.maxVisiblePages) {
        return Array.from({ length: props.totalPage }, (_, i) => i + 1);
    }

    let start = props.currentPage - Math.floor(props.maxVisiblePages / 2);
    let end = props.currentPage + Math.floor(props.maxVisiblePages / 2);

    if (start < 1) {
        start = 1;
        end = props.maxVisiblePages;
    }

    if (end > props.totalPage) {
        end = props.totalPage;
        start = props.totalPage - props.maxVisiblePages + 1;
    }

    return Array.from({ length: end - start + 1 }, (_, i) => start + i);
});

const showStartEllipsis = computed(() => {
    return visiblePages.value[0] > 1;
});

const showEndEllipsis = computed(() => {
    return visiblePages.value[visiblePages.value.length - 1] < props.totalPage;
});

// Methods
const getPageClass = (page) => ({
    'bg-blue-500 text-white hover:bg-blue-600': page === props.currentPage,
    'bg-white text-gray-700 hover:bg-gray-50': page !== props.currentPage
});

const goToPage = (page) => {
    if (page >= 1 && page <= props.totalPage && page !== props.currentPage) {
        emit('page-changed', page);
    }
};

const previousPage = () => {
    if (!isFirstPage.value) {
        goToPage(props.currentPage - 1);
    }
};

const nextPage = () => {
    if (!isLastPage.value) {
        goToPage(props.currentPage + 1);
    }
};
</script>
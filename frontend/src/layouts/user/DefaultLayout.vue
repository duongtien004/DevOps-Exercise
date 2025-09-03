<template>
    <Header />
    <slot></slot>
    <Footer />
</template>

<script setup>
import Header from '@/components/user/header/Header.vue'
import Footer from '@/components/user/footer/Footer.vue';
</script>
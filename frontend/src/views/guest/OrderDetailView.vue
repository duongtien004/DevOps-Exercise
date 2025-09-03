<script setup>
import DefaultLayout from '@/layouts/user/DefaultLayout.vue'
import orderServices from '@/services/orderServices';
import { ref, onMounted, onBeforeMount } from 'vue'
import { useRoute } from 'vue-router';
import { loadScript } from "@paypal/paypal-js";

const route = useRoute()
const order = ref({})
const paypalLoaded = ref(false)

const fetchOrder = async () => {
    try {
        const response = await orderServices.get(route.query.order)
        order.value = response.data.data
    } catch (error) {
        console.error('Error fetching order:', error)
    }
}

onBeforeMount(fetchOrder)

const initializePayPal = async () => {
    try {
        const paypal = await loadScript({
            clientId: "Aem6xwjgD1G7OqUTRqYpigsFQs4r5B6jBDB_l4WGZKjtaacDq7CvY_p5yJFD3cV5xRsN6iOqvy03c4Ag",
        });

        if (paypal) {
            paypal
                .Buttons({
                    createOrder: (data, actions) => {
                        const usdAmount = (order.value.totalPrice / 23000).toFixed(2)
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: usdAmount,
                                        currency_code: "USD"
                                    },
                                    description: `Order #${order.value._id}`
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {
                        try {
                            const paypalOrder = await actions.order.capture();

                            // Update order status in your backend
                            const orderData = {
                                _id: order.value._id,
                                orderStatus: paypalOrder.status === "COMPLETED" ? "Paid" : "Pending",
                            };

                            await orderServices.update(orderData)
                            // Refresh order data
                            await fetchOrder()

                        } catch (error) {
                            console.error('Payment failed:', error)
                            if (error.name === 'INSTRUMENT_DECLINED') {
                                alert('Your payment was declined. Please try another payment method.')
                            } else {
                                alert('Something went wrong. Please try again.')
                            }
                        }
                    },
                    onCancel: () => {
                        alert('Payment was cancelled')
                    },
                    onError: (err) => {
                        console.error("PayPal Error:", err)
                        alert('Payment failed. Please try again.')
                    },
                })
                .render("#paypal-button-container");

            paypalLoaded.value = true
        }
    } catch (error) {
        console.error("PayPal initialization failed:", error)
        paypalLoaded.value = false
    }
}

onMounted(initializePayPal)

const formatDate = (date) => {
    console.log(date);
    
    if (!date) return ''
    return new Date(date).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    })
}

const formatPrice = (price) => {
    if (!price) return ''
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price)
}
</script>

<template>
    <DefaultLayout>
        <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div class="bg-white rounded-lg shadow overflow-hidden">
                <!-- Order Header -->
                <div class="px-6 py-4 border-b border-gray-200">
                    <div class="flex justify-between items-center">
                        <div>
                            <h1 class="text-2xl font-semibold text-gray-900">Order Details</h1>
                            <p class="mt-2 text-sm text-gray-600">
                                Ordered on {{ formatDate(order.createdAt) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Order Status and Payment -->
                <div class="px-6 py-4 border-b border-gray-200 bg-gray-50">
                    <div class="flex items-center justify-between">
                        <div>
                            <p class="text-sm font-medium text-gray-600">Order Status</p>
                            <div class="mt-1 flex items-center">
                                <span :class="{
                                    'px-2 py-1 text-sm font-semibold rounded-full': true,
                                    'bg-yellow-100 text-yellow-800': order.orderStatus === 'Pending',
                                    'bg-green-100 text-green-800': order.orderStatus === 'Paid',
                                }">
                                    {{ order.orderStatus }}
                                </span>
                            </div>
                        </div>
                        <div v-if="order.paidAt" class="text-right">
                            <p class="text-sm font-medium text-gray-600">Payment Date</p>
                            <p class="mt-1 text-gray-900">{{ formatDate(order.paidAt) }}</p>
                        </div>
                    </div>

                    <!-- PayPal Button Container -->
                    <div v-if="order.orderStatus == 'Pending'" class="mt-4">
                        <div id="paypal-button-container" class="max-w-md mx-auto"></div>
                        <p v-if="!paypalLoaded" class="text-sm text-gray-500 text-center mt-2">
                            Loading payment options...
                        </p>
                    </div>
                </div>

                <!-- Order Items -->
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Items</h2>
                    <div class="space-y-4">
                        <div v-for="item in order.orderItems" :key="item.product" class="flex items-center space-x-4">
                            <img :src="`http://127.0.0.1:8088/${item.image}`" :alt="item.name"
                                class="w-16 h-16 object-cover rounded-md" />
                            <div class="flex-1">
                                <h3 class="text-sm font-medium text-gray-900">{{ item.name }}</h3>
                                <p class="mt-1 text-sm text-gray-500">
                                    Quantity: {{ item.amount }}
                                </p>
                            </div>
                            <p class="text-sm font-medium text-gray-900">
                                {{ formatPrice(item.price) }}
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Shipping Address -->
                <div class="px-6 py-4 border-b border-gray-200">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">
                        Shipping Address
                    </h2>
                    <div class="text-sm text-gray-600">
                        <p class="font-medium text-gray-900">
                            {{ order.shippingAddress?.fullName }}
                        </p>
                        <p>{{ order.shippingAddress?.address }}</p>
                        <p>{{ order.shippingAddress?.city }}, {{ order.shippingAddress?.country }}</p>
                        <p class="mt-2">Phone: {{ order.shippingAddress?.phone }}</p>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="px-6 py-4">
                    <h2 class="text-lg font-semibold text-gray-900 mb-4">Order Summary</h2>
                    <div class="space-y-2">
                        <div class="flex justify-between text-sm">
                            <p class="text-gray-600">Items Total:</p>
                            <p class="font-medium">{{ formatPrice(order.itemsPrice) }}</p>
                        </div>
                        <div class="flex justify-between text-sm">
                            <p class="text-gray-600">Shipping:</p>
                            <p class="font-medium">{{ formatPrice(order.shippingPrice) }}</p>
                        </div>
                        <div class="flex justify-between text-sm">
                            <p class="text-gray-600">Tax:</p>
                            <p class="font-medium">{{ formatPrice(order.taxPrice) }}</p>
                        </div>
                        <div class="pt-4 mt-4 border-t border-gray-200">
                            <div class="flex justify-between">
                                <p class="text-lg font-semibold text-gray-900">Total:</p>
                                <p class="text-lg font-semibold text-gray-900">
                                    {{ formatPrice(order.totalPrice) }}
                                </p>
                            </div>
                            <p class="text-sm text-gray-500 mt-1 text-right">
                                ≈ ${{ ((order.totalPrice || 0) / 23000).toFixed(2) }} USD
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>
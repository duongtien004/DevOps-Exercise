<script setup>
import { ref, computed, onMounted, watch } from "vue";
import DefaultLayout from "@/layouts/user/DefaultLayout.vue";
import { useForm } from "vee-validate";
import * as yup from "yup";
import { useOrderStore } from "@/stores/order";
import { useUserStore } from "@/stores/user";
import { loadScript } from "@paypal/paypal-js";
import { useCartStore } from "@/stores/cart";
import orderServices from "@/services/orderServices";
import { useRoute, useRouter } from "vue-router";

const orderStore = useOrderStore();
const user = useUserStore();
const cart = useCartStore();
const router = useRouter();
const route = useRoute();
let paypal;
onMounted(async () => {
    try {
        paypal = await loadScript({
            clientId:
                "Aem6xwjgD1G7OqUTRqYpigsFQs4r5B6jBDB_l4WGZKjtaacDq7CvY_p5yJFD3cV5xRsN6iOqvy03c4Ag",
        });

        if (paypal) {
            await paypal
                .Buttons({
                    // Thêm các handler cho PayPal
                    createOrder: (data, actions) => {
                        return actions.order.create({
                            purchase_units: [
                                {
                                    amount: {
                                        value: (total.value / 23000).toFixed(2), // Chuyển đổi VND sang USD
                                    },
                                },
                            ],
                        });
                    },
                    onApprove: async (data, actions) => {
                        try {
                            const order = await actions.order.capture();
                            console.log("order" + order);

                            const orderData = {
                                orderItems: orderStore.items,
                                shippingAddress: {
                                    fullName: values.fullName,
                                    address: values.address,
                                    city: values.city,
                                    country: values.country,
                                    phone: values.phone,
                                },
                                itemsPrice: subtotal.value,
                                shippingPrice: shipping.value,
                                taxPrice: tax.value,
                                totalPrice: total.value,
                                user: user.user.id,
                                orderStatus: order.status === "COMPLETED" ? "Paid" : "Pending",
                                ...(order.status === "COMPLETED" && {
                                    paidAt: order.create_time,
                                })
                            };

                            orderServices.create(orderData).then((response) => {
                                // console.log(response.data);
                                if (response.data.data.orderStatus == "Paid") {
                                    cart.clearCart()
                                    orderStore.removeItems()
                                    router.push({ name: "myaccount", query: { ...route.query, tab: "orders" } })
                                }
                            });

                        } catch (error) {
                            // Log error
                            console.error('Payment failed:', error);

                            // Show user friendly error
                            if (error.name === 'INSTRUMENT_DECLINED') {
                                console.log('Your payment was declined. Please try another payment method.');
                            } else {
                                console.log('Something went wrong. Please try again.');
                            }

                        }

                    },
                    onCancel: async (data, actions) => {
                        const orderData = {
                            orderItems: orderStore.items,
                            shippingAddress: {
                                fullName: values.fullName,
                                address: values.address,
                                city: values.city,
                                country: values.country,
                                phone: values.phone,
                            },
                            itemsPrice: subtotal.value,
                            shippingPrice: shipping.value,
                            taxPrice: tax.value,
                            totalPrice: total.value,
                            user: user.user.id,
                            orderStatus: "Pending",
                        };

                        orderServices.create(orderData).then((response) => {
                            if (response.data.data.orderStatus == "Pending") {
                                cart.clearCart()
                                orderStore.removeItems()
                                router.push({ name: "myaccount", query: { ...route.query, tab: "orders" } })
                            }
                        });
                    },
                    onError: (err) => {
                        console.error("PayPal Error:", err);
                        // Xử lý lỗi thanh toán
                    },
                })
                .render("#payPal");
        }
    } catch (error) {
        console.error("PayPal initialization failed:", error);
    }
});
// Form validation schema
const schema = yup.object({
    fullName: yup.string().required("Full name is required"),
    email: yup.string().email("Invalid email").required("Email is required"),
    address: yup.string().required("Address is required"),
    phone: yup.string(),
    city: yup.string().required("City is required"),
    country: yup.string().required("Country is required"),
});


// Form handling with proper field registration
const { handleSubmit, resetForm, setFieldValue, values, errors } = useForm({
    validationSchema: schema,
    initialValues: {
        fullName: user.user.name,
        email: user.user.email,
        address: "",
        phone: "",
        city: "",
        country: "",
    }
});

watch(values, (newValues) => {
    console.log('Form values changed:', newValues);
}, { deep: true });





// Computed values for order summary
const subtotal = ref(orderStore.totalPrice);
const shipping = ref(30000);
const taxRate = 0.05;
const tax = computed(() => subtotal.value * taxRate);
const total = computed(() => subtotal.value + shipping.value + tax.value);

const onSubmit = handleSubmit((values) => {
    console.log("Form submitted:", values);
    // Here you would typically make an API call to process the order
});

// Handle input changes
const handleInputChange = (field, event) => {
    setFieldValue(field, event.target.value);
};

// PayPal payment handling
const handlePayPalPayment = () => {
    console.log("Processing PayPal payment...");
};

function formatVND(amount) {
    if (isNaN(amount)) {
        throw new Error("Invalid input: Amount must be a number");
    }

    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}
</script>

<template>
    <DefaultLayout>
        <div class="max-w-7xl mx-auto p-4">
            <h1 class="text-3xl font-bold mb-6">Checkout</h1>

            <div class="flex flex-wrap lg:flex-nowrap gap-6">
                <!-- Checkout Form -->
                <div class="w-full lg:w-2/3">
                    <div class="bg-white p-6 shadow-lg rounded-lg">
                        <h2 class="text-xl font-bold mb-4">Shipping Address</h2>

                        <form @submit="onSubmit" class="space-y-4">
                            <div class="grid grid-cols-3 gap-4">
                                <!-- Full Name -->
                                <div>
                                    <label for="fullName" class="block text-gray-700 font-bold mb-2">
                                        Full Name
                                    </label>
                                    <input :value="values.fullName" @input="handleInputChange('fullName', $event)"
                                        type="text" id="fullName"
                                        class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="{ 'border-red-500': errors.fullName }"
                                        placeholder="Enter your full name" />
                                    <p v-if="errors.fullName" class="mt-1 text-red-500 text-sm">
                                        {{ errors.fullName }}
                                    </p>
                                </div>
                                <!-- Email -->
                                <div>
                                    <label for="email" class="block text-gray-700 font-bold mb-2">
                                        Email
                                    </label>
                                    <input :value="values.email" @input="handleInputChange('email', $event)"
                                        type="email" id="email"
                                        class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="{ 'border-red-500': errors.email }" placeholder="Enter your email" />
                                    <p v-if="errors.email" class="mt-1 text-red-500 text-sm">
                                        {{ errors.email }}
                                    </p>
                                </div>
                                <!-- phone -->
                                <div>
                                    <label for="phone" class="block text-gray-700 font-bold mb-2">
                                        phone
                                    </label>
                                    <input :value="values.phone" @input="handleInputChange('phone', $event)" type="text"
                                        id="phone"
                                        class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="{ 'border-red-500': errors.phone }" placeholder="Enter your phone" />
                                    <p v-if="errors.phone" class="mt-1 text-red-500 text-sm">
                                        {{ errors.phone }}
                                    </p>
                                </div>
                            </div>
                            <!-- Address fields -->
                            <div class="space-y-4">
                                <div>
                                    <label for="address" class="block text-gray-700 font-bold mb-2">
                                        Address
                                    </label>
                                    <input :value="values.address" @input="handleInputChange('address', $event)"
                                        type="text" id="address"
                                        class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        :class="{ 'border-red-500': errors.address }"
                                        placeholder="Street address or P.O. Box" />
                                    <p v-if="errors.address" class="mt-1 text-red-500 text-sm">
                                        {{ errors.address }}
                                    </p>
                                </div>

                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label for="city" class="block text-gray-700 font-bold mb-2">
                                            City
                                        </label>
                                        <input :value="values.city" @input="handleInputChange('city', $event)"
                                            type="text" id="city"
                                            class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            :class="{ 'border-red-500': errors.city }" placeholder="City" />
                                        <p v-if="errors.city" class="mt-1 text-red-500 text-sm">
                                            {{ errors.city }}
                                        </p>
                                    </div>
                                    <div>
                                        <label for="city" class="block text-gray-700 font-bold mb-2">
                                            Country
                                        </label>
                                        <input :value="values.country" @input="handleInputChange('country', $event)"
                                            type="text" id="city"
                                            class="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                            :class="{ 'border-red-500': errors.country }" placeholder="country" />
                                        <p v-if="errors.country" class="mt-1 text-red-500 text-sm">
                                            {{ errors.country }}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </form>
                    </div>
                </div>

                <!-- Order Summary -->
                <div class="w-full lg:w-1/3">
                    <div class="bg-white p-6 shadow-lg rounded-lg">
                        <h2 class="text-xl font-bold mb-4">Order Summary</h2>

                        <!-- Cart Items -->
                        <div class="space-y-4 mb-6">
                            <div v-for="item in orderStore.items" :key="item._id"
                                class="flex justify-between items-center">
                                <div class="flex items-center">
                                    <img :src="'http://127.0.0.1:8088/' + item.thumbnail" :alt="item.name"
                                        class="w-12 h-12 object-cover rounded mr-4" />
                                    <div>
                                        <p class="text-gray-700 font-bold">{{ item.name }}</p>
                                        <p class="text-gray-500">Quantity: {{ item.quantity }}</p>
                                    </div>
                                </div>
                                <p class="text-gray-700">
                                    {{ formatVND(item.price * item.quantity) }}
                                </p>
                            </div>
                        </div>

                        <!-- Order Details -->
                        <div class="space-y-2 mb-4">
                            <div class="flex justify-between">
                                <p class="text-gray-600">Subtotal</p>
                                <p class="text-gray-600">{{ formatVND(subtotal) }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p class="text-gray-600">Shipping</p>
                                <p class="text-gray-600">{{ formatVND(shipping) }}</p>
                            </div>
                            <div class="flex justify-between">
                                <p class="text-gray-600">Tax ( 5% )</p>
                                <p class="text-gray-600">{{ formatVND(tax) }}</p>
                            </div>
                        </div>

                        <hr class="my-4" />

                        <div class="flex justify-between text-lg font-bold mb-6">
                            <p>Total</p>
                            <p>{{ formatVND(total) }}</p>
                        </div>

                        <!-- Payment Section -->
                        <div class="space-y-4">
                            <div class="flex justify-between items-center">
                                <p class="text-gray-600">Payment Method</p>
                                <p class="text-gray-700 font-bold">PayPal</p>
                            </div>

                            <div id="payPal"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </DefaultLayout>
</template>

<template>
    <RouterLink :to="`/product/${item._id}`">
        <div class="product-item relative">
            <!-- <span class="badge bg-green-500 absolute m-3 text-white rounded">-{{ item.discount }}%</span> -->
            <!-- <a href="#" class="btn-wishlist">
                <font-awesome-icon :icon="['far', 'heart']" class="size-4" />
            </a> -->
            <figure>
                <a href="index.html" title="Sunstar Fresh Melon Juice">
                    <img :src="'http://127.0.0.1:8088/' + item.thumbnail" :alt="item.title" class="w-full h-auto" />
                </a>
            </figure>
            <h3 class="line-clamp-2">
                {{ item.name }}
            </h3>

            <div class="flex">
                <!-- line-through -->
                <span class="price  text-red-500">{{ formatVND(item.price) }}</span>
                <!-- <span class="text-xl">
                    ${{ calculateDiscountedPrice(item.price, item.discount).toFixed(2) }}
                </span> -->
            </div>
            <div class="flex">
                <span class="line-clamp-3">{{ item.description }}</span>
            </div>
            <div class="flex items-center justify-between mt-3">
                <div class="flex items-center rounded product-qty">
                    <button type="button" class="quantity-left-minus bg-red-500 btn-number text-white p-1 rounded"
                        data-type="minus" @click.prevent="decrementQuantity">
                        <font-awesome-icon icon="minus" />
                    </button>
                    <input type="text" id="quantity" name="quantity"
                        class="form-control input-number w-12 text-center border-0 focus:ring-0 focus:outline-none"
                        :value="quantity" readonly />
                    <button type="button" class="quantity-right-plus bg-green-500 btn-number text-white p-1 rounded"
                        data-type="plus" @click.prevent="incrementQuantity">
                        <font-awesome-icon icon="plus" />
                    </button>
                </div>
                <button class="nav-link text-blue-600 hover:text-blue-800 font-semibold"
                    @click.prevent="handleAddToCart">
                    Add to Cart
                </button>
            </div>
        </div>
    </RouterLink>
</template>
<script setup>
import { ref } from "vue";
import { RouterLink } from "vue-router";
import { useCartStore } from "@/stores/cart";
import { defineProps } from "vue";
import { useUserStore } from "@/stores/user";
const cartStore = useCartStore();
const userStore = useUserStore()
const props = defineProps({
    item: {
        type: Object,
        required: true,
    },
});

const quantity = ref(1);

const incrementQuantity = () => {
    quantity.value++;
};

const decrementQuantity = () => {
    if (quantity.value > 1) {
        quantity.value--;
    }
};

function formatVND(amount) {
    if (isNaN(amount)) {
        throw new Error("Invalid input: Amount must be a number");
    }

    return amount.toLocaleString("vi-VN", { style: "currency", currency: "VND" });
}

// const calculateDiscountedPrice = (price, discount) => {
//     return price * (1 - discount / 100);
// };

const handleAddToCart = () => {
    const data = {
        ...props.item,
        quantity: quantity.value,
        user: userStore.user.id,
    };
    console.log(data);

    cartStore.addItem(data);
};
</script>

<style scoped>
.product-item {
    position: relative;
    padding: 16px;
    background: #ffffff;
    border: 1px solid #fbfbfb;
    box-shadow: 0px 5px 22px rgba(0, 0, 0, 0.04);
    border-radius: 16px;
    margin-bottom: 30px;
    transition: box-shadow 0.3s ease-out;
}

.product-item:hover {
    box-shadow: 0px 21px 44px rgba(0, 0, 0, 0.08);
}

.product-item h3 {
    width: 100%;
    font-weight: 600;
    font-size: 18px;
    line-height: 25px;
    text-transform: capitalize;
    color: #333333;
    margin-top: 10px;
}

.product-item figure {
    background: #f9f9f9;
    border-radius: 12px;
    text-align: center;
}

.product-item figure img {
    height: 180px;
    width: 100%;
}

.product-item .btn-wishlist {
    position: absolute;
    top: 20px;
    right: 20px;
    width: 40px;
    height: 40px;
    border-radius: 50px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fff;
    border: 1px solid #d8d8d8;
    transition: all 0.3s ease-out;
}

.product-item .btn-wishlist:hover {
    background: rgb(240, 56, 56);
    color: #fff;
}

.product-item .qty {
    font-weight: 400;
    font-size: 13px;
    line-height: 18px;
    letter-spacing: 0.02em;
    text-transform: uppercase;
    color: #9d9d9d;
}

.product-item .rating {
    font-weight: 600;
    font-size: 13px;
    line-height: 18px;
    text-transform: capitalize;
    color: #222222;
}

.product-item .rating iconify-icon {
    color: #ffc43f;
}

.product-item .price {
    display: block;
    width: 100%;
    font-weight: 500;
    font-size: 20px;
    line-height: 30px;
    text-transform: capitalize;
}

.product-item .product-qty {
    width: 85px;
}

.product-item .btn-link {
    text-decoration: none;
}

.product-item #quantity {
    height: auto;
    width: 28px;
    text-align: center;
    border: none;
    margin: 0;
    padding: 0;
}

.product-item .btn-number {
    width: 26px;
    height: 26px;
    line-height: 1;
    text-align: center;
    background: #ffffff;
    border: 1px solid #e2e2e2;
    border-radius: 6px;
    color: #222;
    padding: 4;
}
</style>

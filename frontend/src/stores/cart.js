import { defineStore } from "pinia";

export const useCartStore = defineStore("cart", {
  persist: {
    enabled: true,
    strategies: [
      {
        key: "cart",
        storage: localStorage,
      },
    ],
  },
  state: () => ({
    items: [],
  }),
  getters: {
    totalPrice(state) {
      return state.items.reduce(
        (total, item) => total + item.price * item.quantity,
        0
      );
    },
  },
  actions: {
    addItem(newItem) {
      const existingItem = this.items.find((item) => item._id == newItem._id);

      if (existingItem) {
        existingItem.quantity += newItem.quantity || 1;
      } else {
        this.items.push({ ...newItem, quantity: newItem.quantity || 1 });
      }
    },
    updateQuantity(itemId, quantity) {
      console.log(itemId + " " + quantity);

      const item = this.items.find((item) => item._id === itemId);
      if (item) {
        item.quantity = Math.max(0, quantity);
        if (item.quantity === 0) {
          this.removeItem(itemId);
        }
      }
    },

    removeItem(itemId) {
      this.items = this.items.filter((item) => item._id !== itemId);
    },
    clearCart() {
      this.items = [];
    },
  },
});

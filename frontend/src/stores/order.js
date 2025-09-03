import { defineStore } from "pinia";

export const useOrderStore = defineStore("orders", {
  persist: {
    enabled: true,
    strategies: [
      {
        key: "orders",
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
    addItems(order) {
      order.forEach((item) => this.items.push(item));
    },
    removeItems() {
      this.items = [];
    },
  },
});

import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useVouchersStore = defineStore("vouchers", () => {
  // STATE
  let vouchers = ref(null);

  // GETTER
  const getVouchers = computed(() => vouchers.value);

  // ACTIONS
  function setVouchers(data) {
    vouchers.value = data;
  }

  return {
    // STATE
    vouchers,
    // GETTERS
    getVouchers,
    // ACTIONS
    setVouchers,
  };
});

import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCashbackHistoryStore = defineStore("cashbackHistory", () => {
  // STATE
  let currentHistoryPage = ref(1);
  let maxHistoryPage = ref(0);
  let itemsPerPage = ref(10);

  // GETTER
  const getCurrentHistoryPage = computed(() => currentHistoryPage.value);
  const getMaxHistoryPage = computed(() => maxHistoryPage.value);
  const getItemsPerPage = computed(() => itemsPerPage.value);

  // ACTIONS

  function setCurrentHistoryPage(page) {
    currentHistoryPage.value = page;
  }

  function setMaxHistoryPage(page) {
    maxHistoryPage.value = page;
  }

  function resetCashbackHistoryStore() {
    currentHistoryPage.value = 1;
    maxHistoryPage.value = 1;
  }

  return {
    // GETTERS
    getCurrentHistoryPage,
    getMaxHistoryPage,
    getItemsPerPage,
    // ACTIONS
    setCurrentHistoryPage,
    setMaxHistoryPage,
    resetCashbackHistoryStore,
  };
});

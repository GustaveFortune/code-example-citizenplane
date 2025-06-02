import { ref, computed } from "vue";
import { defineStore } from "pinia";

export const useCashbackStore = defineStore(
  "cashback",
  () => {
    // STATE
    let cashbackCoupons = ref(null);
    let currentPartner = ref(null);
    let currentPartnersPage = ref(1);
    let maxPartnersPage = ref(10);
    let itemsPerPage = ref(10);
    let cashbackCurrentCountry = ref({
      title: "",
      code: "fr",
      icon: "fr-small",
    });
    let cashbackUserData = ref({});
    let isGiftCardTransfer = ref(false);
    let fanWallet = ref(0);
    let companyChannels = ref([]);

    // GETTERS
    const getCashbackCoupons = computed(() => cashbackCoupons.value);
    const getCurrentPartner = computed(() => currentPartner.value);
    const getCurrentPartnersPage = computed(() => currentPartnersPage.value);
    const getMaxPartnersPage = computed(() => maxPartnersPage.value);
    const getItemsPerPage = computed(() => itemsPerPage.value);
    const getCashbackCurrentCountry = computed(
      () => cashbackCurrentCountry.value
    );
    const getCashbackUserData = computed(() => cashbackUserData.value);
    const getIsGiftCardTransfer = computed(() => isGiftCardTransfer.value);
    const getFanWallet = computed(() => fanWallet.value);
    const getCompanyChannels = computed(() => companyChannels.value);

    // ACTIONS
    function setCashbackCoupons(data) {
      cashbackCoupons.value = data;
    }

    function setCurrentPartner(partner) {
      currentPartner.value = partner;
    }

    function setCurrentPartnersPage(page) {
      currentPartnersPage.value = page;
    }

    function setMaxPartnersPage(page) {
      maxPartnersPage.value = page;
    }

    function setCurrentCountry(country) {
      cashbackCurrentCountry.value = country;
    }

    function setCashbackUserData(data) {
      cashbackUserData.value = { ...data };
    }

    function setIsGiftCardTransfer(bool) {
      isGiftCardTransfer.value = bool;
    }

    function setFanWallet(amount) {
      fanWallet.value = amount;
    }

    function setCompanyChannels(channels) {
      companyChannels.value = channels;
    }

    function resetCashbackStore() {
      cashbackCoupons.value = null;
      currentPartner.value = null;
      currentPartnersPage.value = 1;
      isGiftCardTransfer.value = false;
      companyChannels.value = [];
    }

    return {
      // STATE
      cashbackCoupons,
      // GETTERS
      getCashbackCoupons,
      getCurrentPartner,
      getCurrentPartnersPage,
      getMaxPartnersPage,
      getItemsPerPage,
      getCashbackCurrentCountry,
      getCashbackUserData,
      getIsGiftCardTransfer,
      getFanWallet,
      getCompanyChannels,
      // ACTIONS
      setCashbackCoupons,
      setCurrentPartner,
      setCurrentPartnersPage,
      setMaxPartnersPage,
      setCurrentCountry,
      resetCashbackStore,
      setCashbackUserData,
      setIsGiftCardTransfer,
      setFanWallet,
      setCompanyChannels,
    };
  },
  // For persistent data on reload set "enabled" to TRUE
  {
    persist: {
      enabled: true,
      paths: ["cashbackCurrentCountry"], // Only persist cashbackCurrentCountry
    },
  }
);

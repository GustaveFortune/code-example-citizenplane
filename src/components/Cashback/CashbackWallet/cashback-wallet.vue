<template>
  <div class="cashback-wallet-container" :style="style">
    <!-- TITLE -->
    <div class="wallet-title font-1-subtitle-2">
      {{ t("cashback.wallet.myWallet") }}
    </div>

    <!-- CONTENT -->
    <div class="cashback-wallet-content">
      <!-- FUNDS -->
      <div class="user-funds">
        <!-- AVAILABLE -->
        <WalletCash :amount="fanWallet" />

        <!-- SEPARATOR -->
        <div class="funds-separator" v-if="props.showPending"></div>

        <!-- ON HOLD -->
        <WalletCash
          v-if="props.showPending"
          :isAvailable="false"
          :amount="fanWallet"
        />
      </div>
      <!-- ACTION -->
      <div class="action-buttons-container">
        <WalletButton
          v-if="props.showTransfer"
          iconName="arrows-exchange"
          :title="t('cashback.wallet.transfer')"
          @transfer="transferToBank"
        />
        <WalletButton
          iconName="basic-gift"
          :title="t('cashback.wallet.giftCard')"
          @transfer="transferToGiftCard"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
// ------ VUE------ //
import { ref, computed, watch } from "vue";

// ------ PINIA ------ //
import { storeToRefs } from "pinia";

// ------ I18N------ //
import { useI18n } from "vue-i18n";

// ------ COMPONENTS ------ //
import WalletCash from "@/components/Cashback/CashbackWallet/WalletCash/wallet-cash.vue";
import WalletButton from "@/components/Cashback/CashbackWallet/WalletButton/wallet-button.vue";

// ------ SERVICES ------ //
import fetchFanDataService from "@/business-logic/vouchers/fetchFanData";
import fetchVoucherChannelService from "@/business-logic/vouchers/fetchVoucherChannel";

// ------ STORES ------ //
import { useBreakpointStore } from "@/stores/responsive";
import { useCashbackStore } from "@/stores/cashback/cashback.js";
import { useModalCashBackStore } from "@/stores/modals/modalCashback.js";
import { useInterfaceCustomizationStore } from "@/stores/interfaceCustomization";

// ------ PROPS ------ //
const props = defineProps({
  showPending: {
    type: Boolean,
    default: false,
  },
  showTransfer: {
    type: Boolean,
    default: false,
  },
});

// ------ DATA ------ //
const breakpoint = useBreakpointStore();
const cashbackStore = useCashbackStore();
const modalCashBackStore = useModalCashBackStore();
const { getCashbackCurrentCountry } = storeToRefs(cashbackStore);
const { getMdAndUp } = storeToRefs(breakpoint);
const { t } = useI18n();
const fanWallet = ref(0);

// ------ COMPUTED ------ //
const style = computed(() => ({
  "--cashback-wallet-content__flex-direction": getMdAndUp.value
    ? "column"
    : "row",
  "--cashback-wallet-container__padding": getMdAndUp.value
    ? "var(--spacing-xl)"
    : "var(--spacing-m)",
}));

// ------ METHODS ------ //
const transferToGiftCard = async () => {
  // Fetch partner data
  const partner = await fetchVoucherChannelService.fetchVoucherChannel();
  // Setup logo using program logo
  partner.logo190_90 = useInterfaceCustomizationStore().logo;
  // Setup values in store
  cashbackStore.setCurrentPartner(partner);
  // Set gift card transfer in store
  cashbackStore.setIsGiftCardTransfer(true);
  // Show sidebar
  modalCashBackStore.setIsCashBackModalOpen(true);
};

// ------ SETUP ------ //
// Fetch fan wallet
fanWallet.value = await fetchFanDataService.fetchFanWallet(
  getCashbackCurrentCountry.value?.code || "fr"
);
// Setup fan wallet in store
cashbackStore.setFanWallet(fanWallet.value || 0);

// ------ WATCHERS ------ //
watch(
  () => getCashbackCurrentCountry.value,
  async () => {
    fanWallet.value = await fetchFanDataService.fetchFanWallet(
      getCashbackCurrentCountry.value?.code || "fr"
    );
  }
);
</script>

<style lang="scss" scoped>
@use "./cashback-wallet.scss";
</style>

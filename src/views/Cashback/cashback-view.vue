<template>
  <div id="CashbackView" class="cashback-view-container" :style="style">
    <!-- When pending in wallet and bank transfer will be added, leftSectionWidth should be 304 -->
    <GridMainContent
      :isContentOverflowHidden="false"
      :leftSectionWidth="getMdAndUp ? '250' : '100%'"
      :rightSectionWidth="getMdAndUp ? '275' : '100%'"
      showSectionRight
      :showFilterTitle="false"
      :showSectionTitle="false"
    >
      <!-- USER INFORMATION -->
      <template v-slot:section-filter>
        <!-- MY WALLET -->
        <CashbackWallet />
        <!-- MY BANKS -->
        <CashbackBank v-if="props.showBank" />
      </template>

      <!-- COMPANY CASHBACK INFORMATION -->
      <template v-slot:main-content>
        <CashbackContent />
      </template>

      <!-- HISTORY INFORMATION -->
      <template v-slot:side-right>
        <!-- HISTORY -->
        <CashbackHistory />
      </template>
    </GridMainContent>

    <!-- SIDEBAR INFOS -->
    <Transition name="infos">
      <CashbackSidebar v-if="getIsCashBackModalOpen" />
    </Transition>
  </div>
</template>

<script setup>
// ------ VUE ------ //
import { onUnmounted, onMounted, computed } from "vue";

// ------ ROUTER ------ //
import { useRoute } from "vue-router";

// ------ PINIA ------ //
import { storeToRefs } from "pinia";

// ------ I18N ------ //
import { useI18n } from "vue-i18n";

// ------ COMPONENTS ------ //
import GridMainContent from "@/components/UIKit/GridMainContent/grid-main-content.vue";
import CashbackWallet from "@/components/Cashback/CashbackWallet/cashback-wallet.vue";
import CashbackBank from "@/components/Cashback/CashbackBank/cashback-bank.vue";
import CashbackContent from "@/components/Cashback/CashbackContent/cashback-content.vue";
import CashbackHistory from "@/components/Cashback/CashbackHistory/cashback-history.vue";
import CashbackSidebar from "@/components/Cashback/CashbackSidebar/cashback-sidebar.vue";

// ------ STORES ------ //
import { useBreakpointStore } from "@/stores/responsive";
import { useLayoutStore } from "@/stores/layout/layout.js";
import { useModalCashBackStore } from "@/stores/modals/modalCashback.js";
import { useCashbackStore } from "@/stores/cashback/cashback.js";
import { useSnackbarInfoStore } from "@/stores/snackbar/snackbarInfo.js";
import { useCashbackSuccessStore } from "@/stores/cashback/cashbackSuccess.js";

// ------ SERVICES ------ //
import fetchCompanyChannelsService from "@/business-logic/plebicom/fetchCompanyChannels.js";

// ------ PROPS ------ //
const props = defineProps({
  showBank: {
    type: Boolean,
    default: false,
  },
});

// ------ DATA ------ //
// Store
const route = useRoute();
const { t } = useI18n();
const breakpoint = useBreakpointStore();
const layoutStore = useLayoutStore();
const modalCashBackStore = useModalCashBackStore();
const snackbarInfoStore = useSnackbarInfoStore();
const cashbackStore = useCashbackStore();
const cashbackSuccessStore = useCashbackSuccessStore();
const { getSmAndUp, getMdAndUp } = storeToRefs(breakpoint);
const { getIsCashBackModalOpen } = storeToRefs(modalCashBackStore);
// Layout scroll
const { getIsLayoutScroll } = storeToRefs(layoutStore);

// ------ COMPUTED ------ //
const style = computed(() => ({
  "--cashback-view-container__padding-bottom": getSmAndUp.value
    ? "unset"
    : "var(--menu-height)",
  "margin-top": getIsLayoutScroll.value ? "-96px" : "0px",
  "--right-transition": getSmAndUp.vale ? "-512px" : "-100vh",
}));

// ------ ON MOUNTED ------ //
onMounted(() => {
  // Use Vue Router to check for query parameters
  if (route.name === "cashbackSuccessPayment") {
    // Show success modal
    cashbackSuccessStore.setIsSuccessModalShown(true);
  } else if (route.name === "cashbackErrorPayment") {
    snackbarInfoStore.setSnackbarInfo({
      title: t("cashback.sidebar.errorPaymentNotification"),
      type: "error",
      open: true,
    });

    // Set a timeout to reset the snackbar info after 5 seconds (5000 milliseconds)
    setTimeout(() => {
      snackbarInfoStore.resetSnackbarInfo();
    }, 5000);
  }
});

// ------ ON UNMOUNTED ------ //
onUnmounted(() => {
  cashbackStore.resetCashbackStore();
});

// ------ SETUP ------ //
fetchCompanyChannelsService.fetchCompanyChannels();
</script>

<style lang="scss" scoped>
@use "./cashback-view.scss";
</style>

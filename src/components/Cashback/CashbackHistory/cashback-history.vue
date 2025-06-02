<template>
  <div class="cashback-history-container" :style="style">
    <!-- TITLE -->
    <div class="bank-title font-1-subtitle-2">
      {{ t("cashback.history.earningHistory") }}
    </div>

    <!-- CONTENT -->
    <div class="cashback-history-content">
      <!-- THIS WEEK -->
      <div class="content-block-container" v-if="thisWeek.length > 0">
        <div class="history-title font-1-body-m-semi-bold">
          {{ t("common.timer.thisWeek") }}
        </div>
        <div class="history-row">
          <HistoryRow
            v-for="(row, index) in thisWeek"
            :key="`this-week-row-${index}`"
            :title="row.partner.name"
            :imageUrl="getHistoryImage(row)"
            :totalPrice="getTotalPrice(row)"
            :couponPrice="getCouponPrice(row)"
            :date="row.order_date"
            :isAvailable="row.state !== 'PENDING'"
          />
        </div>
      </div>

      <div class="content-block-container" v-if="lastWeek.length > 0">
        <!-- LAST WEEK -->
        <div class="history-title font-1-body-m-semi-bold">
          {{ t("common.timer.lastWeek") }}
        </div>
        <div class="history-row">
          <HistoryRow
            v-for="(row, index) in lastWeek"
            :key="`last-week-row-${index}`"
            :title="row.partner.name"
            :imageUrl="getHistoryImage(row)"
            :totalPrice="getTotalPrice(row)"
            :couponPrice="getCouponPrice(row)"
            :date="row.order_date"
            :isAvailable="row.state !== 'PENDING'"
          />
        </div>
      </div>

      <div class="content-block-container" v-if="olderWeeks.length > 0">
        <!-- OLDER WEEKS -->
        <div class="history-title font-1-body-m-semi-bold">
          {{ t("common.timer.olderWeeks") }}
        </div>
        <div class="history-row">
          <HistoryRow
            v-for="(row, index) in olderWeeks"
            :key="`last-months-row-${index}`"
            :title="row.partner.name"
            :imageUrl="getHistoryImage(row)"
            :totalPrice="getTotalPrice(row)"
            :couponPrice="getCouponPrice(row)"
            :date="row.order_date"
            :isAvailable="row.state !== 'PENDING'"
          />
        </div>
      </div>
    </div>

    <!-- SEE ALL -->
    <BaseButton
      size="fitWidth"
      :neutral="false"
      type="success"
      :label="getButtonLabel"
      @click="seeAllHistory"
    />
  </div>
</template>

<script setup>
// ------ VUE ------ //
import { ref, computed, watch } from "vue";

// ------ PINIA ------ //
import { storeToRefs } from "pinia";

// ------ I18N ------ //
import { useI18n } from "vue-i18n";

// ------ ROUTER ------ //
import { useRouter } from "vue-router";

// ------ COMPONENTS ------ //
import HistoryRow from "@/components/Cashback/CashbackHistory/HistoryRow/history-row.vue";
import BaseButton from "@/components/UIKit/ButtonBase/base-button.vue";

// ------ SERVICES ------ //
import fetchUserCashbackHistoryService from "@/business-logic/plebicom/fetchUserCashbackHistory.js";

// ------ STORES ------ //
import { useCashbackHistoryStore } from "@/stores/cashback/cashbackHistory.js";
import { useBreakpointStore } from "@/stores/responsive";
import { useCashbackStore } from "@/stores/cashback/cashback.js";
import { useUserStore } from "@/stores/user.js";
import { useInterfaceCustomizationStore } from "@/stores/interfaceCustomization";

// ------ DATA ------ //
const { t } = useI18n();
const router = useRouter();
// Store
const userStore = useUserStore();
const breakpoint = useBreakpointStore();
const cashbackHistoryStore = useCashbackHistoryStore();
const cashbackStore = useCashbackStore();
const { getCashbackCurrentCountry } = storeToRefs(cashbackStore);
const { getItemsPerPage, getCurrentHistoryPage } =
  storeToRefs(cashbackHistoryStore);
const { getMdAndUp } = storeToRefs(breakpoint);
const { getCurrentFanId } = storeToRefs(userStore);
const thisWeek = ref([]);
const lastWeek = ref([]);
const olderWeeks = ref([]);

// ------ COMPUTED ------ //
const getButtonLabel = computed(() => {
  return t("cashback.history.seeAllHistory");
});

const style = computed(() => ({
  "--cashback-history-container__padding": getMdAndUp.value
    ? "var(--spacing-xl)"
    : "var(--spacing-m)",
}));

// ------ METHODS ------ //
const getHistoryImage = (row) => {
  // If order_amount isn't NULL then row is a VOUCHER
  // Otherwise, row is a COUPON
  if (row.order_amount) {
    return useInterfaceCustomizationStore().logo;
  } else {
    return row.partner.logo90_50;
  }
};

const getTotalPrice = (row) => {
  // If order_amount isn't NULL then row is a VOUCHER
  // Otherwise, row is a COUPON
  return row.order_amount ? null : row.total_paid || null;
};

const getCouponPrice = (row) => {
  // If order_amount isn't NULL then row is a VOUCHER
  // Otherwise, row is a COUPON
  return row.order_amount
    ? -row.order_amount || null
    : row.total_cashback || null;
};

const seeAllHistory = () => {
  router.push({ name: "cashbackHistory" });
};

const splitHistory = async () => {
  // Reset values
  thisWeek.value = [];
  lastWeek.value = [];
  olderWeeks.value = [];

  // Fetch history
  const response =
    await fetchUserCashbackHistoryService.fetchUserCashbackHistory(
      getCurrentFanId.value,
      getCurrentHistoryPage.value,
      getItemsPerPage.value
    );

  const today = new Date();

  response.forEach((element) => {
    const orderDate = new Date(element.order_date);
    const diffInDays = Math.floor((today - orderDate) / (1000 * 60 * 60 * 24));
    if (diffInDays < 7) {
      thisWeek.value.push(element);
    } else if (diffInDays < 14) {
      lastWeek.value.push(element);
    } else {
      olderWeeks.value.push(element);
    }
  });
};

// ------ SETUP ------ //
await splitHistory();

// ------ WATCHERS ------ //
watch(
  () => getCashbackCurrentCountry.value,
  () => {
    splitHistory();
  }
);
</script>

<style lang="scss" scoped>
@use "./cashback-history.scss";
</style>

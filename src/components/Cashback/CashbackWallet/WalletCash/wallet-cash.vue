<template>
  <div class="wallet-cash-container" :style="style">
    <!-- AMOUNT -->
    <div class="amount-container font-1-subtitle-1">
      {{ nFormatter(props.amount, 2) }} {{ props.currency }}
    </div>
    <!-- STATUS -->
    <div class="status-container font-1-body-xs-regular-4">
      <BaseIcon
        :name="props.isAvailable ? 'tick-circle' : 'time-circle'"
        filled
      />

      {{
        props.isAvailable
          ? t("cashback.common.available").toUpperCase()
          : t("cashback.common.onHold").toUpperCase()
      }}
    </div>
  </div>
</template>

<script setup>
// ------ VUE------ //
import { computed } from "vue";

// ------ I18N------ //
import { useI18n } from "vue-i18n";

// ------ COMPONENTS ------ //
import BaseIcon from "@/components/UIKit/BaseIconV2/base-icon-v2.vue";

// ------ HELPERS ------
import { nFormatter } from "@/helpers/numbers/numbers.js";

// ------ PROPS ------ //
const props = defineProps({
  isAvailable: {
    type: Boolean,
    default: true,
  },
  amount: {
    type: Number,
    default: 0,
  },
  currency: {
    type: String,
    default: "€",
  },
});

// ------ DATA ------ //
const { t } = useI18n();

// ------ COMPUTED ------ //
const style = computed(() => ({
  "--status-container__color": props.isAvailable
    ? "var(--wallet-cash__available_color)"
    : "var(--wallet-cash__on-hold_color)",
}));
</script>

<style lang="scss" scoped>
@use "./wallet-cash.scss";
</style>

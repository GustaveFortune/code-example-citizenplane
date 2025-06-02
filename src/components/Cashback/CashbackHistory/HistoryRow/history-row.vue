<template>
  <div class="history-row-container" :style="style">
    <!-- LEFT CONTAINER -->
    <div class="left-container">
      <!-- IMAGE -->
      <div class="image-container">
        <img v-if="props.imageUrl" :src="props.imageUrl" />

        <BaseIcon v-else name="domain" size="md" />
      </div>
      <div class="title-text-container">
        <!-- TITLE -->
        <div class="font-1-body-m-regular-2">
          {{ props.title }}
        </div>
        <!-- PRICE -->
        <div
          v-if="props.totalPrice"
          class="font-1-body-xs-semi-bold price-date-container"
        >
          {{ props.totalPrice }}€
        </div>
        <!-- DATE -->
        <div class="font-1-body-xs-regular-3 price-date-container">
          {{ getDate }}
        </div>
      </div>
    </div>

    <!-- RIGHT CONTAINER -->
    <div class="right-container">
      <!-- COUPON PRICE -->
      <div v-if="props.couponPrice" class="font-1-button">
        {{ parseFloat(props.couponPrice).toFixed(2) }}€
      </div>
    </div>
  </div>
</template>

<script setup>
// ------ VUE ------ //
import { computed } from "vue";

// ------ I18N ------ //
import i18n from "@/i18n.js";

// ------ COMPONENTS ------ //
import BaseIcon from "@/components/UIKit/BaseIconV2/base-icon-v2.vue";

// ------ HELPERS ------
import { formatDistance } from "date-fns";
import { cs, da, de, enUS, es, fr, it, nl, pt } from "date-fns/locale"; // Import locales

// ------ PROPS ------ //
const props = defineProps({
  title: {
    type: String,
    default: "Not found",
  },
  imageUrl: {
    type: String,
    default: "",
  },
  totalPrice: {
    type: Number,
    default: 0,
  },
  couponPrice: {
    type: Number,
    default: 0,
  },
  date: {
    type: String,
    default: "",
  },
  isAvailable: {
    type: Boolean,
    default: true,
  },
});

// ------ COMPUTED ------ //
const style = computed(() => ({
  "--price__color": props.isAvailable
    ? "var(--price__available_color)"
    : "var(--price__on-hold_color)",
}));

const getDate = computed(() => {
  return getFormattedDate(props.date);
});

// ------ METHODS ------ //
const getFormattedDate = (date) => {
  const locale = i18n.global.locale.value;
  let selectedLocale;

  switch (locale) {
    case "cs":
    case "cz":
      selectedLocale = cs;
      break;
    case "da":
    case "dk":
      selectedLocale = da;
      break;
    case "de":
      selectedLocale = de;
      break;
    case "en":
      selectedLocale = enUS;
      break;
    case "es":
      selectedLocale = es;
      break;
    case "fr":
      selectedLocale = fr;
      break;
    case "it":
      selectedLocale = it;
      break;
    case "nl":
      selectedLocale = nl;
      break;
    case "pt":
      selectedLocale = pt;
      break;
    default:
      selectedLocale = enUS; // Default to enUS if the locale is not recognized
  }

  return formatDistance(date, new Date(), {
    addSuffix: true,
    locale: selectedLocale,
  });
};
</script>

<style lang="scss" scoped>
@use "./history-row.scss";
</style>

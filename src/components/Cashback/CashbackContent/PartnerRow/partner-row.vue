<template>
  <div class="partner-row-container">
    <!-- IMAGE -->
    <div class="image-container">
      <img :src="props.image" />
    </div>
    <!-- TITLE + PERCENTAGE -->
    <div class="title-percentage-container">
      <!-- TITLE -->
      <div class="title-container font-1-body-m-semi-bold">
        {{ props.title }}
      </div>

      <!-- CASHBACK PERCENTAGE -->
      <div class="percentage-container font-1-subtitle-3">
        <!-- ICON -->
        <div class="percentage-icon-container success-color">
          <BaseIconV2 name="basic-flash" size="custom" filled />
        </div>
        <!-- PERCENTAGE VALUE -->
        <span class="success-color"> {{ props.percentage }}% </span>
        <!-- CASHBACK WORDING -->
        <span class="cashback-wording">
          {{ t("cashback.partner.cashback") }}
        </span>
      </div>
    </div>
    <!-- ACTION BUTTON -->
    <div class="action-button-container">
      <BaseButton
        :label="t('cashback.partner.see')"
        outlined
        @click="seeMore"
        size="x-small"
      />
    </div>
  </div>
</template>

<script setup>
// ------ COMPONENTS ------ //
import BaseIconV2 from "@/components/UIKit/BaseIconV2/base-icon-v2.vue";
import BaseButton from "@/components/UIKit/ButtonBase/base-button.vue";

// ------ I18N------ //
import { useI18n } from "vue-i18n";

// ------ PROPS ------ //
const props = defineProps({
  id: {
    type: Number,
    default: 1,
  },
  image: {
    type: String,
    default: "",
  },
  title: {
    type: String,
    default: "",
  },
  percentage: {
    type: String,
    default: "0",
  },
});

// ------ EMITS ------ //
const emit = defineEmits(["seeMore"]);

// ------ DATA ------ //
const { t } = useI18n();

// ------ FUNCTIONS ------ //
const seeMore = () => {
  emit("seeMore", props.id);
};
</script>

<style lang="scss" scoped>
@use "./partner-row.scss";
</style>

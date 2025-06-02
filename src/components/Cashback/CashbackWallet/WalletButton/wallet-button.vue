<template>
  <div class="wallet-button-container" @click="action">
    <!-- ICON -->
    <div class="icon-container font-1-subtitle-1">
      <BaseIcon :name="props.iconName" size="lg" filled />
    </div>
    <!-- TITLE -->
    <div class="title-container font-1-body-xs-regular-4">
      {{ props.title }}
    </div>
  </div>
</template>

<script setup>
// ------ COMPONENTS ------ //
import BaseIcon from "@/components/UIKit/BaseIconV2/base-icon-v2.vue";

// ------ PROPS ------ //
const props = defineProps({
  iconName: {
    type: String,
    default: "arrows-exchange",
  },
  title: {
    type: String,
    default: "Transfer",
  },
});

// --------- EMITS ---------
const emit = defineEmits(["transfer"]);

// ------ FUNCTIONS ------ //
const action = () => {
  emit("transfer");
};
</script>

<style lang="scss" scoped>
@use "./wallet-button.scss";
</style>

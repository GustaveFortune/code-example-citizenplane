<template>
  <div class="cashback-content-container" :style="style">
    <!-- HEADER -->
    <div class="cashback-content-header font-1-body-xm-semi-bold">
      <!-- TITLE -->
      {{ t("cashback.partner.partnerOffers") }}

      <!-- SEARCH CONTAINER -->
      <div class="search-input-container">
        <!-- SEARCH INPUT -->
        <div class="search-input">
          <!-- INPUT -->
          <div class="left-content">
            <BaseTextInput
              v-model="searchPartnerText"
              :placeholder="t('cashback.partner.searchPartners')"
              appendIconV2="search"
              fillWidth
              outlined
              @updateValue="searchPartnerDebounced"
            />
          </div>
        </div>

        <div v-if="countries.length > 1">
          <CountrySelect :lang="countries" />
        </div>
      </div>
    </div>

    <!-- CONTENT -->
    <div v-if="loading" class="cashback-content">
      <div class="content-loader">
        <LoadingState />
      </div>
    </div>

    <div v-else class="cashback-content">
      <PartnerRow
        v-for="(partner, index) in partners"
        :key="`partner-row-${partner.name}-${index}`"
        :image="partner.logo90_50"
        :title="partner.name"
        :percentage="partner.cashback?.percent || 0"
        @seeMore="showSidebar(partner)"
      />
    </div>

    <!-- PAGINATION -->
    <BasePagination
      v-if="getMaxPartnersPage > 1"
      :itemsPerPage="getItemsPerPage"
      :currentPage="getCurrentPartnersPage"
      :maxPage="getMaxPartnersPage"
      @update:currentPage="cashbackStore.setCurrentPartnersPage"
    />
  </div>
</template>

<script setup>
// ------ VUE ------ //
import { ref, watch, computed } from "vue";

// ------ PINIA ------ //
import { storeToRefs } from "pinia";

// ------ I18N------ //
import { useI18n } from "vue-i18n";

// ------ HELPERS ------ //
import { debounce } from "@/helpers/methods/debounce.js";

// ------ COMPONENTS ------ //
import BaseTextInput from "@/components/UIKit/TextInput/base-text-input.vue";
import PartnerRow from "@/components/Cashback/CashbackContent/PartnerRow/partner-row.vue";
import BasePagination from "@/components/UIKit/BasePagination/base-pagination.vue";
import LoadingState from "@/components/UIKit/LoadingState/loading-state.vue";
import CountrySelect from "@/components/UIKit/CountrySelect/country-select.vue";

// ------ SERVICES ------ //
import fetchPartnersService from "@/business-logic/plebicom/fetchPartners.js";

// ------ STORES ------ //
import { useModalCashBackStore } from "@/stores/modals/modalCashback.js";
import { useCashbackStore } from "@/stores/cashback/cashback.js";
import { useBreakpointStore } from "@/stores/responsive.js";

// ------ DATA ------ //
// Store
const breakpointStore = useBreakpointStore();
const modalCashBackStore = useModalCashBackStore();
const cashbackStore = useCashbackStore();
const {
  getItemsPerPage,
  getCurrentPartnersPage,
  getMaxPartnersPage,
  getCashbackCurrentCountry,
  getCompanyChannels,
} = storeToRefs(cashbackStore);
const { getMdAndUp, getSmAndUp } = storeToRefs(breakpointStore);
const { t } = useI18n();
const partners = ref([]);
const loading = ref(true);
const searchPartnerText = ref("");

// ------ COMPUTED ------ //
const style = computed(() => ({
  "--cashback-content-container__padding": getMdAndUp.value
    ? "var(--spacing-xl)"
    : "var(--spacing-m)",
  "--cashback-content-header__flex-direction": getSmAndUp.value
    ? "row"
    : "column",
  "--cashback-content-header__align-items": getSmAndUp.value
    ? "center"
    : "start",
}));

const countries = computed(() => {
  const channelsCountries = getCompanyChannels.value.map((item) => {
    return {
      title: "",
      code: item.store.toLowerCase(),
      icon: `${item.store.toLowerCase()}-small`,
    };
  });

  return channelsCountries;
});

// ------ FUNCTIONS ------ //
// Debounced watcher function
const searchPartner = debounce(() => {
  loadPartners();
}, 500);

const searchPartnerDebounced = (newVal) => {
  searchPartnerText.value = newVal;
  searchPartner();
};

const showSidebar = (partner) => {
  cashbackStore.setCurrentPartner(partner);
  modalCashBackStore.setIsCashBackModalOpen(true);
};

const loadPartners = async () => {
  loading.value = true;

  partners.value = await fetchPartnersService.fetchPartners(
    getCurrentPartnersPage.value,
    getItemsPerPage.value,
    searchPartnerText.value,
    getCashbackCurrentCountry.value?.code || "fr"
  );

  loading.value = false;
};

// ------ SETUP ------ //
loadPartners();

// ------ WATCHERS ------ //
watch(
  () => getCashbackCurrentCountry.value,
  () => {
    loadPartners();
  }
);
watch(
  () => getCurrentPartnersPage.value,
  async () => {
    loadPartners();
  }
);
</script>

<style lang="scss" scoped>
@use "./cashback-content.scss";
</style>

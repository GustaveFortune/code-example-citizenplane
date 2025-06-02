// ------ SERVICES ------ //
import ApiClient from "@/services/api_fanprime/rest/api-client.js";

// ------ STORES ------ //
import { useCashbackHistoryStore } from "@/stores/cashback/cashbackHistory.js";

export default {
  // Function to fetch all partners
  async fetchUserCashbackHistory(id, page = 1, size = 8) {
    const cashbackHistoryStore = useCashbackHistoryStore();
    const apiClient = new ApiClient(
      import.meta.env["VITE_APP_BASE_BACK_URL"],
      true
    );
    const baseURL = `v2/connectors/plebicom/get_fan_orders?fan_id=${id}&page=${page}&size=${size}`;

    try {
      const response = await apiClient.get(baseURL);

      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      const { data } = response;

      if (!data?.data) {
        throw new Error("Invalid API response structure");
      }

      const { count, items } = data.data;

      cashbackHistoryStore.setMaxHistoryPage(Math.ceil(count / size));

      return items ?? [];
    } catch (error) {
      if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
        console.info("Fetch request canceled:", error);
      } else {
        console.error("Error fetching partners:", error);
      }
      return [];
    }
  },
};

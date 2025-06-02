// ------ SERVICES ------ //
import ApiClient from "@/services/api_fanprime/rest/api-client.js";

export default {
  // Function to fetch vouchers
  async fetchVouchers() {
    const apiClient = new ApiClient(
      import.meta.env["VITE_APP_BASE_BACK_URL"],
      true
    );
    const baseURL = `v2/connectors/vouchers/get_available_vouchers`;

    try {
      const response = await apiClient.get(baseURL);

      if (response.status !== 200) {
        throw new Error(`Unexpected response status: ${response.status}`);
      }

      const { data } = response;
      if (!data?.data) {
        throw new Error("Invalid API response structure");
      }

      return data.data ?? null;
    } catch (error) {
      if (error.name === "AbortError" || error.code === "ERR_CANCELED") {
        console.info("Fetch request canceled:", error);
      } else {
        console.error("Error fetching vouchers:", error);
      }
      return [];
    }
  },
};

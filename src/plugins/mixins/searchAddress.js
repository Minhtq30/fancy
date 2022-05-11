// Service
import services from "@/services";

// Common
import common from "@/utils/common";
import { get } from "lodash";

export default {
  methods: {
    showError(error, clgMsg = "Có lỗi xảy ra") {
      console.log("------------Thông báo lỗi------------");
      console.log(error);
      console.log(clgMsg);
      console.log("-------------------------------------");
    },
    /**
     * Check CapacityBBS, get new PickTime
     * @params
     *  1. requestParams: request lấy danh sách địa chỉ.
     *  2. options : option thêm.
     * */
    async getListAddressByName(
      requestParams,
      options = { convertToLabel: false }
    ) {
      let listAddress = [];

      try {
        const result = await services.$address.browseSuggestAddress(
          requestParams
        );
        if (result.success) {
          listAddress = result?.data || [];
          if (options.convertToLabel) {
            listAddress = common.convertLabelValueDataSource({
              dataSource: listAddress,
              valueName: "AddressId",
              labelName: "FullName",
            });
          }
        } else {
          this.showError(result.message);
        }
      } catch (error) {
        this.showError(error, "Có lỗi khi tìm kiếm địa chỉ");
      }

      return listAddress;
    },
    /**
     * Gọi Api để phân tích địa chỉ
     * @param {any} adrressParam Object địa chỉ cần phân tích
     * @returns Trả về object địa chỉ đã được phân tích
     */
    async handleParseAddress(addressParam) {
      let analyzedAddress = {};
      try {
        this.fetchingParseAddress = !this.fetchingParseAddress;
        const result = await services.$address.browseParseAddress(addressParam);
        if (result.status === 200) {
          analyzedAddress = get(result, "data", {});
        } else {
          this.handleError(
            result?.data?.message,
            "Có lỗi khi phân tích địa chỉ."
          );
        }
      } catch (error) {
        // this.$toast.error(
        //   get(error, "message" || "Có lỗi khi phân tích địa chỉ.")
        // );
        this.handleError(error, "Có lỗi khi phân tích địa chỉ.");
      } finally {
        this.fetchingParseAddress = !this.fetchingParseAddress;
      }
      return analyzedAddress;
    },
  },
};

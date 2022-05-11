// Service
import services from "@/services";

// Common
import common from "@/utils/common";

export default {
  methods: {
    showError(error, clgMsg = "Có lỗi xảy ra") {
      console.log("------------Thông báo lỗi------------");
      console.log(error);
      console.log(clgMsg);
      console.log("-------------------------------------");
    },
    convertLabel(item) {
      if (item.type === "ghtk") {
        return `${item.address} (Bưu cục)`;
      }

      let result = "";
      if (item.first_address) {
        result += item.first_address;
      }
      if (item.hamlet || item.street) {
        result += `,${item.street || item.hamlet}`;
      }
      if (item.ward) {
        result += `,${item.ward}`;
      }
      if (item.district) {
        result += `,${item.district}`;
      }
      if (item.province) {
        result += `,${item.province}`;
      }
      return result;
    },
    /**
     * Get List WareHose
     * @params
     *  2. options : option thêm.
     * */
    async getListPickAddress(
      options = { convertToLabel: false, convertToWithoutPayloadLabel: false }
    ) {
      let listAddress = [];

      try {
        const result = await services.$shop.browsePickAddress();
        if (result.success) {
          listAddress = result?.data || [];
          listAddress = listAddress.map((item) => {
            item.hub_type = item.type === "ghtk" ? "buu-cuc" : "kho";
            return item;
          });

          if (options.convertToLabel) {
            listAddress = common.convertLabelValueDataSource({
              dataSource: listAddress,
              labelName: "fullname",
              valueName: "id",
              labelConvert: this.convertLabel,
            });
          }
          if (options.convertToWithoutPayloadLabel) {
            listAddress = common.convertLabelValueWithoutPayload({
              dataSource: listAddress,
              labelName: "fullname",
              valueName: "id",
              labelConvert: this.convertLabel,
            });
          }
        } else {
          this.showError(result.message);
        }
      } catch (error) {
        this.showError(error, "Có lỗi khi lấy danh sách kho");
      }

      return listAddress;
    },
  },
};

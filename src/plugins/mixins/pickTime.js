import { filter, forEach, get, map, sumBy, uniqBy } from "lodash";
import services from "@/services";
import common from "@/utils/common";
import { OPTION_CHECK_PICK_TIME_CAPACITY } from "@/contants/date";

const MAX_WEIGHT_BBS = 20;
const optionCheckPickTimeBbs = OPTION_CHECK_PICK_TIME_CAPACITY;

export default {
  methods: {
    showError(error, clgMsg = "Có lỗi xảy ra") {
      console.log("------------Thông báo lỗi------------");
      console.log(error);
      console.log(clgMsg);
      console.log("-------------------------------------");
    },
    convertListProduct(products = []) {
      let listProduct = [];
      products.forEach((item) => {
        const weight = Number(item.weight) || 0;
        const height = Number(item.height) || 0;
        const length = Number(item.length) || 0;
        const width = Number(item.width) || 0;
        const quantity = Number(item.quantity) || 0;
        listProduct.push({ weight, height, length, width, quantity });
      });

      return listProduct;
    },
    convertIdByPickTime(data) {
      return optionCheckPickTimeBbs
        .filter((o) => o.key === data.toLowerCase())
        .map((o) => o.value);
    },
    /**
     * Lấy danh sách ca lấy hàng từ api
     */
    async handleBrowsePickTimes({
      warehouse,
      products = [],
      type = 1,
      pickTell,
      order_id,
    }) {
      let pickup = [];
      let typePickTime = null;
      const totalWeight = sumBy(products, (product) =>
        Number(product.weight)
      ).toFixed(2);
      if (totalWeight <= MAX_WEIGHT_BBS) {
        typePickTime = "Express";
        try {
          pickup = await this.getPickTimeExpress(
            { warehouse },
            {
              convertToWithoutPayloadLabel: true,
            }
          );
        } catch (error) {
          this.showError(
            error,
            "Có lỗi khi lấy phiên lấy hàng, vui lòng chọn lại kho lấy."
          );
        }
      } else {
        typePickTime = "BBS";
        pickup = await this.getPickTimeBBS(
          { warehouse, products, type, pickTell, order_id },
          {
            convertToWithoutPayloadLabel: true,
          }
        );
      }

      return { pickup, type: typePickTime, order_id };
    },
    /**
     * Lấy danh sách ca lấy hàng từ api
     */
    async getPickTimeExpress(
      { warehouse, order_id },
      options = { convertToLabel: false, convertToWithoutPayloadLabel: false }
    ) {
      let pickTimeList = [];
      const param = {
        province_id: warehouse?.province_id,
        district_id: warehouse?.district_id,
        order_id: order_id,
      };
      try {
        const result = await services.$shop.browsePickTimes(param);
        if (result.success) {
          const pickUpList = get(result, "data.pick_up", []);
          forEach(pickUpList, (item) => {
            if (item.type === "" && item.time.length) {
              map(item.time, (time) => {
                time.text = time.text.trim().replace("ngày mai", "");
                time.date = item.date;
                time.work_shift = item.work_shift;
                time.pick_time_slot = time.id;
                time.key = item.date + time.id;
                time.id = new Date(item.date).getTime() + time.id;
                return time;
              });
              pickTimeList = uniqBy([...pickTimeList, ...item.time], "key");
            } else if (item.type === "" && !item.time.length) {
              pickTimeList.push({
                text: item.name,
                label: item.name,
                date: item.date,
                id: new Date(item.date).getTime() + item.work_shift,
                key: new Date(item.date).getTime() + item.work_shift,
                work_shift: item.work_shift,
                payload: item,
              });
            } else {
              map(item.time, (time) => {
                time.type = item.type;
                return time;
              });
              pickTimeList = uniqBy([...pickTimeList, ...item.time], "id");
            }
          });
          if (options.convertToLabel) {
            pickTimeList = common.convertLabelValueDataSource({
              dataSource: pickTimeList,
              valueName: "id",
              labelName: "text",
            });
          }
          if (options.convertToWithoutPayloadLabel) {
            pickTimeList = common.convertLabelValueWithoutPayload({
              dataSource: pickTimeList,
              valueName: "id",
              labelName: "text",
            });
          }
        } else {
          this.showError(result.message);
        }
      } catch (e) {
        console.log(e);
      }
      return pickTimeList;
    },
    /**
     * Check CapacityBBS, get new PickTime
     * @params
     *  1. warehouse: kho hàng.
     *  3. type: Loại điạ chỉ.
     *  4. products: Số lượng sản phẩm.
     *  5. pickTell: SĐT lấy hàng.
     * */
    async getPickTimeBBS(
      { warehouse, products = [], type = 1, pickTell = "", order_id },
      options = {
        convertToLabel: false,
        convertToWithoutPayloadLabel: false,
        uniqueKey: "id",
      }
    ) {
      let pickTimeList = [];

      try {
        const requestParam = {
          pick_address_id: warehouse?.hub_code,
          province_id: warehouse?.province_id,
          district_id: warehouse?.district_id,
          ward_id: warehouse?.ward_id,
          street_id: warehouse?.street_id,
          hamlet_id: warehouse?.hamlet_id || warehouse?.specific_id,
          products: this.convertListProduct(products),
          pick_tell: pickTell,
          type: type,
          order_id: order_id,
        };

        const response = await services.$shop.browseCheckCapacityBBS(
          requestParam
        );
        if (response?.success) {
          const expectPickOrder = response.data?.pick_up;
          forEach(expectPickOrder, (item) => {
            map(item.time, (time) => {
              time.type = item.type;
              time.pick_time_slot = time.id;
              time.key = item.type + "_" + time.id;
              time.id = Number(this.convertIdByPickTime(item.type) + time.id);
              return time;
            });
            pickTimeList = uniqBy(
              [...pickTimeList, ...item.time],
              options.uniqueKey
            );
          });

          // Lọc ra các available_pick_address > 0 và available.
          pickTimeList = filter(
            pickTimeList,
            (item) =>
              item.capacity === null ||
              (item.capacity &&
                item.capacity?.available &&
                item.capacity?.available_pick_address > 0)
          );

          if (options.convertToLabel) {
            pickTimeList = common.convertLabelValueDataSource({
              dataSource: pickTimeList,
              valueName: "id",
              labelName: "text",
            });
          }
          if (options.convertToWithoutPayloadLabel) {
            pickTimeList = common.convertLabelValueWithoutPayload({
              dataSource: pickTimeList,
              valueName: "id",
              labelName: "text",
            });
          }
          return pickTimeList;
        } else {
          this.showError(response.data.message);
          return [];
        }
      } catch (e) {
        console.log(e);
      }

      return [];
    },
  },
};

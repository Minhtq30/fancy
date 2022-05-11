<template>
  <g-modal
    :visible="visible"
    :centered="true"
    :width="750"
    okText="Xác nhận"
    cancelText="Quay lại"
    :title="`Thiết lập kịch bản đăng đơn`"
    @cancel="handleCancel"
    @ok="handleAccept"
    class="t-px-3 modal-order-script"
  >
    <div class="t-p-2">
      <div class="t-mb-[10px] t-flex t-justify-between">
        <g-multiselect
          :width="450"
          :visible="showOptionPickAddress"
          @on-close-visible="handleClosePickAddress"
          class="filter-select-wrapper"
        >
          <template #contentDropdown>
            <g-select
              class="filter-select"
              placeholder="Kho lấy hàng"
              :style="{ width: '450px', fontSize: '0.875rem !important' }"
              :open="false"
              :options="pickAddresses"
              :value="config?.warehouse?.value"
              @click="handleSelectPickAddress"
            ></g-select>
          </template>
          <template #contentOption>
            <list-options
              class-content="list-pickAddress-in-excel"
              :showAll="false"
              modeOption="simple"
              :options="pickAddresses"
              :checked-list-default="[config?.warehouse?.value]"
              @onChange="handleUpdateOrderWarehouse"
            />
          </template>
        </g-multiselect>
        <g-multiselect
          :width="220"
          :visible="showOptionPickTime"
          @on-close-visible="handleClosePickTime"
          class="filter-select-wrapper"
        >
          <template #contentDropdown>
            <g-select
              class="filter-select"
              placeholder="Ca lấy hàng"
              :style="{ width: '220px', fontSize: '0.875rem !important' }"
              :open="false"
              :options="pickTimes"
              :value="config?.pick_time?.value"
              @click="handleSelectPickTime"
            ></g-select>
          </template>
          <template #contentOption>
            <list-options
              :showAll="false"
              modeOption="simple"
              :options="pickTimes"
              :checked-list-default="[config?.pick_time?.value]"
              @onChange="handleUpdateOrderPickTime"
            />
          </template>
        </g-multiselect>
      </div>
      <div class="components-input-demo-presuffix t-mb-2">
        <g-multiselect
          @on-close-visible="handleApllyProduct"
          class="filter-select-wrapper"
        >
          <template #contentDropdown>
            <a-input
              class="text-search-product"
              placeholder="Tìm để thêm sản phẩm"
              @change="handleSearchText"
              @focus="handleBrowseListProduct(searchText)"
            >
              <template #prefix>
                <search-active-icon />
              </template>
            </a-input>
          </template>
          <template #contentOption>
            <list-options
              :showAll="false"
              :options="listProduct"
              class-content="list-product-in-confirm"
              :checked-list-default="getListProduct"
              @onChange="handleUpdateProduct"
            >
              <template #label="{ option }">
                <div class="t-ml-3">
                  <div class="t-mb-2">{{ option?.full_name }}</div>
                  <div class="t-flex" @click="handleClickOption($event)">
                    <g-select
                      :style="{
                        width: '140px',
                        fontSize: '0.875rem !important',
                      }"
                      placeholder="Chọn khối lượng"
                      :value="`KL (kg) ${option.weight}`"
                      @change="handleChangeWeight($event, option)"
                      :options="weightDataSource"
                      :open="false"
                    />
                    <g-select
                      :style="{
                        width: '76px',
                        marginLeft: '10px',
                        fontSize: '0.875rem !important',
                      }"
                      :open="false"
                      placeholder="Chọn số lượng"
                      :value="`SL ${option.quantity || 0}`"
                      @change="handleChangeQuantity($event, option)"
                      :options="quantityDataSource"
                    />
                  </div>
                </div>
              </template>
            </list-options>
          </template>
        </g-multiselect>
        <template v-for="(product, index) in config.products" :key="index">
          <div class="t-flex t-items-center t-justify-between t-mt-2 t-mb-2">
            <span :style="{ width: '20px' }">{{ `${index + 1}.` }}</span>
            <img
              width="30"
              height="30"
              v-if="product?.images && product?.images[0]?.image"
              @error="handleErrorLoadAvatar"
              :src="product?.images ? product?.images[0]?.image : null"
            />
            <add-image-icon :height="30" :width="30" v-else></add-image-icon>
            <div :style="{ width: 'calc(100% - 170px)' }">
              <b>
                {{ product.full_name }}
              </b>
              <div>Có thể bán: 0 | Giá bán: 100.000</div>
            </div>
            <div
              class="btn-remove-product"
              @click="handleRemoveProduct(product, index)"
            >
              <remove-product-icon />
            </div>
          </div>
        </template>
      </div>
      <strong class="t-text-[16px] t-text-black">THÔNG TIN VẬN CHUYỂN</strong>
      <div class="t-mt-[10px] radio-config t-mb-5">
        <a-radio-group v-model:value="config.transport">
          <g-radio value="fly" id="transportFly" check-value="fly">
            <span
              class="t-flex t-items-center t-ml-2"
              :style="transportTypeStyle('fly')"
            >
              <plane-icon width="22" height="22"></plane-icon>
              <span class="t-ml-2">Bay</span>
            </span>
          </g-radio>
          <g-radio id="transportRoad" value="road" check-value="road">
            <span
              class="t-flex t-items-center t-ml-2"
              :style="transportTypeStyle('road')"
            >
              <truck-icon width="22" height="22"></truck-icon>
              <span class="t-ml-2">Bộ</span>
            </span>
          </g-radio>
        </a-radio-group>
      </div>
      <div class="t-mt-5 radio-config t-mb-3">
        <a-radio-group v-model:value="config.shipPay">
          <g-radio value="shop">
            <div class="t-ml-2">Shop trả ship</div>
          </g-radio>
          <g-radio value="khach">
            <div class="t-ml-2">Khách trả ship</div>
          </g-radio>
        </a-radio-group>
      </div>
      <strong class="t-text-[16px] t-text-black">GHI CHÚ ĐƠN HÀNG</strong>

      <div class="t-w-full t-flex">
        <g-input
          class="t-w-full t-pr-3"
          :borderless="true"
          v-model="config.message"
          :placeholder="'Nhập ghi chú'"
        ></g-input>
        <g-multiselect
          placement="topRight"
          :width="290"
          :maxHeight="185"
          :visible="showOptionPickCustomTags"
          @on-close-visible="showOptionPickCustomTags = false"
          class="filter-select-wrapper"
        >
          <template #contentDropdown>
            <g-select
              class="filter-select t-flex"
              :value="selectionText"
              :style="{
                width: '136px',
                fontSize: '0.875rem !important',
                textAlign: 'center',
              }"
              :open="false"
              :options="shopCustomTags"
            ></g-select>
          </template>
          <template #contentOption>
            <order-tag
              class-content="custom-tags"
              @onChangeTagsSelected="updateConfigData"
              :tag-list="shopCustomTags"
              :order-type="'bbs'"
              :checked-list-default="config.tags"
              :not-deliver-option="config.not_delivered_option"
              :not-deliver-fee="config.not_delivered_fee"
            ></order-tag>
          </template>
        </g-multiselect>
      </div>
      <div class="t-mt-5">
        <!--        <list-options
          :showAll="false"
          :options="expNotes"
          :has-padding="false"
          :checked-list-default="config.messages"
          @onChange="handleUpdateOrderMessage"
        >
          <template #label="{ option }">
            {{ option.text }}
          </template>
        </list-options>-->

        <order-tag
          class-content="default-tags"
          :has-divider="true"
          @onChangeTagsSelected="updateConfigData"
          :tag-list="tagList"
          :not-deliver-options="notDeliverOptions"
          :not-deliver-option="config.not_delivered_option"
          :checked-list-default="config.tags"
          :not-deliver-fee="config.not_delivered_fee"
        ></order-tag>
      </div>

      <!--      <tags-note-->
      <!--        :tags="config.tags"-->
      <!--        :packageLabels="packageLabels"-->
      <!--        @onSelectTag="onSelectTag"-->
      <!--      />-->
    </div>
  </g-modal>
</template>
<script>
import { mapState } from "vuex";
import { debounce, trim, findIndex, cloneDeep, size, find } from "lodash";
import { GModal, GRadio } from "../elements";
import SearchActiveIcon from "@/components/icons/SearchActiveIcon.vue";
import { PlaneIcon, TruckIcon, AddImageIcon } from "@/components";
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import GSelect from "@/components/base/SelectBoxInTable";
import RemoveProductIcon from "@/components/icons/RemoveProductIcon";
import { GInput } from "@/components";
// Plugin
import commonMixin from "@/plugins/mixins/common";
import pickTimeMixin from "@/plugins/mixins/pickTime";
import productMixin from "@/plugins/mixins/product";
import mixinErrorImage from "@/plugins/mixins/errorImage";
import OrderTag from "@/components/OrderTag";

const TCID = 14;

export default {
  components: {
    GInput,
    OrderTag,
    AddImageIcon,
    RemoveProductIcon,
    GModal,
    PlaneIcon,
    TruckIcon,
    GRadio,
    GMultiselect,
    ListOptions,
    GSelect,
    SearchActiveIcon,
  },
  props: ["visible", "setVisible", "packageLabels"],
  created() {
    this.debouncedHanldeBrowseListProduct = debounce(
      this.handleBrowseListProduct,
      500
    );
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        // Mo
        this.handleBeforeShowModal();
      } else {
        // Dong
        // Do something
      }
    },
  },
  mixins: [commonMixin, pickTimeMixin, productMixin, mixinErrorImage],
  methods: {
    handleAccept() {
      this.$store.state.sessionStorage.order_excel_config = this.config;
      this.$nextTick(() => {
        this.$emit("onApplyConfig", this.config);
      });
      this.setVisible(false);
    },
    handleSearchText(event) {
      this.debouncedHanldeBrowseListProduct(event.target.value);
    },
    handleRemoveProduct(data) {
      this.config.products = this.config.products.filter(
        (item) => item.value !== data.value
      );
    },
    handleChangeWeight(data, option) {
      option.weight = data;
    },
    handleChangeQuantity(data, option) {
      option.quantity = data;
    },
    handleClickOption(event) {
      event.preventDefault();
      event.stopPropagation();
    },
    handleApllyProduct() {
      this.config.products = this.productTemp;
    },
    handleUpdateProduct(values) {
      this.productTemp = values.dataOptions;
    },
    handleUpdateOrderMessage(values) {
      if (values.checkedList) {
        this.config.messages = values.checkedList;
        this.config.message = values.checkedList.join(", ");
      }
    },
    handleBeforeShowModal() {
      const configStorage =
        this.$store.state.sessionStorage.order_excel_config || {};
      if (!configStorage || size(configStorage) === 0) {
        this.config = {
          products: [],
          messages: [],
          warehouse: {
            value: "",
          },
          tags: [],
          shipPay: "shop",
          transport: "road",
          message: "",
          pick_time: "",
          not_delivered_fee: 0,
          not_delivered_option: 14,
        };
      } else {
        const config = cloneDeep(configStorage);
        if (!config.products) {
          config.products = [];
        }
        if (!config.tags) {
          config.tags = [TCID];
        }
        this.config = { ...config };
      }
      if (this.config?.warehouse?.value) {
        this.handleBrowsePickTimesAsyn();
      }
    },
    handleCancel() {
      this.setVisible(false);
    },
    handleUpdateOrderWarehouse(value) {
      this.showOptionPickAddress = false;
      this.config.warehouse = value.dataOptions || { value: null };

      this.config.pick_time = null;
      this.pickTimes = [];
      if (!this.config.warehouse.value) return;
      this.handleBrowsePickTimesAsyn();
    },
    handleUpdateOrderPickTime({ dataOptions }) {
      this.config.pick_time = dataOptions;
      this.showOptionPickTime = false;
    },

    handleClosePickAddress() {
      this.showOptionPickAddress = false;
    },
    handleClosePickTime() {
      this.showOptionPickTime = false;
    },
    handleSelectPickAddress() {
      this.showOptionPickAddress = !this.showOptionPickAddress;
    },
    handleSelectPickTime() {
      this.showOptionPickTime = !this.showOptionPickTime;
    },
    transportTypeStyle(type) {
      return this.config.transport === type
        ? { color: "#069255" }
        : { color: "#bdbdbd" };
    },

    /**
     * Tìm kiếm danh sách sản phẩm theo tên
     * @param {string} search Tên sản phẩm cần tìm
     */
    async handleBrowseListProduct(search) {
      if (this.productTemp) {
        this.handleApllyProduct();
      }
      this.productTemp = this.config.products;
      this.listProduct = await this.getProductByName(
        { term: trim(search) },
        { convertToWithoutPayloadLabel: true }
      );
    },
    /**
     * Lấy danh sách ca lấy hàng từ api
     */
    async handleBrowsePickTimesAsyn() {
      this.fetchingPickTime = !this.fetchingPickTime;
      const resPickTime = await this.handleBrowsePickTimes({
        warehouse: this.config.warehouse,
        products: this.config.products,
      });

      this.pickTimes = resPickTime.pickup || [];

      if (this.config?.pick_time?.value) {
        const capacityFindedIndex = findIndex(
          this.pickTimes,
          (item) => item.id === this.config?.pick_time?.value
        );

        if (capacityFindedIndex > -1) {
          this.handleApplyPickTime(this.pickTimes[capacityFindedIndex]);
        } else {
          this.handleApplyPickTime(this.pickTimes[0]);
        }
      }
    },
    handleApplyPickTime(pickTime) {
      this.config = { ...this.config, pick_time: pickTime };
    },
    onSelectTag(item) {
      let tieuChuanTag = find(
        this.packageLabels,
        (x) => x.label === "Tiêu chuẩn"
      );

      // Loại bỏ tag tiêu chuẩn trước.
      let tags = this.config.tags.filter(
        (_item) => _item !== tieuChuanTag.value
      );

      if (tieuChuanTag.value === item.value) {
        // Nếu chọn tag tiêu chuẩn. => sẽ ẩn hết tất cả các tag khác.
        tags = [item.value];
      } else {
        // Nếu tag đang chọn, đã được active thì bỏ chọn.
        if (this.config.tags.includes(item.value)) {
          tags = tags.filter((_item) => _item !== item.value);
        } else {
          // TH chọn các tag khác. (Dễ vỡ + Giao 1 phần)
          tags.push(item.value);
        }
      }

      if (tags.length === 0) {
        // TH rỗng thì mặc định thêm tag tiêu chuẩn vào
        tags = [TCID];
      }

      this.config.tags = tags;
    },

    updateConfigData(data) {
      this.config.tags = data.tags;
      this.config.message = data.message;
      this.config.not_delivered_fee = data.not_delivered_fee;
      this.config.not_delivered_option = data.not_delivered_option;
      this.config.message = this.generateMessage();
    },
    generateMessage() {
      let message = "";
      const tags = this.config.tags;
      const tagList = [...this.shopCustomTags, ...this.tagList];
      const not_delivered_fee = this.config.not_delivered_fee;
      for (let i = 0; i < tagList.length; i++) {
        let tag = tagList[i];
        if (tag && tags.includes(tagList[i].key)) {
          message += "; " + tag.title;
          if (tagList[i].key === 19 && not_delivered_fee) {
            message +=
              " " +
              not_delivered_fee
                .toString()
                .replace(/\B(?=(\d{3})+(?!\d))/g, ",") +
              " đ";
          }
        }
      }
      let tag = find(
        this.notDeliverOptions,
        (x) => x.value === this.config.not_delivered_option
      );
      message = tag
        ? message + "; " + "Hoàn hàng: " + tag["label"].toLowerCase()
        : "";
      message = message.slice(2);
      return message;
    },
  },
  computed: {
    ...mapState({
      weightDataSource: (state) => state.global.weightDataSource,
      quantityDataSource: (state) => state.global.quantityDataSource,
    }),
    selectionText() {
      let count = 0;
      this.shopCustomTags.forEach((item) => {
        if (this.config.tags.includes(item.key)) {
          count++;
        }
      });
      return `Chọn (${count})`;
    },
    orderExcelConfig() {
      return this.$store.state.sessionStorage.order_excel_config;
    },
    pickAddresses() {
      return this.$store.state.orderExcel.listWarehouse;
    },
    expNotes() {
      return this.$store.state.constant.expNotes;
    },
    tagList() {
      return this.$store.state.constant.tagListExcel.filter((tag) => {
        return ![2, 6, 12].includes(tag.key);
      });
    },
    notDeliverOptions() {
      return this.$store.state.constant.not_delivered_options;
    },
    getListProduct() {
      const list = [];
      this.config.products.forEach((item) => {
        list.push(item.value);
      });

      return list;
    },
  },
  data() {
    return {
      shopCustomTags: [
        {
          key: 100,
          title: "Có vấn đề gọi shop, không tự ý hủy đơn",
          extFeeNote: "",
          extFeeNoteExplain: "",
        },
        {
          key: 101,
          title: "Gọi khách trước khi giao",
          extFeeNote: "",
          extFeeNoteExplain: "",
        },
      ],
      showOptionPickAddress: false,
      showOptionPickTime: false,
      alias: "",
      receiveTypes: ["1", "2"],
      pickTimes: [],
      productTemp: [],
      listProduct: [],
      config: {
        warehouse: {
          value: null,
        },
        products: [],
        tags: [],
        not_delivered_fee: 0,
        not_delivered_option: 14,
      },
      fetchingPickTime: false,
      searchText: "",
    };
  },
};
</script>

<style lang="scss">
.custom-tags {
  padding-top: 8px;
  padding-left: 5px;
  .tag-key-16 {
    width: 244px !important;
  }
  .g-checkbox {
    font-size: 14px !important;
  }
  .ant-col {
    margin-bottom: 8px;
  }
  .tag {
    padding-bottom: 1px !important;
  }
}
.default-tags {
  .ant-select-selection-item {
    font-size: 14px;
  }
  .tag-key-2 p {
    width: 465px;
  }
  .g-checkbox {
    font-size: 14px !important;
  }
}
.list-pickAddress-in-excel {
  .ant-checkbox-group-item {
    height: 40px !important;
  }
  .ant-checkbox-inner {
    border-radius: 50px;
    width: 22px;
    height: 22px;
  }
  .ant-checkbox-inner::after {
    left: 30%;
  }
}
.radio-config {
  .ant-radio-wrapper {
    width: 200px;
    display: flex;
    align-items: center;
  }
  .ant-radio-group {
    display: flex;
  }
}
.text-search-product {
  input {
    font-size: 0.875rem !important;
  }
}
.list-product-in-confirm {
  .ant-checkbox-group-item {
    height: 77px !important;
    border-bottom: 1px solid #c4c4c4;
    padding-left: 16px;
  }
  .ant-checkbox-inner {
    border-radius: 50px;
    width: 30px;
    height: 30px;
  }
  .ant-checkbox-inner::after {
    left: 35%;
  }
}
.modal-order-script {
  .ant-modal-footer .ant-btn {
    color: #dc3545;
    border-color: #dc3545;
  }

  .ant-modal-footer .ant-btn:hover {
    background-color: #dc3545;
    color: white;
  }

  .ant-modal-footer .ant-btn:focus {
    border-color: #dc3545;
  }

  .ant-modal-footer button + button {
    background-color: var(--primaryColor) !important;
    border-color: var(--primaryColor) !important;
    color: white !important;
  }
  .ant-modal-footer button + button:hover {
    background-color: var(--primaryColor) !important;
    border-color: var(--primaryColor) !important;
    color: white !important;
  }
  .ant-modal-footer button + button:focus {
    background-color: var(--primaryColor) !important;
    border-color: var(--primaryColor) !important;
    color: white !important;
  }
  .ant-modal-body {
    max-height: 535.13px;
    overflow-y: auto;
  }
}
</style>

<style lang="scss" scoped>
.btn-remove-product {
  cursor: pointer;
}
.text-search-product {
  height: 32px;
  border-radius: 4px;
  svg {
    width: 15px;
    height: 15px;
  }
}
</style>

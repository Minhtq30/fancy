<template>
  <div class="channel__item-col channel__item-note">
    <div class="note-wrapper" @paste.prevent="handlePasteFromExcel($event)">
      <a-tooltip :mouseEnterDelay="0.5" placement="bottom">
        <template #title> {{ message }} </template>
        <span class="">
          <g-textarea
            v-model:value="message"
            :debounce="debounceConfig"
            :autoSize="{ minRows: 1, maxRows: 2 }"
          >
          </g-textarea
        ></span>
      </a-tooltip>
      <div class="note-option">
        <g-multiselect
          :width="380"
          :maxHeight="480"
          class="filter-select-wrapper"
          :showApplyToAllChecked="true"
          :isApplyToAllChecked="isApplyAllMessage"
          textApplyToAllChecked="Áp dụng cho tất cả đơn hàng"
          @applyToAll="handleApplyAllByField('isApplyAllMessage', $event)"
        >
          <template #contentDropdown>
            <g-select
              class="filter-select"
              :style="{ textAlign: 'center' }"
              :open="false"
              :options="expNotes"
              :value="selectionText"
            ></g-select>
          </template>
          <template #contentOption>
            <a-divider></a-divider>
            <div class="t-ml-2 t-mt-3">
              <order-tag
                :key="orderTagKey"
                :order-type="serviceData.toLowerCase()"
                class-content="order-tags-note"
                @onChangeTagsSelected="updateTagSelected"
                :tag-list="[...shopCustomTags, ...tagList]"
                :not-deliver-options="notDeliverOptions"
                :checked-list-default="tagsSelected"
                :create-order-type="'excel'"
                :orderValue="orderValue"
                :not-deliver-option="not_delivered_option"
                :not-deliver-fee="not_delivered_fee"
                :has-divider="true"
              ></order-tag>
            </div>
          </template>
        </g-multiselect>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from "vue";
import { find } from "lodash";

// Components
import GMultiselect from "@/components/base/Multiselect";
import GSelect from "@/components/base/SelectBoxInTable";
import GTextarea from "@/components/base/TextareaInTable";
import OrderTag from "@/components/OrderTag";
import { TCID, SHOP_CUSTOM_TAGS } from "@/contants/order";
import orderExcelMixin from "@/plugins/mixins/orderExcel";

export default defineComponent({
  name: "order-excel-col-note",
  props: {
    type: {
      type: String,
    },
    messageData: {
      type: Object,
    },
    productsData: {
      type: Array,
    },
    messagesData: {
      type: Array,
      default() {
        return [];
      },
    },
    tags: {
      type: Array,
      default() {
        return [];
      },
    },
    serviceData: {
      type: String,
      default: "",
    },
    packageLabels: {
      type: Array,
      default() {
        return [];
      },
    },
    expNotes: {
      type: Array,
      default() {
        return [];
      },
    },
    debounceConfig: {
      type: Number,
      default: 1,
    },
    isApplyAllMessage: {
      type: Boolean,
      default: false,
    },
    notDeliveredOption: {
      type: Number,
      default: 14,
    },
    notDeliveredFee: {
      type: Number,
      default: 0,
    },
  },
  components: {
    OrderTag,
    GTextarea,
    GSelect,
    GMultiselect,
  },
  mixins: [orderExcelMixin],
  data() {
    return {
      orderTagKey: true,
      shopCustomTags: SHOP_CUSTOM_TAGS,
    };
  },
  methods: {
    handlePasteFromExcel(event) {
      this.$emit("onPasteFromExcel", "message", event);
    },
    // handleUpdateOrderMessage(data) {
    //   this.$emit("onUpdateItemByFieldName", {
    //     name: "messages",
    //     value: data.checkedList,
    //   });
    //   this.$emit("onUpdateOrderMessage", data.checkedList);
    // },
    handleApplyAllByField(name, checked) {
      if (!checked && this.type) {
        this.$store.commit(this.type + "/applyAllByField", {
          fieldName: "isApplyAllMessage",
          fieldValue: checked,
        });
        this.orderTagKey = !this.orderTagKey;
      } else {
        this.$emit("onApplyAllByField", name, checked);
      }
    },
    onChangeBigTags(type) {
      let bigTag = find(this.packageLabels, (x) => x.label === "Giá trị cao");

      let tags = this.tags || [];
      let change = false;

      if (type === "add") {
        if (!this.tags?.includes(bigTag.value)) {
          tags = [...tags, bigTag.value];
          change = true;
        }
      } else if (type === "remove") {
        if (this.tags?.includes(bigTag.value)) {
          tags = this.tags?.filter((_item) => _item !== bigTag.value);
          change = true;
        }
      }

      if (change) {
        this.$emit("onUpdateItemByFieldName", {
          name: "tags",
          value: tags,
        });
      }
    },
    onSelectTag(item) {
      let tieuChuanTag = find(
        this.packageLabels,
        (x) => x.label === "Tiêu chuẩn"
      );

      let bigTag = find(this.packageLabels, (x) => x.label === "Giá trị cao");

      // Loại bỏ tag tiêu chuẩn trước.
      let tags = this.tags.filter((_item) => _item !== tieuChuanTag.value);

      if (tieuChuanTag.value === item.value) {
        // Nếu chọn tag tiêu chuẩn. => sẽ ẩn hết tất cả các tag khác.
        tags = [item.value];
      } else {
        // Nếu tag đang chọn, đã được active thì bỏ chọn.
        if (this.tags.includes(item.value)) {
          tags = tags.filter((_item) => _item !== item.value);
        } else {
          // TH chọn các tag khác. (Dễ vỡ + Giao 1 phần)
          tags = [...tags, item.value];
        }
      }

      if (
        tags.length === 0 ||
        (tags.length === 1 && tags[0] === bigTag.value)
      ) {
        // TH rỗng thì mặc định thêm tag tiêu chuẩn vào
        tags = [TCID];
      }

      this.handleUpdateTags(tags);
    },
    /**
     * Convert text VND to Number.
     */
    vndToNumber(x) {
      if (!x) {
        return 0;
      }
      x = x.toString();
      x = x.replace(/\D/g, "");
      x = parseInt(x);
      return x;
    },
    handleUpdateTags(tags) {
      this.$emit("onUpdateItemByFieldName", {
        name: "tags",
        value: tags,
      });
      // this.$emit("onUpdateOrderTags");
    },
    handleChangeTags(newValue) {
      let totalCashNew = 0;
      let weight = 0;
      newValue.forEach((item) => {
        totalCashNew += this.vndToNumber(item.money);
        weight = weight + item.weight || 0;
      });

      // TODO NamVH: chỗ này đang bị gọi lại nhiều lần.
      const shopType = localStorage.getItem("shop_type");
      // Nếu tổng giá trị của đơn hàng.
      // 1. Shop_type = 0 (shop c2c, đơn hàng có tổng giá trị hàng >=1tr -> nhảy tag [giá trị cao]
      // 2. shop_type = 1 (shop b2c, đơn hàng có tổng giá trị hàng >3tr -> nhảy tag [giá trị cao]
      // -> tính bảo hiểm hàng hoá
      // TODO NamVH: Đưa logic này tập chung và gọn vào 1 khu vực để sau dễ quản lý. Vì sẽ thay đổi theo thời gian.
      if (
        (`${shopType}` === "0" && totalCashNew >= 1000000) ||
        (`${shopType}` === "2" && totalCashNew >= 1000000) ||
        (`${shopType}` === "1" && totalCashNew > 3000000)
      ) {
        this.onChangeBigTags("add");
      } else {
        this.onChangeBigTags("remove");
      }

      // Nếu là đơn Express thì cần loại bỏ tag gia cố nếu trước đó đã chọn.
      if (this.serviceData === "Express" || weight <= 20) {
        const giacoTag = this.packageLabels.find(
          (item) => item.label === "Gia cố hàng hóa"
        );

        if (this.tags.includes(giacoTag.value)) {
          let tags = this.tags.filter((_item) => _item !== giacoTag.value);
          this.handleUpdateTags(tags);
        }
      }
    },

    updateTagSelected(data) {
      this.$emit("onUpdateItemByFieldName", {
        name: "tags",
        value: data.tags,
      });
      this.$emit("onUpdateItemByFieldName", {
        name: "message",
        value: data.message,
      });
      this.$emit("onUpdateItemByFieldName", {
        name: "not_delivered_fee",
        value: data.not_delivered_fee,
      });
      this.$emit("onUpdateItemByFieldName", {
        name: "not_delivered_option",
        value: data.not_delivered_option,
      });
      if (this.isApplyAllMessage) {
        this.$emit(
          "onApplyAllByField",
          "isApplyAllMessage",
          this.isApplyAllMessage
        );
      }
    },
  },
  computed: {
    orderValue() {
      let val = 0;
      if (this.productsData.length > 0) {
        this.productsData.forEach((item) => {
          val += this.vndToNumber(item.money);
        });
      }
      return val;
    },
    message: {
      get() {
        return this.messageData;
      },
      set(nextValue) {
        this.$emit("onUpdateItemByFieldName", {
          name: "message",
          value: nextValue,
        });
      },
    },
    not_delivered_option: {
      get() {
        return this.notDeliveredOption;
      },
      set(nextValue) {
        this.$emit("onUpdateItemByFieldName", {
          name: "not_delivered_option",
          value: nextValue,
        });
      },
    },
    not_delivered_fee: {
      get() {
        return this.notDeliveredFee;
      },
      set(nextValue) {
        this.$emit("onUpdateItemByFieldName", {
          name: "not_delivered_fee",
          value: nextValue,
        });
      },
    },

    tagsSelected: {
      get() {
        return this.tags;
      },
      set(nextValue) {
        this.$emit("onUpdateItemByFieldName", {
          name: "tags",
          value: nextValue,
        });
      },
    },

    selectionText() {
      return `Chọn (${this.tagsSelected.length})`;
    },

    tagList() {
      return this.$store.state.constant.tagListExcel.filter((tag) => {
        return this.serviceData.toLowerCase() == "bbs"
          ? tag.key !== 12
          : ![6, 12].includes(tag.key);
      });
    },
  },
  watch: {
    productsData: {
      handler(oldValue, newValue) {
        // TODO NamVH: Cần so sánh để tránh việc thực thi ở đây.
        this.handleChangeTags(newValue);
      },
      deep: true,
    },
    tags() {
      this.$emit("onUpdateItemByFieldName", {
        name: "message",
        value: this.generateMessage(
          this.tags,
          this.not_delivered_fee,
          this.tagList
        ),
      });
      this.handleChangeTags(this.productsData);
    },
  },
});
</script>

<style scoped>
.channel__item-col {
  padding-top: 15px;
}

.note-option {
  margin-top: 0.25rem;
  text-align: right;
}

.ant-divider-horizontal {
  display: block;
  clear: both;
  width: 100%;
  min-width: 100%;
  height: 1px;
  margin: 3px 0;
}
</style>
<style lang="scss">
.order-tags-note {
  span.notify-free.t-text-primary {
    margin-right: 0 !important;
  }
  .picture-display {
    display: none;
  }
  .tag-key-2 p {
    width: 256px;
  }
  .tag-key-16 {
    width: 256px !important;
  }
  .tag-key-1 p {
    width: 146px;
  }
  .high-value-images {
    display: none;
  }
  .filter-select {
    width: 230px !important;
  }
}
</style>

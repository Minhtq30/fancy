<template>
  <div
    :class="{
      [classContent]: true,
    }"
  >
    <a-col
      v-for="tag in tagList"
      :key="tag.key"
      :class="tag.key < 7 || tag.key > 18 ? 'tag-key-1' : 'tag-key-2'"
    >
      <div class="dropdown-content-input-all">
        <g-checkbox
          :checked="tags.includes(tag.key)"
          class="g-checkbox"
          :class="
            optionsHavePadding.includes(tag.key) && !hasDivider ? 'tag' : ''
          "
          @change="handleChangeCheckbox(tag.key)"
          v-if="isValidTag(tag.key)"
        >
          <div
            class="t-flex t-justify-between w-full"
            :class="[createOrderType === 'excel' ? 'excel-tag-item' : '']"
          >
            <p :class="tag.key > 16 && tag.key !== 19 ? 'tag-key-16' : ''">
              {{ tag.title }}
            </p>

            <a-tooltip
              v-if="tag.extFeeNote && tag.key !== 19"
              :mouseEnterDelay="0.5"
              placement="bottom"
            >
              <template #title v-if="tag.extFeeNoteExplain">
                <template
                  v-for="(text, index) in tag.extFeeNoteExplain"
                  :key="index"
                >
                  <div class="t-mb-2">{{ text }}<br /></div>
                </template>
              </template>
              <span class="notify-free t-underline t-text-primary">{{
                tag.extFeeNote
              }}</span>
            </a-tooltip>

            <g-input
              class="t-ml-1"
              v-if="tag.key === 19"
              :borderless="true"
              :number-only="true"
              v-model="not_delivered_fee"
              :formatter="$filters.integerFormatter"
              :parser="$filters.numberCommaParser"
              @on-blur="emitInfo"
              :size="20"
              placeholder="0 đ"
              @change="checkFormatMoney"
            ></g-input>

            <a-tooltip
              v-if="tag.extFeeNote && tag.key === 19"
              :mouseEnterDelay="0.5"
              placement="bottom"
            >
              <template #title v-if="tag.extFeeNoteExplain">
                <template
                  v-for="(text, index) in tag.extFeeNoteExplain"
                  :key="index"
                >
                  <div class="t-mb-2">{{ text }}<br /></div>
                </template>
              </template>
              <span class="notify-free t-underline t-text-primary">{{
                tag.extFeeNote
              }}</span>
            </a-tooltip>
          </div>
        </g-checkbox>

        <div class="t-flex">
          <g-checkbox
            :checked="tags.includes(tag.key)"
            class="g-checkbox t-flex"
            :class="
              optionsHavePadding.includes(tag.key) && !hasDivider ? 'tag' : ''
            "
            @change="handleChangeCheckbox(tag.key)"
            v-if="tag.key === 2"
          >
            <div
              class="t-flex t-justify-between w-full"
              :class="[createOrderType === 'excel' ? 'excel-tag-item' : '']"
            >
              <p>{{ tag.title }}</p>
            </div>
          </g-checkbox>
          <div
            v-if="tag.key === 2"
            class="t-flex high-value-images"
            @click="isShowSelectProductModal = true"
          >
            <a-tooltip
              v-if="tag.extFeeNote"
              :mouseEnterDelay="0.5"
              placement="bottom"
            >
              <template #title v-if="tag.extFeeNoteExplain">
                <template
                  v-for="(text, index) in tag.extFeeNoteExplain"
                  :key="index"
                >
                  <div class="t-mb-2">{{ text }}<br /></div>
                </template>
              </template>
              <span
                v-if="!images_file.length"
                class="notify-free t-underline t-text-primary t-cursor-pointer t-ml-[-10px]"
              >
                + Ảnh giá trị hàng
              </span>
              <span
                v-if="images_file.length"
                class="notify-free t-underline t-text-primary t-cursor-pointer"
              >
                ({{ images_file.length }}) Ảnh giá trị hàng
              </span>
            </a-tooltip>
          </div>
        </div>
      </div>
      <a-divider
        v-if="optionsHavePadding.includes(tag.key) && hasDivider"
      ></a-divider>

      <div class="dropdown-content-input-all">
        <div class="t-w-full t-flex" v-if="tag.key === 21">
          <g-checkbox
            :checked="true"
            class="g-checkbox t-mb-3"
            v-if="tag.key === 21"
          >
            <div
              class="t-flex t-justify-between"
              :class="[createOrderType === 'excel' ? 'excel-tag-item' : '']"
            >
              <p class="tag-key-21">{{ tag.title }}</p>
              &nbsp;&nbsp;
              <a-tooltip
                v-if="tag.extFeeNote"
                :mouseEnterDelay="0.5"
                placement="bottom"
              >
                <template #title v-if="tag.extFeeNoteExplain">
                  <template
                    v-for="(text, index) in tag.extFeeNoteExplain"
                    :key="index"
                  >
                    <div class="t-mb-2">{{ text }}<br /></div>
                  </template>
                </template>
                <span class="notify-free t-text-primary">{{
                  tag.extFeeNote
                }}</span>
              </a-tooltip>
            </div>
          </g-checkbox>
          <g-multiselect
            class="filter-select-wrapper"
            :width="270"
            :maxHeight="200"
          >
            <template #contentDropdown>
              <g-select
                class="filter-select"
                :class="[createOrderType === 'excel' ? 'excel-tag-item' : '']"
                placeholder="Chọn"
                :style="{ width: '300px', textAlign: 'center' }"
                :open="false"
                :value="getText"
              ></g-select>
            </template>
            <template #contentOption>
              <list-options
                :class="[createOrderType === 'excel' ? 'excel-tag-item' : '']"
                :showAll="false"
                modeOption="simple"
                :options="notDeliverOptions"
                @onChange="handleChangeNotDeliverOption"
                :checkedListDefault="[not_delivered_option]"
              />
            </template>
          </g-multiselect>
        </div>
      </div>
    </a-col>
    <a-modal
      :visible="isShowSelectProductModal"
      :footer="null"
      :closable="false"
      :width="650"
      class="addExistedProductModal"
      @cancel="isShowSelectProductModal = false"
    >
      <template v-slot:title>
        <div class="t-flex t-flex-row t-items-center t-w-full">
          <h3 class="t-text-center t-text-white t-mb-0" style="flex: 1">
            Ảnh giá trị hàng
          </h3>
          <span
            class="t-flex t-items-center t-justify-center t-text-white"
            style="flex: 0 1 50px; width: 50px; cursor: pointer"
            @click="isShowSelectProductModal = false"
          >
            <times-icon :width="16" :height="16"></times-icon>
          </span>
        </div>
      </template>
      <div class="t-flex t-flex-col">
        <div class="product__extra">
          <div
            class="add-product-modal-img t-grid t-grid-cols-6 t-gap-3 t-pb-4"
          >
            <div
              class="product-image t-relative"
              v-for="(image, index) in images_file"
              :key="index"
            >
              <img class="t-w-full t-h-full" :src="image" :alt="''" />
              <svg
                class="t-absolute t-w-[15px] t-top-[1px] t-right-0 t-cursor-pointer"
                @click="removeFile(index)"
                viewBox="64 64 896 896"
                data-icon="close"
                :width="width"
                :height="height"
                :fill="fill || '#fff'"
                aria-hidden="true"
                focusable="false"
              >
                <path
                  d="M563.8 512l262.5-312.9c4.4-5.2.7-13.1-6.1-13.1h-79.8c-4.7 0-9.2 2.1-12.3 5.7L511.6 449.8 295.1 191.7c-3-3.6-7.5-5.7-12.3-5.7H203c-6.8 0-10.5 7.9-6.1 13.1L459.4 512 196.9 824.9A7.95 7.95 0 0 0 203 838h79.8c4.7 0 9.2-2.1 12.3-5.7l216.5-258.1 216.5 258.1c3 3.6 7.5 5.7 12.3 5.7h79.8c6.8 0 10.5-7.9 6.1-13.1L563.8 512z"
                />
              </svg>
            </div>
            <div
              class="select-image__wrapper"
              @click="selectImage('orderImage')"
            >
              <plus-icon
                class="t-mb-[10px]"
                :width="23"
                :height="23"
              ></plus-icon>
              <span style="font-size: 16px; font-weight: 500"> Ảnh </span>
              <input
                type="file"
                :id="'orderImage'"
                style="display: none"
                multiple="true"
                @change="(e) => onSelectProductImage(e)"
              />
            </div>
          </div>
        </div>
        <div class="product-action">
          <g-button type="primary" @on-click="isShowSelectProductModal = false">
            Đóng
          </g-button>
        </div>
      </div>
    </a-modal>
  </div>
</template>

<script>
import GInput from "@/components/common/GInput";
import GMultiselect from "@/components/base/Multiselect";
import ListOptions from "@/components/base/ListOptions";
import GSelect from "@/components/base/SelectBoxInTable";
import { find, get } from "lodash";
import GCheckbox from "@/components/elements/checkbox";
import TimesIcon from "@/components/icons/TimesIcon";
import GButton from "@/components/common/GButton";
import PlusIcon from "@/components/icons/PlusIcon";
import { message } from "ant-design-vue";
import { mapState } from "vuex";
import orderExcelMixin from "@/plugins/mixins/orderExcel";

// const TCID = 10000;
const tagsNeedChangeShipFee = [1, 2, 6];

export default {
  name: "OrderTag",
  components: {
    GCheckbox,
    GInput,
    GMultiselect,
    ListOptions,
    GSelect,
    TimesIcon,
    PlusIcon,
    GButton,
  },
  mixins: [orderExcelMixin],
  data() {
    return {
      tags: [],
      not_delivered_fee: 0,
      not_delivered_option: null,
      initial_checked_list: [],
      message: "",
      need_to_change_ship_fee: false,
      image: "",
      imageFile: "",
      isShowSelectProductModal: false,
      images_file: [],
      images: [],
    };
  },
  props: {
    classContent: {
      type: String,
      default: "",
    },
    listOptionSelected: {
      type: Array,
      default() {
        return [];
      },
    },
    tagList: {
      type: Array,
      default() {
        return [];
      },
    },
    notDeliverOptions: {
      type: Array,
      default() {
        return [];
      },
    },
    checkedListDefault: {
      type: Array,
      default() {
        return [];
      },
    },
    orderType: {
      type: String,
      default: "express",
    },
    notDeliverOption: {
      type: Number,
      default: 0,
    },
    notDeliverFee: {
      type: Number,
      default: 0,
    },
    createOrderType: {
      type: String,
      default: "express", // express | excel
    },
    hasDivider: {
      type: Boolean,
      default: false,
    },
    orderValue: {
      type: Number,
      default: 0,
    },
  },

  async beforeMount() {
    this.tags = this.checkedListDefault;
    this.not_delivered_fee = this.notDeliverFee;
    this.not_delivered_option = this.notDeliverOption
      ? this.notDeliverOption
      : this.notDeliverOptionTag;
    this.initial_checked_list.push(this.not_delivered_option);
    this.initial_checked_list = this.initial_checked_list.filter(
      (item) => item !== 2
    );
    this.tags = this.tags.filter((item) => item !== 2);

    // Thêm tag giá trị cao nếu giá trị hàng hóa lớn
    let shopType = get(this.shopInfo, "shop_type", 1);
    if (
      (Number(shopType) === 1 &&
        this.orderValue >
          this.$store.state.constant.min_order_value_shop_b2c) ||
      (Number(shopType) === 0 &&
        this.orderValue >=
          this.$store.state.constant.min_order_value_shop_c2c) ||
      (Number(shopType) === 2 &&
        this.orderValue >= this.$store.state.constant.min_order_value_shop_c2c)
    ) {
      // tag gia tri cao: 2
      if (!this.initial_checked_list.includes(2)) {
        this.initial_checked_list.push(2);
      }
      if (!this.tags.includes(2)) {
        this.tags.push(2);
      }
    }
  },

  updated() {
    // Thêm tag giá trị cao nếu giá trị hàng hóa lớn
    let shopType = get(this.shopInfo, "shop_type", 1);
    if (
      (Number(shopType) === 1 &&
        this.orderValue >
          this.$store.state.constant.min_order_value_shop_b2c) ||
      (Number(shopType) === 0 &&
        this.orderValue >=
          this.$store.state.constant.min_order_value_shop_c2c) ||
      (Number(shopType) === 2 &&
        this.orderValue >= this.$store.state.constant.min_order_value_shop_c2c)
    ) {
      // tag gia tri cao: 2
      if (!this.initial_checked_list.includes(2)) {
        this.initial_checked_list.push(2);
      }
      if (!this.tags.includes(2)) {
        this.tags.push(2);
      }
    }
  },

  computed: {
    getText() {
      let tag = find(
        this.notDeliverOptions,
        (x) => x.value === this.not_delivered_option
      );
      return tag ? tag["label"] : null;
    },
    ...mapState({
      shopInfo: (state) => state.shop?.Shop || {},
    }),
    optionsHavePadding() {
      if (this.orderType === "express") {
        return this.tagList.filter((item) => item.key == 2).length != 0
          ? [19, 13, 2, 101]
          : [19, 13, 1, 101];
      } else {
        return [6, 19, 13, 101];
      }
    },
    notDeliverOptionTag() {
      return this.$store.getters["shop/notDeliverOptionTag"];
    },
  },
  methods: {
    onSelectProductImage(e) {
      let files = e.target.files;
      if (files.length === 0) {
        return false;
      }
      const self = this;
      if (files.length > 0) {
        for (let f = 0; f < files.length; f++) {
          const file = files[f];
          this.images.push(file);
          const reader = new FileReader();
          reader.onload = function (evt) {
            self.images_file.push(evt.target.result);
          };
          reader.readAsDataURL(file);
        }
        self.$emit("onChangeTagsSelected", {
          tags: this.tags,
          message: this.message,
          not_delivered_fee: this.not_delivered_fee,
          not_delivered_option: this.not_delivered_option,
          need_to_change_ship_fee: this.need_to_change_ship_fee,
          images: this.images,
          images_file: this.images_file,
        });
      }
    },

    emitInfo() {
      let tags = this.tags.filter((item) => {
        return !this.notDeliverOptionsKey.includes(item);
      });
      this.tags = [...tags, this.not_delivered_option];
      this.$emit("onChangeTagsSelected", {
        tags: this.tags,
        message: this.message,
        not_delivered_fee: this.not_delivered_fee,
        not_delivered_option: this.not_delivered_option,
        need_to_change_ship_fee: this.need_to_change_ship_fee,
        images: this.images,
        images_file: this.images_file,
      });
    },

    removeFile(index) {
      this.images.splice(index, 1);
      this.images_file.splice(index, 1);
      this.emitInfo();
    },

    onShowSelectProductModal() {
      this.isShowSelectProductModal = true;
    },

    handleChangeCheckbox(tag) {
      // Tag gia tri cao ho he thong tu dong check
      if (tag === 2) {
        return;
      }
      this.need_to_change_ship_fee = tagsNeedChangeShipFee.includes(tag);
      if (this.tags.includes(tag)) {
        this.tags.splice(this.tags.indexOf(tag), 1);
      } else {
        if (
          tag === 19 &&
          (this.not_delivered_fee < 10000 || this.not_delivered_fee > 20000000)
        ) {
          message.error(
            "Không giao được hàng và thu phí tối thiếu 10.000đ và tối đa 20.000.000đ"
          );
          return;
        }
        this.tags.push(tag);
      }
      this.message = this.generateMessage(
        this.tags,
        this.not_delivered_fee,
        this.tagList
      );
      this.emitInfo();
    },

    handleChangeNotDeliverOption(data) {
      if (!data.value) {
        this.not_delivered_option = this.notDeliverOption;
        return;
      }
      if (this.not_delivered_option === data.value) {
        this.not_delivered_option = this.notDeliverOptionTag;
      } else {
        this.not_delivered_option = data.value;
      }
      this.message = this.generateMessage(
        this.tags,
        this.not_delivered_fee,
        this.tagList
      );
      this.emitInfo();
    },

    isValidTag(tag) {
      if (tag === 21 || tag === 2) {
        // tag mặc định luôn hiển thị
        return false;
      }
      // Nếu đơn BBS thì k hiển thị tag gia cố
      if (tag === 6 && this.orderType !== "bbs") {
        return false;
      }
      return true;
    },

    selectImage(image) {
      document.getElementById(image).click();
    },

    checkFormatMoney() {
      if (this.not_delivered_fee < 10000 || this.not_delivered_fee > 20000000) {
        const removeIndex = this.tags.indexOf(19);
        if (this.tags.indexOf(19) < 0) {
          message.error(
            "Không giao được hàng và thu phí tối thiếu 10.000đ và tối đa 20.000.000đ"
          );
        } else {
          this.tags.splice(removeIndex);
          this.handleChangeCheckbox(19);
        }
      }
    },
  },

  watch: {
    checkedListDefault: {
      handler() {
        this.tags = this.checkedListDefault;
        this.not_delivered_option = this.notDeliverOption;
      },
      deep: true,
    },
    notDeliverFee() {
      this.not_delivered_fee = this.notDeliverFee;
    },
    // not_delivered_fee: function () {
    //   this.generateMessage();
    //   this.emitInfo();
    // },
    images: function () {
      this.emitInfo();
    },
  },
};
</script>

<style lang="scss" scoped>
.ant-col {
  margin-bottom: 10px;
}
/*.ant-col:nth-child(2),*/
/*.ant-col:nth-child(6),*/
/*.ant-col:nth-child(10) {*/
/*  padding-bottom: 20px;*/
/*}*/
.underline {
  text-decoration: underline;
}
.ant-checkbox-wrapper {
  display: flex;
  align-items: center;
}
p {
  margin: 0;
}

/*.ant-col:nth-child(10) {*/
/*  width: 30%;*/
/*  display: inline;*/
/*}*/

.ant-checkbox-inner {
  width: 20px;
  height: 20px;
}

.dropdown-content-input-all {
  padding: 0 2px;
}

.tag {
  padding-bottom: 8px !important;
}

.excel-tag-item {
  font-size: 0.875rem !important;
}

.ant-divider-horizontal {
  display: block;
  clear: both;
  width: 100%;
  min-width: 100%;
  height: 1px;
  margin: 8px 0;
}
.g-input__wrapper {
  width: 86px !important;
}
.add-product-modal {
  .g-input__wrapper {
    .outerError {
      position: absolute;
      bottom: -20px;
      font-size: 13px;
    }
  }
  .g-select-name-char {
    .input__wrapper {
      border-bottom: 1px solid #c4c4c4;
    }
    .list__wrapper {
      min-width: 367px !important;
    }
  }
  .ant-modal-content {
    border-radius: 13px 13px 12px 12px;
    .ant-modal-header {
      padding: 11px 24px;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
    }
  }
  .ant-input:focus {
    border-color: #d9d9d9;
    box-shadow: none;
  }
  .ant-input:hover {
    border-color: #d9d9d9;
    box-shadow: none;
  }
  .ant-modal-body {
    padding: 12px;
  }
}
span.notify-free.t-text-primary {
  margin-right: 10px;
}
.tag-key-21 {
  width: 100% !important;
}
.tag-key-16 {
  width: 300px !important;
}
.select-image__wrapper {
  width: 80px;
  height: 80px;
  border: 1px dashed #069255;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  color: #069255;
  cursor: pointer;
}
.tag-key-1 {
  p {
    width: 190px;
  }
}
.tag-key-2 {
  p {
    width: 430px;
  }
}
.dropdown-content-input-all {
  .g-input__wrapper {
    height: 30px;
    padding-bottom: 7px;
    margin-right: 20px;
    .g-input {
      min-height: 0;
      padding: 0;
    }
  }
}
</style>
<style lang="scss"></style>

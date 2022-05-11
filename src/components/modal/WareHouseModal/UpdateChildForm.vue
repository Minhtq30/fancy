<template>
  <div
    class="t-text-black t-text-[16px] t-p-[24px] t-pb-0"
    style="overflow-y: auto"
  >
    <div class="t-h-[643px]">
      <div class="add-product-modal-img t-grid t-grid-cols-6 t-gap-3 t-pb-4">
        <div
          class="product-image t-relative"
          v-for="(image, index) in localChild.images_file"
          :key="index"
        >
          <img class="t-w-full t-h-full" :src="image" :alt="''" />
          <div class="product-image-close" @click="removeChildFile(index)">
            x
          </div>
        </div>
        <div
          class="select-image__wrapper"
          v-if="localChild.images_file.length < maxImagesNum"
          @click="selectImage('childImage')"
        >
          <plus-icon class="t-mb-[10px]" :width="23" :height="23"></plus-icon>
          <span style="font-size: 16px; font-weight: 500"> Ảnh </span>
          <input
            type="file"
            :ref="'orderImage'"
            id="childImage"
            style="display: none"
            multiple="true"
            @change="(e) => onSelectProductImage(e)"
          />
        </div>
      </div>
      <div class="add-product-modal-detail t-py-[20px] border-none">
        <div class="t-flex t-items-center">
          <label class="t-w-[120px]">Tên sản phẩm </label>
          <g-input
            class="t-flex-1"
            v-model="localChild.full_name"
            placeholder="Nhập tên sản phẩm"
            @input-change="validateProductName"
            :outer-error-message="validate.product_name"
          ></g-input>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Danh mục </label>

          <g-select
            class="t-flex-1 t-cursor-pointer"
            inputJustify="left"
            :show-search="false"
            optionAlign="left"
            :data-source="formattedProductCategories"
            v-model:selected-item="localChild.category_id"
          ></g-select>
        </div>
        <div
          v-for="(variation, index) in localChild.characteristics"
          :key="index"
          class="t-flex t-items-center t-mt-[20px]"
        >
          <label class="t-w-[120px]"> {{ variation.label }} </label>

          <div
            class="t-flex t-justify-start t-items-center t-flex-wrap t-gap-[10px]"
          >
            <button
              class="t-relative t-text-[#fff] t-bg-[#069255] button-toggle-characteristic t-h-[28px] t-py-[4px] t-px-[10px] t-rounded-[5px] t-flex t-justify-center t-items-center"
            >
              {{ variation.value }}
            </button>
          </div>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Khối lượng </label>
          <p class="t-flex t-items-center t-m-0">
            <g-select
              class="t-mr-[10px] t-w-[90px] t-cursor-pointer"
              inputJustify="center"
              :show-search="false"
              valueType="number"
              :number-only="true"
              optionAlign="center"
              showSearch
              :max="20"
              :min="0.1"
              type="suggestion"
              :data-source="weightData"
              v-model:selectedItem="localChild.weigh"
            ></g-select
            >kg
          </p>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Giá gốc</label>
          <g-input
            class="t-flex-1"
            v-model="localChild.cost"
            :formatter="$filters.integerFormatter"
            :parser="$filters.numberCommaParser"
            :number-only="true"
            placeholder="Nhập giá gốc"
            @input-change="validateCostValue(localChild.cost)"
            :outerErrorMessage="validate.product_cost"
          ></g-input>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Giá bán</label>
          <g-input
            v-model="localChild.retail_prices"
            class="t-flex-1"
            placeholder="Nhập giá bán"
            :formatter="$filters.integerFormatter"
            :parser="$filters.numberCommaParser"
            :number-only="true"
            @input-change="validatePriceValue(localChild.retail_prices)"
            :outerErrorMessage="validate.product_price"
          ></g-input>
        </div>
        <div class="t-flex t-mt-[20px]">
          <label class="t-w-[120px] t-mt-[10px]">Mô tả</label>
          <g-textarea
            v-model:value="localChild.description"
            style="min-height: 80px"
            class="t-flex-1"
            placeholder="Nhập mô tả sản phẩm"
          ></g-textarea>
        </div>
      </div>
    </div>
  </div>
  <div
    class="add-product-modal-action t-flex t-justify-between t-items-center t-p-[24px]"
  >
    <button
      @click="updateChild()"
      class="t-bg-[#00904A] t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#069255] t-h-[40px] t-p-0 t-w-full t-text-[16px] t-font-medium t-text-[#fff]"
    >
      Lưu chỉnh sửa
    </button>
  </div>
</template>

<script>
import { GInput } from "@/components";
import { GTextarea } from "@/components/elements";
import PlusIcon from "@/components/icons/PlusIcon";
import { mapState } from "vuex";
import GSelect from "@/components/common/GSelect";
import { message } from "ant-design-vue";

export default {
  components: {
    PlusIcon,
    GInput,
    GSelect,
    GTextarea,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    setVisible: Function,
    child: {
      type: Object,
      required: true,
    },
  },

  data() {
    return {
      localChild: JSON.parse(JSON.stringify(this.child)),
      minSize: 50,
      maxSize: 20000,
      maxImagesNum: 8,
      validate: {
        product_name: "",
        product_cost: "",
        product_price: "",
      },
      weightData: [],
    };
  },
  computed: {
    ...mapState({
      productCategories: (state) => state.warehouse.productCategories,
      weightDataSource: (state) => state.global.weightDataSource,
    }),
    formattedProductCategories() {
      return this.productCategories.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    },
  },
  mounted() {
    this.localChild.images = [];
    for (let i = 0; i < this.child.images.length; i++) {
      this.localChild.images.push(this.child.images[i]);
    }
    if (!this.productCategories.length) {
      this.$store.dispatch("warehouse/getProductCategories");
    }
    this.handleLimitWeight();
  },
  methods: {
    updateChild() {
      if (this.validateValue()) {
        this.$emit("updateChild", this.localChild);
        this.$emit("back");
      }
    },

    handleLimitWeight() {
      this.weightData = this.weightDataSource.filter((w) => {
        return w.value <= 20;
      });
    },
    validateCostValue(data) {
      this.validate.product_cost = "";
      if (data > 20000000) {
        this.validate.product_cost =
          "GHTK chưa hỗ trợ ĐH có giá trị hàng lớn hơn 20,000,000 đ.";
        return false;
      } else if (!data) {
        this.validate.product_cost = "Giá sản phẩm không được để trống";
        return false;
      }
      return true;
    },
    validatePriceValue(data) {
      this.validate.product_price = "";
      if (data > 20000000) {
        this.validate.product_price =
          "GHTK chưa hỗ trợ ĐH có giá trị hàng lớn hơn 20,000,000 đ.";
        return false;
      } else if (!data) {
        this.validate.product_price = "Giá sản phẩm không được để trống";
        return false;
      }
      return true;
    },
    onSelectProductImage(e) {
      let files = e.target.files;
      if (
        this.localChild.images.length + files.length > this.maxImagesNum ||
        files.length === 0
      ) {
        message.error("Tải lên tối đa 8 ảnh");
        return false;
      }
      const self = this;
      let checkImageSize = true;
      if (files.length > 0) {
        for (let f = 0; f < files.length; f++) {
          const file = files[f];
          const reader = new FileReader();
          reader.onload = async (evt) => {
            var img = new Image();
            img.src = evt.target.result;
            await img.decode();
            console.log(`width : ${img.width} px`, `height: ${img.height} px`);
            if (
              img.width < this.minSize ||
              img.height < this.minSize ||
              img.width > this.maxSize ||
              img.height > this.maxSize
            ) {
              if (checkImageSize) {
                message.error(
                  "Ảnh có kích thước tối đa 20000x20000 và tối thiểu 50x50"
                );
                checkImageSize = false;
              }
              return false;
            }
            if (self.localChild.images_file.includes(evt.target.result)) {
              return false;
            } else {
              self.localChild.images_file.push(evt.target.result);
              self.localChild.images.push(file);
            }
          };
          reader.readAsDataURL(file);
        }
      }
    },

    selectImage(image) {
      document.getElementById(image).click();
    },

    removeChildFile(index) {
      this.localChild.images.splice(index, 1);
      this.localChild.images_file.splice(index, 1);
    },
    validateProductName() {
      if (!this.localChild.full_name) {
        this.validate.product_name = "Tên sản phẩm không được để trống";
        return false;
      } else {
        this.validate.product_name = "";
      }
    },
    validateValue() {
      this.validate.product_price = "";
      this.validate.product_cost = "";
      this.validate.product_name = "";
      if (!this.localChild.full_name) {
        this.validate.product_name = "Tên sản phẩm không được để trống";
        return false;
      } else if (!this.localChild.cost) {
        this.validate.product_cost = "Giá sản phẩm không được để trống";
        return false;
      } else if (!this.localChild.retail_prices) {
        this.validate.product_price = "Giá sản phẩm không được để trống";
        return false;
      } else if (!this.localChild.images.length) {
        message.error("Vui lòng thêm ảnh sản phẩm");
        return false;
      }
      return true;
    },
  },
  watch: {
    visible: function (newVal) {
      if (!this.productCategories.length && newVal) {
        this.$store.dispatch("warehouse/getProductCategories");
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.border-none {
  border-bottom: none !important;
}
.add-product-modal {
  .g-select__wrapper
    .list__wrapper
    .result__wrapper
    .options_wrapper
    .option:hover {
    .item-characteristic::after {
      background: #e6f4ee;
    }
  }
  .add-product-modal-detail,
  .add-product-modal-img,
  .add-product-modal-property {
    border-bottom: 1px solid #e0e0e0;
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
  .product-image {
    width: 80px;
    height: 80px;
    img {
      height: 100%;
      -o-object-fit: cover;
      object-fit: cover;
      width: 100%;
    }
    .product-image-close {
      position: absolute;
      top: -4px;
      right: -4px;
      width: 17px;
      padding-left: 0.5px;
      padding-bottom: 0.5px;
      height: 17px;
      z-index: 99;
      background: #f63c3c;
      border-radius: 50%;
      display: flex;
      justify-content: center;
      align-items: center;
      font-size: 15px;
      color: #fff;
      transition: 0.3s;
      cursor: pointer;
      &:hover {
        background: #c61e1e;
      }
    }
  }
  .disabled {
    border-color: #bdbdbd;
    color: #bdbdbd;
    cursor: not-allowed;
  }
}
</style>

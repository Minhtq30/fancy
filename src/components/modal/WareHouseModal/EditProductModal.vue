<template>
  <a-modal
    class="edit-product-modal"
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="656"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="overlayLoading" v-if="loadingSpin">
      <a-spin :spinning="loadingSpin" />
    </div>
    <template v-slot:title>
      <div class="t-flex t-flex-row t-items-center t-w-full">
        <h3
          class="t-text-center t-text-white t-mb-0 t-text-[24px] t-font-medium t-h-[25px]"
          style="
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          "
        >
          {{ product.fullName || "Sửa sản phẩm" }}
        </h3>
        <span class="t-flex t-cursor-pointer" @click="handleCancel">
          <svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M20 2.01429L17.9857 0L10 7.98571L2.01429 0L0 2.01429L7.98571 10L0 17.9857L2.01429 20L10 12.0143L17.9857 20L20 17.9857L12.0143 10L20 2.01429Z"
              fill="#fff"
            />
          </svg>
        </span>
      </div>
    </template>
    <div class="t-text-black t-text-[16px]">
      <div class="overlay" v-if="loading">
        <a-spin :spinning="loading" />
      </div>
      <div class="edit-product-modal-img t-grid t-grid-cols-6 t-gap-3 t-pb-4">
        <div
          class="product-image t-relative"
          v-for="(image, index) in product.images"
          :key="index"
        >
          <img
            class="edit-product-modal-img t-w-full t-h-full"
            :src="image.ghtkPath"
            :alt="''"
          />
          <div class="product-image-close" @click="removeFile(index)">x</div>
        </div>
        <div
          class="select-image__wrapper"
          v-if="product.images && product.images.length < maxImagesNum"
          @click="selectImage('productEditImage')"
        >
          <plus-icon class="t-mb-[10px]" :width="23" :height="23"></plus-icon>
          <span style="font-size: 16px; font-weight: 500"> Ảnh </span>
          <input
            type="file"
            :ref="'orderImage'"
            id="productEditImage"
            style="display: none"
            multiple="true"
            @change="(e) => onSelectProductImage(e)"
          />
        </div>
      </div>
      <div class="edit-product-modal-detail t-py-[20px]">
        <div class="t-flex t-items-center">
          <label class="t-w-[120px]">Tên sản phẩm</label>
          <g-input
            class="t-flex-1"
            v-model="product.fullName"
            placeholder="Nhập tên sản phẩm"
            :outer-error-message="validate.product_name"
            @input-change="validateProductName"
          ></g-input>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Danh mục </label>
          <g-select
            @on-selection-change="validate.product_category = ''"
            class="t-flex-1"
            inputJustify="left"
            :show-search="false"
            optionAlign="left"
            :data-source="formattedProductCategories"
            v-model:selected-item="product.category"
            :outerErrorMessage="validate.product_category"
            :placeholder="'Chọn danh mục sản phẩm'"
          ></g-select>
        </div>
        <div
          class="t-flex t-items-center t-flex-col"
          v-if="product?.charateristics?.length"
        >
          <label class="t-w-full t-mt-[20px]">Đặc tính </label>
          <div class="t-w-full">
            <div
              class="t-flex t-items-center t-mt-[20px]"
              v-for="char in product.charateristics"
              :key="char.id"
            >
              <label class="t-w-[120px] t-capitalize">{{ char.name }} </label>
              <div class="t-flex t-items-center t-gap-[10px]">
                <template v-for="value in char.values" :key="value.id">
                  <button
                    v-if="value.is_view"
                    class="t-relative button-toggle-characteristic t-h-[28px] t-py-[4px] t-px-[10px] t-rounded-[5px] t-flex t-justify-center t-items-center t-bg-[#069255] t-text-[#fff] t-cursor-default"
                  >
                    {{ value.name }}
                  </button>
                </template>
              </div>
            </div>
          </div>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Khối lượng </label>
          <p class="t-flex t-items-center t-m-0">
            <g-select
              class="t-mr-[10px] t-w-[90px]"
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
              v-model:selectedItem="product.weight"
            ></g-select
            >kg
          </p>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Giá gốc</label>
          <g-input
            class="t-flex-1"
            v-model="product.cost"
            placeholder="Nhập giá gốc"
            :formatter="$filters.integerFormatter"
            :parser="$filters.numberCommaParser"
            :number-only="true"
            @input-change="onCostMoneyBlur(product.cost)"
            :outerErrorMessage="validate.product_cost"
          ></g-input>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Giá bán</label>
          <g-input
            v-model="product.retail_prices"
            class="t-flex-1"
            placeholder="Nhập giá bán"
            :formatter="$filters.integerFormatter"
            :parser="$filters.numberCommaParser"
            :number-only="true"
            @input-change="onRetailMoneyBlur(product.retail_prices)"
            :outerErrorMessage="validate.product_price"
          ></g-input>
        </div>
        <div class="t-flex t-mt-[20px]">
          <label class="t-w-[120px] t-mt-[10px]">Mô tả</label>
          <g-textarea
            v-model:value="product.description"
            style="min-height: 80px"
            class="t-flex-1"
            placeholder="Nhập mô tả sản phẩm"
          ></g-textarea>
        </div>
      </div>
      <div
        class="edit-product-modal-action t-pt-[20px] t-flex t-justify-between t-items-center"
      >
        <button
          @click="updateProduct(product)"
          class="t-bg-[#00904A] t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#069255] t-h-[40px] t-p-0 t-w-full t-text-[16px] t-font-medium t-text-[#fff]"
        >
          Lưu sản phẩm
        </button>
      </div>
    </div>
  </a-modal>
</template>

<script>
import PlusIcon from "@/components/icons/PlusIcon";
import { GInput } from "@/components";
import GSelect from "@/components/common/GSelect";
import { GTextarea } from "@/components/elements";
import { mapState } from "vuex";
import { message } from "ant-design-vue";
import wareHouseService from "@/services/warehouse.service";
import { forEach } from "lodash";
import services from "@/services";

export default {
  components: { PlusIcon, GInput, GSelect, GTextarea },
  props: ["productId", "visible", "setVisible", "fullInfoProductDetail"],
  data() {
    return {
      maxImagesNum: 8,
      product: {
        retail_prices: "",
        cost: "",
      },
      validate: {
        product_name: "",
        product_cost: "",
        product_price: "",
        product_category: "",
      },
      loading: false,
      loadingSpin: false,
    };
  },
  computed: {
    ...mapState({
      weightDataSource: (state) => state.global.weightDataSource,
      productCategories: (state) => state.warehouse.productCategories,
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
  methods: {
    async getData() {
      this.loading = true;
      try {
        const response = this.fullInfoProductDetail
          ? {
              data: {
                data: this.fullInfoProductDetail,
                success: true,
              },
            }
          : await wareHouseService.getProductDetailId(this.productId);
        if (response.data.success) {
          this.product = {
            product_id: response.data.data.id,
            code: response.data.data.code,
            name: response.data.data.name,
            fullName: response.data.data.fullName,
            images: response.data.data.images,
            images_file: [],
            charateristics: response.data.data.charateristics,
            weight: {
              label:
                response.data.data.weight === 0
                  ? 0.1
                  : response.data.data.weight,
              value:
                response.data.data.weight === 0
                  ? 0.1
                  : response.data.data.weight,
            },
            category: {
              value: response.data.data.category_id,
              label: response.data.data.category_name,
            },
            retail_prices: response.data.data.retailPrice || "",
            cost: response.data.data.cost || "",
            description: response.data.data.description,
          };
          this.loading = false;
        } else {
          this.product = {
            retail_prices: "",
            cost: "",
          };
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
          setTimeout(() => {
            this.setVisible(false);
          }, 1000);
        }
      } catch (error) {
        console.log(error);
        this.loading = false;
        message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
      }
    },
    validateProductName() {
      if (!this.product.fullName) {
        this.validate.product_name = "Tên sản phẩm không được để trống";
        return false;
      } else if (this.product.fullName.length > 256) {
        this.validate.product_name =
          "Tên sản phẩm không được vượt quá 256 ký tự";
        return false;
      } else {
        this.validate.product_name = "";
        return true;
      }
    },
    validateValue() {
      this.validate.product_price = "";
      this.validate.product_cost = "";
      this.validate.product_name = "";
      this.validate.product_category = "";
      if (!this.product.fullName) {
        this.validate.product_name = "Tên sản phẩm không được để trống";
        return false;
      } else if (this.product.fullName.length > 256) {
        this.validate.product_name =
          "Tên sản phẩm không được vượt quá 256 ký tự";
        return false;
      } else if (!this.product.category.label) {
        this.validate.product_category =
          "Danh mục sản phẩm không được để trống";
        return false;
      } else if (!this.product.cost) {
        this.validate.product_cost = "Giá sản phẩm không được để trống";
        return false;
      } else if (!this.product.retail_prices) {
        this.validate.product_price = "Giá sản phẩm không được để trống";
        return false;
      } else if (this.product.retail_prices > 20000000) {
        this.validate.product_price =
          "GHTK chưa hỗ trợ ĐH có giá trị hàng lớn hơn 20,000,000 đ.";
        return false;
      } else if (this.product.cost > 20000000) {
        this.validate.product_cost =
          "GHTK chưa hỗ trợ ĐH có giá trị hàng lớn hơn 20,000,000 đ.";
        return false;
      } else if (!this.product.images.length) {
        message.error("Vui lòng thêm ảnh sản phẩm");
        return false;
      }
      return true;
    },

    handleLimitWeight() {
      this.weightData = this.weightDataSource.filter((w) => {
        return w.value <= 20;
      });
    },
    removeFile(index) {
      this.product?.images.splice(index, 1);
      // this.product?.parent.images_file.splice(index, 1);
    },
    handleCancel() {
      this.setVisible(false);
      this.product = {
        retail_prices: "",
        cost: "",
      };
    },
    selectImage(image) {
      document.getElementById(image).click();
    },
    onCostMoneyBlur(data) {
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
    onRetailMoneyBlur(data) {
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

    async onSelectProductImage(e) {
      let files = e.target.files;
      if (this.product.images.length + files.length > this.maxImagesNum) {
        message.error("Tải lên tối đa 8 ảnh");
        return false;
      }
      if (files.length > 0) {
        for (let f = 0; f < files.length; f++) {
          const file = files[f];
          this.product.images_file.push(file);
        }
        await this.uploadImageCs();
      }
    },
    async uploadImage() {
      let data = new FormData();
      forEach(this.product.images, (image) => {
        data.append("content", "productImage");
        data.append("object", "product");
        data.append("files[]", image);
      });
      let result = await services.$package.uploadImage(data);
      if (result && result.success) {
        console.log("uploaded", result);
      }
    },
    async uploadImageCs() {
      if (this.product.images_file.length) {
        try {
          const formData = new FormData();
          this.product.images_file.forEach((image) =>
            formData.append("images[]", image)
          );
          await wareHouseService.uploadImageCs(formData).then((rs) => {
            if (rs.data.success) {
              this.product.images_file = [];
              for (let i = 0; i < rs.data.data.length; i++) {
                this.product.images.push({
                  name: rs.data.data[i].file_name,
                  ghtkPath: rs.data.data[i].url,
                  path: rs.data.data[i].url,
                });
              }
            }
          });
        } catch (error) {
          let errorMessage = "";
          errorMessage = error.response.data.message
            ? error.response.data.message
            : "Tải ảnh thất bại, vui lòng thử lại";
          message.error(errorMessage);
          this.product.images_file = [];
        }
      }
    },
    async updateProduct(product) {
      if (this.validateValue()) {
        this.loadingSpin = true;
        await this.uploadImageCs();
        const productJSON = JSON.stringify({
          ...product,
          category_id: product.category.value,
          category_name: product.category.label,
          weight: product.weight.value,
          name: product.fullName,
          images: product.images.map((image) => {
            return {
              name: image.name,
              ghtk_path: image.ghtkPath,
              path: image.ghtkPath,
              id: image.id,
            };
          }),
        });
        try {
          const response = await wareHouseService.updateProduct(
            productJSON,
            product.product_id
          );
          if (response.data.success) {
            this.$store.commit("warehouse/setProductDetailById", this.product);
            message.success(response.data.message);
            this.setVisible(false);
          } else {
            message.error(response.data.message);
          }
          this.loadingSpin = false;
        } catch (error) {
          console.log(error);
          this.loadingSpin = false;
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
      }
    },
  },
  watch: {
    visible(_visible) {
      if (_visible) {
        this.getData();
        if (!this.productCategories.length) {
          this.$store.dispatch("warehouse/getProductCategories");
        }
        this.handleLimitWeight();
      }
    },
    product: {
      handler: function () {
        if (this.product.fullName) {
          this.validate.product_name = "";
        }
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.edit-product-modal {
  .overlayLoading {
    position: fixed;
    display: flex;
    top: 0;
    left: 0;
    align-items: center;
    background-color: #0000001c;
    justify-content: space-around;
    height: 100%;
    width: 100%;
    z-index: 999;
  }
  .overlay {
    position: absolute;
    display: flex;
    align-items: center;
    background-color: rgba(255, 255, 255, 0.5);
    justify-content: space-around;
    height: calc((100% - 75px) - 50px);
    width: calc(100% - 30px);
    z-index: 1;
  }
  .edit-product-modal-detail,
  .edit-product-modal-img,
  .edit-product-modal-property {
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
    .edit-product-modal-img {
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
}
</style>

<style lang="scss">
.edit-product-modal {
  .g-input__wrapper {
    .outerError {
      position: absolute;
      bottom: -20px;
      font-size: 13px;
      width: 383px;
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
</style>

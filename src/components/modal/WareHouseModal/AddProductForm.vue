<template>
  <div
    class="t-text-black t-text-[16px] t-p-[24px] t-pb-0 t-overflow-y-auto"
    id="form-container"
  >
    <div class="t-h-[640px]">
      <div class="add-product-modal-img t-grid t-grid-cols-6 t-gap-3 t-pb-4">
        <div
          class="product-image t-relative"
          v-for="(image, index) in product.parent.images_file"
          :key="index"
        >
          <img class="t-w-full t-h-full" :src="image" :alt="''" />
          <div class="product-image-close" @click="removeFile(index)">x</div>
        </div>
        <div
          v-if="product.parent.images_file.length < maxImagesNum"
          class="select-image__wrapper"
          @click="selectImage('productImage')"
        >
          <plus-icon class="t-mb-[10px]" :width="23" :height="23"></plus-icon>
          <span style="font-size: 16px; font-weight: 500"> Ảnh </span>
          <input
            type="file"
            :ref="'orderImage'"
            id="productImage"
            style="display: none"
            multiple="true"
            @change="(e) => onSelectProductImage(e)"
          />
        </div>
      </div>
      <div class="add-product-modal-detail t-py-[20px]">
        <div class="t-flex t-items-center">
          <label class="t-w-[120px]">Tên sản phẩm </label>
          <g-input
            class="t-flex-1 t-text-[16px]"
            v-model="product.parent.full_name"
            placeholder="Nhập tên sản phẩm"
            @input-change="validateProductName"
            :outer-error-message="validate.product_name"
          ></g-input>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Danh mục </label>
          <g-select
            @on-selection-change="onChangeCategory()"
            class="t-flex-1 t-cursor-pointer"
            inputJustify="left"
            :show-search="false"
            optionAlign="left"
            :data-source="formattedProductCategories"
            v-model:selected-item="product.parent.category_id"
            :outerErrorMessage="validate.product_category"
            :placeholder="'Chọn danh mục sản phẩm'"
          ></g-select>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Khối lượng </label>
          <p class="t-flex t-items-center t-m-0">
            <g-select
              @on-selection-change="
                product.children = productChildrenCharacteristicGenerated()
              "
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
              v-model:selectedItem="product.parent.weigh"
            ></g-select
            >kg
          </p>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Giá gốc</label>
          <g-input
            class="t-flex-1"
            v-model="product.parent.cost"
            :formatter="$filters.integerFormatter"
            :parser="$filters.numberCommaParser"
            :number-only="true"
            placeholder="Nhập giá gốc"
            @input-change="onCostMoneyBlur(product)"
            :outerErrorMessage="validate.product_cost"
          ></g-input>
        </div>
        <div class="t-flex t-items-center t-mt-[20px]">
          <label class="t-w-[120px]">Giá bán</label>
          <g-input
            v-model="product.parent.retail_prices"
            class="t-flex-1 t-text-[16px]"
            placeholder="Nhập giá bán"
            :formatter="$filters.integerFormatter"
            :parser="$filters.numberCommaParser"
            :number-only="true"
            @input-change="onRetailMoneyBlur(product)"
            :outerErrorMessage="validate.product_price"
          ></g-input>
        </div>
        <div class="t-flex t-mt-[20px]">
          <label class="t-w-[120px] t-mt-[10px]">Mô tả</label>
          <g-textarea
            @input-change="
              product.children = productChildrenCharacteristicGenerated()
            "
            v-model:value="product.parent.description"
            style="min-height: 80px"
            class="t-flex-1"
            placeholder="Nhập mô tả sản phẩm"
          ></g-textarea>
        </div>
      </div>
      <div
        class="add-product-modal-property t-flex t-justify-between t-py-[20px]"
      >
        <div class="t-w-full">
          <div class="t-flex t-items-center t-justify-between">
            <div class="t-flex t-items-center">
              <label class="t-w-[120px]">Đặc tính</label>
              <button
                :disabled="disabledButton.add"
                :class="disabledButton.add ? 'disabled' : ''"
                class="t-bg-transparent t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#069255] t-p-0 t-h-[32px] t-w-[150px] t-text-[16px] t-font-normal t-text-[#069255]"
                @click="handleAddNewCharacteristic"
              >
                Thêm đặc tính mới
              </button>
            </div>
            <div>
              <button
                class="t-bg-transparent t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#069255] t-p-0 t-h-[32px] t-w-[70px] t-text-[16px] t-font-normal t-text-[#069255]"
                @click="handleOpenManageModal"
              >
                Quản lý
              </button>
            </div>
          </div>
          <div
            class="t-flex t-mt-[20px]"
            v-for="(array, index) in arrayCharacteristics"
            :key="index"
          >
            <div class="t-flex t-flex-wrap t-gap-[10px] t-w-full">
              <g-select
                v-model:selectedItem="array.selectedCharacteristic"
                :direction="'bottom'"
                :noBorder="true"
                :required="true"
                :data-source="handleGetCharacteristics"
                inputId="productName"
                class="g-select-name-char t-min-w-[100px] t-max-w-[100px] t-flex-1"
                placeholder="Size/ Màu"
                @on-selection-change="
                  (item) => onCharacteristicSelectionChange(item, index)
                "
              >
                <template v-slot:option="{ item }">
                  <div
                    class="item-characteristic-div t-flex t-flex-row t-items-center t-w-full t-py-[10px]"
                  >
                    <div class="t-font-medium">{{ item.label }}:</div>
                    <div class="t-flex t-items-center t-ml-[5px]">
                      <div
                        class="item-characteristic t-relative"
                        v-for="(value, index) in item.values"
                        :key="value.id_value"
                      >
                        {{ value.value }}
                        <span
                          class="t-mr-[5px]"
                          :class="
                            index === item.values.length - 1 ? 't-hidden' : ''
                          "
                          >|</span
                        >
                      </div>
                    </div>
                  </div>
                </template>
              </g-select>
              <div
                class="t-flex t-justify-start t-items-center t-flex-wrap t-gap-[10px]"
                v-if="array.listCharacteristics"
              >
                <button
                  class="t-relative button-toggle-characteristic t-h-[28px] t-py-[4px] t-px-[10px] t-rounded-[5px] t-flex t-justify-center t-items-center"
                  v-for="value in array.listCharacteristics?.values"
                  :key="value"
                  :class="
                    value.checked
                      ? 't-bg-[#069255] t-text-[#fff]'
                      : 't-bg-[#fff] t-text-[#069255] t-border-solid t-border-[1px] t-border-[#069255]'
                  "
                  @click="deleteValueCharacteristic(value, index)"
                >
                  {{ value.value }}
                </button>
              </div>
              <g-input
                class="t-w-full t-min-w-[50px] t-flex-1"
                placeholder="+ Nhập giá trị đặc tính (S/M/...)"
                v-model="array.valueCharacteristic"
                @update:modelValue="handChangeValueCharacteristic"
                @onFocus="handFocusValueCharacteristic(index)"
                @keyup.enter="handleSaveCharacteristic(index)"
              ></g-input>
              <button
                :class="array.disableSave ? 'disabled' : ''"
                class="t-bg-transparent t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#069255] t-h-[32px] t-p-0 t-w-[50px] t-text-[16px] t-font-normal t-text-[#069255]"
                @click="handleSaveCharacteristic(index)"
              >
                Lưu
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  <div class="add-product-modal-action t-px-[24px]">
    <div class="t-py-[24px] t-flex t-justify-between t-items-center">
      <button
        @click="previewList"
        class="t-bg-transparent t-rounded-[5px] t-h-[40px] t-mr-[18px] t-min-w-[120px] t-p-0 t-text-[16px] t-font-medium t-text-[#00904A] t-flex-1"
      >
        Xem trước
      </button>
      <button
        @click="addProduct"
        class="t-bg-[#00904A] t-rounded-[5px] t-border-[2px] t-border-solid t-border-[#069255] t-h-[40px] t-p-0 t-w-full t-text-[16px] t-font-medium t-text-[#fff]"
      >
        Tạo {{ product.children.length != 0 ? product.children.length : 1 }} sản
        phẩm
      </button>
    </div>
  </div>
  <manage-characteristics-modal
    :visible="visibleModal.manageModal"
    :setVisible="setVisibleModal('manageModal')"
  />
</template>

<script>
import { nanoid } from "nanoid";
import { GInput } from "@/components";
import { GTextarea } from "@/components/elements";
import PlusIcon from "@/components/icons/PlusIcon";
import { mapState } from "vuex";
import ManageCharacteristicsModal from "@/components/modal/WareHouseModal/ManageCharacteristicsModal";
import GSelect from "@/components/common/GSelect";
import { message } from "ant-design-vue";
import { isEmptyObject } from "@/utils";

export default {
  components: {
    ManageCharacteristicsModal,
    PlusIcon,
    GInput,
    GSelect,
    GTextarea,
  },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    setVisible: Function,
  },
  data() {
    return {
      minSize: 50,
      maxSize: 20000,
      maxImagesNum: 8,
      checkUpdateParentForm: false,
      index: 0,
      product: {
        children: [],
        parent: {
          full_name: "",
          weigh: {
            label: "0.1",
            value: 0.1,
          },
          cost: "",
          retail_prices: "",
          images: [],
          description: "",
          category_id: {},
          images_file: [],
        },
      },
      disabledButton: {
        add: true,
        save: false,
      },
      weightData: [],
      validate: {
        product_name: "",
        product_cost: "",
        product_price: "",
        product_category: "",
      },
      visibleModal: {
        manageModal: false,
      },
      totalAddCharacteristic: 1,
      arrayCharacteristics: [
        {
          name: "",
          selectedCharacteristic: {},
          valueCharacteristic: "",
          listCharacteristics: {},
          values: [],
          disableSave: true,
        },
      ],
      selectedCharacteristicIds: [],
    };
  },
  computed: {
    ...mapState({
      productCategories: (state) => state.warehouse.productCategories,
      weightDataSource: (state) => state.global.weightDataSource,
      characteristics: (state) => state.warehouse.productCharacteristics,
    }),
    formattedProductCategories() {
      return this.productCategories.map((item) => {
        return {
          label: item.name,
          value: item.id,
        };
      });
    },
    handleGetCharacteristics() {
      if (this.arrayCharacteristics.length === 1) {
        return this.characteristics.map((item) => {
          let values = item.values.map((item) => ({ ...item, checked: true }));
          return {
            value: item.id,
            label: item.name,
            values: values,
          };
        });
      }

      return this.characteristics
        .filter((item) => {
          return !this.selectedCharacteristicIds.includes(item.id);
        })
        .map((item) => {
          let values = item.values.map((item) => ({ ...item, checked: true }));
          return {
            value: item.id,
            label: item.name,
            values: values,
          };
        });
    },
  },
  mounted() {
    if (!this.productCategories.length && this.visible) {
      this.$store.dispatch("warehouse/getProductCategories");
    }
    if (!this.characteristics.length && this.visible) {
      this.$store.dispatch("warehouse/getProductCharacteristics");
    }
    this.handleLimitWeight();
  },

  updated() {
    if (!this.characteristics.length && this.visible) {
      this.$store.dispatch("warehouse/getProductCharacteristics");
    }
  },
  methods: {
    previewList() {
      if (this.validateValue()) {
        if (this.checkUpdateParentForm == true) {
          this.checkUpdateParentForm = false;
          this.$emit("getProduct", this.product);
        }
        this.$emit("showPreviewList");
      }
    },
    productChildrenCharacteristicGenerated() {
      this.checkUpdateParentForm = true;
      let result = [];
      let validCharacteristics = this.arrayCharacteristics.filter(
        (characteristic) => {
          return (
            !isEmptyObject(characteristic.selectedCharacteristic) &&
            characteristic.selectedCharacteristic.value
          );
        }
      );
      if (!validCharacteristics.length) {
        result.push({
          nanoid: nanoid(),
          images_file: this.product.parent.images_file,
          description: this.product.parent.description,
          images: this.product.parent.images,
          full_name: this.product.parent.full_name,
          cost: this.product.parent.cost,
          retail_prices: this.product.parent.retail_prices,
          weigh: this.product.parent.weigh,
          category_id: this.product.parent.category_id,
          category: this.product.parent.category_id,
          characteristics: [],
        });

        return result;
      }
      validCharacteristics[0].selectedCharacteristic.values.map((item) => {
        if (!item.checked) return null;
        let tmpChild = {
          nanoid: nanoid(),
          images_file: this.product.parent.images_file,
          description: this.product.parent.description,
          images: [],
          full_name:
            this.product.parent.full_name +
            "- (" +
            validCharacteristics[0].selectedCharacteristic.label +
            ") " +
            item.value,
          cost: this.product.parent.cost,
          retail_prices: this.product.parent.retail_prices,
          weigh: this.product.parent.weigh,
          category_id: this.product.parent.category_id,
          characteristics: [
            {
              label: validCharacteristics[0].selectedCharacteristic.label,
              id: validCharacteristics[0].selectedCharacteristic.value,
              value: item.value,
              value_ids: [item.id_value],
            },
          ],
        };
        for (let i = 0; i < this.product.parent.images.length; i++) {
          tmpChild.images.push(this.product.parent.images[i]);
        }
        result.push(tmpChild);
      });

      // handle next characteristics
      for (let i = 1; i < validCharacteristics.length; i++) {
        let tmp_result = [];
        for (
          let j = 0;
          j < validCharacteristics[i].selectedCharacteristic.values.length;
          j++
        ) {
          // Neu khong duoc chon thi bo qua
          if (
            !validCharacteristics[i].selectedCharacteristic.values[j].checked
          ) {
            continue;
          }
          for (let k = 0; k < result.length; k++) {
            let tmpChar = {
              ...result[k],
              images_file: this.product.parent.images_file,
              full_name: this.product.parent.full_name,
              characteristics: [
                ...result[k].characteristics,
                {
                  id: validCharacteristics[i].selectedCharacteristic.value,
                  label: validCharacteristics[i].selectedCharacteristic.label,
                  value:
                    validCharacteristics[i].selectedCharacteristic.values[j]
                      .value,
                  value_ids: [
                    validCharacteristics[i].selectedCharacteristic.values[j]
                      .id_value,
                  ],
                },
              ],
            };
            tmpChar.characteristics.forEach(
              (variation) =>
                (tmpChar.full_name =
                  tmpChar.full_name +
                  " - (" +
                  variation.label +
                  ") " +
                  variation.value)
            );
            tmp_result.push(tmpChar);
          }
        }
        result = tmp_result;
      }
      return result;
    },
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    handleLimitWeight() {
      this.weightData = this.weightDataSource.filter((w) => {
        return w.value <= 20;
      });
    },
    handleOpenManageModal() {
      this.visibleModal.manageModal = true;
    },
    async handleSaveCharacteristic(index) {
      if (this.arrayCharacteristics[index].listCharacteristics.values) {
        const valueArray = this.arrayCharacteristics[
          index
        ].listCharacteristics.values.map((list) => {
          return list.value;
        });
        if (
          this.arrayCharacteristics[index].disableSave === false &&
          !valueArray.includes(
            this.arrayCharacteristics[index].valueCharacteristic
          )
        ) {
          if (this.arrayCharacteristics[index].listCharacteristics.label) {
            if (this.arrayCharacteristics[index].valueCharacteristic) {
              this.arrayCharacteristics[index].listCharacteristics.values.push({
                id: nanoid(),
                value: this.arrayCharacteristics[index].valueCharacteristic,
                checked: true,
              });
            }
            const newCharacteristicUpdateData = this.arrayCharacteristics[
              index
            ].listCharacteristics.values.map((val) => {
              return {
                id: val.id_value,
                value: val.value,
              };
            });
            this.arrayCharacteristics[index].valueCharacteristic = "";
            await this.$store.dispatch(
              "warehouse/updateProductCharacteristics",
              {
                id: this.arrayCharacteristics[index].listCharacteristics.value,
                name: this.arrayCharacteristics[index].listCharacteristics
                  .label,
                values: newCharacteristicUpdateData,
              }
            );
            await this.$store.dispatch("warehouse/getProductCharacteristics");
          } else {
            message.error("Vui lòng nhập tên đặc tính");
          }
        } else if (
          valueArray.includes(
            this.arrayCharacteristics[index].valueCharacteristic
          )
        ) {
          message.error("Trùng với đặc tính trước đó");
        }
      } else {
        message.error("Vui lòng chọn đặc tính");
      }
    },
    handleAddNewCharacteristic() {
      if (this.arrayCharacteristics.length < 3) {
        this.arrayCharacteristics.push({
          name: "",
          selectedCharacteristic: {},
          listCharacteristics: {},
          values: [],
        });
        this.arrayCharacteristics[
          this.arrayCharacteristics.length - 1
        ].disableSave = true;
      } else {
        message.error("Vui lòng chọn nhiều nhất 3 đặc tính sản phẩm");
      }
    },
    onCharacteristicSelectionChange(item, index) {
      if (item) {
        this.disabledButton.add = false;
        this.arrayCharacteristics[index].listCharacteristics = item;
        if (!this.selectedCharacteristicIds.includes(item.value)) {
          this.selectedCharacteristicIds[index] = item.value;
        }
      }
    },
    handFocusValueCharacteristic(index) {
      this.index = index;
    },
    handChangeValueCharacteristic(data) {
      if (data !== "") {
        this.arrayCharacteristics[this.index].disableSave = false;
      } else {
        this.arrayCharacteristics[this.index].disableSave = true;
      }
    },
    onCostMoneyBlur(data) {
      this.validate.product_cost = "";
      if (data.parent.cost > 20000000) {
        this.validate.product_cost =
          "GHTK chưa hỗ trợ ĐH có giá trị hàng lớn hơn 20,000,000 đ.";
        return false;
      } else if (!data.parent.cost) {
        this.validate.product_cost = "Giá sản phẩm không được để trống";
        return false;
      }
      this.product.children = this.productChildrenCharacteristicGenerated();
      return true;
    },
    onRetailMoneyBlur(data) {
      this.validate.product_price = "";
      if (data.parent.retail_prices > 20000000) {
        this.validate.product_price =
          "GHTK chưa hỗ trợ ĐH có giá trị hàng lớn hơn 20,000,000 đ.";
        return false;
      } else if (!data.parent.retail_prices) {
        this.validate.product_price = "Giá sản phẩm không được để trống";
        return false;
      }
      this.product.children = this.productChildrenCharacteristicGenerated();
      return true;
    },

    async onSelectProductImage(e) {
      let files = e.target.files;
      if (
        this.product.parent.images.length + files.length >
        this.maxImagesNum
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
            if (
              img.width < this.minSize ||
              img.height < this.minSize ||
              img.width > this.maxSize ||
              img.height > this.maxSize
            ) {
              if (checkImageSize) {
                message.error(
                  "Ảnh có kích thước tối đa 20000x20000(px) và tối thiểu 50x50(px)"
                );
                checkImageSize = false;
              }
              return false;
            }
            if (self.product.parent.images_file.includes(evt.target.result)) {
              return false;
            } else {
              self.product.parent.images_file.push(evt.target.result);
              self.product.parent.images.push(file);
              self.product.children =
                self.productChildrenCharacteristicGenerated();
            }
          };

          reader.readAsDataURL(file);
        }
      }
    },

    selectImage(image) {
      document.getElementById(image).click();
    },
    removeFile(index) {
      this.product?.parent.images.splice(index, 1);
      this.product?.parent.images_file.splice(index, 1);
      this.product.children = this.productChildrenCharacteristicGenerated();
      document.getElementById("productImage").value = null;
    },
    validateProductName() {
      this.product.children = this.productChildrenCharacteristicGenerated();
      if (!this.product.parent.full_name) {
        this.validate.product_name = "Tên sản phẩm không được để trống";
        return false;
      } else if (this.product.parent.full_name.length > 256) {
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
      if (!this.product.parent.full_name) {
        this.validate.product_name = "Tên sản phẩm không được để trống";
        return false;
      } else if (this.product.parent.full_name.length > 256) {
        this.validate.product_name =
          "Tên sản phẩm không được vượt quá 256 ký tự";
        return false;
      } else if (!this.product.parent.category_id.label) {
        this.validate.product_category =
          "Danh mục sản phẩm không được để trống";
        return false;
      } else if (!this.product.parent.cost) {
        this.validate.product_cost = "Giá sản phẩm không được để trống";
        return false;
      } else if (!this.product.parent.retail_prices) {
        this.validate.product_price = "Giá sản phẩm không được để trống";
        return false;
      } else if (this.product.parent.retail_prices > 20000000) {
        this.validate.product_price =
          "GHTK chưa hỗ trợ ĐH có giá trị hàng lớn hơn 20,000,000 đ.";
        return false;
      } else if (this.product.parent.cost > 20000000) {
        this.validate.product_cost =
          "GHTK chưa hỗ trợ ĐH có giá trị hàng lớn hơn 20,000,000 đ.";
        return false;
      } else if (!this.product.parent.images.length) {
        message.error("Vui lòng thêm ảnh sản phẩm");
        return false;
      }
      return true;
    },
    async addProduct() {
      if (this.validateValue()) {
        if (this.checkUpdateParentForm == true) {
          this.checkUpdateParentForm = false;
          this.$emit("getProduct", this.product);
        }
        this.$emit("addProduct");
      }
    },
    onChangeCategory() {
      this.product.children = this.productChildrenCharacteristicGenerated();
      this.validate.product_category = "";
    },
    deleteValueCharacteristic(value, index) {
      if (value) {
        let characteristicValueIndex = this.arrayCharacteristics[
          index
        ].listCharacteristics.values.findIndex(
          (val) => val.id_value === value.id_value
        );
        if (
          this.arrayCharacteristics[index].listCharacteristics.values[
            characteristicValueIndex
          ].checked === false ||
          this.arrayCharacteristics[index].listCharacteristics.values.filter(
            function (e) {
              return e.checked === true;
            }
          ).length > 1
        )
          this.arrayCharacteristics[index].listCharacteristics.values[
            characteristicValueIndex
          ].checked =
            !this.arrayCharacteristics[index].listCharacteristics.values[
              characteristicValueIndex
            ].checked;
        this.arrayCharacteristics[index].disableSave = false;
      }
    },
  },
  watch: {
    visible: function (newVal) {
      if (!this.productCategories.length && newVal) {
        this.$store.dispatch("warehouse/getProductCategories");
      }
    },
    characteristics: {
      handler: function () {
        if (this.arrayCharacteristics[0].listCharacteristics.value) {
          this.arrayCharacteristics.forEach((characteristic, index) => {
            if (characteristic.listCharacteristics.values) {
              let tmp = this.characteristics.find(
                (x) => x.id === characteristic.listCharacteristics.value
              );
              if (tmp == undefined) {
                if (this.arrayCharacteristics.length == 1) {
                  this.arrayCharacteristics = [
                    {
                      name: "",
                      selectedCharacteristic: {},
                      valueCharacteristic: "",
                      listCharacteristics: {},
                      values: [],
                      disableSave: true,
                    },
                  ];
                } else {
                  this.arrayCharacteristics.splice(index, 1);
                }
                return;
              }
              characteristic.listCharacteristics.label = tmp.name;
              characteristic.listCharacteristics.values = [];
              tmp.values.forEach((val) => {
                characteristic.listCharacteristics.values.push({
                  value: val.value,
                  order: null,
                  id_value: val.id_value || val.id,
                  checked: true,
                });
              });
              characteristic.selectedCharacteristic =
                characteristic.listCharacteristics;
            }
          });
        }
      },
      deep: true,
    },

    arrayCharacteristics: {
      handler: function () {
        this.product.children = this.productChildrenCharacteristicGenerated();
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
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
  .add-product-modal-img {
    border-bottom: 1px solid #e0e0e0;
  }
  .add-product-modal-action-wrapper {
    border-top: 1px solid #e0e0e0;
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

.add-product-modal-detail ::v-deep(.g-input) {
  font-size: 16px;
}
</style>

<template>
  <a-modal
    class="add-product-modal"
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="656"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <div class="overlay" v-if="loadingSpin">
      <a-spin :spinning="loadingSpin" />
    </div>
    <template v-slot:title>
      <div class="t-flex t-flex-row t-items-center t-w-full">
        <svg
          class="t-cursor-pointer"
          v-if="step != 'add_product'"
          @click="
            step == 'preview_list'
              ? (step = 'add_product')
              : (step = 'preview_list')
          "
          width="13"
          height="22"
          viewBox="0 0 13 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M11.9425 0.724367C12.1925 0.974403 12.3329 1.31348 12.3329 1.66703C12.3329 2.02059 12.1925 2.35966 11.9425 2.6097L3.55188 11.0004L11.9425 19.391C12.1854 19.6425 12.3198 19.9793 12.3168 20.3289C12.3137 20.6785 12.1735 21.0129 11.9263 21.2601C11.6791 21.5073 11.3447 21.6476 10.9951 21.6506C10.6455 21.6536 10.3087 21.5192 10.0572 21.2764L0.723878 11.943C0.473917 11.693 0.333496 11.3539 0.333496 11.0004C0.333496 10.6468 0.473917 10.3077 0.723878 10.0577L10.0572 0.724367C10.3072 0.474405 10.6463 0.333984 10.9999 0.333984C11.3534 0.333984 11.6925 0.474405 11.9425 0.724367Z"
            fill="white"
          />
        </svg>
        <h3
          class="t-text-center t-text-white t-mb-0 t-text-[24px] t-font-medium t-h-[25px]"
          style="
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          "
        >
          {{ step != "update_child" ? "Tạo sản phẩm" : childDetail.full_name }}
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
    <keep-alive>
      <add-product-form
        v-if="step == 'add_product'"
        @getProduct="getProduct"
        @showPreviewList="showPreviewList"
        @addProduct="addProduct"
      />
    </keep-alive>
    <preview-children-list
      v-if="step == 'preview_list'"
      :children="product.children"
      @getChildDetail="getChildDetail"
      @addProduct="addProduct"
      @back="step = 'add_product'"
    />
    <update-child-form
      v-if="step == 'update_child'"
      @updateChild="updateChild"
      @back="step = 'preview_list'"
      :child="childDetail"
    />
  </a-modal>
</template>

<script>
import wareHouseService from "@/services/warehouse.service";
import { message } from "ant-design-vue";
import UpdateChildForm from "./UpdateChildForm.vue";
import PreviewChildrenList from "./PreviewChildrenList.vue";
import AddProductForm from "./AddProductForm.vue";

export default {
  components: {
    UpdateChildForm,
    PreviewChildrenList,
    AddProductForm,
  },
  props: {
    visible: {
      type: Boolean,
      default: true,
    },
    changeParams: {
      type: Boolean,
      default: true,
    },
    setVisible: Function,
  },
  data() {
    return {
      loadingSpin: false,
      childDetail: {},
      step: "add_product",
      product: {},
    };
  },
  methods: {
    getProduct(product) {
      this.product = product;
    },
    showPreviewList() {
      this.step = "preview_list";
    },
    async handleUploadImageGs() {
      let check = false;
      let totalImagesFile = [];
      let totalImages = [];
      let uniqueImagesFile = [];
      let uniqueImages = [];
      for (let i = 0; i < this.product.parent.images_file.length; i++) {
        totalImagesFile.push(this.product.parent.images_file[i]);
        totalImages.push(this.product.parent.images[i]);
      }
      this.product.children.forEach((child) => {
        for (let i = 0; i < child.images_file.length; i++) {
          totalImagesFile.push(child.images_file[i]);
          totalImages.push(child.images[i]);
        }
      });
      //get unique list
      totalImagesFile.forEach((image, index) => {
        if (!uniqueImagesFile.includes(image)) {
          uniqueImagesFile.push(image);
          uniqueImages.push(totalImages[index]);
        }
      });
      let apiImages = [];
      if (totalImagesFile.length > 0) {
        try {
          const formData = new FormData();
          uniqueImages.forEach((image) => formData.append("images[]", image));
          await wareHouseService.uploadImageCs(formData).then((rs) => {
            if (rs.data.success) {
              apiImages = rs.data.data;
              for (let i = 0; i < apiImages.length; i++) {
                let j = 0;
                while (
                  Object.prototype.hasOwnProperty.call(
                    totalImagesFile[j],
                    "file_id"
                  )
                ) {
                  j++;
                }
                if (
                  !Object.prototype.hasOwnProperty.call(
                    totalImagesFile[j],
                    "file_id"
                  )
                ) {
                  let tmpValue = totalImagesFile[j];
                  for (let x = j; x < totalImagesFile.length; x++) {
                    if (tmpValue === totalImagesFile[x]) {
                      totalImagesFile[x] = apiImages[i];
                    }
                  }
                }
              }
              for (let i = 0; i < this.product.parent.images.length; i++) {
                let tmp = totalImagesFile.shift();
                this.product.parent.images[i] = {
                  name: tmp.file_name,
                  ghtk_path: tmp.url,
                };
              }
              this.product.children.forEach((child) => {
                for (let i = 0; i < child.images.length; i++) {
                  let tmp = totalImagesFile.shift();
                  child.images[i] = {
                    name: tmp.file_name,
                    ghtk_path: tmp.url,
                  };
                }
              });
              check = true;
            }
          });
        } catch (error) {
          check = false;
          this.loadingSpin = false;
        }
      } else {
        check = true;
      }
      return check;
    },
    handleCancel() {
      this.setVisible(false);
    },
    getChildDetail(child) {
      this.childDetail = child;
      this.step = "update_child";
    },
    updateChild(child) {
      var foundIndex = this.product.children.findIndex(
        (x) => x.nanoid == child.nanoid
      );
      this.product.children[foundIndex] = child;
      message.success("Lưu chỉnh sửa thành công");
    },
    showUpdateChildModal(index) {
      this.childDetail = this.product.children[index];
      this.showUpdateModal = true;
    },
    async addProduct() {
      this.loadingSpin = true;
      let uploadImages = await this.handleUploadImageGs();
      if (!uploadImages) {
        message.error("Tải ảnh thất bại, vui lòng thử lại");
        return;
      }
      delete this.product.parent.images_file;
      this.product.parent = {
        ...this.product.parent,
        weigh: this.product.parent.weigh.label,
        category_id: this.product.parent.category_id.value,
      };
      if (this.product.children.length > 0) {
        this.product.children.forEach((child) => {
          child.weigh = child.weigh.label;
          child.category_id = child.category_id.value;
          delete child.images_file;
          delete child.nanoid;
        });
      }
      try {
        const response = await wareHouseService.addProduct(
          JSON.stringify([this.product])
        );
        if (response.data.success) {
          this.$store.dispatch("warehouse/getProduct", {
            page: 1,
            page_size: 25,
          });
          if (this.changeParams) {
            this.$router.push({
              name: "warehouse-and-products_list-products",
              params: { page: 1, page_size: 25 },
            });
          }
          message.success("Tạo sản phẩm thành công");
          this.setVisible(false);
          this.product = {};
        } else {
          message.error(response.data.message);
        }
        this.loadingSpin = false;
      } catch (error) {
        message.error(error);
        this.loadingSpin = false;
      }
    },
  },
};
</script>
<style lang="scss">
.add-product-modal {
  .overlay {
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
  .list__wrapper {
    padding: 0 !important;
  }
  .option {
    padding: 5px 15px;
  }
  .option + .option {
    border-top: 1px solid #e0e0e0;
  }
  .g-input__wrapper {
    .outerError {
      position: absolute;
      bottom: -20px;
      font-size: 13px;
      width: 383px;
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
    min-height: 750px;
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
    min-height: 700px;
    padding: 0px !important;
  }
}
</style>

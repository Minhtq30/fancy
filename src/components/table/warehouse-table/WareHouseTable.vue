<template>
  <div class="warehouse-table-wrapper">
    <table class="w-100 g-table">
      <thead class="t-sticky t-top-0 t-z-10">
        <tr>
          <th class="medium-text t-min-w-[366px] t-w-[366px]">Tên sản phẩm</th>
          <th class="medium-text t-text-right">Giá bán</th>
          <th class="medium-text t-text-right">Tương tác</th>
          <th class="medium-text t-text-right">Đặt mua</th>
          <th class="medium-text t-text-right">Đã xuất</th>
          <th class="medium-text t-text-right">Đã bán</th>
          <th class="medium-text t-text-right">Hoàn hàng</th>
          <th class="medium-text t-text-right">Tồn</th>
          <th class="medium-text t-text-right">Doanh thu</th>
        </tr>
      </thead>
      <tbody class="t-align-top">
        <tr v-for="product in products" :key="product.id">
          <td class="warehouse-table-product t-max-w-[366px] t-w-[366px]">
            <div class="t-flex">
              <div
                class="warehouse-table-product__img t-w-[72px] t-h-[76px] t-min-w-[72px] t-mt-[5px]"
              >
                <div
                  v-if="product.images[0]"
                  class="image-default t-h-full t-w-full t-bg-no-repeat t-bg-center t-bg-cover"
                  :style="{
                    backgroundImage: `url(${
                      product.images[0] || orderDefaultImage
                    }`,
                  }"
                ></div>
                <image-preload
                  v-else
                  class="image-default t-h-full t-w-full t-bg-no-repeat t-bg-center t-bg-cover"
                />
              </div>
              <div class="t-ml-[15px] t-flex-1 t-flex t-justify-between">
                <div>
                  <a-tooltip :title="product.product_name">
                    <span
                      class="warehouse-table-product__name t-whitespace-normal t-cursor-pointer t-break-words text-ellipsis"
                      @click="handleClickDetail(product)"
                      >{{ product.product_name }}</span
                    >
                  </a-tooltip>
                  <div
                    class="warehouse-table-product__note t-mt-[5px]"
                    v-if="product.note"
                  >
                    #{{ product.note }}
                  </div>
                </div>
                <div>
                  <button
                    class="t-text-[#069255] t-text-[14px] t-border-[1px] t-border-solid t-border-[#069255] t-bg-transparent t-rounded-full t-w-[50px] t-p-0"
                    @click="handleClickDetail(product)"
                  >
                    Xem
                  </button>
                </div>
              </div>
            </div>
            <div class="warehouse-table-actions t-flex t-justify-end">
              <div
                class="warehouse-table-actions-edit t-cursor-pointer t-flex t-mr-[5px]"
                @click="handleClickEdit(product)"
              >
                <svg
                  width="25"
                  height="25"
                  viewBox="0 0 25 25"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M20.3125 12.5C20.3125 12.2928 20.3948 12.0941 20.5413 11.9476C20.6878 11.8011 20.8865 11.7188 21.0938 11.7188C21.301 11.7188 21.4997 11.8011 21.6462 11.9476C21.7927 12.0941 21.875 12.2928 21.875 12.5V21.0938C21.875 21.301 21.7927 21.4997 21.6462 21.6462C21.4997 21.7927 21.301 21.875 21.0938 21.875H3.90625C3.69905 21.875 3.50034 21.7927 3.35382 21.6462C3.20731 21.4997 3.125 21.301 3.125 21.0938V3.90625C3.125 3.69905 3.20731 3.50034 3.35382 3.35382C3.50034 3.20731 3.69905 3.125 3.90625 3.125H12.5C12.7072 3.125 12.9059 3.20731 13.0524 3.35382C13.1989 3.50034 13.2812 3.69905 13.2812 3.90625C13.2812 4.11345 13.1989 4.31216 13.0524 4.45868C12.9059 4.60519 12.7072 4.6875 12.5 4.6875H4.6875V20.3125H20.3125V12.5Z"
                    fill="#069255"
                  />
                  <path
                    d="M11.4732 13.5313L12.7622 13.3469L20.681 5.42969C20.7556 5.35762 20.8151 5.27141 20.8561 5.1761C20.897 5.08078 20.9186 4.97827 20.9195 4.87453C20.9204 4.7708 20.9006 4.66793 20.8613 4.57191C20.822 4.4759 20.764 4.38867 20.6907 4.31532C20.6173 4.24196 20.5301 4.18395 20.4341 4.14467C20.3381 4.10539 20.2352 4.08562 20.1315 4.08652C20.0277 4.08743 19.9252 4.10898 19.8299 4.14992C19.7346 4.19087 19.6484 4.25038 19.5763 4.325L11.656 12.2422L11.4716 13.5313H11.4732ZM21.7857 3.21875C22.0035 3.43641 22.1762 3.69485 22.2941 3.9793C22.412 4.26376 22.4727 4.56865 22.4727 4.87656C22.4727 5.18448 22.412 5.48937 22.2941 5.77382C22.1762 6.05828 22.0035 6.31672 21.7857 6.53438L13.6841 14.6359C13.5646 14.7558 13.4095 14.8337 13.2419 14.8578L10.6638 15.2266C10.5436 15.2438 10.4211 15.2328 10.306 15.1945C10.1908 15.1562 10.0861 15.0915 10.0003 15.0057C9.91448 14.9198 9.84983 14.8152 9.81148 14.7C9.77314 14.5849 9.76216 14.4623 9.77942 14.3422L10.1482 11.7641C10.1718 11.5967 10.2491 11.4416 10.3685 11.3219L18.4716 3.22031C18.9111 2.78093 19.5072 2.5341 20.1286 2.5341C20.7501 2.5341 21.3462 2.78093 21.7857 3.22031V3.21875Z"
                    fill="#069255"
                  />
                </svg>
              </div>
              <div
                class="warehouse-table-actions-delete t-cursor-pointer t-flex"
                @click="handleClickDeleteProduct(product)"
              >
                <svg
                  width="19"
                  height="22"
                  viewBox="0 0 19 22"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.375 4C11.375 3.50272 11.1775 3.02581 10.8258 2.67417C10.4742 2.32254 9.99728 2.125 9.5 2.125C9.00272 2.125 8.52581 2.32254 8.17417 2.67417C7.82254 3.02581 7.625 3.50272 7.625 4H6.375C6.375 3.1712 6.70424 2.37634 7.29029 1.79029C7.87634 1.20424 8.6712 0.875 9.5 0.875C10.3288 0.875 11.1237 1.20424 11.7097 1.79029C12.2958 2.37634 12.625 3.1712 12.625 4H18.25C18.4158 4 18.5747 4.06585 18.6919 4.18306C18.8092 4.30027 18.875 4.45924 18.875 4.625C18.875 4.79076 18.8092 4.94973 18.6919 5.06694C18.5747 5.18415 18.4158 5.25 18.25 5.25H17.5575L15.9375 19.2875C15.867 19.8967 15.5749 20.4588 15.117 20.8668C14.659 21.2747 14.0671 21.5001 13.4538 21.5H5.54625C4.93293 21.5001 4.34099 21.2747 3.88302 20.8668C3.42506 20.4588 3.13303 19.8967 3.0625 19.2875L1.44125 5.25H0.75C0.603718 5.25005 0.462053 5.19879 0.349676 5.10514C0.2373 5.01149 0.161331 4.88139 0.135 4.7375L0.125 4.625C0.125 4.45924 0.190848 4.30027 0.308058 4.18306C0.425269 4.06585 0.58424 4 0.75 4H11.375ZM16.2975 5.25H2.70125L4.30375 19.1437C4.33903 19.4485 4.48513 19.7296 4.71424 19.9336C4.94336 20.1376 5.23948 20.2502 5.54625 20.25H13.4538C13.7603 20.2499 14.0561 20.1371 14.285 19.9332C14.5138 19.7292 14.6597 19.4483 14.695 19.1437L16.2975 5.25ZM7.625 8.375C7.93125 8.375 8.1875 8.56875 8.24 8.82375L8.25 8.9225V16.5787C8.25 16.88 7.97 17.125 7.625 17.125C7.31875 17.125 7.0625 16.9312 7.01 16.6762L7 16.5775V8.92375C7 8.62125 7.28 8.37625 7.625 8.37625V8.375ZM11.375 8.375C11.6812 8.375 11.9375 8.56875 11.99 8.82375L12 8.9225V16.5787C12 16.88 11.72 17.125 11.375 17.125C11.0688 17.125 10.8125 16.9312 10.76 16.6762L10.75 16.5775V8.92375C10.75 8.62125 11.03 8.37625 11.375 8.37625V8.375Z"
                    fill="#DA4838"
                  />
                </svg>
              </div>
            </div>
          </td>
          <td
            class="warehouse-table-prices t-text-right xl:t-w-auto xl:t-min-w-auto"
          >
            <div class="warehouse-table__number">
              <vue3-autocounter
                :startAmount="
                  parseFloat(product.retail_prices) > 100
                    ? parseFloat(product.retail_prices) - 100
                    : 0
                "
                :endAmount="parseFloat(product.retail_prices) || 0"
                :suffix="'đ'"
                :duration="1"
              />
            </div>
          </td>
          <td
            class="warehouse-table-interactive t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <div>
              <div class="warehouse-table__number">
                <vue3-autocounter
                  :startAmount="
                    product.total_interactive > 100
                      ? product.total_interactive - 100
                      : 0
                  "
                  :endAmount="product.total_interactive"
                  :suffix="suffix"
                  :duration="1"
                />
              </div>
              <div
                class="warehouse-table__plus t-text-[#069255] t-text-[15px] t-mt-[5px]"
                v-if="product?.inventory?.number"
              >
                +{{ product?.interactive?.plus }}
              </div>
            </div>
          </td>
          <td
            class="warehouse-table-order t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <div class="warehouse-table__number">
              <vue3-autocounter
                :startAmount="
                  product?.total_order > 100 ? product?.total_order - 100 : 0
                "
                :endAmount="product.total_order ? product.total_order : 0"
                :suffix="suffix"
                :duration="1"
              />
            </div>
            <div
              class="warehouse-table__plus t-text-[#069255] t-text-[15px] t-mt-[5px]"
              v-if="product?.inventory?.number"
            >
              +{{ product?.inventory?.number }}
            </div>
          </td>
          <td
            class="warehouse-table-export t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <div class="warehouse-table__number">
              <vue3-autocounter
                :startAmount="
                  product.total_out > 100 ? product.total_out - 100 : 0
                "
                :endAmount="product.total_out ? product.total_out : 0"
                :suffix="suffix"
                :duration="1"
              />
            </div>
          </td>
          <td
            class="warehouse-table-sell t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <div class="warehouse-table__number">
              <vue3-autocounter
                :startAmount="
                  product.total_sell > 100 ? product.total_sell - 100 : 0
                "
                :endAmount="product.total_sell ? product.total_sell : 0"
                :suffix="suffix"
                :duration="1"
              />
            </div>
            <div
              class="warehouse-table__plus t-text-[#069255] t-text-[15px] t-mt-[5px]"
              v-if="product.inventory?.number"
            >
              +{{ product.inventory?.number }}
            </div>
          </td>
          <td
            class="warehouse-table-refund t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <div class="warehouse-table__number">
              <vue3-autocounter
                :startAmount="
                  product.total_refund > 100 ? product.total_refund - 100 : 0
                "
                :endAmount="product.total_refund ? product.total_refund : 0"
                :suffix="suffix"
                :duration="1"
              />
            </div>
          </td>
          <td
            class="warehouse-table-inventory t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <div class="warehouse-table__number">
              <vue3-autocounter
                :startAmount="
                  product.total_inventory > 100
                    ? product.total_inventory - 100
                    : 0
                "
                :endAmount="
                  product.total_inventory ? product.total_inventory : 0
                "
                :suffix="suffix"
                :duration="1"
              />
            </div>
          </td>
          <td
            class="warehouse-table-turnover t-text-right xl:t-w-auto xl:t-min-w-auto"
          >
            <div class="warehouse-table__number">
              <vue3-autocounter
                :startAmount="product.revenue > 100 ? product.revenue - 100 : 0"
                :endAmount="product.revenue ? product.revenue : 0"
                :suffix="'đ'"
                :duration="1"
              />
            </div>
          </td>
        </tr>
        <tr v-if="products.length === 0">
          <td colspan="12">
            <a-empty :description="'Danh sách trống'" />
          </td>
        </tr>
      </tbody>
    </table>
    <div
      class="pagination-wrapper flex align-items-center justify-content-space-between t-px-[15px]"
      v-if="products.length !== 0"
    >
      <div>
        <span class="description-limit">Số lượng bản ghi/trang</span>
        <g-select
          :disabled="loading"
          class="page-limit"
          :value="page_size.toString()"
          :default-active-first-option="false"
          @change="onChangeLimit"
        >
          <a-select-option value="25">25</a-select-option>
          <a-select-option value="50">50</a-select-option>
          <a-select-option value="100">100</a-select-option>
        </g-select>
        Trang {{ products.length === 0 ? 0 : page }}/{{ totalPages }}
        <g-button
          :disabled="loading || page === 1"
          class="ml btn-prev-page"
          @click="changePage(page - 1)"
        >
          <span>Trang trước</span>
        </g-button>
        <g-button
          :disabled="loading || page === totalPages || products.length === 0"
          class="ml btn-next-page"
          @click="changePage(page + 1)"
        >
          <span>Trang sau</span>
        </g-button>
      </div>
    </div>
  </div>
  <a-modal
    class="delete-product-modal-warehouse"
    :visible="visibleModal.deleteProduct"
    :footer="null"
    :centered="true"
    :width="500"
    @cancel="handleCancel"
    @ok="handleOk"
  >
    <template v-slot:title>
      <div class="t-flex t-flex-row t-items-center t-w-full">
        <h3
          class="t-text-center t-text-white t-mb-0 t-text-[22px] t-font-medium"
          style="
            flex: 1;
            white-space: nowrap;
            text-overflow: ellipsis;
            overflow: hidden;
          "
        >
          Xóa sản phẩm
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
    <div
      class="delete-product-modal-content t-text-center t-text-[22px] t-mb-[25px] t-mt-[10px]"
      style="
        flex: 1;
        white-space: nowrap;
        text-overflow: ellipsis;
        overflow: hidden;
      "
    >
      {{
        isModalDeleteProduct
          ? "Bạn có chắc muốn xoá sản phẩm"
          : `Bạn có chắc muốn xoá ${selectedProductIds.length} sản phẩm`
      }}
      <span v-if="isModalDeleteProduct" class="t-font-medium">{{
        selectedProduct?.product_name
      }}</span>
      ?
    </div>
    <div
      class="delete-product-modal-action t-flex t-justify-around t-m-[10px] t-mb-[20px]"
    >
      <g-button
        size=""
        type="faded"
        class="faded t-h-[45px] t-w-[150px] t-text-[16px] t-font-medium"
        @click="handleCancel"
      >
        Hủy
      </g-button>
      <g-button
        size=""
        type="primary"
        class="primary t-h-[45px] t-w-[150px] t-text-[16px] t-font-medium"
        @click="handleClickDeleteConfirm"
      >
        Xóa
      </g-button>
    </div>
  </a-modal>
  <detail-product-modal
    :selectedProduct="selectedProduct"
    :visible="visibleModal.viewDetail"
    :setVisible="setVisibleModal('viewDetail')"
    :setSelectedProduct="setSelectedProduct"
    :selectedWarehouses="selectedWarehouseComputed"
  />
  <edit-product-modal
    :productId="selectedProduct.product_id"
    :visible="visibleModal.editProduct"
    :setVisible="setVisibleModal('editProduct')"
  />
</template>

<script>
import { GSelect, GButton } from "@/components/elements";
import DetailProductModal from "@/components/modal/DetailProductModal/index.vue";
import { mapState } from "vuex";
import orderDefaultImage from "@/assets/images/default_product.svg";
import { message } from "ant-design-vue";
import warehouseService from "@/services/warehouse.service";
import { ImagePreload } from "@/components/elements";
import Vue3Autocounter from "vue3-autocounter";
import EditProductModal from "@/components/modal/WareHouseModal/EditProductModal";
export default {
  components: {
    EditProductModal,
    GButton,
    GSelect,
    DetailProductModal,
    ImagePreload,
    Vue3Autocounter,
  },
  props: [
    "loading",
    "productsInPage",
    "handleChangePage",
    "handleChangeLimit",
    "totalPages",
    "loadData",
    "page",
    "page_size",
    "selectedWarehouses",
  ],
  data() {
    return {
      isModalDeleteProduct: true,
      orderDefaultImage,
      selectedProduct: {},
      visibleModal: {
        deleteProduct: false,
        viewDetail: false,
        editProduct: false,
      },
      selectedProductIds: [],
      selectedListDelete: [],
      selectedId: "",
    };
  },
  mounted() {},
  computed: {
    packages() {
      return this.$store.state.warehouse.productList.products;
    },
    isSelectedAll() {
      if (!this.productsInPage?.length) return false;
      return this.selectedProductIds.length === this.productsInPage.length;
    },
    ...mapState({
      products: (state) => state.warehouse.productList.products,
    }),
  },
  methods: {
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    handleClickAdd() {
      const btn = document.getElementById("btn-warehouse-action");
      if (btn) btn.click();
      this.visibleModal.addProduct = true;
    },
    handleClickEdit(product) {
      this.selectedProduct = product;
      this.visibleModal.editProduct = true;
    },
    handleClickDetail(product) {
      this.selectedProduct = product;
      this.visibleModal.viewDetail = true;
    },
    handleClickDeleteProduct(product) {
      if (product) {
        this.selectedProduct = product;
        this.visibleModal.deleteProduct = true;
        this.isModalDeleteProduct = true;
      }
    },
    handleChangeCheckedAll(event) {
      const checked = event.target.checked;
      if (checked) {
        let updateIds = [];

        for (const p of this.productsInPage) {
          updateIds.push(p.id);
        }

        this.selectedProductIds = updateIds;
      } else {
        this.selectedProductIds = [];
      }
    },
    onChangeLimit(_limit) {
      this.handleChangeLimit(_limit);
    },
    changePage(page) {
      this.selectedProductIds = [];
      this.handleChangePage(page);
    },
    handleToggleProduct(product) {
      const isSelected = this.selectedProductIds.includes(product.product_id);
      this.selectedProductIds = isSelected
        ? this.selectedProductIds.filter((id) => id !== product.product_id)
        : this.selectedProductIds.concat(product.product_id);
    },
    handleDeleteProducts() {
      if (this.selectedProductIds.length !== 0) {
        this.visibleModal.deleteProduct = true;
        this.isModalDeleteProduct = false;
      }
    },
    confirmCloseModal() {
      this.showModal = false;
    },
    getDataFromImportExportProduct() {
      this.showModal = false;
    },
    handleCancel() {
      this.visibleModal.deleteProduct = false;
    },
    async handleClickDeleteConfirm() {
      if (this.selectedProduct && this.isModalDeleteProduct) {
        try {
          const response = await warehouseService.deleteProduct(
            this.selectedProduct.product_id
          );
          if (response.data.success) {
            this.visibleModal.deleteProduct = false;
            message.success(response.data.message);
            this.$emit("loadData", true);
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
          this.visibleModal.deleteProduct = false;
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
      } else if (
        !this.isModalDeleteProduct &&
        this.selectedProductIds.length !== 0
      ) {
        try {
          const response = await warehouseService.deleteProducts(
            this.selectedProductIds
          );
          if (response.data.success) {
            this.visibleModal.deleteProduct = false;
            if (response.data.data.invalid.reason) {
              console.log(response.data.data.invalid.invalid);
              const nameProductInvalid = this.packages
                .filter((pack) => {
                  return response.data.data.invalid.invalid.includes(
                    pack.product_id
                  );
                })
                .map((name) => {
                  return name.product_name;
                });
              if (nameProductInvalid.length > 2) {
                message.error(
                  `Những sản phẩm : ${nameProductInvalid[0]}, ${
                    nameProductInvalid[1]
                  } và ${
                    response.data.data.invalid.invalid.length - 2
                  } sản phẩm không thể xóa có thể do đang ở trong phiếu đang xử lý, thuộc combo hoặc đang có tồn sản phẩm trong kho.`
                );
              } else {
                message.error(
                  `Những sản phẩm : ${nameProductInvalid} không thể xóa có thể do đang ở trong phiếu đang xử lý, thuộc combo hoặc đang có tồn sản phẩm trong kho.`
                );
              }
            } else {
              message.success(
                `Xóa thành công ${this.selectedProductIds.length} sản phẩm`
              );
            }
            this.$emit("loadData", true);
            this.selectedProductIds = [];
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          console.log(error);
          this.visibleModal.deleteProduct = false;
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau. ");
        }
      }
    },
    setSelectedProduct(_selectedProduct) {
      this.selectedProduct = _selectedProduct;
    },
  },
  watch: {
    products: {
      handler: function () {
        this.visibleModal.viewDetail = false;
      },
      deep: true,
    },
  },
};
</script>

<style lang="scss" scoped>
.warehouse-table-wrapper {
  height: calc(100vh - 240px);
  overflow-y: auto;
  .auto-number-count {
    padding: 0 !important;
    text-align: right !important;
  }
  .disabled {
    border-color: #bdbdbd;
    color: #bdbdbd;
    cursor: not-allowed;
  }
  .pagination-wrapper {
    background: #fff;
    height: 60px;
    border: 1px solid var(--grayColor);
    width: calc(100% - 30px);
    position: absolute;
    bottom: 0;
    .description-limit {
      display: none;
    }
    .g-select.page-limit {
      width: 70px;
    }
    .actions-wrapper {
      .button-action {
        padding: 0 40px;
        height: 38px;
      }
    }
    @media only screen and (min-width: 1600px) {
      .description-limit {
        display: inline-block;
        margin-right: 0.5rem !important;
      }
    }
  }
  @media only screen and (max-width: 1600px) {
    height: calc(100vh - 295px);
  }
}
.product-request-wrapper {
  .request-item + .request-item {
    border-top: 1px solid #e7e7e7;
  }
}
</style>

<style lang="scss">
.delete-product-modal-warehouse {
  .delete-product-modal-action {
    .ant-btn {
      height: 40px;
      font-weight: 500;
    }
  }
}
@media only screen and (max-width: 1400px) {
  .warehouse-table-wrapper {
    .btn-prev-page,
    .btn-next-page {
      padding: 0 5px;
      font-size: 14px !important;
    }
    .pagination-wrapper {
      font-size: 14px !important;
    }
    .button-add {
      width: 150px;
      font-size: 14px;
    }
    .actions-wrapper .button-action {
      padding: 0 25px !important;
      font-size: 14px !important;
      height: 35px !important;
    }
  }
}
</style>

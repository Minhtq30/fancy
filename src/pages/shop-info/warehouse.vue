<template>
  <main-content>
    <template #main>
      <div
        class="warehouse t-w-full"
        :class="{ 'has-policy': isAdmin }"
        :key="pickAddresses.length"
      >
        <div class="overlay" v-if="loading">
          <a-spin />
        </div>
        <h1 class="t-text-lg t-leading-5">Quản lý kho hàng</h1>
        <div
          class="warehouse_info t-mb-4"
          v-for="(pickAddress, index) in pickAddresses"
          :key="index"
        >
          <div
            class="display_warehouse_item"
            v-if="index <= 2 || showAllItem === true"
          >
            <div
              class="warehouse_info_top t-flex t-items-center t-justify-between t-pb-1"
            >
              <div class="info_top_left t-font-medium">
                Kho hàng {{ index + 1 }} - Mã kho
                {{ pickAddress.value }}
              </div>
              <div
                v-if="isAdmin && pickAddresses.length > 1"
                class="info_top_right t-flex t-cursor-pointer t-mt-2.5"
                @click="openConfirmDeleteWarehouse(pickAddress)"
              >
                <svg
                  width="16"
                  height="18"
                  viewBox="0 0 16 15"
                  fill="#fff"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7.34675 0L8.82725 0.00375C9.41075 0.07425 9.92225 0.34875 10.3437 0.81225C10.688 1.19025 10.8687 1.62975 10.8792 2.10825H14.9855C15.2697 2.10825 15.5 2.34075 15.5 2.628C15.5003 2.69586 15.4872 2.76311 15.4615 2.82592C15.4358 2.88873 15.398 2.94586 15.3502 2.99406C15.3025 3.04225 15.2457 3.08056 15.1831 3.1068C15.1205 3.13305 15.0534 3.1467 14.9855 3.147L13.6085 3.14625V11.8665C13.6085 13.7737 12.8967 15 11.3277 15H4.56425C2.99525 15 2.29475 13.7805 2.29475 11.8665V3.14625H1.0145C0.87771 3.14565 0.746737 3.09084 0.650292 2.99384C0.553847 2.89683 0.499801 2.76554 0.500001 2.62875C0.500001 2.3415 0.73025 2.10975 1.0145 2.10975H5.117C5.1275 1.72425 5.27075 1.3335 5.5325 0.94725C5.9225 0.37125 6.5315 0.0555 7.34675 0ZM12.5795 3.14625H3.323V11.8665C3.323 13.2825 3.713 13.962 4.56425 13.962H11.3277C12.182 13.962 12.5802 13.2765 12.5802 11.8665L12.5795 3.14625ZM5.537 4.755C5.8205 4.755 6.05075 4.9875 6.05075 5.274V11.3115C6.05104 11.3794 6.03797 11.4466 6.01228 11.5094C5.98658 11.5722 5.94876 11.6294 5.90099 11.6776C5.85321 11.7257 5.79641 11.7641 5.73383 11.7903C5.67125 11.8165 5.60411 11.8302 5.53625 11.8305C5.39933 11.8297 5.26832 11.7746 5.17199 11.6773C5.07567 11.58 5.0219 11.4484 5.0225 11.3115V5.274C5.0225 4.9875 5.25275 4.755 5.53625 4.755H5.537ZM7.5815 4.755C7.8665 4.755 8.096 4.9875 8.096 5.274V11.3115C8.09629 11.3794 8.08322 11.4466 8.05753 11.5094C8.03183 11.5722 7.99401 11.6294 7.94624 11.6776C7.89846 11.7257 7.84166 11.7641 7.77908 11.7903C7.7165 11.8165 7.64936 11.8302 7.5815 11.8305C7.44458 11.8297 7.31357 11.7746 7.21724 11.6773C7.12092 11.58 7.06715 11.4484 7.06775 11.3115V5.274C7.06775 4.9875 7.298 4.755 7.5815 4.755ZM9.6275 4.755C9.911 4.755 10.1412 4.9875 10.1412 5.274V11.3115C10.1418 11.4484 10.0881 11.58 9.99175 11.6773C9.89543 11.7746 9.76442 11.8297 9.6275 11.8305C9.55964 11.8302 9.4925 11.8165 9.42992 11.7903C9.36733 11.7641 9.31053 11.7257 9.26276 11.6776C9.21498 11.6294 9.17717 11.5722 9.15147 11.5094C9.12578 11.4466 9.1127 11.3794 9.113 11.3115V5.274C9.113 4.9875 9.34325 4.755 9.6275 4.755ZM7.382 1.0365C6.9005 1.07025 6.58325 1.2345 6.3815 1.533C6.233 1.75125 6.15875 1.94025 6.14675 2.109L9.85025 2.10825C9.83975 1.89 9.7535 1.698 9.58625 1.51425C9.32675 1.22925 9.03875 1.07475 8.7665 1.038L7.382 1.0365Z"
                    fill="#DA4838"
                  />
                </svg>
                <p class="t-leading-5 t-pl-2 t-text-red-400">Xóa kho</p>
              </div>
            </div>
            <div
              class="warehouse_info_mid xl:t-grid xl:t-grid-cols-2 xl:t-gap-20 t-flex-col"
            >
              <div class="info_mid_left">
                <div class="t-flex">
                  <a-col :span="6">
                    <p>Tên người liên hệ</p>
                  </a-col>
                  <a-col :span="18">
                    <g-input
                      :borderless="false"
                      v-model="pickAddress.payload.fullname"
                      inputId="whTel"
                      placeholder="Nhập tên người liên hệ"
                      :outerErrorMessage="
                        pickAddress.validateUpdate.warehouse_fullname_err
                      "
                      @input-change="setPickAddressChangedStatus(pickAddress)"
                      @input="() => {}"
                    />
                  </a-col>
                </div>
                <div class="t-flex">
                  <a-col :span="6">
                    <p>Số điện thoại</p>
                  </a-col>
                  <a-col :span="18">
                    <g-input
                      :borderless="false"
                      :number-only="true"
                      v-model="pickAddress.payload.tel"
                      inputId="whTel"
                      :outerErrorMessage="
                        pickAddress.validateUpdate.warehouse_tel_err
                      "
                      placeholder="Nhập SĐT"
                      @input-change="setPickAddressChangedStatus(pickAddress)"
                      @input="() => {}"
                      @keydown.space="(event) => event.preventDefault()"
                    />
                  </a-col>
                </div>
              </div>
              <div class="info_mid_right">
                <div class="t-flex t-w-full">
                  <a-col :span="6" class="t-w-full">
                    <p>Địa chỉ lấy hàng</p></a-col
                  >
                  <a-col :span="18" class="t-w-full">
                    <warehouse-info
                      :ware-house-data="pickAddress"
                      @update:address="
                        (data) => updateDetailForPickAddress(pickAddress, data)
                      "
                    />
                  </a-col>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div
          v-if="showAllItem !== true && pickAddresses.length > 3"
          class="warehouse_show t-text-lg t-leading-5 t-pt-2 t-pb-8"
        >
          <span class="t-cursor-pointer" @click="clickShowAllItem"
            >Xem tất cả kho</span
          >
        </div>
        <div v-if="isAdmin && !loading" class="warehouse_policy">
          <div class="warehouse_policy_tittle t-font-medium">
            Chính sách trả hàng
          </div>
          <form class="t-w-full xl:t-w-7/12">
            <div class="warehouse_policy_item">
              <div class="warehouse_policy_check">
                <input
                  type="radio"
                  id="check1"
                  name="radio-group"
                  :checked="return_package.auto_store_package.is_selected"
                  @click="changeReturnOption('auto_store_package')"
                />
                <label for="check1"></label>
              </div>
              <div class="warehouse_policy_content">
                <div class="policy_content_title xl:t-pl-2">
                  <label for="check1" class="t-cursor-pointer"
                    >Tự động lưu kho chờ check cho đến khi có thao tác của shop
                    hoặc tự động hoàn sau
                    <g-select
                      v-model:selectedItem="
                        return_package.auto_store_package.selected_day
                      "
                      :data-source="daysReturnDataSource"
                      class="t-flex-1 t-inline-block"
                      inputJustify="center"
                      valueType="number"
                      :number-only="true"
                      :show-search="false"
                      optionAlign="center"
                      @update:selectedItem="handleChange"
                    ></g-select>
                    ngày lưu kho</label
                  >
                </div>
                <div class="policy_content_script">
                  <div class="policy_content_script_item t-pt-0.5 xl:t-pl-2">
                    Đơn hàng sau 3 ca giao không thành công, Shop có 24h để xác
                    nhận. Sau 24h xác nhận, ĐH sẽ được lưu kho tự động và tính
                    phí lưu kho. Thời gian lưu kho tối đa 30 ngày. Shop có thể
                    tùy chỉnh thời gian lưu kho tối đa theo mong muốn của shop.
                  </div>
                  <div class="policy_content_script_item t-pt-0.5 xl:t-pl-2">
                    Phí lưu kho:
                    <p>Ngày đầu tiên: 1000đ/đơn</p>
                    <p>Ngày thứ 2: 2000đ/ đơn</p>
                    <p>Từ ngày thứ 3: 3000đ/đơn.</p>
                  </div>
                </div>
              </div>
            </div>
            <div class="warehouse_policy_item">
              <div class="warehouse_policy_check">
                <input
                  type="radio"
                  :checked="return_package.not_auto_store_return_immediately"
                  id="check2"
                  name="radio-group"
                  @click="
                    changeReturnOption('not_auto_store_return_immediately')
                  "
                />
                <label for="check2"></label>
              </div>
              <div class="warehouse_policy_content">
                <div class="policy_content_title t-pt-0.5">
                  <label
                    for="check2"
                    class="t-cursor-pointer t-pt-0.5 xl:t-pl-2"
                  >
                    Không lưu kho/ hoàn ngay
                  </label>
                </div>
                <div class="policy_content_script t-pt-0.5 xl:t-pl-2">
                  <div>
                    Đơn hàng sau 3 ca giao không thành công, Shop có 24h để xác
                    nhận. Sau 24h xác nhận, đơn hàng sẽ không lưu kho và được
                    trả về ngay cho shop.
                  </div>
                </div>
              </div>
            </div>
            <div class="warehouse_policy_item">
              <div class="warehouse_policy_check">
                <input
                  :checked="return_package.not_receive_return_package"
                  type="radio"
                  id="check3"
                  name="radio-group"
                  @click="changeReturnOption('not_receive_return_package')"
                />
                <label for="check3"></label>
              </div>
              <div class="warehouse_policy_content">
                <div class="policy_content_title t-pt-0.5 xl:t-pl-2">
                  <label class="t-cursor-pointer" for="check3">
                    Không nhận hàng trả
                  </label>
                </div>
                <div class="policy_content_script t-pt-0.5 xl:t-pl-2">
                  <div>
                    Đơn hàng sau 3 ca giao không thành công, Shop có 24h để xác
                    nhận. Hết thời gian này, GHTK sẽ không trả hàng về shop và
                    có toàn quyền xử lý với những đơn hàng này.
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
        <a-modal
          :visible="showModalCreatePickAddress"
          :footer="null"
          :closable="false"
          :centered="true"
          :width="587"
          class="confirmSubmitOrderModal"
          @cancel="showModalCreatePickAddress = false"
        >
          <template v-slot:title>
            <div class="t-flex t-flex-row t-items-center t-w-full">
              <h3 class="t-text-center t-text-white t-mb-0 t-flex-1 t-ml-12">
                Thêm kho mới
              </h3>
              <span
                class="t-flex t-items-center t-justify-center t-text-white t-w-12 t-cursor-pointer btn-close-modal"
                @click="toggleCreatePickAddressModal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.1677 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.95959 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z"
                    fill="white"
                  />
                </svg>
              </span>
            </div>
          </template>
          <div class="t-p-5">
            <div class="t-pb-1.5">
              <g-input
                class="t-flex-1"
                v-model="newPickAddress.payload.fullname"
                inputId="newWhFullname"
                placeholder="Nhập tên người liên hệ"
                :required="true"
                :innerErrorMessage="validate.warehouse_fullname.innerError"
                :outerErrorMessage="validate.warehouse_fullname.outerError"
                @on-blur="validateNewPickAddress"
              />
            </div>
            <div class="t-pb-1.5">
              <g-input
                class="t-flex-1"
                :borderless="true"
                v-model="newPickAddress.payload.tel"
                :required="true"
                inputId="newWhTel"
                :innerErrorMessage="validate.warehouse_tel.innerError"
                :outerErrorMessage="validate.warehouse_tel.outerError"
                :number-only="true"
                placeholder="Nhập số điện thoại người liên hệ"
                @on-blur="validateNewPickAddress"
                @keydown.space="(event) => event.preventDefault()"
              ></g-input>
            </div>

            <div class="t-pt-2 t-w-full">
              <div class="t-pb-5">
                <a-col :span="24" class="t-w-full">
                  <warehouse-info
                    :key="pickAddresses.length"
                    @update:address="setNewAddress"
                  />
                </a-col>
              </div>
            </div>

            <button
              :disabled="loading"
              class="t-font-medium t-w-full t-text-white t-h-10 t-text-base t-leading-5 btnAddNewWarehouse"
              @click="addNewPickAddress"
            >
              Thêm kho mới
            </button>
          </div>
        </a-modal>
        <a-modal
          :visible="confirmSetLocation"
          :footer="null"
          :closable="false"
          :centered="true"
          :width="378"
          class="confirmSubmitOrderModal"
          @cancel="confirmSetLocation = false"
        >
          <template v-slot:title>
            <div class="t-flex t-flex-row t-items-center t-w-full">
              <h3 class="t-text-center t-text-white t-mb-0 t-flex-1 t-ml-12">
                Cập nhật tọa độ
              </h3>
              <span
                class="t-flex t-items-center t-justify-center t-text-white t-w-12 t-cursor-pointer btn-close-modal"
                @click="onCancelConfirmSetLocation"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.1677 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.95959 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z"
                    fill="white"
                  />
                </svg>
              </span>
            </div>
          </template>
          <div class="t-p-4 t-pb-0 text-modal">
            Vui lòng cho phép GHTK truy cập vị trí của bạn để lấy hàng nhanh
            nhất!
          </div>
          <div
            class="button t-flex t-items-center t-justify-between t-w-full t-p-4 t-pt-0 t-space-x-2"
          >
            <button
              class="footer_button_add t-font-medium"
              @click="onCancelConfirmSetLocation"
            >
              <p>Không cho phép</p>
            </button>

            <button class="footer_button_save t-font-medium">
              <p>Cho phép</p>
            </button>
          </div>
        </a-modal>
        <a-modal
          :visible="showModalConfirmDeletePickAddress"
          :footer="null"
          :closable="false"
          :centered="true"
          :width="400"
          class="confirmSubmitOrderModal"
          @cancel="confirmSetLocation = false"
        >
          <template v-slot:title>
            <div class="t-flex t-flex-row t-items-center t-w-full">
              <h3 class="t-text-center t-text-white t-mb-0 t-flex-1 t-ml-12">
                Xoá địa chỉ lấy hàng?
              </h3>
              <span
                class="t-flex t-items-center t-justify-center t-text-white t-w-12 t-cursor-pointer btn-close-modal"
                @click="toggleConfirmRemovePickAddressModal"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 20 20"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M11.8323 10.0001L19.6199 2.21215C20.1267 1.70557 20.1267 0.88651 19.6199 0.379933C19.1133 -0.126644 18.2943 -0.126644 17.7877 0.379933L9.99988 8.16793L2.21228 0.379933C1.70548 -0.126644 0.886669 -0.126644 0.380103 0.379933C-0.126701 0.88651 -0.126701 1.70557 0.380103 2.21215L8.1677 10.0001L0.380103 17.7881C-0.126701 18.2947 -0.126701 19.1138 0.380103 19.6204C0.632555 19.8731 0.964493 20 1.29619 20C1.62789 20 1.95959 19.8731 2.21228 19.6204L9.99988 11.8324L17.7877 19.6204C18.0404 19.8731 18.3721 20 18.7038 20C19.0355 20 19.3672 19.8731 19.6199 19.6204C20.1267 19.1138 20.1267 18.2947 19.6199 17.7881L11.8323 10.0001Z"
                    fill="white"
                  />
                </svg>
              </span>
            </div>
          </template>
          <div class="t-p-4 text-modal t-text-center">
            <p class="t-text-xl">Bạn có chắc muốn xoá địa chỉ lấy hàng?</p>
            <p class="t-font-bold t-text-xl">
              {{ this.current_first_address }}
            </p>
          </div>
          <div
            class="button t-flex t-items-center t-justify-between t-w-full t-p-5 t-space-x-2 btnDeleteWarehouse t-pt-0"
          >
            <button
              class="footer_button_add t-font-medium"
              @click="toggleConfirmRemovePickAddressModal"
            >
              <p>Không</p>
            </button>

            <button
              class="footer_button_save t-font-medium"
              @click="confirmDeletePickAddress"
            >
              <p>Xác nhận</p>
            </button>
          </div>
        </a-modal>

        <confirm-exit-modal
          :visible="visibleModal.confirmExit"
          :setVisible="setVisibleModal('confirmExit')"
          :onSubmit="handleExit"
        />
      </div>
    </template>
    <template #footer>
      <div class="button t-flex t-items-center t-justify-between t-w-full">
        <button
          class="footer_button_add t-font-medium"
          @click="toggleCreatePickAddressModal"
        >
          <p>Thêm kho mới</p>
        </button>
        <button
          @click="saveChange"
          :class="
            !loading
              ? 'footer_button_save t-font-medium'
              : 'footer_button_save t-font-medium t-cursor-not-allowed'
          "
          :disabled="loading"
        >
          <p>Lưu thay đổi</p>
        </button>
      </div>
    </template>
  </main-content>
</template>

<script>
import MainContent from "./main-content.vue";
import { GInput } from "@/components";
import { mapState } from "vuex";
import { get, replace, size, startsWith, trim } from "lodash";
import WarehouseInfo from "@/pages/shop-info/WarehouseInfo";
import pickAddressService from "@/services/pickAddress.service";
import { message } from "ant-design-vue";
import common from "@/utils/common";
import GSelect from "@/components/common/GSelect";
import services from "@/services";
import ConfirmExitModal from "@/pages/shop-info/confirm-exit-modal";
import { ROLES } from "@/contants";

export default {
  components: {
    ConfirmExitModal,
    GSelect,
    WarehouseInfo,
    MainContent,
    GInput,
    // UnSelectLocationIcon,
  },

  data() {
    return {
      loading: false,
      innerError: "",
      showAllItem: false,
      currentPickAddress: {},
      current_first_address: "",
      //Danh sách địa chỉ lấy
      pickAddresses: [],

      // Modal
      showModalCreatePickAddress: false,
      confirmSetLocation: false,
      showModalConfirmDeletePickAddress: false,
      checkSaveChange: true,
      validate: {
        selectedAddressPicker: "",
        warehouse_tel: {
          innerError: "",
          outerError: "",
        },
        warehouse_fullname: {
          innerError: "",
          outerError: "",
        },
        warehouse_address: {
          innerError: "",
          outerError: "",
        },
      },
      newPickAddress: {
        labelEx: "",
        payload: {
          fullname: "",
          tel: "",
          province_id: null,
          district_id: null,
          ward_id: null,
          street_id: null,
          hamlet_id: null,
        },
        selectedPickAddressCod: {
          selectedProvince: {},
          selectedDistrict: {},
          selectedWard: {},
          selectedHamlet: {},
        },
      },

      visibleModal: {
        confirmExit: false,
      },
      isChanged: false,

      allowExit: false,
      changeRouteTo: "",

      isConfigChanged: false,
      return_package: {
        //config hoàn hàng
        auto_store_package: {
          //auto lưu kho chờ shop check
          is_selected: 0,
          day: 0,
          selected_day: {
            value: "",
            label: "",
          },
        },
        not_auto_store_return_immediately: 0, // không lưu kho, trả ngay
        not_receive_return_package: 0, // không nhận hàng trả
      },
      selectedDay: {
        value: "",
        label: "",
      },
    };
  },

  mounted() {
    // @todo : tối ưu chỗ này, hiện tại đang call api get list mỗi lần vào trang để tránh lỗi k hiển thị được khi update địa chỉ lấy
    this.getWarehouseList();
    this.getShopConfig();
  },

  computed: {
    ...mapState({
      allPickAddressList: (state) => state.shop.allPickAddressList,
      daysReturnDataSource: (state) => state.global.daysReturnDataSource,
      shopStaff: (state) => state.shop?.ShopStaff,
    }),
    notChange() {
      return true;
    },
    isAdmin() {
      return this.shopStaff?.role === ROLES.ADMIN;
    },
  },
  methods: {
    changeReturnOption(option) {
      this.isChanged = true;
      this.return_package.auto_store_package.is_selected = 0;
      this.return_package.not_auto_store_return_immediately = 0;
      this.return_package.not_receive_return_package = 0;
      if (option === "auto_store_package") {
        this.return_package.auto_store_package.is_selected = 1;
      } else {
        this.return_package[option] = 1;
      }
      this.isConfigChanged = true;
    },
    async getShopConfig() {
      try {
        const response = await services.$shop.getShopConfig();
        if (response.success) {
          this.return_package = response.data.policy.return_package;
          this.return_package.auto_store_package.selected_day = {
            label: this.return_package.auto_store_package.day,
            value: this.return_package.auto_store_package.day,
          };
          this.$store.commit(
            "shop/setReturnPackageConfig",
            response.data.policy.return_package
          );
        }
      } catch (error) {
        console.log(error);
      }
    },
    handleChange(value) {
      this.return_package.auto_store_package.selected_day = value;
      this.return_package.auto_store_package.day = value.value;
    },
    async getWarehouseList() {
      try {
        this.loading = true;
        const response = await pickAddressService.getPickAddresses();
        this.loading = false;
        if (response.data.success) {
          let pickAddressData = this.formatPickAddressData(response.data.data);
          this.$store.commit("shop/setFullPickAddressList", pickAddressData);
          this.pickAddresses = pickAddressData;
          for (let i = 0; i < this.pickAddresses.length; i++) {
            this.pickAddresses[i].validateUpdate = {
              warehouse_tel_err: "",
              warehouse_fullname_err: "",
            };
          }
        }
      } catch (error) {
        console.log(error);
      }
    },
    formatPickAddressData(pickAddressData) {
      let formatedPickAddressData = common.convertLabelValueDataSource({
        dataSource: pickAddressData,
        labelName: "fullname",
        valueName: "id",
        labelConvert: (item) => {
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
      });
      for (let i = 0; i < pickAddressData.length; i++) {
        let selectedWard = formatedPickAddressData[i].payload.ward
          ? {
              label: formatedPickAddressData[i].payload.ward,
              value: formatedPickAddressData[i].payload.ward_id,
            }
          : {
              label: formatedPickAddressData[i].payload.street,
              value: formatedPickAddressData[i].payload.street_id,
            };
        formatedPickAddressData[i].selectedItem = {
          selectedDistrict: {
            label: formatedPickAddressData[i].payload.district,
            value: formatedPickAddressData[i].payload.district_id,
          },
          selectedHamlet: {
            label: formatedPickAddressData[i].payload.hamlet,
            value: formatedPickAddressData[i].payload.hamlet_id,
          },
          selectedProvince: {
            label: formatedPickAddressData[i].payload.province,
            value: formatedPickAddressData[i].payload.province_id,
          },
          selectedWard: selectedWard,
        };
      }
      return formatedPickAddressData;
    },
    validateNewPickAddress() {
      let isValid = true;
      // Validate customer_tel
      this.validate.warehouse_tel.innerError = "";
      this.validate.warehouse_tel.outerError = "";
      if (!this.newPickAddress.payload.tel) {
        this.validate.warehouse_tel.innerError = "Số điện thoại không hợp lệ";
        isValid = false;
      } else {
        let tel = this.newPickAddress.payload.tel;
        if (startsWith(tel, "+84")) {
          tel = replace(tel, "+84", 0);
        } else if (startsWith(tel, "84")) {
          tel = replace(tel, "84", 0);
        }
        let isValidateTel_10 = /^\d{10}$/.test(tel);
        let isValidateTel_11 = /^\d{11}$/.test(tel);
        if (
          (isValidateTel_10 && startsWith(tel, "0")) ||
          (isValidateTel_11 && startsWith(tel, "02"))
        ) {
          isValid = true;
        } else {
          this.validate.warehouse_tel.outerError = "Số điện thoại không hợp lệ";
          isValid = false;
        }
      }
      // Validate customer_fullname
      this.validate.warehouse_fullname.innerError = "";
      this.validate.warehouse_fullname.outerError = "";
      if (size(trim(this.newPickAddress.payload.fullname)) === 0) {
        this.validate.warehouse_fullname.innerError =
          "Tên người liên hệ không hợp lệ";
        isValid = false;
      }
      this.validate.warehouse_address.innerError = "";
      if (size(trim(this.newPickAddress.labelEx)) === 0) {
        this.validate.warehouse_address.innerError = "Địa chỉ lấy không hợp lệ";
        isValid = false;
      }
      return isValid;
    },

    async confirmDeletePickAddress() {
      this.showModalConfirmDeletePickAddress = false;
      try {
        this.loading = true;
        const response = await pickAddressService.removePickAddress(
          JSON.stringify({
            pick_address_id: this.currentPickAddress.value,
          })
        );
        this.loading = false;
        if (response.data.success) {
          message.success(response.data.message);
          this.$store.commit(
            "shop/removePickAddress",
            this.currentPickAddress.value
          );
          this.pickAddresses = this.allPickAddressList;
          this.currentPickAddress = {};
        } else {
          message.error(
            response.data.message || "Đã có lỗi xảy ra vui lòng thử lại sau."
          );
        }
      } catch (error) {
        message.error("Đã có lỗi xảy ra vui lòng thử lại sau.");
      }
    },
    async addNewPickAddress() {
      let isValid = this.validateNewPickAddress();
      if (!isValid) {
        message.error("Vui lòng nhập đầy đủ các thông tin để tạo kho mới!");
      } else {
        try {
          this.loading = true;
          let payload = {
            fullname: this.newPickAddress.payload.fullname,
            tel: this.newPickAddress.payload.tel,
            first_address: this.newPickAddress.labelEx,
            province_id: this.newPickAddress.payload.province_id,
            district_id: this.newPickAddress.payload.district_id,
            ward_id: this.newPickAddress.payload.ward_id,
            hamlet_id: this.newPickAddress.payload.hamlet_id,
          };
          if (this.newPickAddress.payload.street_id) {
            payload.street_id = this.newPickAddress.payload.street_id;
          }
          const response = await pickAddressService.creatNewPickAddress(
            JSON.stringify(payload)
          );
          this.loading = false;
          if (response.data.success) {
            this.toggleCreatePickAddressModal();
            message.success(response.data.message);
            let pickAddressFormatted = this.formatPickAddressData([
              response.data.data,
            ]);
            pickAddressFormatted[0].validateUpdate = {
              warehouse_tel_err: "",
              warehouse_fullname_err: "",
            };
            this.$store.commit("shop/addPickAddress", pickAddressFormatted[0]);
            this.pickAddresses = this.allPickAddressList;
            this.resetNewPickAddress();
            payload = {};
          } else {
            message.error(response.data.message);
          }
        } catch (error) {
          this.toggleCreatePickAddressModal();
          this.loading = false;
          message.error("Đã có lỗi xảy ra vui lòng thử lại sau.");
        }
      }
    },

    setNewAddress(data) {
      this.newPickAddress.payload.province_id = data.selectedProvince.value;
      this.newPickAddress.payload.district_id = data.selectedDistrict.value;
      this.newPickAddress.payload.ward_id = data.selectedWard.value;
      this.newPickAddress.payload.street_id = data.selectedWard.value;
      this.newPickAddress.payload.hamlet_id = data.selectedHamlet.value;
      this.newPickAddress.labelEx = data.warehouse_address;
      this.newPickAddress.validateUpdate = {
        warehouse_fullname_err: "",
        warehouse_tel_err: "",
      };
    },

    updateDetailForPickAddress(pickAddress, data) {
      if (
        pickAddress.payload.province_id !== data.selectedProvince.value ||
        pickAddress.payload.district_id !== data.selectedDistrict.value ||
        pickAddress.payload.ward_id !== data.selectedWard.value ||
        pickAddress.payload.hamlet_id !== data.selectedHamlet.value ||
        pickAddress.labelEx !== data.warehouse_address
      ) {
        pickAddress.isChanged = true;
      }
      pickAddress.payload.province_id = data.selectedProvince.value;
      pickAddress.payload.district_id = data.selectedDistrict.value;
      pickAddress.payload.ward_id = data.selectedWard.value;
      pickAddress.payload.street_id = data.selectedWard.value;
      pickAddress.payload.hamlet_id = data.selectedHamlet.value;
      pickAddress.labelEx = data.warehouse_address;
    },
    checkSaveUpdate() {
      for (let i = 0; i < this.pickAddresses.length; i++) {
        if (
          this.pickAddresses[i].validateUpdate.warehouse_tel_err === "" ||
          this.pickAddresses[i].validateUpdate.warehouse_fullname_err === ""
        ) {
          this.checkSaveChange = true;
        } else {
          this.checkSaveChange = false;
        }
      }
      return this.checkSaveChange;
    },

    setPickAddressChangedStatus(pickAddress) {
      pickAddress.isChanged = true;
      let isValid = true;
      // Validate customer_tel
      if (!pickAddress.payload.tel) {
        pickAddress.validateUpdate.warehouse_tel_err =
          "Số điện thoại không hợp lệ";
        isValid = false;
      } else {
        let tel = pickAddress.payload.tel;
        if (startsWith(tel, "+84")) {
          tel = replace(tel, "+84", 0);
        } else if (startsWith(tel, "84")) {
          tel = replace(tel, "84", 0);
        }
        let isValidateTel_10 = /^\d{10}$/.test(tel);
        let isValidateTel_11 = /^\d{11}$/.test(tel);
        if (isValidateTel_10 || (isValidateTel_11 && startsWith(tel, "02"))) {
          pickAddress.validateUpdate.warehouse_tel_err = "";
          isValid = true;
        } else {
          pickAddress.validateUpdate.warehouse_tel_err = "SĐT sai";
          isValid = false;
        }
      }
      // Validate customer_fullname
      if (size(trim(pickAddress.payload.fullname)) === 0) {
        pickAddress.validateUpdate.warehouse_fullname_err =
          "Tên người liên hệ không hợp lệ";
        isValid = false;
      } else {
        pickAddress.validateUpdate.warehouse_fullname_err = "";
        isValid = true;
      }
      return isValid;
    },

    clickShowAllItem() {
      this.showAllItem = true;
    },
    openConfirmDeleteWarehouse(pickAddress) {
      this.showModalConfirmDeletePickAddress = true;
      this.currentPickAddress = pickAddress;
      this.current_first_address = pickAddress.payload.first_address;
    },

    toggleConfirmRemovePickAddressModal() {
      this.showModalConfirmDeletePickAddress =
        !this.showModalConfirmDeletePickAddress;
    },
    toggleCreatePickAddressModal() {
      this.showModalCreatePickAddress = !this.showModalCreatePickAddress;
    },
    onCancelConfirmSetLocation() {
      this.confirmSetLocation = false;
    },

    async saveChange() {
      let totalCheck = true;
      for (let i = 0; i < this.pickAddresses.length; i++) {
        if (
          this.pickAddresses[i].validateUpdate.warehouse_tel_err === "" &&
          this.pickAddresses[i].validateUpdate.warehouse_fullname_err === ""
        ) {
          this.checkSaveChange = true;
        } else {
          this.checkSaveChange = false;
          totalCheck = false;
        }
      }
      if (!totalCheck) {
        message.error("Thông tin không hợp lệ!");
      } else {
        this.loading = true;
        let arrayPromise = [];
        for (const address of this.pickAddresses) {
          let isAddressChanged = get(address, "isChanged", false);
          if (isAddressChanged) {
            arrayPromise.push(this.handleUpdatePickAddress(address));
          }
        }

        await Promise.all(arrayPromise);
        this.resetUpdateStatusPickAddress();
        if (this.isConfigChanged) {
          await this.saveConfig();
        }
        this.loading = false;
      }
    },

    async saveConfig() {
      this.isConfigChanged = false;
      try {
        let params = {
          policy: {
            return_package: this.return_package,
          },
        };
        const response = await services.$shop.setShopConfig(params);
        if (response.success) {
          message.success(response.message);
        } else {
          message.error(response.message);
        }
      } catch (error) {
        message.error("Không lưu được thay đổi, vui lòng thử lại sau");
        console.log(error);
      }
    },

    async handleUpdatePickAddress(pickAddress) {
      try {
        const response = await pickAddressService.updatePickAddress(
          pickAddress.value,
          JSON.stringify({
            fullname: pickAddress.payload.fullname,
            tel: pickAddress.payload.tel,
            first_address: pickAddress.labelEx,
            province_id: pickAddress.payload.province_id,
            district_id: pickAddress.payload.district_id,
            ward_id: pickAddress.payload.ward_id,
            street_id: pickAddress.payload.street_id,
            hamlet_id: pickAddress.payload.hamlet_id,
            pick_address_id: pickAddress.value,
          })
        );
        if (response.data.success) {
          message.success(response.data.message);
        } else {
          message.error(response.data.message);
        }
      } catch (error) {
        console.log(error);
      }
    },

    resetUpdateStatusPickAddress() {
      for (let address of this.pickAddresses) {
        address.isChanged = false;
      }
    },

    resetNewPickAddress() {
      this.newPickAddress = {
        labelEx: "",
        payload: {
          fullname: "",
          tel: "",
          province_id: null,
          district_id: null,
          ward_id: null,
          street_id: null,
          hamlet_id: null,
        },
        selectedPickAddressCod: {
          selectedProvince: {},
          selectedDistrict: {},
          selectedWard: {},
          selectedHamlet: {},
        },
      };
    },

    setVisibleModal(modalName) {
      const _this = this;
      return (value) => {
        _this.visibleModal[modalName] = value;
      };
    },

    handleExit() {
      this.allowExit = true;
      this.visibleModal.confirmExit = false;
      this.$router.push(this.changeRouteTo);
    },

    updateChangeStatus() {
      this.isChanged = true;
    },
  },
  watch: {
    "return_package.auto_store_package.day": function () {
      this.isChanged = true;
    },
  },
  beforeRouteLeave(to, from, next) {
    let isPickAddressChanged = false;
    for (let i = 0; i < this.pickAddresses.length; i++) {
      if (this.pickAddresses[i].isChanged) {
        isPickAddressChanged = true;
        break;
      }
    }
    let isDataChanged = isPickAddressChanged || this.isConfigChanged;

    if (this.allowExit || !isDataChanged) {
      next();
    } else {
      this.allowExit = false;
      this.changeRouteTo = to.path;
      this.visibleModal.confirmExit = true;
    }
  },
};
</script>

<style lang="scss" scoped>
.warehouse {
  padding: 0 0 16px 0;
  align-items: flex-start;
  &.has-policy {
    box-shadow: inset 0px -1px 0px #e0e0e0;
  }
  &_info {
    .display_warehouse_item {
      border-bottom: 1px solid var(--grayColor);
    }
    &_top {
      .info_top_left {
        font-size: 16px;
        line-height: 20px;
      }
      .info_top_right {
        font-size: 14px;
        line-height: 18px;
      }
    }
    .setLocation {
      margin-left: -50px;
      padding-top: 5px;
    }
    &_mid {
      font-size: 16px;
      line-height: 20px;
    }
  }
  &_show {
    color: var(--primaryColor);
  }
  &_policy {
    &_tittle {
      font-size: 18px;
      line-height: 22px;
    }
    &_item {
      display: grid;
      grid-template-columns: 5% 1fr;
      .warehouse_policy_check {
        [type="radio"]:checked,
        [type="radio"]:not(:checked) {
          position: absolute;
          left: -9999px;
        }
        [type="radio"]:checked + label,
        [type="radio"]:not(:checked) + label {
          position: relative;
          padding-left: 28px;
          cursor: pointer;
          line-height: 20px;
          display: inline-block;
          color: #666;
        }
        [type="radio"]:checked + label:before,
        [type="radio"]:not(:checked) + label:before {
          content: "";
          position: absolute;
          left: 0;
          top: 0;
          width: 24px;
          height: 24px;
          border: 2px solid var(--primaryColor);
          border-radius: 100%;
          background: #ffffff;
        }
        [type="radio"]:checked + label:after,
        [type="radio"]:not(:checked) + label:after {
          color: #fff;
          content: "";
          background: url("../../assets/images/check.svg") no-repeat center;
          font-size: 25px;
          position: absolute;
          left: 0;
          top: 0;
          width: 24px;
          height: 24px;
          border: 1.5px solid var(--primaryColor);
          border-radius: 100%;
          background-color: #069255;
          -webkit-transition: all 0.2s ease;
          transition: all 0.2s ease;
        }
        [type="radio"]:not(:checked) + label:after {
          opacity: 0;
          -webkit-transform: scale(0);
          transform: scale(0);
        }
        [type="radio"]:checked + label:after {
          opacity: 1;
          -webkit-transform: scale(1);
          transform: scale(1);
        }
      }
      .warehouse_policy_content {
        padding-top: 18px;
        .policy_content_title {
          font-size: 16px;
          line-height: 20px;
          padding-bottom: 10px;
        }
        .policy_content_script {
          font-size: 14px;
          line-height: 18px;
          color: #808080;
          &_item {
            padding-bottom: 4px;
            p {
              margin: 0;
            }
            p::before {
              content: "• ";
              font-size: 18px;
            }
          }
        }
      }
    }
  }
}
.footer_button_add {
  background-color: #ffffff;
  border: 1.5px solid var(--primaryColor);
  height: 40px;
  width: 154px;
  border-radius: 5px;
  padding: 10px 18px;
  p {
    font-size: 16px;
    line-height: 20px;
    color: var(--primaryColor);
  }
}

.footer_button_save {
  background-color: #00904a;
  border: 1.5px solid #00904a;
  height: 40px;
  width: 154px;
  border-radius: 5px;
  padding: 10px 18px;
  p {
    font-size: 16px;
    line-height: 20px;
    color: #fff;
  }
}
.overlay {
  position: absolute;
  display: flex;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.5);
  justify-content: space-around;
  height: calc((100% - 75px) - 24px);
  width: calc(100% - 30px);
  z-index: 1;
}
.btn-close-modal {
  flex: 0 1 50px;
}
.text-modal {
  font-size: 16px;
  line-height: 30px;
}
.btnAddNewWarehouse {
  background-color: var(--primaryColor);
}
.btnDeleteWarehouse {
  margin-top: -20px;
}
</style>

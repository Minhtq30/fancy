<template>
  <div class="order-table-wrapper">
    <table class="w-100 g-table">
      <thead>
        <tr>
          <th class="medium-text">Đơn hàng</th>
          <th class="medium-text">Khách hàng</th>
          <!-- <th class="product-col medium-text">Sản phẩm</th> -->
          <th class="medium-text">Cập nhật</th>
          <th class="action-col medium-text">
            <g-checkbox
              :disabled="!orders.length"
              :checked="isSelectedAll"
              @change="handleChangeCheckedAll"
            >
              Chọn tất cả
            </g-checkbox>
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="order in orders" :key="order.id">
          <td>
            <span class="medium-text">
              {{ order.alias }}
            </span>
            <package-label :order="order" />
            <p v-if="order.client_id">Mã KH riêng: {{ order.client_id }}</p>
            <p>Trạng thái: {{ order.package_status_id_text }}</p>
            <p
              v-if="
                Number(order.package_status_id) === 4 &&
                order.tmp_delivering_status
              "
              class="red-notice"
            >
              COD báo
              {{ TMP_DELIVERY_STATUS_TEXT[order.tmp_delivering_status] }}
            </p>
            <div
              v-if="
                detailById[order.id]?.is_loading_get_detail ||
                detailById[order.id]?.product?.length
              "
            >
              <span class="medium-text">Sản phẩm</span>
              <div v-if="detailById[order.id]?.is_loading_get_detail">
                <div class="t-my-2">
                  <g-skeleton-text :active="true" :width="'50%'" />
                  <g-skeleton-text
                    class="no-margin"
                    :active="true"
                    :width="'50%'"
                  />
                </div>
              </div>
              <div v-else>
                <p
                  v-for="(product, index) in detailById[order.id].product"
                  :key="product.id"
                >
                  {{ index + 1 }}. {{ product.product_name }} | SL:
                  {{ product.quantity }}
                </p>
              </div>
            </div>
            <p>Tiền CoD: <format-price :value="order.pick_money" /> đ</p>
            <!-- <p>Giá trị hàng: <format-price :value="order.value" /> đ</p>
            <div
              v-if="detailById[order.id]?.is_loading_get_detail"
              class="flex align-items-center"
            >
              Tiền ship:
              <g-skeleton-text
                class="no-margin ml"
                :active="true"
                :width="'60px'"
              />
            </div>
            <div
              v-else-if="Number(detailById[order.id]?.ship_fee_only)"
              class="flex align-items-center"
            >
              Tiền ship:
              <div style="padding: 0 4px">
                <format-price :value="detailById[order.id].ship_fee_only" />
              </div>
              {{ " đ" }}
            </div>
            <p v-if="Number(order.prepayment)" class="red-notice">
              Tổng tiền cấn trừ: <format-price :value="order.prepayment" /> đ
            </p>
            <p v-if="Number(order.insurance)">
              Phí bảo hiểm: <format-price :value="order.insurance" /> đ
            </p>
            <p v-if="Number(order.discount_amount)">
              Khuyến mãi:
              <format-price :value="Math.abs(order.discount_amount)" /> đ
            </p>
            <p v-if="Number(order.re_delivery_fee)">
              Phí giao lại: <format-price :value="order.re_delivery_fee" /> đ
            </p>
            <p v-if="Number(getFragileFee(order))">
              Phụ phí hàng dễ vỡ: 
              <format-price :value="Number(getFragileFee(order))" /> đ
            </p>
            <p v-if="Number(order.return_fee)">
              Phí trả hàng:
              <format-price :value="Number(order.return_fee)" /> đ
            </p>
            <div
              v-if="detailById[order.id]?.is_loading_get_detail"
              class="flex align-items-center"
            >
              Phí DV cuối cùng:
              <g-skeleton-text
                class="no-margin ml"
                :active="true"
                :width="'60px'"
              />
            </div>
            <div
              v-else-if="Number(detailById[order.id]?.final_ship_fee)"
              class="flex align-items-center"
            >
              Phí DV cuối cùng:
              <div style="padding: 0 4px">
                <format-price :value="detailById[order.id].final_ship_fee" />
              </div>
              {{ " đ" }}
            </div>
            <p v-if="order.used_coupon_message" class="red-notice">
              {{ order.used_coupon_message }}
            </p>
            <p v-if="Number(order.pre_paid_amount)">
              Shop trả trước: <format-price :value="order.pre_paid_amount" /> đ
            </p>
            <template v-if="order.total_prepayment">
              <p style="color: #ff0d1b">
                Đã thanh toán cấn trừ:
                <format-price :value="order.total_prepayment" /> đ
              </p>
            </template>
            <p>
              {{
                order.is_freeship === "1"
                  ? "Shop trả tiền ship"
                  : "Khách trả tiền ship"
              }}
            </p> -->
            <!-- <p
              v-if="
                [9, 10].includes(Number(order.package_status_id)) &&
                getCountdownTimeRTDealy(order)
              "
              class="red-notice"
            >
              Còn {{ getCountdownTimeRTDealy(order) }} để xác nhận trước khi ĐH
              bị tính phí lưu kho
            </p> -->
            <!-- <p v-if="order.rt_delay && Number(order.rt_delay)">
              Thời gian lưu kho: {{ order.rt_delay || 0 }} ngày
            </p> -->
            <div class="split" />
            <p>
              Kho lấy hàng: {{ order.pick_fullname }}/
              <hidden-content :text="order.pick_tel" :first="3" :last="4" />
            </p>
            <p>{{ order.pick_first_address }}, {{ order.pick_last_address }}</p>
          </td>
          <td>
            <p>
              {{ order.customer_fullname }} /
              <hidden-content :text="order.customer_tel" :first="3" :last="4" />
            </p>
            <p>
              <hidden-content
                :text="order.customer_first_address"
                :first="1"
                :last="1"
              />,
              {{ order.customer_last_address }}
            </p>
            <span v-if="order.date_to_delay_deliver">
              Hẹn giao: {{ formatPredictionDelivery(order) }}
            </span>
            <g-skeleton-image
              v-if="detailById[order.id]?.is_loading_get_detail"
              class="mt skeleton-tracking-image"
              :active="true"
            />
            <div v-else>
              <template
                v-if="
                  detailById[order.id]?.current_station_route
                    ?.ghtk_map_image_url
                "
              >
                <div class="split" />
                <div
                  class="static-map-wrapper"
                  @click="openExpandStaticMapModal(order)"
                >
                  <image-preload
                    class="static-map"
                    :src="
                      detailById[order.id]?.current_station_route
                        ?.ghtk_map_image_url
                    "
                  />
                  <img
                    class="expand-icon"
                    src="@/assets/icons/expand_image.svg"
                  />
                </div>
              </template>
            </div>
          </td>
          <!-- <td>
            <div v-if="detailById[order.id]?.product">
              <p
                v-for="(product, index) in detailById[order.id].product"
                :key="product.id"
              >
                {{ index + 1 }}. {{ product.product_name }} <br />
                SL: {{ product.quantity }}
                <span v-if="product.weight">| KL: {{ product.weight }} kg</span>
              </p>
              <div class="split" />
            </div>
            <span>Tổng KL: {{ order.weight || 0 }} kg</span>
          </td> -->
          <td>
            <div
              v-if="
                detailById[order.id]?.message ||
                getPrintLog(detailById[order.id]?.PrintLog)
              "
            >
              <span>Ghi chú</span>
              <p
                v-if="detailById[order.id]?.message"
                v-html="detailById[order.id].message"
              />
              <p
                v-if="getPrintLog(detailById[order.id]?.PrintLog)"
                v-html="getPrintLog(detailById[order.id]?.PrintLog)"
              />
              <div class="split" />
            </div>
            <template v-if="deliveryMessages(order).length">
              <span>Lịch sử giao hàng</span>
              <g-timeline style="padding-top: 8px" :type="'normal'">
                <a-timeline-item
                  v-for="(deliveryMessage, index) in deliveryMessages(order)"
                  :key="`delivery_message_${order.order}_${index}`"
                >
                  {{ deliveryMessage }}
                </a-timeline-item>
              </g-timeline>
              <div class="split" />
            </template>
            <div class="mt-1">
              <package-logs
                :packageDetail="detailById[order.id] || {}"
                :isLoading="detailById[order.id]?.is_loading_get_detail"
                :max="5"
              />
            </div>
            <!-- <template v-else> -->
            <!-- <a-timeline
                class="g-timeline order-timeline"
                style="padding-top: 8px"
              >
                <a-timeline-item v-for="logNote in logNotes" :key="logNote.key">
                  <b class="medium-text">{{ logNote.text }}</b>
                  <template
                    v-if="
                      detailById[order.id] && detailById[order.id][logNote.key]
                    "
                  >
                    <br />
                    <div
                      v-for="(log, index) of detailById[order.id][logNote.key]"
                      :key="index"
                    >
                      {{ formatTimelineCreated(log.created) }}:
                      <span v-html="log.desc" />
                      <div v-if="logImageSrc(log)">
                        <img class="log-image" :src="logImageSrc(log)" />
                      </div>
                    </div>
                  </template>
                </a-timeline-item>
              </a-timeline> -->
            <!-- <template v-if="callLogs(detailById[order.id]).length">
                <div class="split" />
                <span>Log cuộc gọi</span>
                <a-timeline
                  class="g-timeline order-timeline"
                  style="padding-top: 8px"
                >
                  <a-timeline-item
                    v-for="log in callLogs(detailById[order.id])"
                    :key="log.id"
                  >
                    <template v-if="formatDesCallLog(log.desc)">
                      <span>{{ formatDesCallLog(log.desc)[0] }}</span>
                      <hidden-content
                        :text="formatDesCallLog(log.desc)[1]"
                        :first="3"
                        :last="4"
                      />
                      <span>{{ formatDesCallLog(log.desc)[2] }}</span>
                    </template>
                    <span v-else>{{ log.desc }}</span>
                  </a-timeline-item>
                </a-timeline>
              </template> -->
            <!-- </template> -->
          </td>
          <td>
            <g-button
              @click="
                setSelectedOrder(order);
                openModalPackageDetail();
              "
              class="rounded w-100 mb medium-text"
            >
              Chi tiết ĐH
            </g-button>
            <g-button
              class="rounded w-100 mb medium-text"
              @click="handlePrintOrder([order.id])"
            >
              In đơn hàng
            </g-button>
            <g-button
              @click="openRequestChat(order.order)"
              class="rounded w-100 mb medium-text"
            >
              Chats yêu cầu
            </g-button>
            <g-checkbox
              :checked="selectedOrderIds.includes(order.id)"
              @change="handleToogleOrder(order)"
            >
              <span class="primary-text medium-text">
                {{
                  selectedOrderIds.includes(order.id) ? "Bỏ chọn ĐH" : "Chọn ĐH"
                }}
              </span>
            </g-checkbox>
          </td>
        </tr>
        <tr v-if="orders.length === 0 && !loading">
          <td colspan="5">
            <a-empty :description="'Danh sách trống'" />
          </td>
        </tr>
      </tbody>
    </table>
    <div
      v-if="totalPages"
      class="pagination-wrapper flex align-items-center justify-content-space-between"
      :class="{ 'not-sticky': isNotSticky }"
    >
      <div>
        <span class="description-limit">Số lượng bản ghi/trang</span>
        <g-select
          class="page-limit"
          :disabled="loading"
          :value="limit.toString()"
          :default-active-first-option="false"
          @change="onChangeLimit"
        >
          <a-select-option value="25">25</a-select-option>
          <a-select-option value="50">50</a-select-option>
          <a-select-option value="100">100</a-select-option>
        </g-select>
        Trang {{ page }}/{{ totalPages }}
        <g-button
          :disabled="loading || page === 1"
          class="ml btn-prev-page"
          @click="changePage(page - 1)"
        >
          <span>Trang trước</span>
        </g-button>
        <g-button
          :disabled="loading || page === totalPages"
          class="ml btn-next-page"
          @click="changePage(page + 1)"
        >
          <span>Trang sau</span>
        </g-button>
      </div>
      <div class="actions-wrapper">
        <g-multiselect v-if="requestOptions?.length">
          <template #contentDropdown>
            <g-button
              id="btn-send-request-order"
              class="primary mr"
              :class="{ disabled: selectedOrderIds.length === 0 }"
            >
              <div>
                <span class="text-lg">Chats yêu cầu</span>
                <span class="text-sm">Chats Y.C</span>
                {{
                  selectedOrderIds.length
                    ? ` ${selectedOrderIds.length} ĐH`
                    : ""
                }}
              </div>
            </g-button>
          </template>
          <template v-if="selectedOrderIds.length" #contentOption>
            <div v-if="requestOptions?.length" class="list-request-wrapper">
              <div
                v-for="requestOpiton of requestOptions"
                :key="requestOpiton.key"
                class="request-item primary-text"
                @click="openSendRequestModal(requestOpiton.key)"
              >
                {{ requestOpiton.label }}
              </div>
            </div>
          </template>
        </g-multiselect>
        <g-button
          :disabled="selectedOrderIds.length === 0"
          class="primary"
          @click="handlePrintSelectedOrders"
        >
          In
          {{ selectedOrderIds.length ? `${selectedOrderIds.length} ĐH` : "" }}
        </g-button>
        <g-multiselect v-if="isAdmin" placement="topRight">
          <template #contentDropdown>
            <g-button id="btn-export-excel" class="primary ml">
              Xuất Excel
              <img
                style="transform: translateY(-1px)"
                class="ml icon-export-order-excel"
                src="@/assets/icons/arrow_up.svg"
              />
            </g-button>
          </template>
          <template #contentOption>
            <div class="list-request-wrapper">
              <div
                class="request-item primary-text"
                @click="setExportExcelForAll(true)"
              >
                Xuất phiếu xuất hàng tổng
              </div>
              <div
                class="request-item primary-text"
                :class="{ 'is-disabled': !selectedOrderIdsExport.length }"
                @click="
                  () => {
                    if (selectedOrderIdsExport.length) {
                      setExportExcelForAll(false);
                    }
                  }
                "
              >
                Xuất Excel {{ selectedOrderIdsExport.length }} ĐH đã chọn
              </div>
            </div>
          </template>
        </g-multiselect>
      </div>
    </div>
    <package-detail-modal
      :visible="visibleModal.packageDetail"
      :setVisible="setVisibleModal('packageDetail')"
      :order="selectedOrder"
      :orderDetail="detailById[selectedOrder?.id] || {}"
    />
    <export-order-modal
      :visible="visibleModal.exportOrder"
      :setVisible="setVisibleModal('exportOrder')"
      :selectedIds="selectedOrderIdsExport"
      :exportExcelForAll="exportExcelForAll"
      :exportFilter="exportFilter"
    />
    <expand-static-map-modal
      :order="{
        ...selectedOrder,
        static_map_url:
          detailById[selectedOrder.id]?.current_station_route
            ?.ghtk_map_image_url,
      }"
      :visible="visibleModal.expandStaticMap"
      :setVisible="setVisibleModal('expandStaticMap')"
    />
    <send-request-order-modal
      :visible="visibleModal.sendRequestOrder"
      :setVisible="setVisibleModal('sendRequestOrder')"
      :type="typeSendRequestOrder"
      :handleSubmit="handleSendRequest"
      :totalSelected="selectedOrderIds.length"
    />
  </div>
</template>

<script>
// Components
import { chunk } from "lodash";
import { v4 as uuidv4 } from "uuid";
import {
  GSelect,
  GButton,
  GCheckbox,
  ImagePreload,
  GTimeline,
} from "@/components/elements";
import { HiddenContent, FormatPrice } from "@/components";
import { GSkeletonImage, GSkeletonText } from "@/components/elements/skeleton";
import ExportOrderModal from "@/components/modal/ExportOrderModal.vue";
import ExpandStaticMapModal from "@/components/modal/ExpandStaticMapModal.vue";
import GMultiselect from "@/components/base/Multiselect";
import PackageLabel from "./PackageLabel.vue";

// Mixins
import eventGChat from "@/plugins/mixins/eventGChat";

// Util
import { TMP_DELIVERY_STATUS_TEXT } from "@/contants/package";
import { CACHE_URL, REDIRECT_URI, ROLES } from "@/contants";
import { REGEX_PHONE_NUMBER } from "@/utils";
import SendRequestOrderModal from "@/components/modal/SendRequestOrderModal.vue";
import PackageDetailModal from "@/components/modal/PackageDetailModal.vue";
import { formatDateTimeRequest, formatMomentDate } from "@/utils/date";
import ticketService from "@/services/ticket.service";
import { objectRequestOptions } from "@/pages/operate/Operate.vue";
import PackageLogs from "./PackageLogs.vue";
import moment from "moment";

const PRINT_URL = `${REDIRECT_URI}/khach-hang/in-don-hang`;

export default {
  name: "OrderTable",
  props: [
    "loading",
    "page",
    "totalPages",
    "Pages",
    "limit",
    "handleChangePage",
    "handleChangeLimit",
    "orders",
    "isAudit",
    "packagesInPage",
    "requestOptions",
    "isNotSticky",
    "exportFilter",
  ],
  components: {
    GButton,
    GCheckbox,
    GSelect,
    HiddenContent,
    FormatPrice,
    ExportOrderModal,
    ExpandStaticMapModal,
    ImagePreload,
    GMultiselect,
    SendRequestOrderModal,
    PackageLabel,
    PackageLogs,
    PackageDetailModal,
    GSkeletonImage,
    GSkeletonText,
    GTimeline,
  },
  data() {
    return {
      visibleModal: {
        chatRequest: false,
        orderNote: false,
        exportOrder: false,
        expandStaticMap: false,
        sendRequestOrder: false,
        packageDetail: false,
      },
      visiblePages: true,
      selectedOrder: {},
      selectedOrderIds: [],
      selectedOrderIdsExport: [],
      selectedOrders: [],
      logNotes: [
        { key: "CreateLog", text: "Tạo đơn hàng" },
        { key: "PickLog", text: "Lấy hàng" },
        { key: "DeliverLog", text: "Giao hàng" },
        { key: "AuditLog", text: "Đối soát" },
        { key: "ReturnLog", text: "Trả hàng" },
      ],
      exportExcelForAll: false,
      visiblePopoverSendRequest: false,
      typeSendRequestOrder: "",
      TMP_DELIVERY_STATUS_TEXT,
    };
  },
  mixins: [eventGChat],
  computed: {
    detailById() {
      return this.$store.state.order.detailById;
    },
    isSelectedAll() {
      if (!this.packagesInPage?.length) return false;
      return this.selectedOrderIds.length === this.packagesInPage.length;
    },
    shopStaff() {
      return this.$store.state?.shop?.ShopStaff || {};
    },
    isAdmin() {
      return this.shopStaff?.role === ROLES.ADMIN;
    },
  },
  methods: {
    visiblePage() {
      if (this.Pages == 0) {
        this.visiblePages = false;
      }
    },
    setVisibleModal(field) {
      return (value) => {
        this.visibleModal = {
          ...this.visibleModal,
          [field]: value,
        };
      };
    },
    openRequestChat(orderId) {
      this.$router.push("/chat");
      this.$mixinSendEventGroupChatByPackage(orderId);
    },
    openOrderNoteModal() {
      this.visibleModal.orderNote = true;
    },
    openExportOrderModal() {
      this.visibleModal.exportOrder = true;
    },
    openExpandStaticMapModal(order) {
      this.selectedOrder = order;
      this.visibleModal.expandStaticMap = true;
    },
    handleToogleOrder(_order) {
      const isSelected = this.selectedOrderIds.includes(_order.id);

      // For export Excel
      this.selectedOrderIdsExport = isSelected
        ? this.selectedOrderIdsExport.filter((id) => id !== _order.order)
        : this.selectedOrderIdsExport.concat(_order.order);

      // For send request
      this.selectedOrders = isSelected
        ? this.selectedOrders.filter((o) => o.id !== _order.id)
        : this.selectedOrders.concat(_order);

      // For print
      this.selectedOrderIds = isSelected
        ? this.selectedOrderIds.filter((id) => id !== _order.id)
        : this.selectedOrderIds.concat(_order.id);
    },
    totalOrderWeight(products = []) {
      let _totalOrderWeight = 0;
      for (const product of products) {
        const weight = product.weight ? Number(product.weight) : 0;
        const quantity = product.quantity ? Number(product.quantity) : 0;
        _totalOrderWeight += weight * quantity;
      }
      return _totalOrderWeight;
    },
    getLogs(logs, action) {
      return logs.filter((log) => log.action === action);
    },
    setSelectedOrder(_order) {
      this.selectedOrder = _order;
    },
    formatTimelineCreated(created) {
      if (!created) return "";
      const [date, time] = created.split(" ");
      const [hours, minutes] = time.split(":");
      // eslint-disable-next-line no-unused-vars
      const [_, month, day] = date.split("-");

      return `${hours}:${minutes} ${day}/${month}`;
    },
    handlePrintOrder(orderIds) {
      let query = "";
      for (const id of orderIds) {
        query += (query ? "&" : "?") + `data[package_id][${id}]=1`;
      }
      window.open(encodeURI(PRINT_URL + query), "_blank");
    },
    handlePrintSelectedOrders() {
      this.handlePrintOrder(this.selectedOrderIds);
    },
    getImageLog(imageUrl) {
      return CACHE_URL + "/" + imageUrl;
    },
    formatPredictionDelivery(order) {
      const date = order.date_to_delay_deliver;
      const shift = order.deliver_work_shift;

      if (!date) return "";

      const dateText = formatMomentDate(moment(new Date(date)), "DD-MM");
      let shiftText = "";

      if (shift) {
        const objectShift = { 1: "Sáng", 2: "Chiều", 3: "Tối" };
        shiftText = objectShift[shift];
      }
      if (shiftText) {
        return `${shiftText} ${dateText}`;
      }
      return dateText;
    },
    getFragileFee(order) {
      if (order?.property?.toLowerCase() === "bbs") {
        return order?.ext_fees?.reinforced_fee;
      } else {
        return order?.ext_fees?.fragile_fee || 0;
      }
    },
    onChangeLimit(_limit) {
      this.handleChangePage(1);
      this.handleChangeLimit(_limit);
    },
    logImageSrc(log) {
      const imageSrc = log.pickImage || log.deliveryImage || log.returnImage;
      if (!imageSrc) return null;
      if (!imageSrc.startsWith("http")) {
        return CACHE_URL + "/" + imageSrc;
      }
      return imageSrc;
    },
    deliveryMessages(order) {
      if (!order.deliver_message) return [];
      return order.deliver_message.split("<br/>");
    },
    callLogs(order) {
      const _logs = order?.logs || [];
      let _callLogs = [];
      let _desc = [];
      for (const log of _logs) {
        if (
          [
            "callCustomer",
            "callShop",
            "callShopFail",
            "callCustomerFail",
            "voipCallShop",
            "voipCallShopFail",
          ].includes(log.action) &&
          !_desc.includes(log.desc) // remove duplicate desc
        ) {
          _callLogs.push(log);
          _desc.push(log.desc);
        }
      }
      return _callLogs;
    },
    formatDesCallLog(des) {
      const match = des.match(REGEX_PHONE_NUMBER);
      const phoneNumber = match && match[0] ? match[0] : null;
      if (phoneNumber) {
        return [
          des.split(phoneNumber)[0],
          phoneNumber,
          des.split(phoneNumber)[1],
        ];
      }
      return null;
    },
    handleChangeCheckedAll(event) {
      const checked = event.target.checked;
      if (checked) {
        let updateIds = [];
        let updateOrders = [];

        for (const p of this.packagesInPage) {
          updateIds.push(p.id);
          updateOrders.push(p.order);
        }

        this.selectedOrderIds = updateIds;
        this.selectedOrderIdsExport = updateOrders;
        this.selectedOrders = this.packagesInPage;
      } else {
        this.selectedOrderIds = [];
        this.selectedOrderIdsExport = [];
        this.selectedOrders = [];
      }
    },
    changePage(page) {
      this.handleChangePage(page);
    },
    setExportExcelForAll(exportExcelForAll) {
      const btn = document.getElementById("btn-export-excel");
      if (btn) btn.click();
      this.exportExcelForAll = exportExcelForAll;
      this.openExportOrderModal();
    },
    openSendRequestModal(requestKey) {
      const timestamp = new Date().getTime();
      this.selectedOrders = this.selectedOrders.map((o) => ({
        ...o,
        custom_id: `${uuidv4()}_${timestamp}}`,
      }));
      this.typeSendRequestOrder = requestKey;
      const btn = document.getElementById("btn-send-request-order");
      if (btn) btn.click();
      this.visibleModal.sendRequestOrder = true;
    },
    openModalPackageDetail() {
      this.visibleModal.packageDetail = true;
    },
    async handleSendTicket(order, type, content) {
      let _status;
      let _message;

      try {
        const response = await ticketService.sendTicketOrder(
          order.id,
          order.alias,
          objectRequestOptions[type].feedback_type_id,
          content
        );

        if (response?.data?.success) {
          _status = "successed";
          _message = response?.data?.msg;
        } else {
          _status = "failed";
          _message =
            response?.data?.msg ||
            response?.data?.message ||
            "Oops! Something went wrong when call api.";
        }
      } catch (error) {
        _status = "failed";
        _message = "Oops! Something went wrong when call api.";
      }

      this.$store.commit("messagesSystem/updateMessage", {
        id: order.custom_id,
        dataUpdate: {
          status: _status,
          message: _message,
        },
      });
    },
    handleUpdateStatusMessage(orders, dataUpdate) {
      for (const order of orders) {
        this.$store.commit("messagesSystem/updateMessage", {
          id: order.custom_id,
          dataUpdate,
        });
      }
    },
    async handleChunkItem(chunkItem, type, content) {
      let arrayPromise = [];

      for (const item of chunkItem) {
        arrayPromise.push(this.handleSendTicket(item, type, content));
      }

      await Promise.all(arrayPromise);
    },
    async handleSendRequest(type, content) {
      const titleRequest = objectRequestOptions[type]?.label;

      this.$store.commit("global/setVisibleMessagesSystemModal", true);

      let _messagesSystem = {};

      for (const order of this.selectedOrders) {
        _messagesSystem[order.custom_id] = {
          id: order.custom_id,
          type: "send_order_request",
          desc: `<b>${titleRequest}</b> đơn hàng <b>${order.alias}</b>`,
          status: "waitting",
          created: formatDateTimeRequest(new Date()),
        };
      }

      this.$store.commit("messagesSystem/addMultiMesssages", _messagesSystem);

      const chunks = chunk(this.selectedOrders, 20);

      for (const chunkItem of chunks) {
        this.handleUpdateStatusMessage(chunkItem, { status: "executing" });
        await this.handleChunkItem(chunkItem, type, content);
      }
    },
    getCountdownTimeRTDealy(order) {
      if (!order.done_at || !order.rt_delay) {
        return null;
      }

      const timeDoneAt = new Date(order.done_at).getTime();
      const maxTimeDelay = timeDoneAt + 86400 * 1000 * Number(order.rt_delay);
      const remainTime = new Date(maxTimeDelay) - new Date();

      if (remainTime < 0) return null;

      const seconds = Math.floor(new Date(remainTime).getTime() / 1000);
      const days = Math.floor(seconds / 86400);
      const hours = Math.floor((seconds - days * 86400) / 3600);
      const minutes = Math.floor((seconds - days * 86400 - hours * 3600) / 60);

      let array = [];
      if (days) array.push(`${days} ngày`);
      if (hours) array.push(`${hours} giờ`);
      if (minutes) array.push(`${minutes} phút`);

      return array.join(" ");
    },
    getPrintLog(printLogs) {
      return (printLogs || [])
        .filter((l) => l.desc)
        .map((l) => `${this.formatTimelineCreated(l.created)}: ${l.desc}`)
        .join("<br />");
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler() {
        this.selectedOrderIds = [];
        this.selectedOrders = [];
        this.selectedOrder = {};
        this.selectedOrderIdsExport = [];
      },
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./table-responsive.scss";

.order-table-wrapper {
  table {
    thead {
      position: sticky;
      top: 0;
      background-color: #fff;
      z-index: 1;
    }

    th {
      &.action-col {
        width: 150px;
      }
      &.product-col {
        width: 200px;
      }
    }
    td {
      vertical-align: top;
      word-wrap: break-word;
      p {
        margin-bottom: 0;
        &.red-notice {
          color: #eb5757;
        }
      }
      .split {
        width: 100%;
        height: 1px;
        background-color: var(--grayColor);
        margin: 5px 0;
      }
      .static-map-wrapper {
        position: relative;
        display: inline-block;
        cursor: pointer;
        width: 100%;
        .static-map {
          max-width: 100%;
          height: 100px;
          @media only screen and (min-width: 1600px) {
            height: 130px;
          }
          @media only screen and (min-width: 1920px) {
            height: 160px;
          }
        }
        .expand-icon {
          cursor: pointer;
          position: absolute;
          bottom: 8px;
          right: 8px;
          opacity: 0;
          transition: 0.15s linear;
        }
        &:hover {
          .expand-icon {
            opacity: 1;
          }
        }
      }
      .btn-action {
        margin-bottom: 8px;
        border-radius: 20px;
      }
    }
    .order-timeline {
      color: #000;
    }
  }
  .pagination-wrapper {
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
    @media only screen and (min-width: 1600px) {
      .description-limit {
        display: inline-block;
        margin-right: 0.5rem !important;
      }
    }
  }
  .not-sticky {
    position: unset;
    border: none;
    width: 100%;
  }
  .log-image {
    width: 80px;
    border-radius: 3px;
  }
}
</style>

<style lang="scss">
@import "./responsive.scss";

.order-timeline {
  .ant-timeline-item-content {
    font-size: 16px;
  }
}

.list-request-wrapper {
  .request-item {
    cursor: pointer;
    height: 40px;
    line-height: 40px;
    font-size: 16px;
    padding: 0 1rem;
    &:not(:last-child) {
      border-bottom: 1px solid var(--grayColor);
    }
    &.is-disabled {
      cursor: not-allowed;
      color: var(--disabledColor) !important;
      opacity: 0.5;
    }
  }
}

.icon-export-order-excel {
  display: none;
}

@media only screen and (min-width: 1600px) {
  .icon-export-order-excel {
    display: inline-block;
  }
}

.skeleton-tracking-image {
  height: 100px;
  @media only screen and (min-width: 1600px) {
    height: 130px !important;
  }
  @media only screen and (min-width: 1920px) {
    height: 160px !important;
  }
}
</style>

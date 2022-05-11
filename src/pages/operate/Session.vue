<template>
  <div class="wrapper-session-page">
    <div
      class="overlay"
      v-if="visibleOverlay"
      ref="overlay"
      @click="
        () => {
          visibleOverlay = false;
          showConfirmReject = false;
          imagesBase64Object = {};
          visibleReportBreak = '';
        }
      "
    />
    <div v-if="showConfirmReject" class="wrapper-confirm-reject">
      <div class="confirm-title">Bạn có chắc không muốn nhận hàng trả?</div>
      <div class="flex wrapper-reject-action">
        <g-button
          class="t-flex-1 reject-action medium-text danger-text pointer"
          :loading="loadingReject"
          @click="handleReject"
        >
          Xác nhận
        </g-button>
        <g-button
          class="t-flex-1 reject-action medium-text primary-text pointer"
          :disabled="loadingReject"
          @click="
            () => {
              visibleOverlay = false;
              showConfirmReject = false;
            }
          "
        >
          Hủy
        </g-button>
      </div>
    </div>
    <div class="page-header">
      <div class="wrapper-header-title flex">
        <header-title @onBack="onBack" :title="title" />
      </div>
    </div>
    <div class="page-content">
      <table class="w-100 g-table">
        <thead>
          <tr>
            <th style="width: 260px; max-width: 260px">
              Phiên {{ getSessionTypeCod }}
            </th>
            <th style="width: 277px; max-width: 277px">
              Địa chỉ {{ getSessionTypeCod }}
            </th>
            <th style="width: 280px; max-width: 280px">{{ getTableType }}</th>
            <th style="width: 215px; min-width: 215px">
              NV {{ getSessionTypeCod }}
            </th>
            <th style="width: 162px; max-width: 162px">Thao tác</th>
          </tr>
        </thead>
        <tbody>
          <tr v-if="isLoadingGetSessions" class="is-loading">
            <td colspan="5">
              <preload-table :text="'Đang lấy danh sách phiên'" />
            </td>
          </tr>
          <tr v-else-if="sessions?.length === 0">
            <td colspan="5">
              <a-empty :description="'Danh sách trống'" />
            </td>
          </tr>
          <template v-else>
            <tr v-for="session in sessionsPagination" :key="session.id">
              <td style="width: 260px; max-width: 260px">
                <span class="medium-text">
                  {{ getSessionType(session.type) }} | {{ session.alias }}
                </span>
                <br />
                <span>
                  {{ getWorkShift(session.work_shift) }}
                  {{ formatDateTime(session.date) }}
                </span>
              </td>
              <td style="width: 277px; max-width: 277px">
                <span>{{ session.pick_address_name }}</span>
              </td>
              <td style="width: 280px; max-width: 280px">
                <template v-if="type">
                  <span v-if="type === 'incurredReportData.incurred'">
                    <span>
                      Đã lấy: {{ session.count_pkgs_detail.picked }} ĐH | Phát
                      sinh: {{ session.count_pkgs_detail.incurred }} ĐH
                    </span>
                  </span>
                  <span v-else> {{ session.count_pkgs }} ĐH </span>
                  <template v-if="isReturning">
                    <div class="wrapper-returning-action">
                      <g-button
                        class="rounded"
                        @click="
                          setSelectedSession(session);
                          openSendRequestModal('date_for_return');
                        "
                      >
                        Hẹn lịch trả
                      </g-button>
                      <g-button class="rounded" @click="handleLostPackage">
                        Nhận thiếu đơn
                      </g-button>
                      <a-popover
                        trigger="click"
                        placement="bottom"
                        overlayClassName="overlay-popover-return-request"
                        :visible="visibleReportBreak === session.id"
                      >
                        <template v-slot:content>
                          <div class="overlay-break-package">
                            <span>
                              Vui lòng tải lên hình ảnh hàng hóa (nếu có)
                            </span>
                            <div class="wrapper-input-images mt-1">
                              <span class="text-des">Ảnh</span>
                              <div class="list-images flex ml-1">
                                <div
                                  v-for="imageBase64 in imagesBase64"
                                  class="image-preview mr"
                                  :class="{
                                    'is-success': imageBase64.success,
                                    'is-error': imageBase64.error,
                                  }"
                                  :key="imageBase64.id"
                                  :style="{
                                    backgroundImage: `url(${imageBase64.src})`,
                                  }"
                                >
                                  <div
                                    v-if="!imageBase64.loading"
                                    class="inner-content-error"
                                  >
                                    <a-spin v-if="imageBase64.loading" />
                                    <template v-else>
                                      <div
                                        v-if="imageBase64.error"
                                        class="inner-action info-action"
                                      >
                                        <a-tooltip>
                                          <template v-slot:title>
                                            {{ imageBase64.error }}
                                          </template>
                                          <info-icon />
                                        </a-tooltip>
                                      </div>
                                      <div
                                        class="inner-action"
                                        @click="
                                          handleRemoveImage(imageBase64.id)
                                        "
                                      >
                                        <a-tooltip>
                                          <template v-slot:title>
                                            Xóa ảnh
                                          </template>
                                          <remove-icon />
                                        </a-tooltip>
                                      </div>
                                      <div
                                        v-if="
                                          !imageBase64.loading &&
                                          !imageBase64.success
                                        "
                                        class="inner-action"
                                        @click="handleReUpload(imageBase64)"
                                      >
                                        <a-tooltip>
                                          <template v-slot:title>
                                            Upload lại
                                          </template>
                                          <reload-icon />
                                        </a-tooltip>
                                      </div>
                                    </template>
                                  </div>
                                </div>
                                <div
                                  class="label-input-images mr"
                                  @click="handleChooseImage"
                                >
                                  <span class="plus-icon">+</span>
                                  <span class="plus-text">Thêm</span>
                                </div>
                              </div>
                              <input
                                type="file"
                                multiple
                                id="break-images"
                                ref="inputBreakImages"
                                @change="handleChangeFiles"
                                accept="image/*"
                              />
                            </div>
                            <g-button
                              class="primary mt-1 w-100"
                              :loading="loadingBreakImages"
                              @click="handleRequestBreakImages"
                            >
                              Xác nhận
                            </g-button>
                          </div>
                        </template>
                        <g-button
                          class="rounded"
                          @click="
                            () => {
                              visibleReportBreak = session.id;
                              setSelectedSession(session);
                              setVisibleMissPackage(session.id);
                            }
                          "
                        >
                          Khiếu nại hỏng, vỡ
                        </g-button>
                      </a-popover>
                      <g-button
                        class="rounded"
                        @click="
                          () => {
                            setSelectedSession(session);
                            visibleOverlay = true;
                            showConfirmReject = true;
                          }
                        "
                      >
                        Không muốn nhận hàng trả
                      </g-button>
                    </div>
                  </template>
                </template>
              </td>
              <td style="width: 215px; max-width: 215px">
                <div class="wrapper-cod-info">
                  <div
                    v-if="session.cod_avatar"
                    class="cod-avatar mr"
                    :style="{
                      backgroundImage: `url(${session.cod_avatar}`,
                    }"
                  />
                  <div class="cod-info">
                    <span class="cod-info__name">{{ session.cod_name }}</span>
                    <br />
                    <div v-if="session.cod_phone" class="cod-info__tel">
                      <hidden-content
                        :text="session.cod_phone"
                        :first="3"
                        :last="4"
                      />
                    </div>
                  </div>
                </div>
              </td>
              <td style="width: 162px; max-width: 162px">
                <g-button
                  v-if="type === 'returningReportData.returning'"
                  class="rounded w-100 mb medium-text"
                  @click="
                    () => {
                      setSelectedSession(session);
                      openReturnedConfirmModal();
                    }
                  "
                >
                  Xác nhận đã trả
                </g-button>
                <g-button
                  v-else
                  class="rounded w-100 mb medium-text"
                  @click="goToDetail(session)"
                >
                  Chi tiết phiên
                </g-button>
                <g-button
                  class="rounded w-100 mb medium-text"
                  @click="
                    openSendRequestModal();
                    setSelectedSession(session);
                  "
                >
                  Gửi yêu cầu
                </g-button>
                <g-button
                  class="rounded w-100 medium-text"
                  @click="
                    openRateModal(
                      session.cod_name,
                      session.cod_phone,
                      session.pick_address_name,
                      session.id,
                      session.alias,
                      staff,
                      addressTitle
                    );
                    setSelectedRate(rate);
                  "
                >
                  <span class="btn-title">Chấm</span>
                  <rate-star-icon />
                </g-button>
              </td>
            </tr>
          </template>
        </tbody>
      </table>
    </div>
    <div
      v-if="totalPages"
      class="t-px-3 t-py-3 t-absolute t-bottom-0 session-pagination"
    >
      <span class="description-limit mr">Số lượng bản ghi / trang</span>
      <g-select
        class="page-limit"
        :value="filter.limit"
        @change="handleChangeLimit"
      >
        <a-select-option value="25">25</a-select-option>
        <a-select-option value="50">50</a-select-option>
        <a-select-option value="100">100</a-select-option>
      </g-select>
      Trang {{ filter.page }}/{{ totalPages }}
      <g-button
        @click="handleChangePage(filter.page - 1)"
        :disabled="filter.page === 1"
        class="ml"
      >
        Trang trước
      </g-button>
      <g-button
        :disabled="filter.page > totalPages - 1"
        class="ml"
        @click="handleChangePage(filter.page + 1)"
      >
        Trang sau
      </g-button>
    </div>
    <returned-confirm-modal
      :visible="visibleModal.returnedConfirm"
      :handleCancel="closeReturnedConfirmModal"
      :session="selectedSession"
      :title="`${getSessionType()} |  ${selectedSession?.alias}`"
      :openRateModal="openRateModal"
    />

    <rate-modal
      :visible="visibleModal.Rate"
      :setVisible="setVisibleModal('Rate')"
      :rate="selectedRate"
      :name="selectedSession.name"
      :phone="selectedSession.phone"
      :address="selectedSession.address"
      :id="selectedSession.id"
      :alias="selectedSession.alias"
      :staff="
        type === 'incurredReportData.incurred' ||
        type === 'delayNotPickReportData.delay_not_pick'
          ? 'NV lấy hàng'
          : 'NV trả hàng'
      "
      :addressTitle="
        type === 'incurredReportData.incurred' ||
        type === 'delayNotPickReportData.delay_not_pick'
          ? 'ĐC lấy hàng'
          : 'ĐC trả hàng'
      "
    />

    <send-return-request-modal
      :visible="visibleModal.sendRequest"
      :handleCancel="closeSendRequestModal"
      :session="selectedSession"
      :type="getParamsByType(type).type"
      :selected-key="selectedKey"
    />
  </div>
</template>

<script>
import { OPERATE_TYPE } from "@/contants";
import { OPERATE_TYPE_C2C } from "@/contants/operate";
import HeaderTitle from "@/components/base/HeaderTitle/index.vue";
import { GButton, GSelect } from "@/components/elements";
import {
  RateStarIcon,
  RemoveIcon,
  ReloadIcon,
  InfoIcon,
} from "@/components/icons";
import operateService from "@/services/operate.service";
import orderService from "@/services/order.service";
import { PreloadTable, HiddenContent } from "@/components";
import RateModal from "@/components/modal/RateModal.vue";
import SendReturnRequestModal from "@/components/modal/SendReturnRequestModal/index.vue";
import ReturnedConfirmModal from "@/components/modal/ReturnedConfirmModal.vue";
import { imageToBase64 } from "@/utils";
import { v4 as uuidv4 } from "uuid";
import ticketService from "@/services/ticket.service";
import services from "@/services";

export default {
  components: {
    HeaderTitle,
    GButton,
    RateStarIcon,
    PreloadTable,
    HiddenContent,
    RateModal,
    SendReturnRequestModal,
    GSelect,
    ReturnedConfirmModal,
    RemoveIcon,
    ReloadIcon,
    InfoIcon,
  },
  data() {
    return {
      isLoadingGetSessions: false,
      sessions: null,
      type: "",
      filter: {},
      visibleModal: {
        Rate: false,
        sendRequest: false,
        returnedConfirm: false,
      },
      staff: "",
      addressTitle: "",
      selectedSession: {
        name: "",
        phone: "",
        address: "",
        id: "",
        alias: "",
      },
      selectedKey: "",
      visibleMissPackage: "",
      visibleOverlay: false,
      missedPackage: {
        label: "1",
        value: 1,
      },
      imagesBase64Object: {},
      getRate: {
        status: "",
        detail: {
          key: "",
          value: "",
        },
      },
      loadingBreakImages: false,
      visibleReportBreak: "",
      loadingReject: false,
    };
  },
  async mounted() {
    orderService.getRateChoice(this.getRateType);
  },
  computed: {
    isC2C() {
      return this.type.includes("c2c.");
    },
    typeOperate() {
      return this.isC2C ? OPERATE_TYPE_C2C : OPERATE_TYPE;
    },
    getTableType() {
      const type = this.type;

      if (type === "incurredReportData.incurred") {
        return "Đã lấy | Phát sinh";
      } else if (type === "delayNotPickReportData.delay_not_pick") {
        return "Delay & Hủy lấy";
      } else if (type === "waitingToReturnReportData.waiting_to_return") {
        return "Lưu kho chờ trả";
      } else if (type === "returningReportData.returning") {
        return "Đang trả";
      } else if (type === "returnedReportData.returned") {
        return "Đã trả";
      }
      return "";
    },
    getRateType() {
      const param = this.getParamsByType(this.type);
      return param.type === 1 ? "pick" : "return";
    },
    getSessionTypeCod() {
      const type = this.type;

      if (
        [
          "incurredReportData.incurred",
          "delayNotPickReportData.delay_not_pick",
        ].includes(type)
      )
        return "lấy hàng";
      else if (
        [
          "waitingToReturnReportData.waiting_to_return",
          "returningReportData.returning",
          "returnedReportData.returned",
        ].includes(type)
      )
        return "trả hàng";
      return "";
    },
    isReturning() {
      return this.type === "returningReportData.returning";
    },
    title() {
      let _title = "";

      for (let type of this.typeOperate) {
        if (type.key === this.type) {
          _title = type.title;
          break;
        }
      }
      return _title;
    },
    totalPages() {
      if (!this.sessions) return 0;
      const total = this.sessions.length;
      const limit = this.filter.limit || 25;

      if (total % limit === 0) return total / limit;

      return Math.floor(total / this.filter.limit) + 1;
    },
    sessionsPagination() {
      if (!this.sessions) return [];
      const page = this.filter.page - 1;
      return this.sessions.slice(
        page * this.filter.limit,
        (page + 1) * this.filter.limit
      );
    },
    imagesBase64() {
      let _imagesBase64 = [];
      for (const id in this.imagesBase64Object) {
        if (this.imagesBase64Object[id]) {
          _imagesBase64.push({ id, ...this.imagesBase64Object[id] });
        }
      }
      return _imagesBase64;
    },
  },
  methods: {
    onBack() {
      this.$router.push("/don-hang");
    },
    getParamsByType(_type) {
      let type, sub_type;

      if (_type === "incurredReportData.incurred") {
        type = 1;
        sub_type = "pickedIncurred";
      } else if (_type === "delayNotPickReportData.delay_not_pick") {
        type = 1;
        sub_type = "delayCancel";
      } else if (_type === "waitingToReturnReportData.waiting_to_return") {
        type = 2;
        sub_type = "wait_to_return";
      } else if (_type === "returningReportData.returning") {
        type = 2;
        sub_type = "returning";
      } else if (_type === "returnedReportData.returned") {
        type = 2;
        sub_type = "returned";
      }

      return {
        type,
        sub_type,
      };
    },
    goToDetail(_session) {
      this.$router.push({
        name: "operate-manage-page",
        query: {
          type: this.type,
          session_id: _session.id,
          session_type: _session.type,
          session_alias: _session.alias,
        },
      });
    },
    getSessionType(type) {
      return type === 1 ? "LẤY" : "TRẢ";
    },
    getWorkShift(work_shift_id) {
      const workShift = {
        1: "Sáng",
        2: "Chiều",
        3: "Tối",
      };

      return workShift[work_shift_id];
    },
    formatDateTime(timeString) {
      const [year, month, day] = timeString.split("-");
      return `${day}/${month}/${year}`;
    },
    optionsMissed(_max) {
      let _optionsMissed = [];
      for (let index = 0; index < _max; index++) {
        _optionsMissed.push({
          value: index + 1,
          label: `${index + 1}`,
        });
      }
      return _optionsMissed;
    },
    async getSessions() {
      this.isLoadingGetSessions = true;

      let _sessions = [];
      try {
        const params = this.getParamsByType(this.type);

        if (params.type && params.sub_type) {
          const response = await operateService.getSessions(params);
          _sessions = response?.data?.data || [];
          if (!response?.data?.data) {
            this.$message.error("Lấy danh sách phiên thất bại.");
          }
        }
      } catch (error) {
        console.log(error);
        this.$message.error("Lấy danh sách phiên thất bại.");
      }

      this.sessions = _sessions
        .sort((a, b) => new Date(b.date) - new Date(a.date))
        .sort((a, b) => a.work_shift - b.work_shift);
      this.isLoadingGetSessions = false;
    },
    handleChangeQueryUrl(_query = {}) {
      const query = { ...this.filter, ..._query };

      this.$router.push({ query });
    },
    handleChangePage(page) {
      this.filter = { ...this.filter, page };
      this.handleChangeQueryUrl({ page });
    },
    handleChangeLimit(limit) {
      this.filter = { ...this.filter, limit };
      this.handleChangeQueryUrl({ limit });
    },
    getFilterFromUrlParams(_params) {
      let _query = { ...this.filter };

      const page = Number(_params.page) || 1;
      const limit = Number(_params.limit) || 25;

      _query.page = page;
      _query.limit = limit;

      _query = { ..._query, type: this.type };

      return _query;
    },
    scrollToTop() {
      const contentScrollable = document.querySelector(
        ".wrapper-session-page .page-content"
      );
      if (contentScrollable) {
        contentScrollable.scroll({ top: 0, behavior: "smooth" });
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
    openRateModal(
      name,
      phone,
      address,
      id,
      alias,
      statusRate,
      staff,
      addressTitle
    ) {
      this.visibleModal.Rate = true;
      this.selectedSession.name = name;
      this.selectedSession.phone = phone;
      this.selectedSession.address = address;
      this.selectedSession.alias = alias;
      this.selectedSession.id = id;
      this.getRate.status = statusRate;
      this.staff = staff;
      this.addressTitle = addressTitle;
    },
    setSelectedRate(_rate) {
      this.selectedOrder = _rate;
    },
    setSelectedSession(session) {
      this.selectedSession = session;
    },
    setVisibleMissPackage(session) {
      this.visibleMissPackage = session.id;
      this.visibleOverlay = true;
    },
    openSendRequestModal(selectedKey) {
      if (selectedKey) this.selectedKey = selectedKey;
      this.visibleModal.sendRequest = true;
    },
    closeSendRequestModal() {
      this.selectedKey = "";
      this.visibleModal.sendRequest = false;
    },
    handleChooseImage() {
      this.$refs.inputBreakImages.click();
    },
    handleUpdateImages(id, dataUpdate) {
      this.imagesBase64Object[id] = {
        ...this.imagesBase64Object[id],
        ...dataUpdate,
      };
    },
    handleReUpload(image) {
      this.uploadImages(image.file, image.id);
    },
    async uploadImages(file, id) {
      this.handleUpdateImages(id, { loading: true });

      const data = new FormData();
      data.append("content", "packageImage");
      data.append("object", "package");
      data.append("files[]", file);
      data.append("object_ids[]", id);

      try {
        const response = await services.$package.uploadImage(data);
        if (response.success) {
          const paths = response.data;
          this.imagesBase64Object[id] = {
            ...this.imagesBase64Object[id],
            path: paths[0]?.secretUrl?.split("?au=")[0],
            success: true,
            error: null,
          };
        } else {
          const message = response.message || "Upload ảnh không thành công";
          this.$message.error(message);
          this.handleUpdateImages(id, {
            success: false,
            error: message,
          });
        }
      } catch (error) {
        this.$message.error("Upload ảnh không thành công");
        this.handleUpdateImages(id, {
          success: false,
          error: "Upload ảnh không thành công",
        });
      }

      this.handleUpdateImages(id, { loading: false });
    },
    async handleChangeFiles(event) {
      const files = event.target.files;
      for (const file of files) {
        const id = uuidv4();
        const base64 = await imageToBase64(file);
        this.imagesBase64Object[id] = {
          src: base64,
          type: file.type,
          name: file.name,
          size: file.size,
          file: file,
        };
        this.uploadImages(file, id);
      }
    },
    openReturnedConfirmModal() {
      this.visibleModal.returnedConfirm = true;
    },
    closeReturnedConfirmModal() {
      this.visibleModal.returnedConfirm = false;
    },
    async handleReject() {
      this.loadingReject = true;
      try {
        const response = await ticketService.rejectReturn(
          this.selectedSession.id
        );
        if (response.data.success) {
          this.showConfirmReject = false;
          this.$refs["overlay"].click();
          this.$message.success(response.data.message);
        } else {
          this.$message.error(
            response.data.message || "Oops! Something went wrong when call api."
          );
        }
      } catch (error) {
        console.error(error);
        let messageError = "Oops! Something went wrong when call api.";
        if (error?.response?.data?.message) {
          messageError = error.response.data.message;
        }
        this.$message.error(messageError);
      }
      this.loadingReject = false;
    },
    async handleRequestBreakImages() {
      this.loadingBreakImages = true;
      try {
        const feedback = { content: "Khiếu nại hỏng, vỡ" };
        const upload_img = this.imagesBase64
          .filter((image) => image.success)
          .map((image) => image.path);

        if (upload_img.length) {
          feedback.upload_img = upload_img;
        }

        const response = await ticketService.sendTicketSession(
          this.selectedSession.id,
          28,
          feedback
        );
        if (response.data.success) {
          this.$refs["overlay"].click();
          this.visibleReportBreak = "";
          this.$message.success(response.data.message);
        } else {
          this.$message.error(
            response.data.message || "Oops! Something went wrong when call api."
          );
        }
      } catch (error) {
        let messageError = "Oops! Something went wrong when call api.";
        if (error?.response?.data?.message) {
          messageError = error.response.data.message;
        }
        this.$message.error(messageError);
      }
      this.loadingBreakImages = false;
    },
    handleRemoveImage(id) {
      this.imagesBase64Object[id] = null;
    },
    handleLostPackage() {
      this.$router.push("/chat");
      // TODO send message event
    },
  },
  watch: {
    "$route.query": {
      immediate: true,
      handler(_query) {
        if (this.$route.path !== "/danh-sach-phien") {
          return;
        }
        this.scrollToTop();
        this.type = _query.type.replace("c2c._", "").replace("c2c.", "");
        this.filter = this.getFilterFromUrlParams(_query);
        if ((!_query.page && !_query.limit) || !this.sessions) {
          this.getSessions();
        }
      },
    },
    visibleReportBreak() {
      if (this.$refs.inputBreakImages) {
        this.$refs.inputBreakImages.value = "";
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.wrapper-session-page {
  position: relative;
  height: calc(100vh - 64px);
  .wrapper-header-title {
    padding: 0 1rem;
    height: 64px;
  }
  .page-content {
    margin: 0 1rem;
    max-height: calc(100vh - 64px - 64px - 59px);
    overflow: auto;
    table {
      thead {
        position: sticky;
        top: 0;
        z-index: 1;
      }
      th,
      td {
        padding: 1rem;
        &:last-child {
          position: sticky;
          right: 0;
          background-color: #fafafa;
        }
      }
      td {
        vertical-align: top;
        &:first-child {
          min-width: 280px;
        }
        &:nth-child(2) {
          min-width: 277px;
        }
        &:nth-child(3) {
          min-width: 195px;
        }
        &:nth-child(4) {
          min-width: 180px;
        }
        &:last-child {
          background-color: #fff;
        }
        @media only screen and (min-width: 1920px) {
          min-width: unset !important;
        }
      }
      .wrapper-cod-info {
        display: flex;
        align-items: center;
        .cod-avatar {
          width: 40px;
          height: 40px;
          background-size: cover;
          background-position: center;
          border-radius: 50%;
          border: 1px solid #fff;
          box-shadow: rgba(93, 93, 93, 0.32) 0px 0px 5px;
        }
        .cod-info {
          line-height: 20px;
          flex: 1;
          .cod-info__tel {
            width: 70px;
            display: inline-block;
          }
        }
      }
      .wrapper-returning-action {
        button {
          display: inline-block;
          padding: 0 11px;
          margin-top: 0.5rem;
          margin-right: 4px;
        }
      }
    }
    .g-button {
      display: flex;
      align-items: center;
      justify-content: center;
      .btn-title {
        margin-right: 0.25rem;
      }
    }
  }
  .session-pagination {
    background-color: #fff;
    border-top: 1px solid var(--grayColor);
    border-right: 1px solid var(--grayColor);
    border-left: 1px solid var(--grayColor);
    width: calc(100% - 2rem);
    transform: translateX(1rem);
    height: 60px;
    .description-limit {
      display: none;
      @media only screen and (min-width: 1376px) {
        display: inline-block;
      }
    }
    .page-limit {
      margin-right: 1rem;
    }
  }
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    z-index: 1000;
    background-color: rgba(0, 0, 0, 0.45);
  }
  .wrapper-confirm-reject {
    position: fixed;
    top: 50%;
    left: 50%;
    z-index: 1;
    background-color: #fff;
    transform: translate(-50%, -50%);
    border-radius: 8px;
    overflow: hidden;
    width: 364px;
    z-index: 9999;
    .confirm-title {
      font-size: 16px;
      padding: 1.5rem 1rem;
      border-bottom: 1px solid #e0e0e0;
    }
    .reject-action {
      text-align: center;
      border: none;
      height: unset;
      padding: 0.75rem 0;
      border-radius: 0;
      &:first-child {
        border-right: 1px solid #e0e0e0;
      }
    }
  }
}
</style>

<style lang="scss">
.overlay-break-package {
  padding: 1rem;
  .wrapper-input-images {
    display: flex;
    .text-des {
      line-height: 64px;
    }
    .list-images {
      flex-wrap: wrap;
      width: calc(256px + 2rem);
      .image-preview {
        width: 64px;
        height: 64px;
        background-size: cover;
        background-position: center;
        margin-bottom: 0.5rem;
        border: 1px solid var(--grayColor);
        position: relative;
        &.is-success {
          border: 1px solid #069255;
        }
        &.is-error {
          border: 1px solid red;
          opacity: 0.65;
        }
        &:hover {
          .inner-content-error {
            opacity: 1;
          }
        }
        .inner-content-error {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          align-items: center;
          justify-content: space-around;
          opacity: 0;
          transition: 0.15s linear;
          .inner-action {
            cursor: pointer;
            background-color: #fff;
            display: flex;
            align-items: center;
            justify-content: center;
            &.info-action {
              svg {
                width: 18px;
              }
            }
          }
        }
      }
      .label-input-images {
        cursor: pointer;
        color: #069255;
        border-style: dashed;
        border-color: #069255;
        border-width: 1px;
        display: flex;
        flex-direction: column;
        height: 64px;
        width: 64px;
        justify-content: center;
        align-items: center;
        margin-bottom: 0.5rem;
        .plus-icon {
          font-size: 30px;
          line-height: 30px;
        }
      }
    }
    #break-images {
      display: none;
    }
  }
}
.overlay-popover-return-request {
  .ant-popover-inner {
    border-radius: 8px;
    color: #000;
    font-size: 16px;
    .overlay-miss-package {
      padding: 1rem;
      .g-select__wrapper {
        width: 63px;
      }
    }
  }
}
</style>

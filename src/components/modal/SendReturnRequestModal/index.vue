<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="500"
    :maskClosable="!loading"
    :title="'Gửi yêu cầu'"
    @cancel="handleCancel"
  >
    <div class="wrapper-send-return-request">
      <div class="session-alias">
        <div class="wrapper-icon-send-request">
          <send-request-session-icon />
        </div>
        <span class="alias medium-text">{{ session.alias }}</span>
      </div>
      <div class="wrapper-list-request mt-1">
        <div
          v-for="requestItem in requestOptions"
          :key="requestItem.key"
          class="request-item pointer"
          @click="setSelectedRequest(requestItem.key)"
        >
          <div
            class="item-header flex justify-content-space-between align-items-center"
            :class="{ 'is-selected': selectedRequest === requestItem.key }"
          >
            <img
              class="back-icon"
              v-if="selectedRequest"
              src="@/assets/icons/back_active.svg"
              @click="backDetail"
            />
            <span>{{ requestItem.title }}</span>
            <img
              v-if="!selectedRequest"
              class="ml"
              src="@/assets/icons/menu_right_submenu_right.svg"
            />
          </div>
          <div class="item-detail" v-if="selectedRequest">
            <detail-kick
              v-if="selectedRequest === 'kick_off'"
              :session="session"
              :loading="loading"
              :setLoading="setLoading"
              :handleCancel="handleCancel"
              :type="type"
            />
            <date-for-return
              v-if="selectedRequest === 'change_date'"
              :session="session"
              :loading="loading"
              :setLoading="setLoading"
              :handleCancel="handleCancel"
              :type="type"
            />
            <change-pick-address
              v-if="selectedRequest === 'change_pick_address'"
              :handleCancel="handleCancel"
              :session="session"
              :type="type"
              :loading="loading"
              :setLoading="setLoading"
            />
            <list-package-to-action
              v-if="
                [
                  'report_lost_package',
                  'report_delay',
                  'report_wrong_info',
                  'report_employee',
                  'report_break',
                  'report_receive_yet',
                ].includes(selectedRequest)
              "
              :type="type"
              :request-key="selectedRequest"
              :session="session"
              :packages="packages"
              :handleNextPage="handleNextPage"
              :loadingNextPage="loadingNextPage"
              :loading="loading"
              :setLoading="setLoading"
              :handleCancel="handleCancel"
              :ids="ids"
            />
          </div>
        </div>
      </div>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../../elements/modal.vue";

// Conponent
import SendRequestSessionIcon from "@/components/icons/SendRequestSessionIcon.vue";
import DetailKick from "./DetailKick.vue";
import DateForReturn from "./DateForReturn.vue";
import ListPackageToAction from "./ListPackage.vue";
import ChangePickAddress from "./ChangePickAddress.vue";

// Service
import orderService from "@/services/order.service";
import operateService from "@/services/operate.service";

// Mixin
import eventGChat from "@/plugins/mixins/eventGChat";

// Const
import {
  OPTIONS_RETURN_REQUEST_FOR_RETURN,
  OPTIONS_RETURN_REQUEST_FOR_PICK,
} from "@/contants/operate";

// type: 1 for pick, type: 2 for return
export default {
  name: "SendReturnRequestModal",
  components: {
    GModal,
    SendRequestSessionIcon,
    DetailKick,
    DateForReturn,
    ListPackageToAction,
    ChangePickAddress,
  },
  props: ["visible", "handleCancel", "session", "type", "selectedKey"],
  mixins: [eventGChat],
  data() {
    return {
      loading: false,
      loadingGetIds: true,
      ids: [],
      selectedRequest: null,
      packagesOfSession: {},
      page: 1,
      loadingNextPage: false,
    };
  },
  methods: {
    async handleNextPage() {
      const page = this.page + 1;

      if (this.loadingNextPage || page > this.totalPages) return;

      this.loadingNextPage = true;

      this.page = page;
      try {
        await this.getPackagesOfSession(this.session.id, page);
      } catch (error) {
        console.log(error);
      }
      this.loadingNextPage = false;
    },
    setLoading(_loading) {
      this.loading = _loading;
    },
    setSelectedRequest(key) {
      if (key === "chat") {
        this.$router.push("/chat");
        this.$mixinSendEventChatWithCSKH();
      } else if (key === "contact") {
        this.$router.push("/chat");
        this.$mixinSendEventChatWithMember(this.session.cod_id);
      } else {
        this.selectedRequest = key;
      }
    },
    backDetail(event) {
      event.stopPropagation();
      this.selectedRequest = null;
    },
    async getIds() {
      this.loadingGetIds = true;

      try {
        const response = await operateService.getSessionDetail(this.session.id);
        this.ids = response?.data?.data;
      } catch (error) {
        console.error(error);
      }

      this.loadingGetIds = false;
    },
    async getPackagesOfSession(sessionId, page = 1) {
      const currentSession = this.packagesOfSession[sessionId] || {};
      const oldPackages = currentSession?.packages || [];

      this.packagesOfSession[sessionId] = {
        ...currentSession,
        loading: true,
      };

      let packages = [...oldPackages];

      try {
        const packageId = this.ids;
        const response = await orderService.getAll({
          packageId,
          limit: 25,
          page,
        });
        const pkgs = response?.data?.pkgs || [];
        packages = [...packages, ...pkgs];
      } catch (error) {
        console.error(error);
      }

      this.packagesOfSession[sessionId] = {
        ...currentSession,
        packages,
        loading: false,
      };
    },
  },
  computed: {
    listRequest() {
      return this.type === 1
        ? OPTIONS_RETURN_REQUEST_FOR_PICK
        : OPTIONS_RETURN_REQUEST_FOR_RETURN;
    },
    totalPages() {
      const total = this.ids.length;
      const limit = 25;

      if (total % limit === 0) return total / limit;

      return Math.floor(total / limit) + 1;
    },
    packages() {
      if (!this.packagesOfSession[this.session.id]?.packages) return null;
      return this.packagesOfSession[this.session.id]?.packages;
    },
    requestOptions() {
      return this.listRequest.filter((r) => {
        return !this.selectedRequest || this.selectedRequest === r.key;
      });
    },
  },
  watch: {
    loadingGetIds(_loadingGetIds) {
      if (!_loadingGetIds) {
        this.getPackagesOfSession(this.session.id);
      }
    },
    selectedKey(_selectedKey) {
      if (_selectedKey === "date_for_return") {
        this.selectedRequest = "change_date"; // Hẹn lịch trả hàng
      } else {
        this.selectedRequest = null;
      }
    },
    visible(_visible) {
      if (!_visible) {
        this.selectedRequest = null;
        this.packagesOfSession[this.session.id] = {};
      } else {
        if (this.session.id) {
          this.page = 1;
          this.getIds();
        }
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./style.scss";
</style>

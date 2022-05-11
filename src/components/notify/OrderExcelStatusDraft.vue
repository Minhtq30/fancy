<template>
  <a-tooltip placement="left">
    <template v-if="statusSmall" #title>
      {{ pendingStatus.pending }} đơn hàng đang được xử lý
    </template>
    <div
      @click="handleClickNotify"
      class="g-notify-fix"
      v-if="pendingStatus.pending > 0"
    >
      <div class="g-notify-title" v-if="!statusSmall">
        {{ pendingStatus.pending }} đơn hàng đang được xử lý
      </div>
      <a-spin :indicator="indicator" />
      <div class="g-notify-number" v-if="statusSmall">
        {{ pendingStatus.pending }}
      </div>
    </div>
  </a-tooltip>
  <g-save-order-modal
    :numberSuccess="this.pendingStatus.success"
    :numberFail="this.pendingStatus.failed"
    :visible="visibleSaveModal"
    :setVisible="onSetVisibleSaveModal"
  />
</template>

<script>
import { defineComponent, h } from "vue";

// Components.
import { LoadingOutlined } from "@ant-design/icons-vue";
import GSaveOrderModal from "@/components/modal/SaveOrderModal";

// Services
import services from "@/services";

let countError = 0;

export default defineComponent({
  name: "OrderExcelStatusDraft",
  components: {
    GSaveOrderModal,
  },
  data() {
    return {
      visibleSaveModal: false,
      statusSmall: false,
      pendingStatus: {
        pending: 0,
        success: 0,
        failed: 0,
      },
      tmpFailedOrder: [],
      sessionInterval: null,
      active: false,
    };
  },
  computed: {
    sessions() {
      return this.$store.state.orderExcel.sessions;
    },
  },
  watch: {
    sessions(newValue) {
      let totalNew = 0;
      const values = newValue.map((item) => {
        if (item.numberOrder > 0) {
          totalNew += item.numberOrder;
          item.numberOrder = 0;
        }

        return item;
      });
      if (totalNew > 0) {
        this.pendingStatus.pending += totalNew;
        // Cập nhật lại number cua các session ve 0.
        this.$store.commit("orderExcel/updateSessions", values);
      }

      if (newValue.length > 0 && !this.active) {
        this.checkSessionsStatusV2();
        this.active = true;
      }
    },
  },
  methods: {
    async handleUpdateOrderDraft() {
      const response = await services.$package.getDraftPackage({
        useNewPackage: true,
        useNewApi: true,
        isEcom: false,
        page: 0,
        size: 1,
        shopCode: localStorage.getItem("shop_code"),
      });

      if (response.success) {
        const approxResultsCount = response?.data?.approxResultsCount || 0;
        // Cập nhật tổng.
        this.$store.commit("orderDraft/updateTotal", approxResultsCount);
      }
    },
    onSetVisibleSaveModal(value) {
      this.visibleSaveModal = value;
      if (!value) {
        // Nếu đóng lại thì chuyển về trạng thái reset.
        this.pendingStatus.pending =
          this.pendingStatus.success =
          this.pendingStatus.failed =
            0;
      }
    },
    handleClickNotify() {
      this.statusSmall = !this.statusSmall;
    },
    clearTimer() {
      clearInterval(this.sessionInterval);
      this.active = false;
    },
    checkSessionsStatusV2() {
      this.sessionInterval = setInterval(() => {
        if (!this.sessions.length) {
          this.clearTimer();
          return;
        }
        const params = {
          batch_sessions: this.sessions
            .map((item) => item.session_id)
            .join(","),
        };
        services.$package.checkDraftPackage(params).then(async (response) => {
          if (response.success) {
            const pendStatus = {
              success: 0,
              failed: 0,
              pending: 0,
            };
            if (response.data.length === 0) {
              // trường hợp dữ liệu lỗi.
              countError += 1;
            }
            for (const data of response.data) {
              if (
                data.session.status === "completed" ||
                data.session.status === "failed"
              ) {
                const doneStatus = {
                  success: 0,
                  failed: 0,
                };
                for (const i in data.results) {
                  if (data.results[i].status === "completed") {
                    doneStatus.success++;
                  } else if (data.results[i].status === "failed") {
                    this.tmpFailedOrder.push(
                      JSON.parse(data.results[i].package)
                    );
                    doneStatus.failed++;
                  }
                }

                const index = this.sessions.findIndex(
                  (item) => `${item.session_id}` === `${data.session_id}`
                );
                if (index === -1) continue;
                this.sessions.splice(index, 1);

                this.pendingStatus.success += doneStatus.success;
                this.pendingStatus.failed += doneStatus.failed;

                // Hoàn thành.
                if (this.sessions.length === 0) {
                  this.onSetVisibleSaveModal(true);
                  // Call API cập nhật số lượng đơn nháp.
                  await this.handleUpdateOrderDraft();
                }
              } else {
                for (const i in data.results) {
                  if (data.results[i].status === "completed") {
                    pendStatus.success++;
                  } else if (data.results[i].status === "failed") {
                    pendStatus.failed++;
                  } else {
                    if (i !== "remove") {
                      pendStatus.pending++;
                    }
                  }
                }
              }
            }

            this.pendingStatus.pending = pendStatus.pending;
          } else {
            countError += 1;
          }

          // NamVH: Hạn chế việc spam server khi lỗi hệ thống.
          if (countError > 50) {
            this.sessions = [];
          }
        });
      }, 10000);
    },
  },
  setup() {
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "35px",
      },
      spin: true,
    });
    return {
      indicator,
    };
  },
});
</script>

<style lang="scss" scoped>
.g-notify-fix {
  cursor: pointer;
  position: fixed;
  top: 66px;
  right: 20px;
  background-color: white;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  display: flex;
  padding: 10px 15px;
  font-size: 1rem;
  font-weight: 500;
  justify-content: space-between;
  align-items: center;
  border-radius: 5px;
  z-index: 1000;
  transition: width 2s;
  .g-notify-title {
    margin-right: 10px;
  }
  .g-notify-number {
    position: absolute;
    display: inline-block;
    width: 35px;
    text-align: center;
  }
}
</style>

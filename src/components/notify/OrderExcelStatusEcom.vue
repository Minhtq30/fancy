<template>
  <div
    v-show="sessions.length || pendingStatus.pending > 0"
    class="g-notify-fix"
  >
    <div @click="handleChangeMode" class="notify-title">
      <span v-if="sessions.length > 0">
        <a-spin :indicator="indicator" /> &nbsp; Đang xử lý
        {{ pendingStatus.pending }} đơn
      </span>
      <span v-else> Đã xử lý xong {{ pendingStatus.pending }} đơn </span>
    </div>
    <div :class="{ 'notify-body': true, 'small-mode': isSmall }">
      <a-popover trigger="click" placement="bottomLeft">
        <template #content>
          <list-order-notify
            :list="listOrderSuccess"
            class="list-order-notify"
          />
        </template>
        <div class="notify-item">
          <span v-show="!isSmall">Thành công</span>
          <span class="notify-item-success">{{ listOrderSuccess.length }}</span>
        </div>
      </a-popover>
      <a-popover trigger="click" placement="bottom">
        <template #content>
          <list-order-notify :list="listOrderFailed" />
        </template>
        <div class="notify-item">
          <span v-show="!isSmall">Lỗi</span>
          <span class="notify-item-fail">{{ listOrderFailed.length }}</span>
        </div>
      </a-popover>
      <a-popover trigger="click" placement="bottomRight">
        <template #content>
          <list-order-notify :list="listOrderPending" />
        </template>
        <div class="notify-item">
          <span v-show="!isSmall">Đang chờ</span>
          <span class="notify-item-pending">{{ listOrderPending.length }}</span>
        </div>
      </a-popover>
    </div>
  </div>
</template>

<script>
import { defineComponent, h } from "vue";

// Components.
import { LoadingOutlined } from "@ant-design/icons-vue";
import ListOrderNotify from "@/components/list/ListOrderNotify";

// Services
import services from "@/services";
import { uniqBy } from "lodash";

let countError = 0;

export default defineComponent({
  name: "OrderExcelStatusEcom",
  components: { ListOrderNotify },
  data() {
    return {
      visibleSaveModal: false,
      statusSmall: false,
      pendingStatus: {
        pending: 0,
        success: 0,
        failed: 0,
      },
      cacheFailedOrder: [],
      cacheSuccessOrder: [],
      tmpFailedOrder: [],
      tmpSuccessOrder: [],
      tmpPendingOrder: [],
      sessionInterval: null,
      active: false,
      isSmall: false,
    };
  },
  computed: {
    sessions() {
      return this.$store.state.orderExcel.sessionsEcom;
    },
    listOrderSuccess() {
      return uniqBy(
        [...this.cacheSuccessOrder, ...this.tmpSuccessOrder],
        "package_draft_id"
      );
    },
    listOrderFailed() {
      return uniqBy(
        [...this.cacheFailedOrder, ...this.tmpFailedOrder],
        "package_draft_id"
      );
    },
    listOrderPending() {
      return this.tmpPendingOrder;
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
        // Chỗ này chỉ chạy khi đơn lên.
        this.pendingStatus.pending += totalNew;
        // Cập nhật lại number cua các session ve 0.
        this.$store.commit("orderExcel/updateSessionsEcom", values);
      }

      if (newValue.length > 0 && !this.active) {
        this.checkSessionsStatusV2();
        this.active = true;
      }
    },
  },
  methods: {
    handleChangeMode() {
      this.isSmall = !this.isSmall;
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
          type: "ecom",
        };

        services.$package.checkDraftPackage(params).then((response) => {
          if (response.data.length === 0) {
            // trường hợp dữ liệu lỗi.
            countError += 1;
          }

          if (response.success) {
            // Duyệt từng phiên.
            response.data.forEach((data) => {
              if (
                data.session.status === "completed" ||
                data.session.status === "failed"
              ) {
                let flag = false;
                // Duyệt dữ liệu trong phiên. để cập nhật những đơn đã hoàn thành.
                for (const i in data.results) {
                  if (data.results[i].status === "completed") {
                    this.cacheSuccessOrder = uniqBy(
                      [...this.cacheSuccessOrder, data.results[i]],
                      "package_draft_id"
                    );

                    // Clear.
                    this.tmpSuccessOrder = this.tmpSuccessOrder.filter(
                      (item) =>
                        item.package_draft_id !==
                        data.results[i].package_draft_id
                    );
                    this.tmpFailedOrder = this.tmpFailedOrder.filter(
                      (item) =>
                        item.package_draft_id !==
                        data.results[i].package_draft_id
                    );
                    this.tmpPendingOrder = this.tmpPendingOrder.filter(
                      (item) =>
                        item.package_draft_id !==
                        data.results[i].package_draft_id
                    );
                  } else if (data.results[i].status === "failed") {
                    this.cacheFailedOrder = uniqBy(
                      [...this.cacheFailedOrder, data.results[i]],
                      "package_draft_id"
                    );

                    // Clear.
                    this.tmpSuccessOrder = this.tmpSuccessOrder.filter(
                      (item) =>
                        item.package_draft_id !==
                        data.results[i].package_draft_id
                    );
                    this.tmpFailedOrder = this.tmpFailedOrder.filter(
                      (item) =>
                        item.package_draft_id !==
                        data.results[i].package_draft_id
                    );
                    this.tmpPendingOrder = this.tmpPendingOrder.filter(
                      (item) =>
                        item.package_draft_id !==
                        data.results[i].package_draft_id
                    );
                  } else if (data.results[i].status === "pending") {
                    flag = true;
                  }
                }

                // Hoàn thành và không còn đơn chờ.
                if (!flag) {
                  const index = this.sessions.findIndex(
                    (item) => `${item.session_id}` === `${data.session_id}`
                  );
                  if (index === -1) return;
                  this.sessions.splice(index, 1);

                  // Hoàn thành đăng đơn.
                  // console.log("Hoàn thành đơn");
                  //
                  // console.log("cacheFailedOrder", this.cacheFailedOrder);
                  // console.log("cacheSuccessOrder", this.cacheSuccessOrder);
                  // console.log("tmpFailedOrder", this.tmpFailedOrder);
                  // console.log("tmpSuccessOrder", this.tmpSuccessOrder);
                  // console.log("tmpPendingOrder", this.tmpPendingOrder);
                }
              } else {
                // Chưa xong phiên.
                for (const i in data.results) {
                  // Clear.
                  this.tmpSuccessOrder = this.tmpSuccessOrder.filter(
                    (item) =>
                      item.package_draft_id !== data.results[i].package_draft_id
                  );
                  this.tmpFailedOrder = this.tmpFailedOrder.filter(
                    (item) =>
                      item.package_draft_id !== data.results[i].package_draft_id
                  );
                  this.tmpPendingOrder = this.tmpPendingOrder.filter(
                    (item) =>
                      item.package_draft_id !== data.results[i].package_draft_id
                  );

                  // thêm vào các phần tương ứng.
                  if (data.results[i].status === "completed") {
                    this.tmpSuccessOrder = uniqBy(
                      [...this.tmpSuccessOrder, data.results[i]],
                      "package_draft_id"
                    );
                  } else if (data.results[i].status === "failed") {
                    this.tmpFailedOrder = uniqBy(
                      [...this.tmpFailedOrder, data.results[i]],
                      "package_draft_id"
                    );
                  } else {
                    if (typeof data.results[i] !== "function") {
                      this.tmpPendingOrder = uniqBy(
                        [...this.tmpPendingOrder, data.results[i]],
                        "package_draft_id"
                      );
                    }
                  }
                }

                // // Chốt API.
                // // Hoàn thành đăng đơn.
                //
                // console.log("Chốt API");
                //
                // console.log("cacheFailedOrder", this.cacheFailedOrder);
                // console.log("cacheSuccessOrder", this.cacheSuccessOrder);
                // console.log("tmpFailedOrder", this.tmpFailedOrder);
                // console.log("tmpSuccessOrder", this.tmpSuccessOrder);
                // console.log("tmpPendingOrder", this.tmpPendingOrder);
              }
            });
          } else {
            countError += 1;
          }

          // NamVH: Hạn chế việc spam server khi lỗi hệ thống.
          if (countError > 50) {
            this.sessions = [];
          }
        });
      }, 5000);
    },
  },
  setup() {
    const indicator = h(LoadingOutlined, {
      style: {
        fontSize: "20px",
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
  border-radius: 4px;
  background-color: white;
  box-shadow: rgba(17, 17, 26, 0.1) 0px 4px 16px,
    rgba(17, 17, 26, 0.1) 0px 8px 24px, rgba(17, 17, 26, 0.1) 0px 16px 56px;
  font-size: 0.875rem;
  font-weight: 500;
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
  text-align: center;
  display: flex;
  align-items: center;
}

.small-mode .notify-item {
  width: 50px !important;
}

.notify-item {
  width: 150px;
  padding: 3px;
  height: 28px;
  overflow: hidden;
  white-space: nowrap;
  transition: width 0.4s;
}

.notify-item:hover {
  background: #efefef;
  border-radius: 50px;
}

.notify-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
  text-align: center;
  padding: 5px;
}
.notify-title {
  border-radius: 4px 0 0 4px;
  color: white;
  text-align: center;
  display: flex;
  height: 40px;
  align-items: center;
  background-color: var(--primaryColor);
  padding: 0 10px;
}
.notify-item-success {
  margin-left: 5px;
  border-radius: 50px;
  padding: 2px 10px;
  color: white;
  background-color: var(--primaryColor);
}

.notify-item-fail {
  margin-left: 5px;
  border-radius: 50px;
  padding: 2px 10px;
  color: white;
  background-color: #dc3545;
}

.notify-item-pending {
  margin-left: 5px;
  border-radius: 50px;
  padding: 2px 10px;
  color: white;
  background-color: #007bff;
}
</style>

<template>
  <div v-show="visible" class="g-notify-fix">
    <div
      @click="handleChangeMode"
      class="flex justify-content-space-between notify-title"
    >
      <div>
        <span v-if="waittingMessages.length > 0">
          <a-spin :indicator="indicator" /> &nbsp; Đang xử lý
          {{ waittingMessages.pending }} đơn
        </span>
        <span v-else> Log </span>
      </div>
      <a-tooltip :title="'Đóng'" v-if="!hasAwaitting">
        <CloseCircleOutlined @click.stop="handleClose" class="close-notify" />
      </a-tooltip>
    </div>
    <div :class="{ 'notify-body': true, 'small-mode': isSmall }">
      <a-popover trigger="click" placement="bottomRight">
        <template #content>
          <list-order-message :list="successedMessages" :status="'success'" />
        </template>
        <div class="notify-item">
          <span v-show="!isSmall">Thành công</span>
          <span class="notify-item-success">
            {{ successedMessages.length }}
          </span>
        </div>
      </a-popover>
      <a-popover trigger="click" placement="bottom">
        <template #content>
          <list-order-message :list="failedMessages" :status="'error'" />
        </template>
        <div class="notify-item">
          <span v-show="!isSmall">Lỗi</span>
          <span class="notify-item-fail">{{ failedMessages.length }}</span>
        </div>
      </a-popover>
      <a-popover trigger="click" placement="bottomRight">
        <template #content>
          <list-order-message :list="waittingMessages" :status="'waitting'" />
        </template>
        <div class="notify-item">
          <span v-show="!isSmall">Đang chờ</span>
          <span class="notify-item-pending">{{ waittingMessages.length }}</span>
        </div>
      </a-popover>
    </div>
  </div>
</template>

<script>
import { h } from "vue";

// Components
import { LoadingOutlined, CloseCircleOutlined } from "@ant-design/icons-vue";
import ListOrderMessage from "@/components/list/ListOrderMessage";

const messageTypes = {
  update_note_created_order: "Cập nhật ghi chú đơn đã tạo",
};

export default {
  name: "MessagesSystem",
  components: {
    ListOrderMessage,
    CloseCircleOutlined,
  },
  data() {
    return {
      tabActive: "",
      isSmall: false,
    };
  },
  computed: {
    visible() {
      return this.$store.state.global.visibleMessagesSystemModal;
    },
    messgesSystem() {
      return this.$store.getters["messagesSystem/getMessagesSystem"];
    },
    successedMessages() {
      return this.messgesSystem
        .filter((m) => m.status === "successed")
        .reverse();
    },
    failedMessages() {
      return this.messgesSystem.filter((m) => m.status === "failed").reverse();
    },
    waittingMessages() {
      return this.messgesSystem
        .filter((m) => m.status === "waitting" || m.status === "executing")
        .reverse();
    },
    total() {
      return {
        successed: this.successedMessages.length,
        failed: this.failedMessages.length,
        waitting: this.waittingMessages.length,
      };
    },
    hasAwaitting() {
      return this.waittingMessages.length;
    },
  },
  methods: {
    handleChangeMode() {
      console.log("handleChangeMode");
      this.isSmall = !this.isSmall;
    },
    formatType(type) {
      return messageTypes[type];
    },
    handleClose() {
      this.$store.commit("messagesSystem/clearAllMessages");
      this.$store.commit("global/setVisibleMessagesSystemModal", false);
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
};
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
  height: 30px;
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

<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="600"
    title="Chats yêu cầu"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="chat-request-modal-wrapper">
      <span class="name">Lưu Cơ Huệ</span>
      <div class="action-wrapper flex align-items-center">
        <img src="@/assets/icons/home.svg" />
        <img class="ml" src="@/assets/icons/phone_active.svg" />
        <img class="ml" src="@/assets/icons/ellipse_active.svg" />
        <img class="ml" src="@/assets/icons/flag_active.svg" />
        <div class="split" />
        <div class="online-status is-online" />
        <span class="ml">Đang hoạt động</span>
      </div>
      <div class="tabs">
        <div class="tab-item">
          <img src="@/assets/icons/message_active.svg" />
        </div>
        <div class="tab-item is-active">
          <b>ĐH 208329984</b>
          <img src="@/assets/icons/menu_down_submenu_right.svg" />
        </div>
      </div>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../elements/modal.vue";

export default {
  name: "ChatRequestModal",
  props: ["visible", "setVisible"],
  components: {
    GModal,
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    handleOk() {
      console.log("ok");
    },
  },
};
</script>

<style lang="scss" scoped>
.chat-request-modal-wrapper {
  .name {
    font-weight: bold;
    font-size: 22px;
  }
  .split {
    width: 1px;
    height: 20px;
    background-color: var(--grayColor);
    margin: 0 0.5rem;
  }
  .action-wrapper {
    margin: 0.5rem 0;
    .online-status {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      &.is-online {
        background-color: #33ca48;
      }
    }
  }
  .tabs {
    display: flex;
    align-items: center;
    width: calc(100% + 30px);
    height: 60px;
    border-bottom: 1px solid var(--grayColor);
    transform: translateX(-15px);
    .tab-item {
      flex: 1;
      justify-content: center;
      display: flex;
      align-items: center;
      position: relative;
      height: 100%;
      &.is-active {
        &::after {
          content: "";
          display: block;
          width: 100%;
          height: 3px;
          background-color: var(--primaryColor);
          position: absolute;
          bottom: -2px;
        }
      }
    }
  }
}
</style>

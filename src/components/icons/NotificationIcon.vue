<template>
  <div class="notification-icon-wrapper">
    <img src="@/assets/icons/notification.svg" />
    <div class="total-notification">
      <span class="smaller">
        <span>99</span>
        <span class="notification-plus">+</span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationIcon",
};
</script>

<style lang="scss" scoped>
.notification-icon-wrapper {
  .total-notification {
    cursor: pointer;
    background-color: #eb5757;
    width: 25px;
    height: 25px;
    border-radius: 50%;
    position: absolute;
    top: 1px;
    right: 3px;
    span {
      color: #fff;
      &.smaller {
        font-size: 80%;
        display: flex;
        height: 100%;
        align-items: center;
        justify-content: center;
        .notification-plus {
          position: absolute;
          top: 0;
          right: 1px;
        }
      }
    }
  }
}
</style>

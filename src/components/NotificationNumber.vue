<template>
  <div class="notification-number-wrapper">
    <img v-if="isActive" src="@/assets/icons/notification_active.svg" />
    <img v-else src="@/assets/icons/notification.svg" />
    <div
      class="total-notification"
      v-if="total"
      :class="{ smaller: total > 99 }"
    >
      <span>
        <span>{{ total > 99 ? "99" : total }}</span>
        <span v-if="total && total > 99" class="notification-plus"> + </span>
      </span>
    </div>
  </div>
</template>

<script>
export default {
  name: "NotificationNumber",
  props: ["total", "isActive"],
};
</script>

<style lang="scss" scoped>
.notification-number-wrapper {
  cursor: pointer;
  position: relative;
  width: 40px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  .total-notification {
    background-color: #eb5757;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    top: -5px;
    right: -5px;
    &.smaller {
      width: 29px;
      border-radius: 20px;
    }
    span {
      color: #fff;
      font-size: 11px;
    }
  }
}
</style>

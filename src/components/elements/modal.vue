<template>
  <a-modal class="g-modal">
    <slot />
    <div class="header-right-slot">
      <slot name="headerRight" />
    </div>
  </a-modal>
</template>

<script>
export default {
  name: "GModal",
};
</script>

<style lang="scss">
.g-modal {
  &.no-padding {
    .ant-modal-body {
      padding: 0 !important;
    }
  }
  .ant-modal-content {
    border-radius: 8px;
    .ant-modal-header {
      background-color: var(--primaryColor);
      border-radius: 8px 8px 0 0;
      .ant-modal-title {
        color: #fff;
        text-align: center;
        font-weight: bold;
        font-size: 20px;
      }
    }
    .ant-modal-close {
      .anticon.anticon-close.ant-modal-close-icon {
        svg {
          font-size: 20px;
          fill: #fff;
        }
      }
    }
    .ant-modal-body {
      padding: 1rem;
    }
  }
  &.has-header-right {
    .ant-modal-close {
      display: none;
    }
  }
}
</style>

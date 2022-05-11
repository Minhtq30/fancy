<template>
  <a-timeline
    class="g-timeline-v2"
    :class="{ [`type-${type || 'check'}`]: true }"
  >
    <slot />
  </a-timeline>
</template>

<script>
export default {
  name: "GTimeline",
  props: ["type"],
};
</script>

<style lang="scss">
.g-timeline-v2 {
  &.type-check {
    .ant-timeline-item:not(.is-extend) {
      &:first-child {
        padding-bottom: 0;
        .ant-timeline-item-head-blue {
          margin-left: -2.5px;
          background-color: #c4c4c4;
          color: unset;
          border: 0;
          width: 14px;
          height: 14px;
          font-size: 25px;
        }
        .ant-timeline-item-head-blue::before {
          color: #fff;
          content: "";
          position: absolute;
          left: 1px;
          top: 0;
          background: url("../../assets/icons/check.svg") no-repeat center;
          width: 14px;
          height: 14px;
        }
      }
    }
  }

  .ant-timeline-item {
    padding-bottom: 0;
    .ant-timeline-item-head-blue {
      margin-left: 0.5px;
      background-color: #c4c4c4;
      color: unset;
      border: 0;
      width: 9px;
      height: 9px;
    }

    .ant-timeline-item-tail {
      position: absolute;
      top: 9px;
      left: 4px;
      height: 100%;
      border-left: 2px solid var(--grayColor);
    }

    .ant-timeline-item-content {
      min-height: unset;
      font-size: 16px;
      color: #000;
    }

    &.is-current {
      .ant-timeline-item-head-blue {
        background-color: var(--primaryColor) !important;
      }
      .ant-timeline-item-content {
        color: var(--primaryColor);
      }
    }
    &:last-child {
      .ant-timeline-item-tail {
        height: 0;
      }
    }
  }
}
</style>

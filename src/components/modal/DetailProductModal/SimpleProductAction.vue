<template>
  <div class="t-flex t-justify-between simple-action">
    <div>
      <span
        class="status-icon t-inline-block t-rounded-full t-w-[12px] t-h-[12px]"
        :style="{ backgroundColor: customerColor }"
      />
      <span class="ml medium-text customer-name">
        {{ event?.customer?.full_name }}
      </span>
      <span class="ml action-content"> {{ event?.action }} </span>
    </div>
    <span class="action-time t-text-sm">
      <i>{{ createdAt }}</i>
    </span>
  </div>
</template>

<script>
import { formatCreatedEventProduct } from "@/utils/date";

export default {
  name: "SimpleProductAction",
  props: ["event"],
  methods: {
    formatTime() {
      return "Vừa mới";
    },
  },
  computed: {
    customerColor() {
      let color = "#bdbdbb";
      const arrayColor = ["blue", "purple", "red", "yellow"];

      for (const c of arrayColor) {
        if (this.event?.customer[c]) {
          color = c;
          if (color === "blue") {
            color = "#069255";
          }
          break;
        }
      }

      return color;
    },
    createdAt() {
      return formatCreatedEventProduct(this.event.created_ts);
    },
  },
};
</script>

<style lang="scss" scoped>
.simple-action {
  line-height: 20px;
  padding: 1rem 0;
  border-bottom: 1px solid #e0e0e0;
  .status-green {
    background-color: #069255;
  }
  .status-purple {
    background-color: #7f007f;
  }
  .action-time {
    color: #808080;
  }
}
</style>

<template>
  <div class="channel__item-col channel__item-code-ghtk">
    <span class="">{{ dataSource }}</span>
  </div>
</template>

<script>
import { defineComponent } from "vue";

export default defineComponent({
  name: "order-excel-col-code",
  props: {
    dataSource: {
      type: String,
      default: "",
    },
  },
});
</script>

<style lang="scss" scoped>
.channel__item-code-ghtk {
  padding: 3px;
  span {
    word-break: break-word;
  }
}
</style>

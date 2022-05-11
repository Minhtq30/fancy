<template>
  <div
    class="flex justify-content-space-between t-text-16 t-leading-5 refund-reason t-cursor-pointer"
  >
    <div class="">
      {{ text }}
    </div>
    <div class="">
      <span class="t-pr-2 t-text-16 t-leading-5"> {{ value }} ĐH</span>
      <span
        class="t-pr-4 t-text-primary t-pl-2 t-text-14 t-leading-4.5 align-items-center"
      >
        {{ percentage }}%
      </span>
      <span class="arrow-right-refund-reason">
        <Arrow :width="6.5" :height="12" />
      </span>
    </div>
  </div>
</template>

<script>
import Arrow from "@/components/icons/ArrowRightIcon.vue";
export default {
  name: "Refund-reason",

  props: {
    text: String,
    value: String,
    percentage: String,
    reason: String,
  },
  components: {
    Arrow,
  },
};
</script>
<style lang="scss">
.refund-reason {
  box-shadow: inset 0px -1px 0px #e0e0e0;
  padding-top: 16px;
  padding-bottom: 16px;
}
// .reason-refund:last-child {
//   .arrow-right-refund-reason {
//     opacity: 0;
//   }
// }
</style>

<template>
  <div class="detail-table-wrapper">
    <table class="w-100 g-table">
      <thead class="t-sticky t-top-0 t-z-10">
        <tr>
          <th class="medium-text">Tên giao dich</th>
          <th class="medium-text">Số tiền</th>
          <th class="medium-text">Thời gian giao dịch</th>
          <th class="medium-text">Nội dung giao dịch</th>
          <th class="medium-text">Thao tác</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="i in 3" :key="i">
          <td class="t-min-w-[200px]">
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td class="t-min-w-[200px]">
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td class="t-min-w-[200px]">
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td class="t-min-w-[250px]">
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td class="t-min-w-[170px] t-w-[170px]">
            <g-skeleton-button :active="true" class="mb" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { GSkeletonButton, GSkeletonText } from "@/components/elements/skeleton";
export default {
  components: {
    GSkeletonButton,
    GSkeletonText,
  },
  props: [],
  data() {
    return {};
  },
  mounted() {},
  computed: {},
  methods: {},
  watch: {},
};
</script>

<style lang="scss" scoped></style>

<style lang="scss"></style>

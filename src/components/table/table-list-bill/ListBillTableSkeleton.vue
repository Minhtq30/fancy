<template>
  <table class="w-100 g-table g-table-skeleton">
    <thead>
      <tr>
        <th class="medium-text t-w-[330px]">Đơn hàng</th>
        <th class="medium-text t-w-[320px]">Sản phẩm</th>
        <th class="medium-text">Cập nhật</th>
        <th class="medium-text t-w-[155px]">Thao tác</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="item in [1, 2, 3]" :key="item">
        <td>
          <g-skeleton-text :active="true" :width="'80%'" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
        <td>
          <package-logs :packageDetail="{}" :isLoading="true" />
        </td>
        <td>
          <g-skeleton-button :active="true" class="mb" />
          <g-skeleton-button :active="true" class="mb" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { GSkeletonText, GSkeletonButton } from "@/components/elements/skeleton";

export default {
  name: "TopProductTableSkeleton",
  components: {
    GSkeletonText,
    GSkeletonButton,
  },
};
</script>

<style lang="scss" scoped>
.g-table-skeleton {
  td {
    vertical-align: top;
  }
}
</style>

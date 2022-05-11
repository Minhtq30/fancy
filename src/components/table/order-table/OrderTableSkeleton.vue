<template>
  <table class="w-100 g-table g-table-skeleton">
    <thead>
      <tr>
        <th>Đơn hàng</th>
        <th>Khách hàng</th>
        <!-- <th>Sản phẩm</th> -->
        <th>Log</th>
        <th>
          <g-checkbox :checked="false" />
          Chọn tất cả
        </th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
          <g-skeleton-text :active="true" />
          <g-skeleton-text :active="true" :width="'50%'" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
          <g-skeleton-image class="mt skeleton-tracking-image" :active="true" />
        </td>
        <!-- <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td> -->
        <td>
          <div class="mt-1">
            <package-logs :packageDetail="{}" :isLoading="true" />
          </div>
        </td>
        <td>
          <g-skeleton-button :active="true" class="mb" />
          <g-skeleton-button :active="true" class="mb" />
          <g-skeleton-button :active="true" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { GCheckbox } from "@/components/elements";
import {
  GSkeletonButton,
  GSkeletonImage,
  GSkeletonText,
} from "@/components/elements/skeleton";
import PackageLogs from "./PackageLogs.vue";

export default {
  name: "OrderTableSkeleton",
  components: {
    GSkeletonButton,
    GSkeletonImage,
    GSkeletonText,
    GCheckbox,
    PackageLogs,
  },
};
</script>

<style lang="scss" scoped>
@import "./table-responsive.scss";

.g-table-skeleton {
  td {
    vertical-align: top;
  }
}
</style>

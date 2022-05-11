<template>
  <table class="w-100 g-table g-table-skeleton">
    <thead>
      <tr>
        <th class="medium-text t-w-[600px]">Sản phẩm</th>
        <th class="medium-text t-text-right">Tương tác</th>
        <th class="medium-text t-text-right">Đặt mua</th>
        <th class="medium-text t-text-right">Đã bán</th>
        <th class="medium-text t-text-right">Đã hoàn</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="t-flex t-items-center t-h-24">
          <g-skeleton-text :active="true" :width="'18%'" />
          <g-skeleton-image
            class="mt"
            :maxWidth="64"
            :height="64"
            :active="true"
          />
          <g-skeleton-text :active="true" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
        <td class="t-text-right">
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
      </tr>
      <tr>
        <td class="t-flex t-items-center t-h-24">
          <g-skeleton-text :active="true" :width="'18%'" />
          <g-skeleton-image
            class="mt"
            :maxWidth="64"
            :height="64"
            :active="true"
          />
          <g-skeleton-text :active="true" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
        <td class="t-text-right">
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
      </tr>
      <tr>
        <td class="t-flex t-items-center t-h-24">
          <g-skeleton-text :active="true" :width="'18%'" />
          <g-skeleton-image
            class="mt"
            :maxWidth="64"
            :height="64"
            :active="true"
          />
          <g-skeleton-text :active="true" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
        <td>
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
        <td class="t-text-right">
          <g-skeleton-text :active="true" :width="'30%'" />
          <g-skeleton-text :active="true" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { GSkeletonImage, GSkeletonText } from "@/components/elements/skeleton";

export default {
  name: "TopProductTableSkeleton",
  components: {
    GSkeletonImage,
    GSkeletonText,
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

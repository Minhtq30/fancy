<template>
  <div class="warehouse-table-wrapper">
    <table class="w-100 g-table 2xl:t-table-fixed">
      <thead>
        <tr>
          <th class="medium-text t-min-w-[366px] t-w-[366px]">Tên sản phẩm</th>
          <th class="medium-text t-text-right">Giá bán</th>
          <th class="medium-text t-text-right">Tương tác</th>
          <th class="medium-text t-text-right">Đặt mua</th>
          <th class="medium-text t-text-right">Đã xuất</th>
          <th class="medium-text t-text-right">Đã bán</th>
          <th class="medium-text t-text-right">Hoàn hàng</th>
          <th class="medium-text t-text-right">Tồn</th>
          <th class="medium-text t-text-right">Doanh thu</th>
        </tr>
      </thead>
      <tbody class="t-align-top">
        <tr v-for="i in 3" :key="i">
          <td
            class="warehouse-table-product t-max-w-[366px] t-w-[366px] t-flex"
          >
            <g-skeleton-image :maxWidth="76" :height="76" :active="true" />
            <div class="t-flex-1 t-ml-[15px]">
              <g-skeleton-text :active="true" :width="'100%'" />
              <g-skeleton-text :active="true" :width="'30%'" />
            </div>
          </td>
          <td
            class="warehouse-table-inventory t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <g-skeleton-text :active="true" :width="'100%'" />
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td
            class="warehouse-table-inventory t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <g-skeleton-text :active="true" :width="'100%'" />
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td
            class="warehouse-table-inventory t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <g-skeleton-text :active="true" :width="'100%'" />
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td
            class="warehouse-table-inventory t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <g-skeleton-text :active="true" :width="'100%'" />
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td
            class="warehouse-table-inventory t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <g-skeleton-text :active="true" :width="'100%'" />
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td
            class="warehouse-table-inventory t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <g-skeleton-text :active="true" :width="'100%'" />
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td
            class="warehouse-table-inventory t-text-right t-min-w-[100px] xl:t-w-auto xl:t-min-w-auto"
          >
            <g-skeleton-text :active="true" :width="'100%'" />
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
          <td
            class="warehouse-table-turnover t-text-right xl:t-w-auto xl:t-min-w-auto"
          >
            <g-skeleton-text :active="true" :width="'100%'" />
            <g-skeleton-text :active="true" :width="'100%'" />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { GSkeletonImage, GSkeletonText } from "@/components/elements/skeleton";
export default {
  name: "WareHouseTableSkeleton",
  components: {
    GSkeletonImage,
    GSkeletonText,
  },
};
</script>

<style lang="scss" scoped></style>

<style lang="scss"></style>

<template>
  <div class="table-c2c-request-wrapper">
    <table class="w-100 g-table">
      <thead>
        <tr>
          <th>Yêu cầu</th>
          <th>Mã đơn hàng</th>
          <th>Nội dung yêu cầu</th>
          <th>Trạng thái</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><g-skeleton-text /></td>
          <td><g-skeleton-text /></td>
          <td><g-skeleton-text /></td>
          <td><g-skeleton-text /></td>
        </tr>
        <tr>
          <td><g-skeleton-text /></td>
          <td><g-skeleton-text /></td>
          <td><g-skeleton-text /></td>
          <td><g-skeleton-text /></td>
        </tr>
        <tr>
          <td><g-skeleton-text /></td>
          <td><g-skeleton-text /></td>
          <td><g-skeleton-text /></td>
          <td><g-skeleton-text /></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { GSkeletonText } from "@/components/elements/skeleton";

export default {
  name: "TableC2CRequestSkeleton",
  props: ["dataSource"],
  components: {
    GSkeletonText,
  },
};
</script>

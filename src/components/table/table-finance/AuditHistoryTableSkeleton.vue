<template>
  <table
    id="audit-history-table-skeleton"
    class="w-100 g-table g-table-skeleton"
  >
    <thead>
      <th>Thông tin hóa đơn</th>
      <th>Tiền thu hộ (1)</th>
      <th>Tiền cộng (2)</th>
      <th>Tiền phí dịch vụ (3)</th>
      <th>Tiền đối soát</th>
      <th>Thao tác</th>
    </thead>
    <tbody>
      <tr>
        <td style="max-width: 275px; width: 275px">
          <g-skeleton-text :active="true" />
          <g-skeleton-text :width="'60%'" :active="true" />
          <g-skeleton-text :width="'50%'" :active="true" />
          <g-skeleton-text :active="true" />
          <g-skeleton-text :width="'80%'" :active="true" />
          <g-skeleton-text :width="'80%'" :active="true" />
          <div class="divider" />
          <g-skeleton-text :width="'30%'" :active="true" />
          <g-skeleton-text :width="'30%'" :active="true" />
        </td>
        <td style="max-width: 135px; width: 135px">
          <span class="money-value">
            <g-skeleton-text :active="true" />
          </span>
        </td>
        <td style="max-width: 240px; width: 240px">
          <div
            class="money-value text-align-right"
            :class="{ 'has-detail': true }"
          >
            <g-skeleton-text :active="true" />
          </div>
          <div class="wrapper-detail-fees">
            <div class="flex justify-content-space-between item-detail-fee">
              <div class="item-detail-fee__label">
                <g-skeleton-text
                  class="font-size-14 mb-16"
                  :width="'80%'"
                  :active="true"
                />
              </div>
              <div class="item-detail-fee__value">
                <g-skeleton-text
                  class="font-size-14 mb-16"
                  :width="'80%'"
                  :active="true"
                />
              </div>
            </div>
          </div>
          <div class="wrapper-detail-fees">
            <div class="flex justify-content-space-between item-detail-fee">
              <div class="item-detail-fee__label">
                <g-skeleton-text
                  class="font-size-14 mb-16"
                  :width="'80%'"
                  :active="true"
                />
              </div>
              <div class="item-detail-fee__value">
                <g-skeleton-text
                  class="font-size-14 mb-16"
                  :width="'80%'"
                  :active="true"
                />
              </div>
            </div>
          </div>
        </td>
        <td style="max-width: 260px; width: 260px">
          <div
            class="money-value text-align-right"
            :class="{ 'has-detail': true }"
          >
            <g-skeleton-text :active="true" />
          </div>
          <div class="wrapper-detail-fees">
            <div class="flex justify-content-space-between item-detail-fee">
              <div class="item-detail-fee__label">
                <g-skeleton-text
                  class="font-size-14 mb-16"
                  :width="'80%'"
                  :active="true"
                />
              </div>
              <div class="item-detail-fee__value">
                <g-skeleton-text
                  class="font-size-14 mb-16"
                  :width="'80%'"
                  :active="true"
                />
              </div>
            </div>
            <div class="flex justify-content-space-between item-detail-fee">
              <div class="item-detail-fee__label">
                <g-skeleton-text
                  class="font-size-14 mb-16"
                  :width="'80%'"
                  :active="true"
                />
              </div>
              <div class="item-detail-fee__value">
                <g-skeleton-text
                  class="font-size-14 mb-16"
                  :width="'80%'"
                  :active="true"
                />
              </div>
            </div>
            <div class="flex justify-content-space-between item-detail-fee">
              <div class="item-detail-fee__label">
                <g-skeleton-text
                  class="font-size-14 mb-16"
                  :width="'80%'"
                  :active="true"
                />
              </div>
              <div class="item-detail-fee__value">
                <g-skeleton-text
                  class="font-size-14 mb-16"
                  :width="'80%'"
                  :active="true"
                />
              </div>
            </div>
          </div>
        </td>
        <td style="max-width: 135px; width: 135px">
          <div class="money-value">
            <g-skeleton-text :active="true" />
          </div>
        </td>
        <td style="max-width: 150px; width: 150px; padding: 16px 8px">
          <g-skeleton-button :active="true" class="mb" />
          <g-skeleton-button :active="true" class="mb" />
          <g-skeleton-button :active="true" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script>
import { GSkeletonButton, GSkeletonText } from "@/components/elements/skeleton";

export default {
  name: "AuditHistoryTableSkeleton",
  components: {
    GSkeletonButton,
    GSkeletonText,
  },
};
</script>

<style lang="scss" scoped>
#audit-history-table-skeleton {
  font-size: 14px;
  thead {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 1;
  }
  th {
    font-size: 16px 12px;
  }
  td {
    vertical-align: top;
    word-wrap: break-word;
    font-size: 16px 12px;
    p {
      margin-bottom: 0;
    }
  }
}
.divider {
  width: 100%;
  height: 1px;
  background-color: #c4c4c4;
  margin-bottom: 8px;
}
.item-detail-fee__label,
.item-detail-fee__value {
  width: 80%;
}
.item-detail-fee__value {
  display: flex;
  justify-content: flex-end;
}
.has-detail {
  margin-bottom: 16px;
  padding-bottom: 8px;
  border-bottom: 1px solid #e0e0e0;
}
.g-table-skeleton {
  td {
    vertical-align: top;
  }
}
</style>

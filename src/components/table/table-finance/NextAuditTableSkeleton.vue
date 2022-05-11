<template>
  <table id="next-audit-table-skeleton" class="w-100 g-table g-table-skeleton">
    <thead>
      <th>Tiền CoD (1)</th>
      <th>Tiền cộng (2)</th>
      <th>Phí dịch vụ (3)</th>
      <th>Số dư<br />hiện tại (4)</th>
      <th>Số dư chốt (5)</th>
      <th>Tiền đang<br />luân chuyển (6)</th>
      <th>Thao tác</th>
    </thead>
    <tbody>
      <tr>
        <td style="max-width: 126px; width: 126px">
          <g-skeleton-text :active="true" />
        </td>
        <td style="max-width: 258px; width: 258px">
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
        <td style="max-width: 301px; width: 301px">
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
        <td style="max-width: 126px; width: 126px">
          <div class="money-value">
            <g-skeleton-text :active="true" />
          </div>
        </td>
        <td style="max-width: 126px; width: 126px">
          <div class="money-value">
            <g-skeleton-text :active="true" />
          </div>
        </td>
        <td style="max-width: 126px; width: 126px">
          <div class="money-value">
            <g-skeleton-text :active="true" />
          </div>
        </td>
        <td style="max-width: 150px; width: 150px; padding: 16px 8px">
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
#next-audit-table-skeleton {
  font-size: 14px;
  thead {
    position: sticky;
    top: 0;
    background-color: #fff;
    z-index: 1;
  }
  th {
    padding: 16px 12px;
  }
  td {
    vertical-align: top;
    word-wrap: break-word;
    padding: 16px 12px;
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

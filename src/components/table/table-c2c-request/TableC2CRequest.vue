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
        <tr v-if="!dataSource.length">
          <td colspan="4">
            <a-empty :description="'Danh sách trống'" />
          </td>
        </tr>
        <tr v-else v-for="(item, index) of dataSource" :key="index">
          <td style="max-width: 280px; min-width: 200px">
            <span class="medium-text"
              >TK {{ item?.Feedback?.id }}/
              {{ item?.Feedback?.feedback_type }}</span
            ><br />
            <span v-if="item?.Feedback?.created">{{
              formatCountdownTime(item.Feedback.created)
            }}</span>
          </td>
          <td style="max-width: 250px; min-width: 200px; word-break: break-all">
            {{ item?.Feedback?.package_alias }}
          </td>
          <td style="max-width: 442px; min-width: 350px">
            <span v-html="item?.Ticket?.desc" />
          </td>
          <td style="min-width: 120px">
            <span v-if="item?.Ticket?.status_id">{{
              convertStatusText(item?.Ticket?.status_id)
            }}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script>
import { formatCountdownTime } from "@/utils/date";

export const TICKET_STATUS_TEXT = {
  1: "Chờ tiếp nhận",
  2: "Đang xử lý",
  3: "Đã xử lý xong",
  4: "Hủy",
};

export default {
  name: "TableC2CRequest",
  props: ["dataSource"],
  methods: {
    formatCountdownTime(timeString) {
      return formatCountdownTime(timeString);
    },
    convertStatusText(status_id) {
      return TICKET_STATUS_TEXT[status_id] || `Không xác định (${status_id})`;
    },
  },
};
</script>

<style lang="scss" scoped>
.table-c2c-request-wrapper {
  height: calc(100% - 59px);
  overflow: auto;
  position: relative;
  thead {
    position: sticky;
    top: 0;
    z-index: 1;
  }
  td {
    vertical-align: top;
  }
  .pagination-wrapper {
    height: 60px;
    display: flex;
    align-items: center;
    border: 1px solid var(--grayColor);
    padding: 0 1rem;
    position: absolute;
    bottom: 0;
    left: 15px;
    right: 15px;
  }
}
</style>

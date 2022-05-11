<template>
  <div className="channel__item-col channel__item-info-order">
    <div>
      <b>{{ item.alias }}</b>
    </div>
    <div>
      {{ item.customer_fullname }} /
      <hidden-content :text="item.customer_tel" :first="3" :last="4" />
    </div>
    <div>
      Địa chỉ giao:
      {{ `${item.customer_first_address}, ${item.customer_last_address}` }}
    </div>
    <div>Mã ĐH riêng: {{ item.client_id }}</div>
    <div>Trạng thái: {{ item.package_status_id_text }}</div>
    <div>
      Dịch vụ: {{ item.transport_service }} | Hình thức VC: {{ getTransport }}
    </div>
    <div>Lượt đăng đơn: {{ getCreatedTime }}</div>
  </div>
</template>

<script>
import { defineComponent } from "vue";

// Components
import { HiddenContent } from "@/components";

export default defineComponent({
  name: "order-created-col-info-order",
  components: {
    HiddenContent,
  },
  props: {
    orderId: String,
    item: Object,
  },
  computed: {
    getTransport() {
      if (this.item.transport === "road") return "Bộ";
      return "Bay";
    },
    getCreatedTime() {
      if (this.item.created) {
        const dataTime = this.item.created.split(" ");
        if (dataTime.length >= 2) {
          return `${dataTime[1]} Ngày ${dataTime[0]}`;
        }
      }
      return "Chưa xác định";
    },
  },
});
</script>

<style lang="scss">
.channel__item-info-order {
  width: 100%;
  height: 100%;
  padding: 0 10px;

  > div {
    margin: 10px 0;
  }
}
</style>

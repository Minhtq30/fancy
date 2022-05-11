<template>
  <g-modal
    :visible="visible"
    :footer="null"
    :centered="true"
    :width="900"
    :title="`Lộ trình đơn hàng ${order.alias}`"
    @ok="handleOk"
    @cancel="handleCancel"
  >
    <div class="expand-static-map-modal-wrapper">
      <div class="order-info flex">
        <div class="order-info__left flex">
          <img src="@/assets/icons/marker_green.svg" />
          <div class="ml">
            <p><b>Kho lấy</b></p>
            <p>
              {{ order.pick_fullname }} /
              <hidden-content :text="order.pick_tel" :first="3" :last="4" />
            </p>
            <p>{{ order.pick_first_address }}, {{ order.pick_last_address }}</p>
          </div>
        </div>

        <div class="order-info__right flex">
          <img src="@/assets/icons/marker_red.svg" />
          <div class="ml">
            <p><b>Khách hàng</b></p>
            <p>
              {{ order.customer_fullname }} /
              <hidden-content :text="order.customer_tel" :first="3" :last="4" />
            </p>
            <p>
              <hidden-content
                :text="order.customer_first_address"
                :first="1"
                :last="1"
              />,
              {{ order.customer_last_address }}
            </p>
          </div>
        </div>
      </div>
      <div class="image-static mt-1">
        <g-map
          :data="getDataFromURL"
          :startAddress="`${order.pick_first_address}, ${order.pick_last_address}`"
          :endAddress="`${order.customer_first_address}, ${order.customer_last_address}`"
        />
      </div>
    </div>
  </g-modal>
</template>

<script>
import GModal from "../elements/modal.vue";
import { HiddenContent } from "@/components";
import GMap from "@/components/map";
import parseURLParams from "@/utils/parseURLParams";

export default {
  name: "OrderNoteModal",
  props: ["order", "visible", "setVisible"],
  components: {
    GModal,
    HiddenContent,
    GMap,
  },
  computed: {
    getDataFromURL() {
      const url = this.order?.static_map_url || "";
      return parseURLParams(url);
      // return parseURLParams(
      //   "https://web-static-map.ghtk.vn/image?start_point=10.823099,106.629662&end_point=20.980207982440216,105.81843347619952&percent_of_distance=70&type_transport=motorbiking&arrows=0"
      // );
    },
  },
  methods: {
    handleCancel() {
      this.setVisible(false);
    },
    handleOk() {
      console.log("ok");
    },
  },
};
</script>

<style lang="scss" scoped>
.order-info {
  color: #000;
  .order-info__left,
  .order-info__right {
    align-items: flex-start;
    flex: 1;
    p {
      font-size: 14px;
      margin-bottom: 0;
    }
  }
}

.image-static {
  height: 500px;
  background-size: contain;
  background-repeat: no-repeat;
}
</style>

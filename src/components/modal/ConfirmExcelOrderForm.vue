<template>
  <g-modal
    :visible="visible"
    :footer="false"
    :centered="true"
    :width="600"
    :title="`Xác nhận đẩy đơn sang GHTK`"
    @cancel="handleCancel"
  >
    <i class="t-text-black t-font-medium">
      Vui lòng xác nhận lại dữ liệu đăng đơn sau đây:
    </i>
    <div class="t-text-base t-mt-4 t-mb-4">
      <div>
        Tổng SL:
        <span class="text-green-500 t-font-medium"
          >{{ selectedList.length }} ĐH</span
        >
      </div>
      <div class="t-mt-4">
        Tổng KL:
        <span class="text-green-500 t-font-medium"
          >{{ totalWeight.toLocaleString().replace(".", ",") }} KG</span
        >
      </div>
      <div class="t-mt-4">
        Tổng tiền CoD:
        <span class="text-green-500 t-font-medium"
          >{{ convertVND(totalPick) }} đ</span
        >
      </div>
      <div class="t-mt-4">
        Tổng giá trị hàng:
        <span class="text-green-500 t-font-medium"
          >{{ convertVND(totalValue) }} đ</span
        >
      </div>
    </div>
    <p class="t-text-red-400">Kiểm tra lại thông tin ĐH nếu thấy sai số</p>
    <div class="t-flex t-justify-end">
      <g-button @click="handleSubmit" class="t-mr-2 primary">
        OK, Đăng đơn
      </g-button>
      <g-button @click="handleCancel" :type="'danger'">Hủy</g-button>
    </div>
  </g-modal>
</template>
<script>
import { replace } from "lodash";
import { GModal } from "../elements";
import GButton from "../elements/button";

export default {
  components: {
    GButton,
    GModal,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    setVisible: {
      type: Function,
    },
    selectedList: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      totalValue: 0,
      totalWeight: 0,
      totalPick: 0,
    };
  },
  watch: {
    visible(newValue) {
      if (newValue) {
        let totalValue = 0;
        let totalWeight = 0;
        let totalPick = 0;
        this.selectedList.forEach((each) => {
          totalPick =
            parseInt(totalPick) + parseInt(replace(each.pick_money, /,/g, ""));
          each.products.forEach((prod) => {
            totalValue =
              parseInt(totalValue) + parseInt(replace(prod.money, /,/g, ""));
            totalWeight = parseFloat(totalWeight) + parseFloat(prod.weight);
          });
        });
        this.totalValue = totalValue;
        this.totalPick = totalPick;
        this.totalWeight = totalWeight;
      }
    },
  },
  methods: {
    handleSubmit() {
      this.handleCancel();
      this.$emit("onSubmit");
    },
    handleCancel() {
      this.setVisible(false);
    },
    convertVND(nStr, decSeperate = ".", groupSeperate = ",") {
      if (!nStr) {
        return 0;
      }
      nStr = this.vndToNumber(nStr);
      nStr += "";
      const x = nStr.split(decSeperate);
      let x1 = x[0];
      const x2 = x.length > 1 ? "." + x[1] : "";
      const rgx = /(\d+)(\d{3})/;
      while (rgx.test(x1)) {
        x1 = x1.replace(rgx, "$1" + groupSeperate + "$2");
      }
      return x1 + x2;
    },

    vndToNumber(x) {
      if (!x) {
        return 0;
      }
      x = x.toString();
      x = x.replace(/\D/g, "");
      return x;
    },
  },
};
</script>
<style scoped>
.ant-divider-horizontal {
  display: block;
  clear: both;
  width: 100%;
  min-width: 100%;
  height: 1px;
  margin: 12px 0;
}
.text-green-500 {
  color: var(--primaryColor);
}
.ant-btn-danger {
  color: red !important;
  background-color: white;
  border-color: red !important;
}
</style>

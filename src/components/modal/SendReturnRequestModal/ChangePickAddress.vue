<template>
  <div>
    <div class="field-row">
      <span>Bấm để chọn địa chỉ lấy hàng</span>
    </div>
    <div class="field-row">
      <g-select
        :data-source="pickAddresses"
        :borderless="true"
        class="w-100"
        v-model:selected-item="selectedPickAddress"
        placeholder="Địa chỉ lấy"
      >
        <template v-slot:option="{ item, index }">
          <div class="t-flex t-flex-row t-items-center">
            <b class="t-mr-2" style="width: 95px; flex: 0 1 95px">
              Địa chỉ {{ index + 1 }}:
            </b>
            <p style="flex: 1" class="t-mb-0">{{ item.labelEx }}</p>
          </div>
        </template>
      </g-select>
    </div>
    <div class="field-row">
      <span class="danger-text change-pick-address-des">
        ĐH tiết kiệm trong phiên khi thay đổi địa chỉ lấy hàng, cước phí sẽ
        chuyển về gói cước thường
      </span>
    </div>
    <div class="field-row" @click="toogleChecked">
      <checkbox-custom :checked="checked" />
      <span class="ml">Điểm lấy hàng là điểm trả hàng</span>
    </div>
    <g-button
      class="primary w-100"
      :disabled="!selectedPickAddress.value || !isValidNewPickAddress"
      :loading="loading"
      @click="handleSubmit"
    >
      Xác nhận
    </g-button>
  </div>
</template>

<script>
import { mapState } from "vuex";
import { GSelect } from "@/components";
import { CheckboxCustom, GButton } from "@/components/elements";
import ticketService from "../../../services/ticket.service";

export default {
  name: "ChangePickAddress",
  props: ["type", "session", "setLoading", "loading", "ids", "handleCancel"],
  components: {
    GSelect,
    GButton,
    CheckboxCustom,
  },
  data() {
    return {
      selectedPickAddress: {
        value: this.session.pick_address_id,
        label: this.session.pick_address_name,
      },
      checked: true,
    };
  },
  methods: {
    toogleChecked() {
      this.checked = !this.checked;
    },
    async handleSubmit() {
      this.setLoading(true);
      try {
        const params = {
          session_id: this.session.id,
          shop_pick_address: this.selectedPickAddress.value,
        };
        if (this.checked) {
          params.shop_return_address = this.selectedPickAddress.value;
        }
        if (this.ids) {
          params.packages = this.ids || [];
        }

        const response = await ticketService.changePickAddress(params);

        if (response.data.success) {
          this.handleCancel();
          this.$message.success(response.data.message);
        } else {
          this.$message.error(
            response.data.message || "Oops! Something went wrong when call api."
          );
        }
      } catch (error) {
        this.$message.error("Oops! Something went wrong when call api.");
      }
      this.setLoading(false);
    },
  },
  computed: {
    ...mapState({
      pickAddresses: (state) => state.shop.ListPickAddress,
    }),
    isValidNewPickAddress() {
      return this.selectedPickAddress.value !== this.session.pick_address_id;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./detail.scss";
.change-pick-address-des {
  font-size: 14px;
}
</style>

<template>
  <div class="request-kick">
    <div class="wrapper-input">
      <span>Ghi chú</span>
      <input
        :value="note"
        @input="handleChangeNote"
        placeholder="Vui lòng nhập thêm chi tiết"
      />
    </div>
    <g-button
      :disabled="loading || !note"
      :loading="loading"
      class="primary w-100"
      @click="handleSubmit"
    >
      Xác nhận
    </g-button>
  </div>
</template>

<script>
import GButton from "@/components/elements/button.vue";
import ticketService from "@/services/ticket.service";

export default {
  name: "DetailKickReturnRequest",
  props: ["session", "loading", "setLoading", "type", "handleCancel"],
  data() {
    return {
      note: "",
    };
  },
  components: {
    GButton,
  },
  methods: {
    handleChangeNote(event) {
      this.note = event.target.value;
    },
    async handleSubmit() {
      this.setLoading(true);
      try {
        const type = this.type === 1 ? 16 : 18;
        const feedback = {
          content: this.note,
        };
        const response = await ticketService.sendTicketSession(
          this.session.id,
          type,
          feedback
        );

        if (response.data.success) {
          this.handleCancel();
          this.$message.success(response.data.message);
        } else {
          this.$message.error(
            response.data.message || "Oops! Something went wrong when call api."
          );
        }
      } catch (error) {
        console.error(error);
        this.$message.error("Oops! Something went wrong when call api.");
      }
      this.setLoading(false);
    },
  },
};
</script>

<style lang="scss" scoped>
@import "./detail.scss";

.request-kick {
  .wrapper-input {
    display: flex;
    margin-bottom: 1.5rem;
    span {
      width: 70px;
    }
  }
  .g-button {
    height: 40px;
  }
}
</style>

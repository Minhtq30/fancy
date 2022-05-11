<template>
  <a-spin tip="Đang tải đơn ..." :spinning="loading">
    <iframe
      frameborder="0"
      height="0"
      name="print_order_draft_frame"
      src="about:blank"
      width="0"
    />
  </a-spin>
</template>

<script>
import services from "@/services";
import { message } from "ant-design-vue";

export default {
  name: "PrintOrder",
  data() {
    return {
      loading: true,
      content: "",
      listDraftIds: this.$route.params.listIds,
    };
  },
  async mounted() {
    // Call API lấy chi tiết in đơn.
    const listIds = this.listDraftIds.split(",");
    const response = await services.$package.printfDraftPackage({
      pkg_ids: listIds,
    });

    if (response.success) {
      const html = response?.data.html;
      await this.handlePrintOrders(html);
    } else {
      message.error("Lỗi hệ thống");
      this.loading = false;
      this.error = true;
    }
  },
  methods: {
    async handlePrintOrders(content) {
      this.$nextTick(() => {
        try {
          window.frames.print_order_draft_frame.document.body.innerHTML =
            content;

          let css = "@page { size: landscape; }";
          let head =
            window.frames.print_order_draft_frame.document.head ||
            window.frames.print_order_draft_frame.document.getElementsByTagName(
              "head"
            )[0];
          let style = document.createElement("style");

          style.type = "text/css";
          style.media = "print";

          if (style.styleSheet) {
            style.styleSheet.cssText = css;
          } else {
            style.appendChild(document.createTextNode(css));
          }

          head.appendChild(style);

          setTimeout(() => {
            this.loading = false;
            window.frames.print_order_draft_frame.window.focus();
            window.frames.print_order_draft_frame.window.print();
          }, 1500);
        } catch (e) {
          this.handleError(e, "Có lỗi khi in đơn hàng.");
        }
      });
    },
  },
};
</script>

<style scoped></style>

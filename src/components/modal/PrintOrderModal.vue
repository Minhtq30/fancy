<template>
  <div id="printingOrders" style="display: none" v-if="fetchingPrintOrder">
    <div class="card-header">
      <div class="row">
        <div class="col-12 text-center p-3"><h1>Danh sách đơn hàng</h1></div>
      </div>
    </div>

    <div class="card-body p-0">
      <table class="table table-bordered form-table">
        <thead class="bg-light">
          <tr class="tbl-header">
            <th colspan="5">Thông tin khách hàng</th>
            <th colspan="7">Thông tin hàng hóa</th>
            <th colspan="2">Thông tin giao hàng</th>
          </tr>
        </thead>
        <tbody>
          <tr class="tbl-sub-header">
            <td>STT</td>
            <td v-if="option.hasClientId">Mã ĐH riêng</td>
            <td>SĐT</td>
            <td>Tên khách hàng</td>
            <td>Địa chỉ chi tiết</td>
            <td>Tên sản phẩm</td>
            <td>Số lượng</td>
            <td>Khối lượng (kg)</td>
            <td>Giá trị hàng</td>
            <td>Tiền CoD</td>
            <td>Ghi chú</td>
            <td>Kho & Phiên lấy hàng</td>
            <td>Dịch vụ & Hình thức VC</td>
            <td>Trả ship</td>
          </tr>
          <template v-for="(order, index) in selectedListOrder" :key="index">
            <tr>
              <td :rowspan="order.products.length" class="text-center">
                <b>{{ index + 1 }}</b>
              </td>
              <td v-if="option.hasClientId" :rowspan="order.products.length">
                {{ order.client_id || "" }}
              </td>
              <td :rowspan="order.products.length">
                {{ order.phone || "" }}
              </td>
              <td :rowspan="order.products.length">
                {{ order.name || "" }}
              </td>
              <td :rowspan="order.products.length">
                {{ order.address || "" }}
              </td>
              <td>
                {{ order.products[0] ? order.products[0].product_name : "" }}
              </td>
              <td>
                {{ order.products[0] ? order.products[0].quantity : "" }}
              </td>
              <td>
                {{ order.products[0] ? order.products[0].weight : "" }}
              </td>
              <td>
                {{ order.products[0] ? order.products[0].money : "" }}
              </td>
              <td :rowspan="order.products.length">
                {{ order.pick_money }}
              </td>
              <td :rowspan="order.products.length">
                {{ order.message }}
              </td>
              <td :rowspan="order.products.length">
                {{ order.warehouse ? order.warehouse.label : "" }}<br />
                {{ order.pick_time ? order.pick_time.label : "" }}
              </td>
              <td :rowspan="order.products.length" class="text-center">
                {{ order.transport_service }} <br />
                {{ order.transport === "fly" ? "Bay" : "Bộ" }}
              </td>
              <td :rowspan="order.products.length" class="text-center">
                {{ order.shipPay === "shop" ? "Shop trả" : "Khách trả" }}
              </td>
            </tr>
            <template v-for="(product, idx) in order.products">
              <tr v-if="idx > 0" :key="index + '-' + idx">
                <td>
                  {{ product.product_name }}
                </td>
                <td>
                  {{ product.quantity }}
                </td>
                <td>
                  {{ product.weight }}
                </td>
                <td>
                  {{ product.money }}
                </td>
              </tr>
            </template>
          </template>
        </tbody>
      </table>
    </div>
  </div>
  <iframe
    style="display: none"
    frameborder="0"
    height="0"
    name="print_frame"
    src="about:blank"
    width="0"
  />
</template>

<script>
export default {
  name: "PrintOrderModal",
  props: {
    selectedListOrder: {
      type: Array,
      default() {
        return [];
      },
    },
    option: Object,
  },
  data() {
    return {
      fetchingPrintOrder: false,
    };
  },
  methods: {
    async handlePrintOrders() {
      this.fetchingPrintOrder = !this.fetchingPrintOrder;
      this.$nextTick(() => {
        try {
          const border =
            "" +
            '<style type="text/css">' +
            "table {" +
            "border-collapse: collapse;" +
            "}" +
            "table th, table td {" +
            "border:1px solid #000;" +
            "}" +
            "</style>";
          window.frames.print_frame.document.body.innerHTML =
            border + document.getElementById("printingOrders").innerHTML;
          window.frames.print_frame.window.focus();
          window.frames.print_frame.window.print();
        } catch (e) {
          this.handleError(e, "Có lỗi khi in đơn hàng.");
        } finally {
          this.fetchingPrintOrder = !this.fetchingPrintOrder;
        }
      });
    },
  },
};
</script>

<style scoped></style>

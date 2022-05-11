export const BASE_URL = process.env.VUE_APP_BASE_URL;
export const REDIRECT_URI = process.env.VUE_APP_REDIRECT_URI;
export const REDIRECT_URI_LOGIN = process.env.VUE_APP_REDIRECT_URI_LOGIN;
export const REDIRECT_URI_LOGOUT = process.env.VUE_APP_REDIRECT_URI_LOGOUT;
export const GMAP_TILE = process.env.VUE_APP_GMAP_TILE;
export const GMAP_STATIC_URL = process.env.VUE_APP_GMAP_STATIC_URL;
export const URL_GCHAT = process.env.VUE_APP_URL_GCHAT;
export const URL_WS_V2 = process.env.VUE_APP_URL_WS_V2;
export const WS_KEY_V2 = process.env.VUE_APP_WS_KEY_V2;
export const BASE_URL_ROUTING = process.env.VUE_APP_BASE_URL_ROUTING;
export const API_KEY_ROUTING = process.env.VUE_APP_API_KEY_ROUTING;
export const VERSION = process.env.VUE_APP_VERSION;
export const CACHE_URL = process.env.VUE_APP_CACHE_URL;
export const THUNDER_URL = process.env.VUE_APP_THUNDER_URL;
export const TRACKING_URL = process.env.VUE_APP_TRACKING_URL;
export const XFAST_ENABLE = process.env.VUE_APP_XFAST_ENABLE;
export const OPERATE_STATUS_TITLE = {
  1: "Phát sinh & Đã lấy",
  2: "Delay & Hủy lấy",
  3: "Chờ ở kho đích",
  4: "Giao thành công",
  5: "Delay không liên lạc được KH",
  6: "Delay KH báo không nhận SP",
  7: "Delay sai thông tin ĐH",
  8: "Delay KH hẹn ngày giao",
  9: "Hủy vì shop báo",
  10: "Hủy vì KH không nhận / \n Không gọi được",
  11: "Delay khác",
  12: "Lưu kho chờ trả",
  13: "Đang trả",
  14: "Không giao được / \n Chờ duyệt hoàn",
  15: "Đã trả",
  16: "Hàng đổi, trả / \n Giao KH mới / \n Thất lạc hỏng vỡ",
};

export const ORDER_STATUS = [
  {
    key: "all",
    title: "Tất cả",
  },
  {
    key: -1,
    title: "Đơn hàng hủy",
  },
  {
    key: 1,
    title: "Chưa tiếp nhận",
  },
  {
    key: 2,
    title: "Đã tiếp nhận",
  },
  {
    key: 12,
    title: "Đã điều phối lấy hàng/Đang lấy hàng",
  },
  {
    key: 3,
    title: "Đã lấy hàng/Đã nhập kho",
  },
  {
    key: 4,
    title: "Đã điều phối giao hàng/Đang giao hàng",
  },
  {
    key: 5,
    title: "Đã giao hàng/Chưa đối soát",
  },
  {
    key: 6,
    title: "Đã đối soát",
  },
  {
    key: 7,
    title: "Không lấy được hàng",
  },
  {
    key: 8,
    title: "Delay lấy hàng",
  },
  {
    key: 9,
    title: "Không giao được hàng",
  },
  {
    key: 10,
    title: "Delay giao hàng",
  },
  {
    key: 11,
    title: "Đã đối soát trả hàng",
  },
  {
    key: 13,
    title: "Bồi hoàn",
  },
];

export const ADDRESS_TYPE = {
  PROVINCE: 0,
  DISTRICT: 3,
  WARD: 1,
  STREET: 2,
};

export const ORDER_TYPE = [
  { key: "all", title: "Tất cả" },
  { key: 1, title: "Dễ vỡ", color: "red" },
  { key: 2, title: "Giá trị cao", color: "#1f6dd8" },
  { key: 3, title: "Cồng kềnh" },
  { key: 4, title: "Giao hàng 1 phần" },
  { key: 5, title: "Thu tiền xem hàng" },
  { key: 6, title: "Gia cố", color: "red" },
  { key: 7, title: "Thực phẩm khô/ nông sản", color: "#088a4b" },
];

export const ORDER_SERVICE = [
  { key: "all", title: "Tất cả" },
  { key: 1, title: "Standard" },
  { key: 2, title: "Xfast", color: "orangered" },
  { key: 3, title: "Economy", color: "blueviolet" },
  { key: 4, title: "BBS" },
  { key: 5, title: "FF" },
  { key: 6, title: "OPM" },
];

export const ORDER_STATUS_TITLE = {
  1: "Chưa tiếp nhận",
  2: "Đã tiếp nhận",
  3: "Đã lấy hàng/ Đã nhập kho",
  4: "Đã điều phối giao hàng/ Đang giao hàng",
  5: "Đã giao hàng/ Chưa đối soát",
  6: "Đã đối soát",
  7: "Không lấy được hàng",
  8: "Delay lấy hàng",
  9: "Không giao được hàng",
  10: "Delay giao hàng",
  11: "Đã đối soát trả hàng",
  12: "Đã điều phối lấy hàng/ Đang lấy hàng",
  13: "Bồi hoàn",
};

export const OPERATE_TYPE = [
  {
    key: "incurredReportData.incurred",
    title: "Phát sinh & Đã lấy",
    type: "pick",
  },
  {
    key: "delayNotPickReportData.delay_not_pick",
    title: "Delay & Hủy lấy",
    type: "delay",
  },
  {
    key: "waitTransferReportData.wait_transfer",
    title: "Chờ giao ở kho đích",
    type: "deliver",
  },
  {
    key: "deliveringReportData.done",
    title: "Giao thành công",
    type: "deliver",
  },
  {
    key: "delayReportData.delay_not_contact",
    title: "Delay không liên hệ được KH",
    type: "delay",
  },
  {
    key: "delayReportData.delay_customer_refused",
    title: "Delay KH báo không nhận SP",
    type: "delay",
  },
  {
    key: "delayReportData.delay_wrong_info",
    title: "Delay sai thông tin ĐH",
    type: "delay",
  },
  {
    key: "delayReportData.delay_customer_change_date",
    title: "Delay KH hẹn ngày giao",
    type: "delay",
  },
  {
    key: "cancelByShopReportData.cancel_by_shop",
    title: "Hủy vì shop báo",
    type: "cancel",
  },
  {
    key: "cancelCouldNotContactOrRefuseReportData.cancel_could_not_contact_refuse",
    title: "Hủy vì KH không nhận/ Không gọi được",
    type: "cancel",
  },
  {
    key: "delayReportData.delay_other_reason_v2",
    title: "Delay khác",
    type: "delay",
  },
  {
    key: "notDeliverDoneAndWaitForApprovalReportData.not_deliver_wait_for_approval",
    title: "Lưu kho chờ shop check/ Chờ duyệt hoàn",
    type: "not_deliver_wait_approval",
  },
  {
    key: "waitingToReturnReportData.waiting_to_return",
    title: "Chờ trả",
    type: "returning",
  },
  {
    key: "returningReportData.returning",
    title: "Đang trả",
    type: "returning",
  },
  {
    key: "waitToConfirmReturnReportData.wait_to_confirm_return",
    title: "Lưu kho trả chờ shop check",
    type: "wait_to_confirm_return",
  },
  {
    key: "returnedReportData.returned",
    title: "Đã trả",
    type: "returning",
  },
  {
    key: "ticketReportData.ticket",
    title: "Hàng đổi trả/ Giao KH mới/ Thất lạc hỏng vỡ",
    type: "ticket",
  },
];

export const FINANCE_NEXT_AUDIT = [
  {
    key: "cash_transfer",
    title: "Tiền đang luân chuyển",
  },
  {
    key: "pick_money",
    title: "Tiền thu hộ",
  },
  {
    key: "delivery_money",
    title: "Phí giao hàng",
  },
  {
    key: "return_fee",
    title: "Phí hoàn hàng",
  },
  // {
  //   key: "extra_fee",
  //   title: "Phí DV phát sinh",
  // },
  {
    key: "insurance_fee",
    title: "Phí bảo hiểm",
  },
  {
    key: "tip_cod",
    title: "Tiền tip CoD",
  },
  {
    key: "store_fee",
    title: "Phí lưu kho",
  },
  {
    key: "change_address_fee",
    title: "Phí thay đổi địa chỉ giao",
  },
  {
    key: "transfer_fee",
    title: "Phí chuyển khoản",
  },
  {
    key: "sale_off",
    title: "Khuyến mãi",
  },
  {
    key: "refund_money",
    title: "Bồi hoàn",
  },
  {
    key: "deb_bill",
    title: "Nợ tồn",
  },
  {
    key: "available_cash",
    title: "Số dư hiện tại",
    des: "Số dư hiện tại là tiền về tính đến thời điểm hiện tại, sau khi trừ các khoản phí phát sinh dự kiến của tất cả các đơn",
    isBold: true,
  },
  {
    key: "audit_mon",
    title: "Số dư chốt",
    des: "Số dư chốt là tiền về tính đến thời điểm hiện tại, sau khi trừ các khoản phí phát sinh dự kiến của tất cả các đơn đã chốt trạng thái",
    isBold: true,
  },
];
export const FILTER_TOTAL_FROM_TO = [
  {
    key: "first",
    label: "0 - 100",
    value: "first",
    range: {
      from: 0,
      to: 100,
    },
  },
  {
    key: "second",
    label: "100 - 200",
    value: "second",
    range: {
      from: 100,
      to: 200,
    },
  },
  {
    key: "third",
    label: "200 - 300",
    value: "third",
    range: {
      from: 200,
      to: 300,
    },
  },
];
export const PAYMENT_FINACE_TYPE = [
  { key: "all", title: "Tất cả" },
  {
    title: "Nạp tiền",
    value: "deposit",
    key: "deposit",
    children: [],
  },
  {
    title: "Rút tiền",
    value: "withdraw",
    key: "withdraw",
    children: [],
  },
  {
    title: "Hoàn tiền",
    value: "return_debt_money",
    key: "return_debt_money",
    children: [],
  },
  {
    title: "Tiền CoD",
    value: "pick_money",
    key: "pick_money",
    children: [],
  },
  {
    title: "Phí dịch vụ GHTK",
    value: "3",
    key: "3",
    children: [
      {
        title: "Tiền tip COD",
        value: "tip_cod",
        key: "tip_cod",
      },
      {
        title: "Phí giao hàng",
        value: "ship_money",
        key: "ship_money",
      },
      {
        title: "Phí bảo hiểm",
        value: "insurance",
        key: "insurance",
      },
      {
        title: "Phí đổi địa chỉ giao hàng",
        value: "change_address_fee",
        key: "change_address_fee",
      },
      {
        title: "Phí đổi địa chỉ trả hàng",
        value: "change_return_add_fee",
        key: "change_return_add_fee",
      },
      {
        title: "Phí theo nhãn dễ vỡ",
        value: "fragile_fee",
        key: "fragile_fee",
      },
      {
        title: "Phí gia cố đơn hàng",
        value: "reinforced_fee",
        key: "reinforced_fee",
      },
      {
        title: "Phí nông sản",
        value: "food_fee",
        key: "food_fee",
      },
      {
        title: "Phí lưu kho",
        value: "store_fee",
        key: "store_fee",
      },
      {
        title: "Phí hoàn hàng",
        value: "return_fee",
        key: "return_fee",
      },
      {
        title: "Phí nguyên vật liệu",
        value: "materials_fee",
        key: "materials_fee",
      },
      {
        title: "Phí giao lại",
        value: "re_delivery_fee",
        key: "re_delivery_fee",
      },
      {
        title: "Phí Xfast",
        value: "xfast_fee",
        key: "xfast_fee",
      },
      {
        title: "Phí xuất trả lại",
        value: "re_return_fee",
        key: "re_return_fee",
      },
    ],
  },
  {
    title: "Khuyến mại",
    value: "discount",
    key: "discount",
    children: [],
  },
  {
    title: "Bồi hoàn",
    value: "refund",
    key: "refund",
  },
  // {
  //   title: "Thanh toán chốt phiên",
  //   value: "closing_session",
  //   key: "closing_session",
  //   children: [],
  // },
];
export const KEY_CACHE_DASHBOARD_METRICS = "dashboard_metrics";
export const KEY_CACHE_REALTIME_REPORT_C2C = "realtime_report_c2c";
export const KEY_CACHE_REALTIME_REPORT_B2C = "realtime_report_b2c";
export const KEY_CACHE_NEXT_AUDIT = "next_audit";

export const ROLES = {
  ADMIN: "admin",
  OPERATOR: "operator",
  CASHIER: "cashier",
};

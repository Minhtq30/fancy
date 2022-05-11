export const SUM_FIELDS = [
  {
    key: "refund_money",
    title: "Bồi hoàn",
  },
  {
    key: "sale_off",
    title: "Khuyến mãi",
  },
  // {
  //   key: "pre_paid_amount",
  //   title: "Trả trước",
  // },
  // {
  //   key: "return_trans_fee",
  //   title: "Phí DV hoàn lại",
  //   des: "",
  // },
  // {
  //   key: "paid_service_fee",
  //   title: "Phí DV đã thanh toán",
  //   des: "Phí dịch vụ phát sinh (không bao gồm trả trước) của các đơn hàng bị hoàn về mà Shop đã thanh toán tiền mặt hoặc GHTK đã cấn trừ khi đơn không giao được ",
  // },
];

export const SUB_FIELDS = [
  {
    key: "delivery_money",
    title: "Phí giao hàng",
    orderAuditHistory: 1,
  },
  {
    key: "re_delivery_fee",
    title: "Phí giao lại",
    orderAuditHistory: 1.1,
  },
  {
    key: "insurance_fee",
    title: "Phí bảo hiểm",
    orderAuditHistory: 2,
  },
  {
    key: "transfer_fee",
    title: "Phí chuyển khoản",
    orderAuditHistory: 11,
  },
  {
    key: "return_fee",
    title: "Phí hoàn hàng",
    orderAuditHistory: 3,
  },
  {
    key: "change_address_fee",
    title: "Phí thay đổi địa chỉ giao",
    orderAuditHistory: 4,
  },
  {
    key: "store_fee",
    title: "Phí lưu kho",
    orderAuditHistory: 5,
  },
  {
    key: "tip_cod",
    title: "Tiền tip CoD",
    orderAuditHistory: 6,
  },
  {
    key: "quick_transfer_fee",
    title: "Phí đối soát nhanh",
    orderAuditHistory: 7,
  },
  {
    key: "sum_fee_materials",
    title: "Phí gia cố",
    orderAuditHistory: 8,
  },
  {
    key: "total_prepayment",
    title: "Phí DV cấn trừ",
    orderAuditHistory: 9,
  },
  {
    key: "deb_bill",
    title: "Nợ tồn",
    orderAuditHistory: 10,
  },
];

export const SUM_FIELDS_AUDIT = [
  {
    key: "refund_fee",
    title: "Bồi hoàn",
  },
  {
    key: "discount",
    title: "Khuyến mãi",
  },
  {
    key: "pre_paid_amount",
    title: "Trả trước",
  },
  {
    key: "return_trans_fee",
    title: "Phí DV hoàn lại",
    des: "",
  },
  {
    key: "paid_service_fee",
    title: "Phí DV đã thanh toán",
    des: "Phí dịch vụ phát sinh (không bao gồm trả trước) của các đơn hàng bị hoàn về mà Shop đã thanh toán tiền mặt hoặc GHTK đã cấn trừ khi đơn không giao được ",
  },
];

export const SUB_FIELDS_AUDIT = [
  {
    key: "ship_money",
    title: "Phí giao hàng",
    orderAuditHistory: 1,
  },
  {
    key: "re_delivery_fee",
    title: "Phí giao lại",
    orderAuditHistory: 1.1,
  },
  {
    key: "insurance",
    title: "Phí bảo hiểm",
    orderAuditHistory: 2,
  },
  {
    key: "transfer_fee",
    title: "Phí chuyển khoản",
    orderAuditHistory: 11,
  },
  {
    key: "return_fee", // Chưa thấy trường mới
    title: "Phí hoàn hàng",
    orderAuditHistory: 3,
  },
  {
    key: "ch_addr_fee",
    title: "Phí thay đổi địa chỉ giao",
    orderAuditHistory: 4,
  },
  {
    key: "store_fee", // Chưa thấy trường mới
    title: "Phí lưu kho",
    orderAuditHistory: 5,
  },
  {
    key: "prepayment_tip",
    title: "Tiền tip CoD",
    orderAuditHistory: 6,
  },
  {
    key: "quick_transfer_fee", // Chưa thấy trường mới
    title: "Phí đối soát nhanh",
    orderAuditHistory: 7,
  },
  {
    key: "sum_fee_materials", // Chưa thấy trường mới
    title: "Phí gia cố",
    orderAuditHistory: 8,
  },
  {
    key: "prepayment_fee",
    title: "Phí DV cấn trừ",
    orderAuditHistory: 9,
  },
  // Tạm ẩn trường này vì chưa dùng trên web
  // {
  //   key: "return_debt_money",
  //   title: "Tiền nợ trả hàng",
  //   orderAuditHistory: 9.1,
  // },
  {
    key: "debt_money", // Chưa thấy trường mới
    title: "Nợ tồn",
    orderAuditHistory: 10,
  },
];
export const PACKAGE_STATUS = [
  {
    key: "all",
    title: "Tất cả",
  },
  {
    key: 2,
    title: "Đã tiếp nhận",
  },
  {
    key: 12,
    title: "Đang lấy hàng",
  },
  {
    key: 3,
    title: "Đã lấy hàng",
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
    key: 4,
    title: "Đang giao hàng",
  },
  {
    key: 5,
    title: "Đã giao hàng",
  },
  {
    key: 9,
    title: "Ko giao được hàng",
  },
  {
    key: 10,
    title: "Delay giao hàng",
  },
  {
    key: 6,
    title: "Đã đối soát",
  },
  {
    key: 21,
    title: " Đã trả hàng",
  },
  {
    key: 51,
    title: "Giao hàng một phần",
  },
];
export const OPTIONS_INFO_EXPORT_EXCEL = [
  {
    title: "Mã giao dịch",
    key: "12",
    alignItems: "left",
    reportType: ["report-transaction"],
  },
  {
    title: "Mã ĐH",
    key: "alias",
    alignItems: "left",
    reportType: [
      "export-summary-session",
      "export-package-money",
      "report-transaction",
    ],
  },
  {
    title: "Mã ĐH Shop",
    key: "client_id",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Trạng thái ĐH",
    key: "package_status",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Ngày tạo",
    key: "created",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Ngày hoàn thành",
    key: "done_at",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Khối lượng",
    key: "weight",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Thông tin khách hàng",
    key: "customer_info",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Tiền CoD",
    key: "pick_money",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí giao hàng",
    key: "ship_money",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí bảo hiểm",
    key: "insurance",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí dễ vỡ",
    key: "fragile_fee",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí gia cố đơn hàng",
    key: "reinforced_fee",
    alignItems: "left",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí thực phẩm khô",
    key: "food_fee",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Loại giao dịch",
    key: "14",
    alignItems: "left",
    reportType: ["report-transaction"],
  },

  {
    title: "Số tiền",
    key: "15",
    alignItems: "left",
    reportType: ["report-transaction"],
  },
  {
    title: "Bên chuyển",
    key: "16",
    alignItems: "right",
    reportType: ["report-transaction"],
  },
  {
    title: "Bên nhận",
    key: "17",
    alignItems: "right",
    reportType: ["report-transaction"],
  },
  {
    title: "Thời gian thực hiện",
    key: "18",
    alignItems: "right",
    reportType: ["report-transaction"],
  },
  {
    title: "Nội dung",
    key: "19",
    alignItems: "right",
    reportType: ["report-transaction"],
  },
  {
    title: "Phí nguyên vật liệu",
    key: "materials_fee_money",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí hoàn hàng",
    key: "return_fee",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí thay đổi địa chỉ giao",
    key: "change_address_fee",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí lưu kho",
    key: "store_fee",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí giao lại",
    key: "re_delivery_fee",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí đổi địa chỉ trả",
    key: "change_return_add_fee",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Phí xuất trả lại",
    key: "re_return_fee",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Khuyến mãi",
    key: "discount",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Tip CoD",
    key: "tip",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Đã thanh toán qua Ví",
    key: "paid_wallet",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
  {
    title: "Ghi chú",
    key: "desc",
    alignItems: "right",
    reportType: ["export-summary-session", "export-package-money"],
  },
];
export const OPTIONS_REPORT_TYPE = [
  {
    key: "export-summary-session",
    title: "Rút tiền tự động",
  },
  {
    key: "export-package-money",
    title: "Tiền hàng",
  },
  {
    key: "report-transaction",
    title: "Giao dịch ví",
  },
];
export const OPTION_AUDIT_ONE_TIME_PER_WEEK = [
  "payment_once_per_week_monday",
  "payment_once_per_week_tuesday",
  "payment_once_per_week_wednesday",
  "payment_once_per_week_thursday",
];

export const MIN_AUDIT_MONEY = {
  value: 50000,
  format: "50,000 VND",
};

export const STATUS_ORDER_IN_PACKAGE_WITHDRAW = {
  completed: "Đã giao hàng",
  deliver_failed: "Không giao được hàng",
  not_completed: "Đang giao hàng",
};

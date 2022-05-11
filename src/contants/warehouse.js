export const WAREHOUSE_METRIC_TYPE = [
  {
    key: "import",
    title: "Nhập",
    isSingle: true,
    keys: ["count_number_product_import"],
  },
  {
    key: "export",
    title: "Xuất",
    isSingle: true,
    keys: ["count_number_product_export"],
  },
  {
    key: "remain",
    title: "Tồn",
    isSingle: true,
    keys: ["count_number_inventory"],
  },
  {
    key: "CREATED",
    title: "ĐH đã tạo",
    keys: [
      "count_number_package_created",
      "count_number_product_package_created",
    ],
  },
  {
    key: "DELIVERED_GHTK",
    title: "Đã bàn giao GHTK",
    keys: [
      "count_number_package_delivered_ghtk",
      "count_number_product_package_delivered_ghtk",
    ],
  },
  {
    key: "TRANSFER",
    title: "Đang giao",
    keys: ["total_package_shipping", "count_number_product_shipping"],
  },
  {
    key: "RETURN",
    title: "Hoàn hàng",
    keys: ["count_number_package_refund", "count_number_refund"],
  },
  {
    key: "DELIVERED_UNPAID",
    title: "Đã giao & chưa CK",
    keys: [
      "count_package_delivered_and_unpaid",
      "count_number_product_delivered_and_unpaid",
    ],
  },
  {
    key: "CHECKED",
    title: "Đã đối soát CK",
    keys: ["count_number_package_checked", "count_number_product_checked"],
  },
  {
    key: "RETURNED",
    title: "Đã trả hàng",
    keys: [
      "count_number_package_returned",
      "count_number_product_package_returned",
    ],
  },
];

export const BILL_TYPES = {
  1: {
    title: "Nhập",
    label: "Nhập mới",
  },
  2: {
    title: "Nhập",
    label: "Nhập mới",
  },
  3: {
    title: "Nhập",
    label: "Nhập điều chuyển",
  },
  4: {
    title: "Nhập",
    label: "Nhập gộp sản phẩm",
  },
  11: {
    title: "Xuất",
    label: "Xuất bán",
  },
  12: {
    title: "Xuất",
    label: "Xuất chuyển kho",
  },
  13: {
    title: "Xuất",
    label: "Xuất cho đơn vị vận chuyển",
  },
  14: {
    title: "Xuất",
    label: "Xuất điều chỉnh",
  },
  15: {
    title: "Xuất",
    label: "Xuất chuyển kho",
  },
  16: {
    title: "Xuất",
    label: "Xuất chuyển kho",
  },
  17: {
    title: "Xuất",
    label: "Xuất chuyển kho",
  },
  18: {
    title: "Xuất",
    label: "Xuất chuyển kho",
  },
  19: {
    title: "Xuất",
    label: "Xuất chuyển kho",
  },
  21: {
    title: "Hủy",
    label: "Hủy trả",
  },
  31: {
    title: "Kiểm",
    label: "Phiếu kiểm",
  },
};

export const BILL_STATUS = {
  0: "NEW",
  1: "ACTIVE",
  2: "DEACTIVE",
  3: "RECEIVED",
  4: "REJECT",
  5: "PROGRESS",
  6: "FAIL",
  7: "SUCCESS",
  8: "TRANSPORT",
  100: "Hoàn thành",
  101: "Đã xóa",
};

export const BILL_CREATE_TYPE = {
  1: "Tạo thủ công",
  2: "Tự động tạo",
};

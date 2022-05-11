import { ROLES } from "@/contants";

export const configHeader = {
  isSummary: ["overview"],
  isOrder: [
    "manage-order",
    "operate-manage-page",
    "quan-ly-van-hanh",
    "list-session",
    "ticket-not-processed",
  ],
  isStore: [
    "warehouse-and-products",
    "warehouse-and-products_list-products",
    "warehouse-and-products_top-product",
    "warehouse-and-products_export-history",
    "warehouse-and-products_list-bills",
    "warehouse-and-products_list-orders",
  ],
  isFinance: [
    "cash-flow",
    "cash-flow_audit",
    "cash-flow_history-audit",
    "cash-flow_vat",
    "audit-detail",
    "detail-report",
    "wallet",
    "finance-list-order",
    "finance-list-transaction",
  ],
};

export const menuItems = [
  {
    key: "summary",
    path: "/",
    icon: require("@/assets/icons/summary.svg"),
    iconActive: require("@/assets/icons/summary_active.svg"),
    title: "Tổng quan",
    roles: [ROLES.ADMIN],
  },
  {
    key: "order",
    path: "/don-hang",
    icon: require("@/assets/icons/order.svg"),
    iconActive: require("@/assets/icons/order_active.svg"),
    title: "Đơn hàng",
    roles: [ROLES.ADMIN, ROLES.OPERATOR],
  },
  {
    key: "store",
    path: "/kho-va-san-pham",
    icon: require("@/assets/icons/store.svg"),
    iconActive: require("@/assets/icons/store_active.svg"),
    title: "Kho & sản phẩm",
    roles: [ROLES.ADMIN],
  },
  {
    key: "finance",
    path: "/dong-tien",
    icon: require("@/assets/icons/finance.svg"),
    iconActive: require("@/assets/icons/finance_active.svg"),
    title: "Dòng tiền",
    roles: [ROLES.ADMIN, ROLES.CASHIER],
  },
];

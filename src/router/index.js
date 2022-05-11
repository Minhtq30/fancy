import { createRouter, createWebHistory } from "vue-router";
import store from "../store";
import services from "@/services";
import { ROLES } from "@/contants";
const DEFAULT_TITLE = "GHTK - Dịch vụ giao hàng trong ngày chuyên nghiệp";

const WALLET_TYPE = {
  ACTVIE: "active",
  NON_ACTIVE: "non-active",
};

const routes = [
  {
    path: "/error",
    name: "error",
    component: () => import("../pages/Error.vue"),
    meta: {
      title: "GHTK - Đã có lỗi xảy ra",
    },
  },
  {
    path: "/login",
    name: "login",
    component: () => import("../pages/Login.vue"),
    meta: {
      title: "GHTK - Đăng nhập",
    },
  },
  {
    path: "/",
    name: "overview",
    component: () => import("../pages/home/Home.vue"),
    meta: {
      layout: "main",
      roles: [ROLES.ADMIN],
      title: "GHTK - Tổng quan",
    },
  },
  {
    path: "/don-hang",
    name: "manage-order",
    component: () => import("../pages/order/Order.vue"),
    meta: {
      layout: "main",
      roles: [ROLES.ADMIN, ROLES.OPERATOR],
      title: "GHTK - Quản lý đơn hàng",
    },
  },
  {
    path: "/chat",
    name: "chat",
    component: () => import("../pages/Empty.vue"),
    meta: {
      layout: "chat",
    },
  },
  {
    path: "/quan-ly-van-hanh",
    name: "operate-manage-page",
    component: () => import("../pages/operate/Operate.vue"),
    meta: {
      layout: "main",
      roles: [ROLES.ADMIN, ROLES.OPERATOR],
      title: "GHTK - Quản lý đơn hàng",
    },
  },
  {
    path: "/danh-sach-phien",
    name: "list-session",
    component: () => import("../pages/operate/Session.vue"),
    meta: {
      layout: "main",
      roles: [ROLES.ADMIN, ROLES.OPERATOR],
      title: "GHTK - Danh sách phiên",
    },
  },
  {
    path: "/yeu-cau-chua-thuc-hien",
    name: "ticket-not-processed",
    component: () => import("../pages/operate/Request.vue"),
    meta: {
      layout: "main",
      roles: [ROLES.ADMIN, ROLES.OPERATOR],
      title: "GHTK - Yêu cầu chưa thực hiện",
    },
  },
  {
    path: "/kho-va-san-pham",
    name: "warehouse-and-products",
    component: () => import("../pages/warehouse/index.vue"),
    redirect: "/kho-va-san-pham/danh-sach-san-pham",
    meta: {
      layout: "main",
      roles: [ROLES.ADMIN],
      meta: {
        title: "GHTK - Quản lý kho & sản phẩm",
      },
    },
    children: [
      {
        path: "danh-sach-san-pham",
        name: "warehouse-and-products_list-products",
        component: () => import("../pages/warehouse/Warehouse.vue"),
        meta: {
          roles: [ROLES.ADMIN],
          title: "GHTK - Quản lý kho & sản phẩm",
        },
      },
      {
        path: "top-san-pham",
        name: "warehouse-and-products_top-product",
        component: () => import("../pages/warehouse/TopProduct.vue"),
        meta: {
          roles: [ROLES.ADMIN],
          title: "GHTK - Quản lý kho & sản phẩm",
        },
      },
      {
        path: "lich-su-xuat-hang",
        name: "warehouse-and-products_export-history",
        component: () => import("../pages/warehouse/ExportHistory.vue"),
        meta: {
          roles: [ROLES.ADMIN],
          title: "GHTK - Quản lý kho & sản phẩm",
        },
      },
      {
        path: "danh-sach-don-hang",
        name: "warehouse-and-products_list-bills",
        component: () => import("../pages/warehouse/ListBills.vue"),
        meta: {
          roles: [ROLES.ADMIN],
          title: "GHTK - Quản lý kho & sản phẩm",
        },
      },
      {
        path: "chi-tiet-don-hang-phieu-xuat",
        name: "warehouse-and-products_list-orders",
        component: () => import("../pages/warehouse/ListOrders.vue"),
        meta: {
          roles: [ROLES.ADMIN],
          title: "GHTK - Quản lý kho & sản phẩm",
        },
      },
    ],
  },
  {
    path: "/dong-tien",
    name: "cash-flow",
    component: () => import("../pages/finance/index.vue"),
    redirect: "/dong-tien/doi-soat",
    meta: {
      layout: "main",
      roles: [ROLES.ADMIN, ROLES.CASHIER],
      title: "GHTK - Dòng tiền",
    },
    children: [
      {
        path: "doi-soat",
        name: "cash-flow_audit",
        component: () => import("../pages/finance/UpcomingAudit.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.CASHIER],
          walletType: WALLET_TYPE.NON_ACTIVE,
          title: "GHTK - Phiên đối soát sắp tới",
        },
      },
      {
        path: "hoa-don-vat",
        name: "cash-flow_vat",
        component: () => import("../pages/finance/VatBill.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.CASHIER],
          title: "GHTK - Quản lý hóa đơn VAT",
        },
      },
      {
        path: "chi-tiet-doi-soat",
        name: "audit-detail",
        component: () => import("../pages/finance/DetailNextAudit.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.CASHIER],
          walletType: WALLET_TYPE.NON_ACTIVE,
          title: "GHTK - Chi tiết đối soát",
        },
      },
      {
        path: "bao-cao-chi-tiet",
        name: "detail-report",
        component: () => import("../pages/finance/Detail.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.CASHIER],
          walletType: WALLET_TYPE.ACTIVE,
          title: "GHTK - Báo cáo chi tiết",
        },
      },
      {
        path: "vi",
        name: "wallet",
        component: () => import("../pages/finance/Wallet.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.CASHIER],
          walletType: WALLET_TYPE.ACTIVE,
          title: "GHTK - Ví",
        },
      },
      {
        path: "danh-sach-don-hang",
        name: "finance-list-order",
        component: () => import("../pages/finance/ListOrder.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.CASHIER],
          walletType: WALLET_TYPE.ACTIVE,
          title: "GHTK - Danh sách đơn hàng",
        },
      },
      {
        path: "danh-sach-giao-dich",
        name: "finance-list-transaction",
        component: () => import("../pages/finance/ListTransaction.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.CASHIER],
          walletType: WALLET_TYPE.ACTIVE,
          title: "GHTK - Danh sách giao dịch",
        },
      },
    ],
  },
  {
    path: "/chi-tiet-hoa-don/:id",
    name: "chi-tiet-hoa-don",
    component: () => import("../pages/finance/ViewPdfBill.vue"),
    meta: {
      roles: [ROLES.ADMIN, ROLES.CASHIER],
      isHiddenChatIFrame: true,
      title: "GHTK - Chi tiết hóa đơn",
    },
  },
  {
    path: "/in-don-nhap/:listIds",
    name: "in-don-nhap",
    component: () => import("../pages/print-order/index.vue"),
    meta: {
      roles: [ROLES.ADMIN, ROLES.OPERATOR],
      title: "GHTK - In đơn nháp",
    },
  },
  {
    path: "/tao-don-hang",
    name: "create-order",
    component: () => import("../pages/create-order/index.vue"),
    redirect: "/tao-don-hang/don-le",
    meta: {
      layout: "header",
      roles: [ROLES.ADMIN, ROLES.OPERATOR],
      isHiddenChatIFrame: true,
    },
    children: [
      {
        path: "don-le",
        name: "create-order-one",
        component: () => import("../pages/create-order/CreateOrder.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.OPERATOR],
          isHiddenChatIFrame: true,
          title: "GHTK - Đăng đơn lẻ",
        },
      },
      {
        path: "don-excel",
        name: "create-order-excel",
        component: () => import("../pages/create-order/CreateOrderExcel.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.OPERATOR],
          isHiddenChatIFrame: true,
          title: "GHTK - Đăng đơn Excel",
        },
      },
      {
        path: "don-nhap",
        name: "create-order-draft",
        component: () => import("../pages/create-order/CreateOrderDraft.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.OPERATOR],
          title: "GHTK - Đăng đơn nháp",
        },
      },
      {
        path: "don-da-tao",
        name: "create-order-created",
        component: () => import("../pages/create-order/CreateOrderCreated.vue"),
        meta: {
          roles: [ROLES.ADMIN, ROLES.OPERATOR],
          isHiddenChatIFrame: true,
          title: "GHTK - Đơn hàng đã tạo",
        },
      },
    ],
  },
  {
    path: "/thong-tin-shop",
    name: "shop-info",
    component: () => import("../pages/shop-info/index.vue"),
    redirect: "/tao-don-hang/tai-khoan",
    meta: {
      layout: "header",
      isHiddenChatIFrame: true,
      title: "GHTK - Thông tin tài khoản",
    },
    children: [
      {
        path: "tai-khoan",
        name: "shop-info-account",
        component: () => import("../pages/shop-info/account.vue"),
        meta: {
          roles: [ROLES.ADMIN],
          isHiddenChatIFrame: true,
          title: "GHTK - Thông tin tài khoản",
        },
      },
      {
        path: "kho",
        name: "shop-info-warehouse",
        component: () => import("../pages/shop-info/warehouse.vue"),
        meta: {
          isHiddenChatIFrame: true,
          title: "GHTK - Quản lý kho hàng",
        },
      },
      {
        path: "tien-va-doi-soat",
        name: "shop-info-finance",
        component: () => import("../pages/shop-info/finance.vue"),
        meta: {
          roles: [ROLES.ADMIN],
          isHiddenChatIFrame: true,
          title: "GHTK - Quản lý tiền & đối soát",
        },
      },
      {
        path: "nhom-tai-khoan",
        name: "shop-info-group-account",
        component: () => import("../pages/shop-info/group-account.vue"),
        meta: {
          isHiddenChatIFrame: true,
          title: "GHTK - Quản lý nhóm tài khoản",
        },
      },
      {
        path: "thong-tin-chinh-sach",
        name: "shop-info-policy",
        component: () => import("../pages/shop-info/policy-info.vue"),
        meta: {
          isHiddenChatIFrame: true,
          title: "GHTK - Chính sách của shop",
        },
      },
      {
        path: "thong-bao",
        name: "shop-info-notification",
        component: () => import("../pages/shop-info/notification.vue"),
        meta: {
          roles: [ROLES.ADMIN],
          isHiddenChatIFrame: true,
          title: "GHTK - Cài đặt thông báo",
        },
      },
    ],
  },
  { path: "/404", name: "404", component: () => import("../pages/404") },
  { path: "/:catchAll(.*)", redirect: "/404" },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
});

async function getShopInfo() {
  let shopInfo = null;

  try {
    const response = await services.$shop.browseInfoShop();
    if (response?.success) {
      shopInfo = response.data;
      store.commit("shop/setFullInfoShop", shopInfo);
      // Update Shop_code and Shop_type
      localStorage.setItem("shop_code", shopInfo.Shop?.code);
      localStorage.setItem("shop_token", shopInfo.Shop?.token);
      localStorage.setItem("shop_type", shopInfo.Shop?.shop_type);
    }
  } catch (error) {
    console.error(error);
  }

  return shopInfo;
}

router.beforeEach(async (to, from, next) => {
  let role = store.state.shop.ShopStaff.role;

  if (to.name === "login" || to.name === "error") {
    next();
    return;
  }

  if (!role) {
    const shopInfo = await getShopInfo();
    if (shopInfo) {
      role = shopInfo?.ShopStaff?.role;
    }
  }

  if (!role) {
    next({
      name: "error",
      params: {
        message: "Lấy thông tin shop thất bại.",
        description: "Vui lòng thử lại bằng cách trở lại trang chủ.",
      },
    });
  } else {
    const isActiveWallet = store.state.shop.Wallet?.wallet_active === 1;

    const isValid =
      role === ROLES.ADMIN || !to.meta?.roles || to.meta?.roles?.includes(role);

    const isValidForWallet =
      !to.meta.walletType ||
      (to.meta.walletType === WALLET_TYPE.ACTVIE && isActiveWallet) ||
      (to.meta.walletType === WALLET_TYPE.NON_ACTIVE && !isActiveWallet);

    if (isValid && isValidForWallet) {
      next();
    } else {
      const pathDefaultForCashier = isActiveWallet ? "wallet" : "cash-flow";
      next({
        name: role === ROLES.OPERATOR ? "manage-order" : pathDefaultForCashier,
      });
    }
  }
  document.title = to?.meta?.title || DEFAULT_TITLE;
});

export default router;

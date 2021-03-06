import http from "../utils/http";
import { formatDateTimeRequest, formatDayTime } from "../utils/date";
import moment from "moment";

const formatDateTime = (_dateTime) => {
  if (!_dateTime && Number(_dateTime) !== 0) return "";
  try {
    const newDate = new Date(_dateTime);

    const day = newDate.getDate().toString().padStart(2, "0");
    const month = (newDate.getMonth() + 1).toString().padStart(2, "0");
    const year = newDate.getFullYear();

    const hours = newDate.getHours().toString().padStart(2, "0");
    const minutes = newDate.getMinutes().toString().padStart(2, "0");
    const seconds = newDate.getSeconds().toString().padStart(2, "0");

    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
  } catch (error) {
    console.error(error);
    return _dateTime;
  }
};

const financeService = {
  getNextAuditData: async ({ type = "all" }) => {
    const params = { type };
    const response = await http.get("/cashflow/statistic-money", { params });
    return response;
  },
  getBillDetail: async (_params = {}) => {
    const params = { bill_id: _params.id };
    const response = await http.get("/cashflow/bill-detail", { params });
    return response;
  },
  getInvoiceDetail: async (_params = {}) => {
    const params = { invoiceId: _params.id };
    return await http.get("/cashflow/get-invoice-detail", { params });
  },
  getInvoicePdf: async (_params = {}) => {
    const params = { invoiceId: _params.id };
    return await http.get("/cashflow/get-invoice-pdf", { params });
  },
  getAuditHistory: async (_params = {}) => {
    const params = {
      ..._params,
      from_date: _params.from_date
        ? formatDateTimeRequest(_params.from_date)
        : undefined,
      to_date: _params.to_date
        ? formatDateTimeRequest(_params.to_date)
        : undefined,
    };
    for (const key in params) {
      if (!params[key]) delete params[key];
    }
    if (!params.type) params.type = "all";
    const response = await http.get("/cashflow/list-bill", { params });
    return response;
  },
  getVATData: async (_params = {}) => {
    const params = {
      ..._params,
      from: _params.from ? formatDayTime(_params.from) : undefined,
      to: _params.to ? formatDayTime(_params.to) : undefined,
      status:
        _params.status && _params.status[0] ? _params.status[0] : undefined,
    };
    const response = await http.get("/cashflow/get-invoice-list", { params });
    return response;
  },
  //API Xem th??ng tin danh s??ch giao d???ch thanh to??n c??c ????n c???a shop
  getDetailPayment: async (_params = {}) => {
    let params = {
      ..._params,
    };
    if (params.paidAtTo && !params.paidAtFrom) {
      delete params.paidAtTo;
    }
    if (params.paidAtFrom && params.paidAtTo) {
      params = {
        ..._params,
        paidAtFrom: moment(params.paidAtFrom).format("DD/MM/YYYY HH:mm:ss"),
        paidAtTo: moment(params.paidAtTo).format("DD/MM/YYYY HH:mm:ss"),
      };
    }
    if (params.paymentKeys) {
      params.paymentKeys = params.paymentKeys.toString();
    }
    if (params.paymentKey === "all") {
      delete params.paymentKey;
    }
    params.pageIndex = params.pageIndex - 1;
    return await http.get("/payment/order-paid-transaction-v2", { params });
  },
  //Chi ti???t Giao d???ch
  async getDetailPaymentId(id) {
    return await http.get(`/payment/transaction/${id}`);
  },
  //Danh s??ch ng??y c?? file r??t ti???n t??? ?????ng
  getTimeAutomaticWithdrawal: async () => {
    const response = await http.get(`/payment/list-date-session`);
    return response;
  },
  //Xu???t file b??o c??o theo t???ng lo???i bi??n b???n
  exportExcel: async (_params = {}, reportType) => {
    const linkApi =
      reportType === "report-transaction" ? "payment" : "cashflow";

    let params = {
      ..._params,
    };
    if (params?.emails?.length === 0) delete params.emails;

    const response = await http.post(`/${linkApi}/${reportType}`, params);

    return response;
  },
  getPendingMoney: async () => {
    const response = await http.get("/cashflow/sum-money-wallet");

    return response;
  },

  getDataWallet: async (_params = {}) => {
    const params = {
      shopCode: localStorage.getItem("shop_code"),
      paidAtFrom: _params.fromDate
        ? formatDateTime(_params.fromDate)
        : undefined,
      paidAtTo: _params.toDate ? formatDateTime(_params.toDate) : undefined,
    };
    const response = await http.get("/payment/cash-flow-summary-v2", {
      params,
    });

    return response;
  },

  getDetailPending: async (_params = {}) => {
    const params = {
      package_status_id: _params.package_status_id,
      pick_address_id: _params.pick_address_id,
      pick_session_id: _params.pick_session_id,
      customer_province_id: _params.customer_province_id,
      page: _params.page,
      limit: _params.limit,
    };
    const response = await http.get("/cashflow/detail-pending-money-wallet", {
      params,
    });

    return response;
  },

  getDetailNextPayment: async (_params = {}) => {
    const params = {
      shopCode: localStorage.getItem("shop_code"),
      status: _params.package_status_id,
      pickAddressId: _params.pick_address_id,
      paymentKeys: _params.payment_keys,
      pageIndex: _params.page - 1,
      pageSize: _params.limit,
    };
    const response = await http.get("/payment/next-bank-payment-schedule-v2", {
      params,
    });

    return response;
  },

  getPaymentForOrder: async (packageOrder) => {
    const params = { packageOrder };

    const response = await http.get(
      "/payment/order-next-bank-payment-schedule",
      { params }
    );

    return response;
  },

  //l???y filter key khi filterType: cashInOut
  async getFilterKeyCashInOut() {
    return await http.get(`/payment/cash-in-out-payment-keys`);
  },

  // l???y filter key m???c ?????nh (filterType <> cashInOut)
  getFilterKey: async (_params = {}) => {
    let params = {
      ..._params,
    };
    const response = await http.get(`/payment/filter-keys`, { params });
    return response;
  },

  async getWalletBalance() {
    const response = await http.get("/payment/wallet/balance");

    return response;
  },

  // l???y danh s??ch ????n h??ng ???? r??t (t??? ?????ng CoD)
  getPackageWithdraw: async (_params = {}) => {
    const params = {
      ..._params,
      pageIndex: _params.pageIndex - 1,
    };
    return await http.get("/payment/package-withdraw", { params });
  },

  async getLatestBankPayment(_params = {}) {
    const params = {
      ..._params,
      shopCode: localStorage.getItem("shop_code"),
    };
    return await http.get("/payment/latest-bank-payment-schedule", { params });
  },

  //Xu???t excel bi??n b???n chuy???n ti???n
  async exportExcelFileTransactionWithdrawal(_params = {}) {
    const params = {
      transaction_id: _params,
    };
    return await http.get("/payment/get-file-transaction-withdrawal", {
      params,
    });
  },
};

export default financeService;

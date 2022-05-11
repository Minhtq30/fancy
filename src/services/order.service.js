import http from "../utils/http";
import moment from "moment";
import { formatDateTimeRequest } from "../utils/date";
import store from "@/store";

// const MAX_PER_PAGE = 25;

const MAP_VERSION_ENDPOINT = {
  1: "/package/list",
  3: "/package/list-v3",
};

function getParamsListPackage(_params = {}) {
  const params = {};

  const dateFields = ["audited_from", "audited_to"];
  const arrayFields = [
    "package_status_id",
    "pick_address_id",
    "package_properties",
    "package_label",
    "wait_print",
    "is_freeship",
  ];

  const booleanFields = ["wait_print", "is_freeship"];

  for (const field of dateFields) {
    params[field] = _params[field]
      ? formatDateTimeRequest(_params[field])
      : undefined;
  }

  for (const field of arrayFields) {
    params[field] = _params[field]
      ? _params[field].map((v) => Number(v))
      : undefined;

    if (params[field] && params[field].length === 0) {
      delete params[field];
    }
  }

  for (const field of booleanFields) {
    if (params[field]) {
      if (params[field].includes(0) && params[field].includes(1)) {
        delete params[field];
      } else {
        params[field] = params[field][0];
      }
    }
  }

  return params;
}

const orderService = {
  getAll: async (p = {}, isListOrders = false) => {
    const _params = { ...p };
    const version = store.state?.shop?.Shop?.list_package_version || 3;

    _params.customer_created_from =
      _params.customer_created_from || moment(new Date(0));

    if (!_params.packageId && !_params.customer_info) {
      const isInfiniteFrom =
        _params.customer_created_from &&
        new Date(_params.customer_created_from).getTime() ===
          new Date(0).getTime();

      if (!_params.customer_created_from || isInfiniteFrom) {
        _params.customer_created_from = moment()
          .startOf("day")
          .subtract(3, "month");
      }
      if (!_params.customer_created_to) {
        _params.customer_created_to = moment().endOf("day");
      }
    }

    let params = {
      page: _params.page ? _params.page : undefined,
      limit: _params.limit || 25,
      customer_info: _params.customer_info,
      customer_created_from: formatDateTimeRequest(
        _params.customer_created_from ||
          moment().startOf("month").startOf("day")
      ),
      customer_created_to: formatDateTimeRequest(
        _params.customer_created_to || moment().endOf("month").endOf("day")
      ),
      quick_type: _params.quick_type ? _params.quick_type : undefined,
      packageId: _params.packageId ? _params.packageId : undefined,
      is_full: _params.is_full ? _params.is_full : undefined,
    };

    params = {
      ...params,
      ...getParamsListPackage(_params),
    };

    if (isListOrders) {
      delete params.customer_created_from;
      delete params.customer_created_to;
    }

    async function getListPackages(p) {
      let response = {};

      try {
        const endpoint = MAP_VERSION_ENDPOINT[version];

        response = await http.post(endpoint, p);

        if (version === 3 && response?.data?.success) {
          response = {
            ...response,
            data: {
              ...(response?.data || {}),
              pkgs: response?.data?.data || [],
            },
          };
          if (response?.data?.data) {
            delete response.data.data;
          }
        }
      } catch (error) {
        console.error(error);
      }

      return response;
    }

    try {
      // const total = params.limit / MAX_PER_PAGE;

      let count = 0;
      let pkgs = [];
      let isSuccess = true;

      const response = await getListPackages({
        ...params,
        limit: params.limit,
        page: params.page,
      });

      if (response?.data?.success) {
        count = response?.data?.count || 0;
        pkgs = response?.data?.pkgs || [];
      } else {
        isSuccess = false;
      }

      // let arrayPromise = [];

      // for (let index = 0; index < total; index++) {
      //   // arrayPromise.push(
      //   //   http.post("/package/list", {
      //   //     ...params,
      //   //     limit: MAX_PER_PAGE,
      //   //     page: (params.page - 1) * total + index + 1,
      //   //   })
      //   // );
      //   arrayPromise.push(
      //     getListPackages({
      //       ...params,
      //       limit: MAX_PER_PAGE,
      //       page: (params.page - 1) * total + index + 1,
      //     })
      //   );
      // }

      // const responses = await Promise.all(arrayPromise);

      // for (let index = 0; index < responses.length; index++) {
      //   const response = responses[index] || {};
      //   if (response?.data?.success) {
      //     if (index === 0) count = response?.data?.count || 0;
      //     pkgs.push(...(response?.data?.pkgs || []));
      //   } else {
      //     isSuccess = false;
      //     break;
      //   }
      // }

      return {
        data: {
          pkgs: isSuccess ? pkgs : [],
          count: isSuccess ? count : 0,
          success: isSuccess,
        },
      };
    } catch (error) {
      return {
        data: {
          pkgs: [],
          count: 0,
          success: false,
          message: "Lấy danh sách đơn hàng thất bại, vui lòng thử lại sau.",
        },
      };
    }
  },
  getOrderDetail: async (id, alias) => {
    let params = { id };
    if (!id && alias) {
      params = { alias };
    }
    const response = await http.get("/package/package-detail", { params });
    return response;
  },
  getOrderDetailByAlias: async (alias) => {
    const params = { alias };
    const response = await http.get("/package/package-detail", { params });
    return response;
  },
  updateNote: async (id, note) => {
    const response = await http.post("/package/note", { id, note });
    return response;
  },
  getRateChoice: async (type) => {
    const response = await http.get(
      `/package-session/review-options?type=${type}`
    );
    return response;
  },
  getDetailRate: async (session_id) => {
    const response = await http.get(
      `/package-session/review?session_id=${session_id}`
    );
    return response;
  },
  updateRate: async (detail) => {
    const response = await http.post("/package-session/push-review", detail);
    return response;
  },

  exportExcel: async (_params = {}) => {
    let params = {
      ..._params,
      customer_info: _params.customer_info,
      quick_type: _params.quick_type ? _params.quick_type : undefined,
      from: _params.from ? formatDateTimeRequest(_params.from) : undefined,
      to: _params.to ? formatDateTimeRequest(_params.to) : undefined,
    };

    params = {
      ...params,
      ...getParamsListPackage(_params),
    };

    if (params?.email?.length === 0) delete params.email;

    const response = await http.post("/package/export-file", params);

    return response;
  },
  getCountPackage: async (_params) => {
    const params = {
      customer_created_from: formatDateTimeRequest(
        _params.customer_created_from ||
          moment().startOf("month").startOf("day")
      ),
      customer_created_to: formatDateTimeRequest(
        _params.customer_created_to || moment().endOf("month").endOf("day")
      ),
    };
    const response = await http.get("/package/summary-package", { params });

    return response;
  },
  getSessionsByListOrderId: async (listOrderIds) => {
    const response = await http.post("/package-session/get-by-order", {
      pkg_orders: listOrderIds,
    });

    return response;
  },

  async returnedConfirm(pkg_orders) {
    return await http.post(`/package/confirm-return`, {
      pkg_orders,
    });
  },
};

export default orderService;

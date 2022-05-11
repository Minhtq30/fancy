import { forEach } from "lodash";

// databases
import orderExcelDatabase from "@/database/orderExcel.database";

import http from "@/utils/http";

class PackageService {
  updatePackageCreated(payload, orderId) {
    return http
      .post(`/package/update/${orderId}`, payload)
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  createPackage(payload, cancelToken) {
    return http
      .post("/package/create", payload, { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  savePackages(payload, cancelToken) {
    return http
      .post("/package/add/multiple", payload, { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  savePackageFromDraft(payload, cancelToken) {
    return http
      .post("/package/draft/add/multiple", payload, { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  getDraftSession(params, cancelToken) {
    return http
      .get("/package/order-batchs", { params, cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  getDraftDetailPackage(params, cancelToken) {
    return http
      .get("/package/draft/list-detail", { params, cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        const result = [];
        const data = _response?.data?.data || [];
        const listIds = params.draft_ids.split(",");
        forEach(listIds, (item) => {
          result.push(data.find((x) => `${x.id}` === `${item}`));
        });

        _response.data = { ..._response.data, data: result };

        return _response.data;
      });
  }

  removeDraftPackage(payload, cancelToken) {
    return http
      .post("/package/draft/delete", payload, { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  updateDraftPackage(payload, cancelToken) {
    return http
      .post(
        `/package/draft/update/${payload.package_draft_id}`,
        { package: payload.package },
        { cancelToken }
      )
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return {
          ..._response.data,
          orderId: payload.orderId,
          draftId: payload.package_draft_id,
        };
      });
  }

  saveDraftPackage(payload, cancelToken) {
    return http
      .post("/package/draft", payload, { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  getDraftPackage(payload, cancelToken) {
    return http
      .post("/package/draft/list", payload, { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  checkDraftPackage(params, cancelToken) {
    return http
      .get("/package/draft-status", { params, cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  printfDraftPackage(payload) {
    return http
      .post("/package/print-draft", payload)
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  uploadImage(payload, cancelToken) {
    return http
      .post("/services/images/upload", payload, { cancelToken })
      .catch((_error) => {
        return _error.response;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  uploadFilesToGs(payload, cancelToken) {
    return http
      .post("/service/images/upload-gs", payload, { cancelToken })
      .catch((_error) => {
        return _error.response;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  getTransportMethod(params, cancelToken) {
    return http
      .get("/package/get-transport", { params }, { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  calculateShipFee(payload, cancelToken) {
    return http
      .post("/package/fee", payload, { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  browseDeliverTime(params, cancelToken) {
    return http
      .get("/package/deliver-time", { params, cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  browsePackageLabel(cancelToken) {
    return http
      .get("/package/label", { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  browsePackageNote(cancelToken) {
    return http
      .get("/package/default-note", { cancelToken })
      .catch((_error) => {
        return _error;
      })
      .then((_response) => {
        return _response.data;
      });
  }

  async browserSaveToIndexDB(data) {
    const cached = await orderExcelDatabase.get();

    let result = null;

    // Check, Nếu đã có cache thì put, chưa có thì add.
    if (cached) {
      result = await orderExcelDatabase.put(JSON.parse(JSON.stringify(data)));
    } else {
      result = await orderExcelDatabase.add(JSON.parse(JSON.stringify(data)));
    }

    return result;
  }
  async browserGetOrderExcel() {
    return await orderExcelDatabase.get();
  }
}

export default PackageService;

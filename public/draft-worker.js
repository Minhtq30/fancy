// --------------------- Function helper
self.verifyProduct = function (oldProduct = [], newProduct = []) {
  if (oldProduct.length === newProduct.length) {
    for (let i = 0; i < oldProduct.length; i++) {
      const _old = oldProduct[i];
      const _new = newProduct[i];
      if (
        _old.product_name !== _new.product_name ||
        _old.quantity !== _new.quantity ||
        _old.weight !== _new.weight ||
        _old.money !== _new.money
      ) {
        return true;
      }
    }

    return false;
  }

  // Nếu length khác nhau chắc chắn là đã update.
  return true;
};

// --------------------- Main

// Lưu trữ dưới dạng Key - Value để truy xuất dễ hơn.
let cacheData = {};

self.addEventListener("message", ({ data: dataReceive }) => {
  const { data = [], type = "", action = "", dataUpdate = [] } = dataReceive;
  if (type === "orderDraft") {
    if (action === "updateCache") {
      dataUpdate.map((item) => {
        cacheData[`${item.orderId}`] = item;
      });
    }

    if (action === "verifyUpdate") {
      const listUpdate = {};
      data.map((item) => {
        // Duyêt tất cả đơn hàng.
        const cacheOrder = cacheData[`${item.orderId}`];

        if (!cacheOrder) {
          listUpdate[`${item.orderId}`] = "error";
        } else if (
          item.alias !== cacheOrder.alias ||
          item.client_id !== cacheOrder.client_id ||
          item.name !== cacheOrder.name ||
          item.phone !== cacheOrder.phone ||
          item.address !== cacheOrder.address ||
          item.addressObj.customer_province_id !==
            cacheOrder.addressObj.customer_province_id ||
          item.addressObj.customer_district_id !==
            cacheOrder.addressObj.customer_district_id ||
          item.addressObj.customer_ward_id !==
            cacheOrder.addressObj.customer_ward_id ||
          item.addressObj.customer_street_id !==
            cacheOrder.addressObj.customer_street_id ||
          item.addressObj.customer_specific_id !==
            cacheOrder.addressObj.customer_specific_id ||
          item.warehouse?.value !== cacheOrder.warehouse?.value ||
          self.verifyProduct(cacheOrder.products, item.products) ||
          item.message !== cacheOrder.message ||
          item.pick_time?.value !== cacheOrder.pick_time?.value ||
          item.transport_service !== cacheOrder.transport_service ||
          item.transport !== cacheOrder.transport ||
          item.shipPay !== cacheOrder.shipPay
        ) {
          listUpdate[`${item.orderId}`] = "update";
        } else {
          listUpdate[`${item.orderId}`] = "none";
        }
      });

      self.postMessage({ listUpdate });
    }
  }
});

self.isProductValueValid = function (order, maxWeight, maxValue) {
  let totalMoney = 0;
  let totalWeight = 0;
  for (let i = 0; i < order.products.length; i++) {
    const money = order.products[i].money || "";
    const moneyNumber = Number.parseInt(order.products[i].money);
    if (isNaN(moneyNumber) || moneyNumber <= 0 || money.length < 3) {
      return false;
    }
    totalMoney += self.vndToNumber(order.products[i].money);
    totalWeight += parseFloat(order.products[i].weight);
  }

  // TODO: Bỏ tạm kịch ban don lon hon 10k.
  // if (totalMoney <= 10000 || totalMoney > 20000000) return false;
  if (totalWeight < 0 || totalWeight > maxWeight) {
    return false;
  }
  if (totalMoney < 0 || totalMoney > maxValue) return false;
  if (
    order.transport_service === "BBS" &&
    totalMoney < self.vndToNumber(order.pick_money)
  )
    return false;
  return true;
};

self.vndToNumber = function (x) {
  if (!x) {
    return 0;
  }
  x = x.toString();
  x = x.replace(/\D/g, "");
  x = parseInt(x);
  return x;
};
self.isValidPhone = function (phone) {
  if (phone.startsWith("+84")) {
    phone = phone.replace("+84", 0);
  } else if (phone.startsWith("84")) {
    phone = phone.replace("84", 0);
  }
  if (phone.length === 10) {
    const regex = new RegExp(/(84|0[3|5|6|7|8|9])+([0-9]{8})\b/g);
    return regex.test(String(phone));
  } else if (phone.length === 11) {
    return phone.toString().startsWith("02");
  } else if (phone.length === 9) {
    return phone.toString().startsWith("06");
  } else if (phone.length === 8) {
    return (
      phone.toString().startsWith("1900") || phone.toString().startsWith("1800")
    );
  } else {
    return false;
  }
};

self.addEventListener("message", ({ data: dataReceive }) => {
  const {
    data = [],
    type = "",
    bbsExtraProvinces = [],
    bbsDefaultMaxWeight = {},
    bbsDefaultMaxValue = {},
    expressDefaultMaxValue = {},
  } = dataReceive;
  if (type === "orderExcel") {
    const listError = [];
    const numberOfOrder = data.length;
    for (let orderIndex = 0; orderIndex < numberOfOrder; orderIndex++) {
      const order = data[orderIndex];
      let maxWeight =
        bbsExtraProvinces.find(
          (e) => e.provinceId == order?.warehouse?.province_id
        )?.bbsMaxWeight || bbsDefaultMaxWeight;
      let maxValue =
        order.transport_service.toLowerCase() == "bbs"
          ? bbsDefaultMaxValue
          : expressDefaultMaxValue;
      const numberProduct = order.products ? order.products.length : 0;
      if (!(order.deliver_option || order.pick_time?.value)) {
        listError[orderIndex] = true;
      } else if (
        !(
          !order.is_blocked_address &&
          order.name &&
          order.phone &&
          order.phone.length > 8 &&
          order.address &&
          order.addressObj &&
          order.addressObj.customer_province_id &&
          order.addressObj.customer_district_id &&
          (order.addressObj.customer_ward_id ||
            order.addressObj.customer_street_id) &&
          (order.addressObj.customer_specific_id ||
            order.addressObj.customer_hamlet_id ||
            order.addressObj.customer_corner_id) &&
          order.warehouse &&
          order.warehouse.value &&
          order.transport_service &&
          numberProduct > 0 &&
          order.products[0].product_name &&
          order.products[numberProduct - 1].product_name &&
          self.isProductValueValid(order, maxWeight, maxValue)
        )
      ) {
        listError[orderIndex] = true;
      } else {
        if (self.isValidPhone(order.phone)) {
          let isValidProduct = true;
          for (
            let productIndex = 0;
            productIndex < numberProduct;
            productIndex++
          ) {
            const product = order.products[productIndex];
            if (
              !(
                product.product_name &&
                product.quantity >= 1 &&
                product.weight >= 0.01 &&
                product.weight <= maxWeight &&
                (product.money >= 0 || product.money) &&
                self.vndToNumber(order.pick_money) <= 20000000
              )
            ) {
              isValidProduct = false;
              break;
            }
          }
          if (isValidProduct) {
            // Do Something.
          } else {
            listError[orderIndex] = true;
          }
        } else {
          listError[orderIndex] = true;
        }
      }
    }

    self.postMessage({ listError });
  }
});

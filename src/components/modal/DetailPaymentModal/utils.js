export const getDetailPaymentLabel = (paymentKey, shopInfo) => {
  let from = "";
  let to = "";

  // Nếu là Rút CoD nhanh và Rút tiền tự động
  if (paymentKey === "withdraw") {
    from = `Ví ${shopInfo?.name} shop`;
    to = `${shopInfo?.against_bank_name} - ${shopInfo?.against_bank_own} - ${shopInfo?.against_bank_account}`;
  }

  // Nếu là tiền CoD
  if (paymentKey === "pick_money") {
    from = "Giao Hang Tiet Kiem., JSC";
    to = `Ví ${shopInfo?.name} shop`;
  }

  // Nếu là hoàn tiền cấn trừ, hoàn tiền phải thu
  if (
    [
      "revert",
      "pre_paid_amount",
      "refund",
      "return_debt_money",
      "discount",
      "pre_payment",
    ].includes(paymentKey)
  ) {
    from = "Giao Hang Tiet Kiem., JSC";
    to = `Ví ${shopInfo?.name} shop`;
  }

  // Nếu là phí
  if (
    [
      "tip_cod",
      "ship_money",
      "insurance",
      "change_address_fee",
      "xfast_fee",
      "fragile_fee",
      "reinforced_fee",
      "food_fee",
      "store_fee",
      "return_fee",
      "materials_fee",
      "re_delivery_fee",
      "change_return_add_fee",
      "re_return_fee",
    ].includes(paymentKey)
  ) {
    from = `Ví ${shopInfo?.name} shop`;
    to = "Giao Hang Tiet Kiem., JSC";
  }

  // Nếu là nạp tiền
  if (paymentKey === "deposit") {
    from = `${shopInfo?.against_bank_name} - ${shopInfo?.against_bank_own} - ${shopInfo?.against_bank_account}`;
    to = `Ví ${shopInfo?.name} shop`;
  }

  return {
    from,
    to,
  };
};

export const formatRealtimeReport = (
  realtimeReportData = {},
  isB2C = false,
  type = "summary"
) => {
  try {
    if (isB2C) {
      return {
        "pickingReportData.done": realtimeReportData.pickingReportData.done,
        "incurredReportData.incurred":
          realtimeReportData.incurredReportData.incurred,
        "delayNotPickReportData.delay_not_pick":
          realtimeReportData.delayNotPickReportData.delay_not_pick,
        "waitTransferReportData.wait_transfer":
          realtimeReportData.waitTransferReportData.wait_transfer,
        "deliveringReportData.done":
          realtimeReportData.deliveringReportData.done,
        "delayReportData.delay_not_contact":
          realtimeReportData.delayReportData.delay_not_contact,
        "delayReportData.delay_customer_refused":
          realtimeReportData.delayReportData.delay_customer_refused,
        "delayReportData.delay_wrong_info":
          realtimeReportData.delayReportData.delay_wrong_info,
        "delayReportData.delay_customer_change_date":
          realtimeReportData.delayReportData.delay_customer_change_date,
        "cancelByShopReportData.cancel_by_shop":
          type === "summary"
            ? realtimeReportData.cancelByShopReportData.cancel_by_shop
            : realtimeReportData.cancelByShopReportData.cancelByShop,
        "cancelCouldNotContactOrRefuseReportData.cancel_could_not_contact_refuse":
          realtimeReportData.cancelCouldNotContactOrRefuseReportData
            .cancel_could_not_contact_refuse,
        "delayReportData.delay_other_reason_v2":
          realtimeReportData.delayReportData.delay_other_reason_v2,
        "waitingToReturnReportData.waiting_to_return":
          realtimeReportData.waitingToReturnReportData.waiting_to_return,
        "returningReportData.returning":
          realtimeReportData.returningReportData.returning,
        "waitToConfirmReturnReportData.wait_to_confirm_return":
          realtimeReportData.waitToConfirmReturnReportData
            .wait_to_confirm_return,
        "notDeliverDoneAndWaitForApprovalReportData.not_deliver_wait_for_approval":
          realtimeReportData.notDeliverDoneAndWaitForApprovalReportData
            .not_deliver_wait_for_approval,
        "returnedReportData.returned":
          realtimeReportData.returnedReportData.returned,
        "ticketReportData.ticket": realtimeReportData.ticketReportData.ticket,
      };
    } else {
      return {
        "c2c._incurredReportData.incurred":
          realtimeReportData._incurredReportData.incurred,
        "c2c._delayNotPickReportData.delay_not_pick":
          realtimeReportData._delayNotPickReportData.delay_not_pick,
        "c2c.deliveringReportData.done":
          realtimeReportData.deliveringReportData.done,
        "c2c.deliveringReportData.notProcessed":
          realtimeReportData.deliveringReportData.notProcessed,
        "c2c.packageExport": realtimeReportData.packageExport,
        "c2c.packageExchange": realtimeReportData.packageExchange,
        "c2c.delayReportData.delay_by_shop":
          realtimeReportData.delayReportData.delay_by_shop,
        "c2c.delayReportData.delay_other_reason_v2":
          realtimeReportData.delayReportData.delay_other_reason_v2,
        "c2c.deliveringReportData.pickMoney":
          realtimeReportData.deliveringReportData.pickMoney,
        "c2c.notDeliverDoneAndWaitForApprovalReportData.not_deliver_wait_for_approval":
          realtimeReportData.notDeliverDoneAndWaitForApprovalReportData
            .not_deliver_wait_for_approval,
        "c2c.returningReportData.returning":
          realtimeReportData.returningReportData.returning,
        "c2c.waitToConfirmReturnReportData.wait_to_confirm_return":
          realtimeReportData.waitToConfirmReturnReportData
            .wait_to_confirm_return,
        "c2c.returnedReportData.returned":
          realtimeReportData.returningReportData.returned,
        "c2c.inventoryReportData.inventory":
          realtimeReportData.inventoryReportData.inventory,
        "c2c.requestReportData.ticket_not_processed":
          realtimeReportData.requestReportData.ticket_not_processed,
      };
    }
  } catch (error) {
    console.error(error);
    return [];
  }
};

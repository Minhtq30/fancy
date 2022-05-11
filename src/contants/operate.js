export const OPTIONS_RETURN_REQUEST_FOR_RETURN = [
  {
    key: "kick_off",
    title: "Giục trả hàng",
  },
  {
    key: "change_date",
    title: "Hẹn lịch trả hàng",
  },
  {
    key: "report_break",
    title: "Khiếu nại hàng hỏng, vỡ",
  },
  {
    key: "report_delay",
    title: "Khiếu nại cập nhật sai lý do Delay",
  },
  {
    key: "report_wrong_info",
    title: "Khiếu nại cập nhật sai trạng thái ĐH",
  },
  {
    key: "report_employee",
    title: "Khiếu nại thái độ nhân viên GHTK",
  },
  {
    key: "report_receive_yet",
    title: "Khiếu nại chưa nhận được hàng",
  },
  {
    key: "chat",
    title: "Chat với CSKH",
  },
  {
    key: "contact",
    title: "Liên hệ với NV trả hàng",
  },
];

export const OPTIONS_RETURN_REQUEST_FOR_PICK = [
  {
    key: "change_pick_address",
    title: "Sửa thông tin điểm lấy hàng",
  },
  {
    key: "kick_off",
    title: "Giục lấy hàng",
  },
  {
    key: "change_date",
    title: "Hẹn lịch lấy hàng",
  },
  {
    key: "report_lost_package",
    title: "Khiếu nại hàng thất lạc",
  },
  {
    key: "report_delay",
    title: "Khiếu nại cập nhật sai lý do Delay",
  },
  {
    key: "report_wrong_info",
    title: "Khiếu nại cập nhật sai trạng thái ĐH",
  },
  {
    key: "report_employee",
    title: "Khiếu nại thái độ nhân viên GHTK",
  },
  {
    key: "chat",
    title: "Chat với CSKH",
  },
  {
    key: "contact",
    title: "Liên hệ với NV lấy hàng",
  },
];

export const OPERATE_TYPE_C2C = [
  {
    key: "c2c._incurredReportData.incurred",
    title: "Phát sinh & Đã lấy",
    type: "pick",
  },
  {
    key: "c2c._delayNotPickReportData.delay_not_pick",
    title: "Delay & Hủy lấy",
    type: "pick",
  },
  {
    key: "c2c.deliveringReportData.done",
    title: "Giao thành công",
    type: "deliver",
  },
  {
    key: "c2c.deliveringReportData.notProcessed",
    title: "Không giao được/ Lưu kho",
    type: "deliver",
  },
  {
    key: "c2c.packageExport",
    title: "ĐH xuất giao khách mới",
    type: "package_export",
  },
  {
    key: "c2c.packageExchange", // Chưa có type, đang mặc định trả về 0
    title: "ĐH đổi trả",
    type: "",
  },
  {
    key: "c2c.delayReportData.delay_by_shop",
    title: "Delay sai thông tin & chờ shop check",
    type: "delay",
  },
  {
    key: "c2c.delayReportData.delay_other_reason_v2",
    title: "Delay khác",
    type: "delay",
  },
  {
    key: "c2c.deliveringReportData.pickMoney",
    title: "Tiền về",
    type: "deliver",
  },
  {
    key: "c2c.notDeliverDoneAndWaitForApprovalReportData.not_deliver_wait_for_approval",
    title: "Lưu kho chờ shop check/ Chờ duyệt hoàn",
    type: "not_deliver_wait_approval",
  },
  {
    key: "c2c.returningReportData.returning",
    title: "Đang trả",
    type: "returning",
  },
  {
    key: "c2c.waitToConfirmReturnReportData.wait_to_confirm_return",
    title: "Lưu kho trả chờ shop check",
    type: "wait_to_confirm_return",
  },
  {
    key: "c2c.returnedReportData.returned",
    title: "Đã trả",
    type: "returning",
  },
  {
    key: "c2c.inventoryReportData.inventory",
    title: "Tồn kho tích lũy",
    type: "inventory",
  },
  {
    key: "c2c.requestReportData.ticket_not_processed", // Không cần type vì có page riêng pages/operate/Request.vue
    title: "Yêu cầu chưa thực hiện",
    type: "",
  },
];

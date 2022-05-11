import moment from "moment";

export const TODAY_DATE_RANGE = {
  fromDate: moment().startOf("day"),
  toDate: moment().endOf("day"),
};

export const YESTERDAY_DATE_RANGE = {
  fromDate: moment().subtract(1, "day").startOf("day"),
  toDate: moment().subtract(1, "day").endOf("day"),
};

// không đặt được tên biến 7_DAYS vì có số ở trước
export const DAYS_7_AGO_DATE_RANGE = {
  fromDate: moment().subtract(7, "day").startOf("day"),
  toDate: moment().endOf("day"),
};

export const DAYS_30_AGO_DATE_RANGE = {
  fromDate: moment().subtract(30, "day").startOf("day"),
  toDate: moment().endOf("day"),
};

export const THIS_WEEK_DATE_RANGE = {
  fromDate: moment().startOf("isoWeek"),
  toDate: moment().endOf("isoWeek"),
};

export const LAST_WEEK_DATE_RANGE = {
  fromDate: moment().startOf("isoWeek").subtract(1, "week"),
  toDate: moment().endOf("isoWeek").subtract(1, "week"),
};

export const THIS_MONTH_DATE_RANGE = {
  fromDate: moment().startOf("month"),
  toDate: moment().endOf("month"),
};
export const LAST_MONTH_DATE_RANGE = {
  fromDate: moment().subtract(1, "months").startOf("month"),
  toDate: moment().subtract(1, "months").endOf("month"),
};
export const TWO_LAST_MONTH_DATE_RANGE = {
  fromDate: moment().subtract(2, "months").startOf("month"),
  toDate: moment().subtract(1, "months").endOf("month"),
};
export const THREE_LAST_MONTH_DATE_RANGE = {
  fromDate: moment().subtract(3, "months").startOf("month"),
  toDate: moment().subtract(1, "months").endOf("month"),
};
export const OPTION_DATE_TIME_PICKER = [
  {
    key: "incremental",
    // Không quan tâm value cho option này
    value: {
      fromDate: moment(new Date(0)),
      toDate: moment().startOf("day"),
    },
    title: "Cộng dồn",
  },
  {
    key: "today",
    value: TODAY_DATE_RANGE,
    title: "Hôm nay",
  },
  {
    key: "yesterday",
    value: YESTERDAY_DATE_RANGE,
    title: "Hôm qua",
  },
  {
    key: "7_days_ago",
    value: DAYS_7_AGO_DATE_RANGE,
    title: "7 ngày trước",
  },
  {
    key: "30_days_ago",
    value: DAYS_30_AGO_DATE_RANGE,
    title: "30 ngày trước",
  },
  {
    key: "this_week",
    value: THIS_WEEK_DATE_RANGE,
    title: "Tuần này",
  },
  {
    key: "last_week",
    value: LAST_WEEK_DATE_RANGE,
    title: "Tuần trước",
  },
  {
    key: "this_month",
    value: THIS_MONTH_DATE_RANGE,
    title: "Tháng này",
  },
  {
    key: "last_month",
    value: LAST_MONTH_DATE_RANGE,
    title: "Tháng trước",
  },
  {
    key: "custom",
    // Không quan tâm value cho option này
    value: {
      fromDate: moment().startOf("day"),
      toDate: moment().startOf("day"),
    },
    title: "Tùy chọn",
  },
  {
    key: "all",
    // Max thời gian lấy đơn là 3 tháng
    value: {
      fromDate: moment(new Date(0)),
      toDate: moment().endOf("day"),
    },
    title: "Tất cả",
  },
  {
    key: "cancel",
    value: {},
    title: "Bỏ qua",
  },
];
export const OPTION_CHECK_PICK_TIME_CAPACITY = [
  {
    value: moment().format("X"),
    key: "sang_nay",
  },
  {
    value: moment().format("X"),
    key: "chieu_nay",
  },
  {
    value: moment().add(1, "days").format("X"),
    key: "sang_mai",
  },
  {
    value: moment().add(1, "days").format("X"),
    key: "chieu_mai",
  },
];

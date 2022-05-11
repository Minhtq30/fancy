import common from "@/utils/common";
import { round } from "lodash";
import moment from "moment";
export default {
  round(value, radix = 2) {
    return value ? round(value, radix) : 0;
  },
  numberFormatter(value) {
    // , seg, suffix
    return common.numberFormatter(value);
  },
  integerFormatter(value) {
    let tmp = value ? parseInt(value) : value;
    tmp = tmp.toString();
    // , seg, suffix
    return common.numberFormatter(tmp);
  },
  numberCommaParser(value) {
    return common.numberCommaParser(value);
  },
  timestampToDate(time, format = "DD/MM/YYYY") {
    return moment.unix(time).format(format) || "";
  },
  roundNumberParser(num, offset = 1) {
    if (!num) return 0;
    return round(num, offset);
  },
};

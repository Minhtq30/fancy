import { isNumber, round, size } from "lodash";
import moment from "moment";
const DATE_TIME_FORMAT = {
  DDMMYYYY: "DD/MM/YYYY",
};
export default {
  filters: {
    formatDateToString(date, format = DATE_TIME_FORMAT.DDMMYYYY) {
      if (moment.isMoment(date)) {
        return date.format(format);
      } else {
        const converted = moment(date);
        if (moment.isMoment(converted)) {
          return converted.format(format);
        }
        return "";
      }
    },
    currencyNumber(num) {
      if (!num) return 0;
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
    },
    dotCurrencyNumber(num) {
      if (!num) return 0;
      return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
    },
    roundNumber(num, offset = 2) {
      if (!num) return 0;
      return round(num, offset);
    },
    minimizeLargeNumber(number, max = 99) {
      if (number) {
        if (number < max) {
          return number;
        } else {
          return max + "+";
        }
      } else {
        return 0;
      }
    },
  },
  methods: {
    handleError(error, clgMsg = "Có lỗi xảy ra") {
      console.log("------------Thông báo lỗi------------");
      console.log(error);
      console.log(clgMsg);
      console.log("-------------------------------------");
    },
    currencyParser(numStr) {
      if (!numStr) return 0;
      return numStr.replace(/\$\s?|(,*)/g, "").replace(/\$\s?|(\.*)/g, "");
    },
    currencyFormatter(num) {
      if (!num) return 0;
      if (Number.parseInt(num) < 1) return 0;
      if (isNumber(num)) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
      } else {
        const parsedNumber = this.currencyParser(num);
        if (isNaN(parsedNumber)) {
          return 0;
        } else {
          let result = parsedNumber
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");
          if (size(result) > 1 && result.charAt(0) === "0") {
            result = result.substring(1);
          }
          return result;
        }
      }
    },
    roundNumberParser(num, offset = 1) {
      if (!num) return 0;
      return round(num, offset);
    },
    numberParser(numStr) {
      if (typeof numStr !== "string") return "";
      if (!numStr) return "";
      return numStr.replace(/[^0-9]*/g, "");
    },
    dotCurrencyParser(numStr) {
      if (!numStr) return 0;
      return numStr.replace(/\$\s?|(\.*)/g, "");
    },
    dotCurrencyFormatter(num) {
      if (!num) return 0;
      if (isNumber(num)) {
        return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
      } else {
        const parsedNumber = this.dotCurrencyParser(num);
        if (isNaN(parsedNumber)) {
          return 0;
        } else {
          let result = parsedNumber
            .toString()
            .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1.");
          if (size(result) > 1 && result.charAt(0) === "0") {
            result = result.substring(1);
          }
          return result;
        }
      }
    },
    splitToChunks(items, chunkSize = 50) {
      const result = [];
      for (let i = 0; i < items.length; i += chunkSize) {
        result.push(items.slice(i, i + chunkSize));
      }
      return result;
    },
    all(items, fn) {
      const promises = items.map((item) => fn(item));
      return Promise.all(promises);
    },
  },
};

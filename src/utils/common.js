import { round, map } from "lodash";

const generateSizeDataSource = () => {
  let result = [];
  for (let i = 1; i <= 150; i++) {
    result.push({
      label: i.toString(),
      value: i,
    });
  }
  return result;
};

const generateQuantityDataSource = () => {
  let result = [];
  for (let i = 1; i <= 30; i++) {
    result.push({
      label: i.toString(),
      value: i,
    });
  }
  return result;
};

const generateExpressWeightDataSource = () => {
  let result = [];
  let value = 0;
  for (let i = 11; i < 211; i++) {
    let step = value < 20 ? 0.1 : 0.5;
    value += step;
    if (step === 0.01) value = round(value, 2);
    else value = round(value, 1);
    result.push({
      label: value.toString(),
      value: value,
    });
  }
  return result;
};

const generateWeightDataSource = () => {
  let result = [];
  let value = 0;
  for (let i = 11; i < 2051; i++) {
    let step = value < 20 ? 0.1 : 1;
    value += step;
    if (step === 0.01) value = round(value, 2);
    else value = round(value, 1);
    result.push({
      label: value.toString(),
      value: value,
    });
  }
  return result;
};

const generateDaysReturnDataSource = () => {
  let result = [];
  let value = 0;
  for (let i = 1; i < 31; i++) {
    let step = 1;
    value += step;
    result.push({
      label: value.toString(),
      value: value,
    });
  }
  return result;
};

const convertLabelValueDataSource = ({
  dataSource,
  labelName,
  valueName,
  labelConvert,
  toStringValue = false,
}) => {
  return map(dataSource, (x) => {
    let label = x[labelName];
    if (labelConvert && typeof labelConvert === "function") {
      label = labelConvert(x);
    }
    const labelCustom = labelName ? { label: label } : {};
    return {
      value: toStringValue ? `${x[valueName]}` : x[valueName],
      labelEx: label,
      payload: x,
      ...labelCustom,
    };
  });
};

const convertLabelValueWithoutPayload = ({
  dataSource,
  labelName,
  valueName,
  labelConvert,
}) => {
  return map(dataSource, (x) => {
    let label = x[labelName];
    if (labelConvert && typeof labelConvert === "function") {
      label = labelConvert(x);
    }
    const labelCustom = labelName ? { label: label } : {};
    return {
      ...x,
      value: x[valueName],
      labelEx: label,
      ...labelCustom,
    };
  });
};

const isNumeric = (str) => {
  if (typeof str != "string") return false;
  return !isNaN(str) && !isNaN(parseFloat(str));
};

const numberFormatter = (value, seg = ",") =>
  value ? `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, seg) : value;
const numberCommaParser = (value) =>
  value ? value.replace(/\$\s?|(,*)/g, "") : value;
export default {
  generateExpressWeightDataSource,
  generateQuantityDataSource,
  generateWeightDataSource,
  convertLabelValueDataSource,
  convertLabelValueWithoutPayload,
  generateSizeDataSource,
  numberFormatter,
  numberCommaParser,
  isNumeric,
  generateDaysReturnDataSource,
};

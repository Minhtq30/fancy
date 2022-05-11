/* eslint-disable */
import rules from "@vee-validate/rules";
import { configure, defineRule } from "vee-validate";
import { helpers } from "@vuelidate/validators";

const veeValidateConfig = {
  bails: true,
  skipOptional: true,
  mode: "aggressive",
  useConstraintAttrs: true,
  defaultMessage: () => "{_field_} thiếu",
};

// Sets the options.
configure(veeValidateConfig);

// Install VeeValidate rules and localization
Object.keys(rules).forEach((rule) => {
  defineRule(rule, rules[rule]);
});

const phone = helpers.regex(
  /^((01[2689]|08|09|03|07|05|04|02[0123456789]|06)|(([\+]{0,1}84)(1[2689]|8|9|3|7|5|4|2[0123456789]|6)))[0-9]{8}$/
);

const vndToNumber = (x) => {
  if (!x) {
    return 0;
  }
  x = x.toString();
  x = x.replace(/\D/g, "");
  x = parseInt(x);
  return x;
};

const moneyRange = (param) => (value) =>
  !helpers.req(value) ||
  value === param.minValue ||
  (value >= param.startValue && value <= param.endValue);

const moneyValidate = (value) =>
  (Number.parseInt(value) && Number.parseInt(value) > 0) || value?.length > 3;

const moneyStringValidate = (value) =>
  vndToNumber(value) > 0 && vndToNumber(value) <= 20000000;

export const customValidator = {
  phone,
  moneyRange,
  moneyValidate,
  moneyStringValidate,
};

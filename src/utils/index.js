/* eslint-disable no-prototype-builtins */

import { replace, startsWith } from "lodash";

export const removeAt = (array, index) => {
  let _array = [];
  for (let i = 0; i < array.length; i++) {
    if (i !== index) _array.push(array[i]);
  }
  return _array;
};

export const isEmptyObject = (obj) => {
  return Object.keys(obj).length === 0;
};

export const isValidEmail = (email) => {
  const regex =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return regex.test(String(email).toLowerCase());
};

export const generateUUID = () => {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (
      c ^
      (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))
    ).toString(16)
  );
};

export const downloadFileFromUrl = (url) => {
  const a = document.createElement("a");
  a.href = url;
  a.download = url.split("/").pop();
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
};

export const imageToBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });

export const REGEX_PHONE_NUMBER = /(84|0[3|5|6|7|8|9])+([0-9]{8})\b/g;

export const isValidPhone = (phone) => {
  if (startsWith(phone, "+84")) {
    phone = replace(phone, "+84", 0);
  } else if (startsWith(phone, "84")) {
    phone = replace(phone, "84", 0);
  }
  if (phone.length === 10) {
    const regex = new RegExp(REGEX_PHONE_NUMBER);
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

export const safeJSONParse = (JSONString) => {
  if (!JSONString) return {};
  try {
    const parsed = JSON.parse(JSONString);
    return parsed;
  } catch (error) {
    return {};
  }
};

export const convertObjectToQs = function (obj) {
  var str = [];
  for (var p in obj)
    if (obj.hasOwnProperty(p)) {
      str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
    }
  return str.join("&");
};

export const getCacheExpire = function (minutes = 3) {
  return new Date().getTime() + minutes * 60 * 1000 - 1000;
};

export const nFormatter = function (num) {
  if (num >= 1000000000) {
    return (num / 1000000000).toFixed(1).replace(/\.0$/, "") + " Tỷ";
  }
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1).replace(/\.0$/, "") + " Tr";
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, "") + " N";
  }
  return num + " Đ";
};

export const getTotalPages = (total, limit) => {
  if (total % limit === 0) return total / limit;

  return Math.floor(total / limit) + 1;
};

const version = 2;

export default () => {
  const request = indexedDB.open("cs-services", version);

  request.onerror = (error) => {
    console.log("Database Error", error);
  };

  request.onsuccess = (data) => {
    console.log("Database Opened", data);
  };

  request.onupgradeneeded = (event) => {
    const db = event.target.result;
    if (event.oldVersion < 1) {
      // Version 2: Add database provinces, districts, wards.
      db.createObjectStore("provinces", { keyPath: "id" });
      db.createObjectStore("districts", { keyPath: "province_id" });
      db.createObjectStore("wards", { keyPath: "district_id" });
    }
    if (event.oldVersion < 2) {
      // Version 2: Add database orderExcel.
      db.createObjectStore("orderExcel", { keyPath: "session_id" });
    }
  };

  return request;
};

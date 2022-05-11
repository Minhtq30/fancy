import DB from "./index";

const TABLE_NAME = "wards";

const wardDatabase = {
  add: (data) => {
    const request = DB();

    return new Promise((resolve, reject) => {
      request.onerror = function (error) {
        reject(error);
      };

      request.onsuccess = (e) => {
        const db = e.target.result;
        const transaction = db.transaction([TABLE_NAME], "readwrite");

        transaction.objectStore(TABLE_NAME).add({
          district_id: data.district_id,
          wards: data.wards,
          created_time: data.created_time,
        });

        transaction.complete = function () {
          resolve();
        };
      };
    });
  },

  put: (data) => {
    const request = DB();

    return new Promise((resolve, reject) => {
      request.onerror = function (error) {
        reject(error);
      };

      request.onsuccess = (e) => {
        const db = e.target.result;
        const transaction = db.transaction([TABLE_NAME], "readwrite");

        transaction.objectStore(TABLE_NAME).put({
          district_id: data.district_id,
          wards: data.wards,
          created_time: data.created_time,
        });

        transaction.complete = function () {
          resolve();
        };
      };
    });
  },

  get: (districtId) => {
    if (!districtId) return [];

    const request = DB();

    return new Promise((resolve, reject) => {
      request.onerror = function (error) {
        reject(error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([TABLE_NAME], "readonly");
        const store = transaction.objectStore(TABLE_NAME);

        store.get(districtId).onsuccess = function (event) {
          resolve(event.target.result);
        };
      };
    });
  },

  clear: () => {
    const request = DB();

    return new Promise((resolve, reject) => {
      request.onerror = function (error) {
        reject(error);
      };

      request.onsuccess = (event) => {
        const db = event.target.result;
        const transaction = db.transaction([TABLE_NAME], "readwrite");
        const store = transaction.objectStore(TABLE_NAME);

        store.clear();
      };
    });
  },
};

export default wardDatabase;
